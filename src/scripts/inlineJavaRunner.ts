/**
 * Tiny, progressive enhancement for code fences in articles.
 * All Shiki code stays static until clicked. No editor dependencies are bundled.
 * Python: local Pyodide in a killable worker; Java: on-demand OneCompiler iframe.
 */
const COMPILER_ORIGIN = "https://onecompiler.com";
const COMPILER_URL = `${COMPILER_ORIGIN}/embed/java?theme=dark&hideTitle=true&hideNew=true&hideLanguageSelection=true&listenToEvents=true&fontSize=14`;
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
    if (!(["python", "py", "java"].includes(lang))) return;
    const source = block.querySelector("code")?.textContent || "";
    if (!source.trim() || source.length > 16000) return;
    const javaFile = lang === "java" ? javaEntrypoint(source) : null;
    if (lang === "java" && !javaFile) return; // Partial class snippets are documentation, not runnable programs.
    const isPython = lang !== "java";
    block.dataset.codeRunner = "ready";

    const wrapper = el("div", "inline-java-lab");
    const toolbar = el("div", "inline-java-lab__toolbar");
    const filename = el("span", "inline-java-lab__filename", javaFile || "main.py");
    const actions = el("div", "inline-java-lab__actions");
    const copy = el("button", "inline-java-lab__button", "Copy");
    const open = el("button", "inline-java-lab__button inline-java-lab__button--run", "Edit & Run");
    copy.type = open.type = "button";
    open.setAttribute("aria-expanded", "false");
    const panel = el("div", "inline-java-lab__panel");
    panel.hidden = true;
    actions.append(copy, open);
    toolbar.append(filename, actions);
    block.parentNode?.insertBefore(wrapper, block);
    wrapper.append(toolbar, block, panel);

    copy.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(source); copy.textContent = "Copied"; }
      catch { copy.textContent = "Copy unavailable"; }
      window.setTimeout(() => { copy.textContent = "Copy"; }, 1200);
    });

    function closeEditor(): void {
      panel.hidden = true;
      block.hidden = false;
      panel.replaceChildren();
      open.textContent = "Edit & Run";
      open.setAttribute("aria-expanded", "false");
      open.focus();
    }
    open.addEventListener("click", () => {
      if (!panel.hidden) { closeEditor(); return; }
      panel.hidden = false;
      block.hidden = true;
      open.textContent = "Close editor";
      open.setAttribute("aria-expanded", "true");
      if (isPython) {
        const area = el("textarea", "inline-java-lab__textarea");
        area.value = source;
        area.spellcheck = false;
        area.setAttribute("aria-label", "Python source code");
        area.rows = Math.min(22, Math.max(8, source.split("\n").length + 1));
        const controls = el("div", "inline-java-lab__controls");
        const run = el("button", "inline-java-lab__button inline-java-lab__button--run", "▶ Run Python");
        const reset = el("button", "inline-java-lab__button", "Reset");
        run.type = reset.type = "button";
        const output = el("pre", "inline-java-lab__output", "Press Run to execute in your browser.");
        output.setAttribute("role", "status");
        controls.append(run, reset);
        panel.append(area, controls, output);
        reset.addEventListener("click", () => { area.value = source; output.textContent = "Code restored."; });
        run.addEventListener("click", async () => {
          if (!area.value.trim()) return;
          run.disabled = true;
          output.textContent = "Running Python (first run downloads the runtime)…";
          try { output.textContent = await runPython(area.value); }
          catch (error) { output.textContent = String(error); }
          finally { run.disabled = false; }
        });
        area.focus();
        return;
      }
      const status = el("p", "inline-java-lab__status", "Java runs on OneCompiler. Do not enter private data or API keys.");
      const frame = el("iframe", "inline-java-lab__frame");
      frame.title = `Java editor (${javaFile})`;
      frame.referrerPolicy = "no-referrer";
      frame.setAttribute("loading", "eager");
      frame.addEventListener("load", () => {
        const fill = () => {
          if (frame.isConnected && !panel.hidden) frame.contentWindow?.postMessage({
            eventType: "populateCode", language: "java", files: [{ name: javaFile, content: source }],
          }, COMPILER_ORIGIN);
        };
        window.setTimeout(fill, 350);
        window.setTimeout(fill, 1300);
        status.textContent = "Edit and press Run inside the Java editor (OneCompiler).";
      }, { once: true });
      frame.src = COMPILER_URL;
      panel.append(frame, status);
    });
  });
}

if (typeof document !== "undefined") {
  init();
  document.addEventListener("astro:page-load", () => init());
}
