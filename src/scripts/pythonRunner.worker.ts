// The heavy WASM Python runtime is fetched only after a visitor presses Run.
// Pin to a stable, versioned release; don't put the runtime in Astro's main bundle.
const PYODIDE_BASE = "https://cdn.jsdelivr.net/pyodide/v0.27.2/full/";

type Runtime = {
  globals: { set(name: string, value: string): void; delete(name: string): void };
  runPythonAsync(code: string): Promise<unknown>;
};
type WorkerScope = {
  importScripts(...urls: string[]): void;
  loadPyodide?: (options: { indexURL: string }) => Promise<Runtime>;
  postMessage(data: object): void;
  onmessage: ((event: MessageEvent<{ id: number; code: string }>) => void) | null;
};
const scope = self as unknown as WorkerScope;
let runtimePromise: Promise<Runtime> | undefined;

function ensureRuntime(): Promise<Runtime> {
  if (!runtimePromise) {
    runtimePromise = (async () => {
      scope.importScripts(`${PYODIDE_BASE}pyodide.js`);
      if (!scope.loadPyodide) throw new Error("Python runtime could not load.");
      return scope.loadPyodide({ indexURL: PYODIDE_BASE });
    })();
  }
  return runtimePromise;
}

scope.onmessage = async event => {
  const { id, code } = event.data;
  try {
    const runtime = await ensureRuntime();
    // Python stdout, stderr, and tracebacks appear in a single output panel.
    runtime.globals.set("__snippet", code);
    const result = await runtime.runPythonAsync(`
import io, contextlib, traceback
__output = io.StringIO()
with contextlib.redirect_stdout(__output), contextlib.redirect_stderr(__output):
    try:
        exec(compile(__snippet, '<article>', 'exec'), {'__name__': '__main__'})
    except BaseException:
        traceback.print_exc()
__output.getvalue()
`);
    runtime.globals.delete("__snippet");
    scope.postMessage({ id, output: String(result || "(Program finished without output)"), ok: true });
  } catch (error) {
    scope.postMessage({ id, output: String(error), ok: false });
  }
};
