/**
 * Add an opt-in-by-valid-entrypoint, in-article Java editor to ordinary Markdown
 * code fences. Static Shiki highlighting stays visible until someone clicks.
 * Java execution is provided by OneCompiler's embedded, third-party editor.
 */

const COMPILER_ORIGIN = "https://onecompiler.com";
const EDITOR_URL = `${COMPILER_ORIGIN}/embed/java?theme=dark&hideTitle=true&hideNew=true&hideLanguageSelection=true&listenToEvents=true&fontSize=14`;

/**
 * Return the Java source filename required by javac for a complete program,
 * or null for incomplete teaching snippets (which must remain static).
 */
export function javaEntrypoint(source: string): string | null {
  if (typeof source !== "string") return null;
  if (!/\bstatic\s+void\s+main\s*\(\s*String\s*(?:\[\s*\]\s*\w+|\w+\s*\[\s*\])\s*\)/.test(source)) {
    return null;
  }
  const declared = source.match(/\bpublic\s+(?:(?:final|abstract)\s+)*class\s+([a-zA-Z_$][\w$]*)\b/);
  return `${declared?.[1] ?? "Main"}.java`;
}

/**
 * Enhances complete Java snippets inside published Markdown/MDX article prose.
 * Calling more than once (e.g., Astro navigation) does not duplicate controls.
 */
export function mountJavaRunners(root: Document = document): void {
  const blocks = root.querySelectorAll<HTMLPreElement>(".app-prose pre.astro-code");

  for (const block of blocks) {
    if (block.dataset.inlineRunnerAttached === "true") continue;
    const code = block.querySelector("code")?.textContent ?? "";
    const filename = javaEntrypoint(code);
    if (!filename) continue;
    block.dataset.inlineRunnerAttached = "true";

    const wrapper = document.createElement("div");
    wrapper.className = "inline-java-lab";
    const toolbar = document.createElement("div");
    toolbar.className = "inline-java-lab__toolbar";
    const caption = document.createElement("span");
    caption.className = "inline-java-lab__filename";
    caption.textContent = filename;
    const actions = document.createElement("div");
    actions.className = "inline-java-lab__actions";

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "inline-java-lab__button";
    copyButton.textContent = "Copy";
    copyButton.setAttribute("aria-label", `Copy ${filename} source`);

    const runButton = document.createElement("button");
    runButton.type = "button";
    runButton.className = "inline-java-lab__button inline-java-lab__button--run";
    runButton.textContent = "Edit & Run";
    runButton.setAttribute("aria-expanded", "false");

    const panel = document.createElement("div");
    panel.className = "inline-java-lab__panel";
    panel.hidden = true;

    const status = document.createElement("p");
    status.className = "inline-java-lab__status";
    status.setAttribute("role", "status");
    status.textContent = "The editor runs on OneCompiler. Do not enter secrets or private data.";

    const editor = document.createElement("div");
    editor.className = "inline-java-lab__editor";
    panel.append(editor, status);
    actions.append(copyButton, runButton);
    toolbar.append(caption, actions);
    block.parentNode?.insertBefore(wrapper, block);
    wrapper.append(toolbar, block, panel);

    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(code);
        copyButton.textContent = "Copied";
        window.setTimeout(() => { copyButton.textContent = "Copy"; }, 1600);
      } catch {
        copyButton.textContent = "Copy unavailable";
      }
    });

    runButton.addEventListener("click", () => {
      if (!panel.hidden) {
        panel.hidden = true;
        block.hidden = false;
        editor.replaceChildren(); // Discard edits and stop the third-party iframe.
        runButton.textContent = "Edit & Run";
        runButton.setAttribute("aria-expanded", "false");
        runButton.focus();
        return;
      }

      block.hidden = true;
      panel.hidden = false;
      runButton.textContent = "Back to snippet";
      runButton.setAttribute("aria-expanded", "true");
      status.textContent = "Loading editor… Code execution uses OneCompiler; never enter secrets.";

      const frame = document.createElement("iframe");
      frame.title = `Interactive Java editor for ${filename}`;
      frame.loading = "eager";
      frame.referrerPolicy = "no-referrer";
      frame.allow = "clipboard-read; clipboard-write";
      frame.addEventListener("load", () => {
        // Wait for the embedded editor's message listener to initialize.
        window.setTimeout(() => {
          if (!frame.isConnected || panel.hidden) return;
          frame.contentWindow?.postMessage({
            eventType: "populateCode",
            language: "java",
            files: [{ name: filename, content: code }],
          }, COMPILER_ORIGIN);
          status.textContent = "Edit the Java code above and press Run inside the editor. Execution is handled by OneCompiler.";
        }, 350);
      }, { once: true });
      frame.src = EDITOR_URL;
      editor.replaceChildren(frame);
    });
  }
}

if (typeof document !== "undefined") {
  mountJavaRunners();
  document.addEventListener("astro:page-load", () => mountJavaRunners());
}
