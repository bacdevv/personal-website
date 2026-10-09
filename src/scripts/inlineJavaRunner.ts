/**
 * Progressive enhancement for fenced Python / runnable Java snippets.
 * Existing Shiki-highlighted code remains untouched until a reader clicks it.
 * A tiny native textarea edits inline; Ctrl/Cmd+Enter runs the edited code.
 * Python runs in a lazily loaded Pyodide Worker; Java runs through an on-demand
 * OneCompiler embed using its public populateCode and triggerRun messages.
 */
const COMPILER_ORIGIN = "https://onecompiler.com";
const RUN_TIMEOUT = 35000;

function javaEntrypoint(code: string): string | null {
  if (!/\bstatic\s+void\s+main\s*\(\s*String\s*(?:\[\s*\]\s*\w+|\w+\s*\[\s*\])\s*\)/.test(code)) return null;
  return `${code.match(/\bpublic\s+(?:(?:final|abstract)\s+)*class\s+([\w$]+)/)?.[1] ?? "Main"}.java`;
}

let pythonWorker: Worker | undefined;
let pythonRequest = 0;
let pythonBusy = false;
function stopPython(): void {
  pythonWorker?.terminate();
  pythonWorker = undefined;
  pythonBusy = false;
}
function runPython(code: string): Promise<string> {
  if (pythonBusy) return Promise.reject(new Error("Another Python example is still running."));
  pythonBusy = true;
  const worker = pythonWorker ?? new Worker(new URL("./pythonRunner.worker.ts", import.meta.url));
  pythonWorker = worker;
  const id = ++pythonRequest;
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      stopPython();
      reject(new Error("Python took too long. The execution was stopped."));
    }, RUN_TIMEOUT);
    worker.onmessage = (event: MessageEvent<{ id: number; output: string; ok: boolean }>) => {
      if (event.data.id !== id) return;
      clearTimeout(timeout);
      pythonBusy = false;
      event.data.ok ? resolve(event.data.output) : reject(new Error(event.data.output));
    };
    worker.onerror = () => {
      clearTimeout(timeout);
      stopPython();
      reject(new Error("Python could not start. Check your connection."));
    };
    worker.postMessage({ id, code });
  });
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, label?: string): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  element.className = cls;
  if (label) element.textContent = label;
  return element;
}


/**
 * Tiny syntax painter for edit mode. The real Shiki HTML is left untouched
 * until typing starts, and the original markup is restored by Reset.
 * We deliberately avoid loading CodeMirror/Monaco on every blog page.
 */
type TokenStyle = "keyword" | "string" | "number" | "comment" | "function" | "type";
type ThemeColor = { light: string; dark: string };
const defaultPalette: Record<TokenStyle, ThemeColor> = {
  keyword: { light: "#d73a49", dark: "#c792ea" },
  string: { light: "#032f62", dark: "#ecc48d" },
  number: { light: "#005cc5", dark: "#f78c6c" },
  comment: { light: "#6a737d", dark: "#637777" },
  function: { light: "#6f42c1", dark: "#82aaff" },
  type: { light: "#005cc5", dark: "#ffcb8b" },
};
const pythonKeywords = new Set(
  "False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield match case".split(" ")
);
const javaKeywords = new Set(
  "abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while true false null record var sealed permits".split(" ")
);
const pythonFunctions = new Set("print range len enumerate zip list dict tuple set str int float bool sum min max sorted reversed input isinstance type open".split(" "));
const javaTypes = new Set("String System Integer Double Boolean Object ArrayList List Map Set HashMap HashSet Scanner Exception Override".split(" "));

function sampleShikiColors(code: HTMLElement, language: "python" | "java"): Record<TokenStyle, ThemeColor> {
  const found = {} as Partial<Record<TokenStyle, ThemeColor>>;
  for (const node of code.querySelectorAll<HTMLElement>("span[style]")) {
    const light = node.style.getPropertyValue("--shiki-light").trim();
    const dark = node.style.getPropertyValue("--shiki-dark").trim();
    if (!light || !dark) continue;
    const value = (node.textContent || "").trim();
    if (!value || value.length > 60) continue;
    let category: TokenStyle | undefined;
    if ((language === "python" ? pythonKeywords : javaKeywords).has(value)) category = "keyword";
    else if (/^['"`]/.test(value)) category = "string";
    else if (/^(#|\/\/|\/\*)/.test(value)) category = "comment";
    else if (/^\d+(?:\.\d+)?$/.test(value)) category = "number";
    else if ((language === "python" ? pythonFunctions : javaTypes).has(value)) category = language === "python" ? "function" : "type";
    if (category && !found[category]) found[category] = { light, dark };
  }
  return { ...defaultPalette, ...found };
}

function paintCode(source: string, target: HTMLElement, language: "python" | "java", palette: Record<TokenStyle, ThemeColor>): void {
  // A small best-effort lexer: it preserves exact text and whitespace while
  // handling common comments, literals, numbers and keywords for tutorials.
  // Shiki remains the fully accurate highlighter in the unedited state.
  const lexer = language === "python"
    ? /#[^\n]*|"""[\s\S]*?"""|'''[\s\S]*?'''|(?:[rRuUbBfF]{0,2})(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\b(?:\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b|\b[A-Za-z_]\w*\b/g
    : /\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b|\b[A-Za-z_$][\w$]*\b/g;
  const fragment = document.createDocumentFragment();
  let position = 0;
  for (const match of source.matchAll(lexer)) {
    const start = match.index;
    if (start > position) fragment.append(document.createTextNode(source.slice(position, start)));
    const value = match[0];
    let category: TokenStyle | undefined;
    if (value.startsWith("#") || value.startsWith("//") || value.startsWith("/*")) category = "comment";
    else if (/^(?:[rRuUbBfF]{0,2})?['"]/.test(value)) category = "string";
    else if (/^\d/.test(value)) category = "number";
    else if ((language === "python" ? pythonKeywords : javaKeywords).has(value)) category = "keyword";
    else if (language === "python" && pythonFunctions.has(value)) category = "function";
    else if (language === "java" && javaTypes.has(value)) category = "type";
    if (category) {
      const token = document.createElement("span");
      token.style.setProperty("--shiki-light", palette[category].light);
      token.style.setProperty("--shiki-dark", palette[category].dark);
      token.textContent = value;
      fragment.append(token);
    } else fragment.append(document.createTextNode(value));
    position = start + value.length;
  }
  if (position < source.length) fragment.append(document.createTextNode(source.slice(position)));
  // DOM textContent, never user-authored HTML, so pasted code cannot inject tags.
  target.replaceChildren(fragment);
}

function init(root: Document = document): void {
  root.querySelectorAll<HTMLPreElement>(".app-prose pre.astro-code").forEach(block => {
    if (block.dataset.codeRunner === "ready") return;
    const lang = (block.dataset.language || block.querySelector("code")?.className.match(/language-(\w+)/)?.[1] || "").toLowerCase();
    if (!["python", "py", "java"].includes(lang)) return;
    const source = block.querySelector("code")?.textContent || "";
    if (!source.trim() || source.length > 16000) return;
    const javaFile = lang === "java" ? javaEntrypoint(source) : null;
    if (lang === "java" && !javaFile) return; // Incomplete class snippets are read-only.
    const isPython = lang !== "java";
    block.dataset.codeRunner = "ready";

    const foundCode = block.querySelector<HTMLElement>("code");
    if (!foundCode) return;
    // Capture a non-null reference for callbacks registered in beginEdit().
    const codeNode: HTMLElement = foundCode;
    const originalNodes = [...codeNode.childNodes].map(node => node.cloneNode(true));
    const palette = sampleShikiColors(codeNode, isPython ? "python" : "java");
    const wrapper = el("div", "inline-java-lab");
    const toolbar = el("div", "inline-java-lab__toolbar");
    const filename = el("span", "inline-java-lab__filename", javaFile || "main.py");
    const actions = el("div", "inline-java-lab__actions");
    const copy = el("button", "inline-java-lab__button", "Copy");
    const reset = el("button", "inline-java-lab__button", "Reset");
    const run = el("button", "inline-java-lab__button inline-java-lab__button--run", "▶ Run");
    copy.type = reset.type = run.type = "button";
    reset.hidden = true;
    run.title = "Run code (Ctrl+Enter or Cmd+Enter)";
    block.tabIndex = 0;
    block.setAttribute("aria-label", `Click to edit ${isPython ? "Python" : "Java"} code; press Ctrl+Enter to run`);
    block.classList.add("inline-java-lab__clickable");
    actions.append(copy, reset, run);
    toolbar.append(filename, actions);
    const stage = el("div", "inline-java-lab__stage");
    block.parentNode?.insertBefore(wrapper, block);
    wrapper.append(toolbar, stage);
    stage.append(block);

    let editor: HTMLTextAreaElement | undefined;
    let scheduledPaint = 0;
    let resetVersion = 0;
    let output: HTMLPreElement | undefined;
    let frame: HTMLIFrameElement | undefined;
    let frameReady = false;
    let javaRunVersion = 0;

    // The textarea is transparent and lies on TOP of Shiki's original pre.
    // Its native selection/caret edits code while the original theme, font and
    // syntax colors remain visible directly underneath it.
    function beginEdit(): HTMLTextAreaElement {
      if (!editor) {
        editor = el("textarea", "inline-java-lab__overlay");
        editor.value = source;
        editor.spellcheck = false;
        editor.wrap = "off";
        editor.setAttribute("aria-label", `Edit ${isPython ? "Python" : "Java"} source code`);
        editor.setAttribute("aria-keyshortcuts", "Control+Enter Meta+Enter");
        const preStyle = getComputedStyle(block);
        const codeStyle = getComputedStyle(codeNode);
        editor.style.fontFamily = codeStyle.fontFamily;
        editor.style.fontSize = codeStyle.fontSize;
        editor.style.fontWeight = codeStyle.fontWeight;
        editor.style.fontStyle = codeStyle.fontStyle;
        editor.style.lineHeight = codeStyle.lineHeight;
        editor.style.letterSpacing = codeStyle.letterSpacing;
        editor.style.tabSize = codeStyle.tabSize || "4";
        editor.style.padding = `${preStyle.paddingTop} ${preStyle.paddingRight} ${preStyle.paddingBottom} ${preStyle.paddingLeft}`;
        editor.addEventListener("scroll", () => {
          block.scrollTop = editor!.scrollTop;
          block.scrollLeft = editor!.scrollLeft;
        });
        editor.addEventListener("input", () => {
          if (scheduledPaint) cancelAnimationFrame(scheduledPaint);
          scheduledPaint = requestAnimationFrame(() => {
            paintCode(editor!.value, codeNode, isPython ? "python" : "java", palette);
            block.scrollTop = editor!.scrollTop;
            block.scrollLeft = editor!.scrollLeft;
            scheduledPaint = 0;
          });
        });
        editor.addEventListener("keydown", event => {
          if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            void execute();
          } else if (event.key === "Tab" && !event.shiftKey) {
            event.preventDefault();
            const { selectionStart: start, selectionEnd: end } = editor!;
            editor!.setRangeText("    ", start, end, "end");
            editor!.dispatchEvent(new Event("input", { bubbles: true }));
          }
        });
        stage.append(editor);
      }
      stage.classList.add("is-editing");
      reset.hidden = false;
      return editor;
    }

    function ensureOutput(): HTMLPreElement {
      if (!output) {
        output = el("pre", "inline-java-lab__output");
        output.setAttribute("role", "status");
        wrapper.append(output);
      }
      output.hidden = false;
      return output;
    }

    async function execute(): Promise<void> {
      const area = beginEdit();
      const executionVersion = resetVersion;
      const code = area.value;
      if (!code.trim()) { ensureOutput().textContent = "There is no code to run."; return; }
      if (isPython) {
        if (run.disabled) return;
        run.disabled = true;
        ensureOutput().textContent = "Running Python… (first use downloads the runtime)";
        try {
          const result = await runPython(code);
          if (executionVersion === resetVersion) ensureOutput().textContent = result;
        } catch (error) {
          if (executionVersion === resetVersion) ensureOutput().textContent = String(error);
        } finally { run.disabled = false; }
        return;
      }

      // Java cannot be compiled inside the static Astro page. OneCompiler is
      // loaded only on the first run; Ctrl+Enter triggers its documented API.
      const label = el("p", "inline-java-lab__status", "Java executes with OneCompiler. Do not paste private data or API keys.");
      if (!frame) {
        frame = el("iframe", "inline-java-lab__frame");
        frame.title = "Java compiler and output (OneCompiler)";
        frame.referrerPolicy = "no-referrer";
        frame.loading = "eager";
        const dark = document.documentElement.dataset.theme === "dark";
        const url = new URL("/embed/java", COMPILER_ORIGIN);
        url.search = new URLSearchParams({
          theme: dark ? "dark" : "light", hideTitle: "true", hideNew: "true",
          hideLanguageSelection: "true", listenToEvents: "true", fontSize: "14",
        }).toString();
        const container = el("div", "inline-java-lab__java-result");
        container.append(frame, label);
        wrapper.append(container);
        // Code used for the first run is refreshed if Run is pressed again
        // before the iframe finishes loading.
        frame.addEventListener("load", () => {
          frameReady = true;
          scheduleJavaRun();
        }, { once: true });
        frame.src = url.toString();
      } else if (frameReady) {
        scheduleJavaRun();
      }

      function scheduleJavaRun() {
        if (!frame?.isConnected) return;
        const version = ++javaRunVersion;
        const currentCode = area.value;
        const currentFile = javaEntrypoint(currentCode) || javaFile || "Main.java";
        // The embed has its own initialization after frame load. Populate
        // source first, then ask OneCompiler to execute it.
        window.setTimeout(() => {
          if (version !== javaRunVersion || !frame?.isConnected) return;
          frame.contentWindow?.postMessage({ eventType: "populateCode", language: "java", files: [{ name: currentFile, content: currentCode }] }, COMPILER_ORIGIN);
          window.setTimeout(() => {
            if (version === javaRunVersion && frame?.isConnected) {
              frame.contentWindow?.postMessage({ eventType: "triggerRun" }, COMPILER_ORIGIN);
            }
          }, 700);
        }, 350);
      }
    }

    block.addEventListener("click", event => {
      // Position the native caret where the reader actually clicked, including
      // inside Shiki's nested token spans (rather than jumping to the start).
      let offset = 0;
      const point = document.caretPositionFromPoint?.(event.clientX, event.clientY);
      const legacy = !point ? document.caretRangeFromPoint?.(event.clientX, event.clientY) : null;
      const node = point?.offsetNode ?? legacy?.startContainer;
      const at = point?.offset ?? legacy?.startOffset ?? 0;
      if (node && codeNode.contains(node)) {
        const range = document.createRange();
        range.selectNodeContents(codeNode);
        range.setEnd(node, at);
        offset = range.toString().length;
      }
      const area = beginEdit();
      area.focus();
      area.setSelectionRange(offset, offset);
    });
    block.addEventListener("keydown", event => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      beginEdit().focus();
    });
    run.addEventListener("click", () => { beginEdit(); void execute(); });
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(editor?.value ?? source);
        copy.textContent = "Copied";
      } catch { copy.textContent = "Copy unavailable"; }
      window.setTimeout(() => { copy.textContent = "Copy"; }, 1200);
    });
    reset.addEventListener("click", () => {
      resetVersion++;
      if (scheduledPaint) { cancelAnimationFrame(scheduledPaint); scheduledPaint = 0; }
      if (editor) { editor.remove(); editor = undefined; }
      codeNode.replaceChildren(...originalNodes.map(node => node.cloneNode(true)));
      block.scrollTop = block.scrollLeft = 0;
      stage.classList.remove("is-editing");
      if (output) output.hidden = true;
      if (frame) { frame.closest(".inline-java-lab__java-result")?.remove(); frame = undefined; frameReady = false; javaRunVersion++; }
      reset.hidden = true;
      block.focus();
    });
  });
}

if (typeof document !== "undefined") {
  init();
  document.addEventListener("astro:page-load", () => init());
}
