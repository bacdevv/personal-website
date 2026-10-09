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
    let resetVersion = 0;
    let output: HTMLPreElement | undefined;
    let frame: HTMLIFrameElement | undefined;
    let frameReady = false;
    let javaRunVersion = 0;

    function beginEdit(): HTMLTextAreaElement {
      if (!editor) {
        editor = el("textarea", "inline-java-lab__textarea");
        editor.value = source;
        editor.spellcheck = false;
        editor.wrap = "off";
        editor.setAttribute("aria-label", `Edit ${isPython ? "Python" : "Java"} source code`);
        editor.setAttribute("aria-keyshortcuts", "Control+Enter Meta+Enter");
        editor.style.height = `${block.getBoundingClientRect().height}px`;
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
        block.hidden = true;
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
      if (editor) { editor.remove(); editor = undefined; }
      codeNode.replaceChildren(...originalNodes.map(node => node.cloneNode(true)));
      block.hidden = false;
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
