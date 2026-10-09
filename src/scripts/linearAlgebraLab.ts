/** Progressive enhancement for SVG Linear Algebra labs. No dependencies. */
import { add, angleDegrees, cross, determinant2, dot, hadamard, magnitude, normalize, outer, type Point } from "./vectorMath";
type Label = "a" | "b" | "c";
const ORIGIN_X = 320;
const ORIGIN_Y = 210;
const GRID = 29;

function initLab(root: HTMLElement): void {
  if (root.dataset.laReady === "true") return;
  root.dataset.laReady = "true";
  const chapter = root.dataset.laChapter;
  const lessonPicker = root.querySelector<HTMLSelectElement>("[data-la-lesson]");
  const setLesson = (lesson: number) => {
    if (!lessonPicker) return;
    lessonPicker.value = String(lesson);
    root.dataset.activeLesson = `${chapter}:${lesson}`;
    root.dispatchEvent(new CustomEvent("la:show-lesson", { detail: lesson }));
  };
  lessonPicker?.addEventListener("change", () => {
    const lesson = Number(lessonPicker.value);
    setLesson(lesson);
    window.dispatchEvent(new CustomEvent("linear-algebra:lesson-change", { detail: { chapter, lesson, source: "manual" } }));
  });
  window.addEventListener("linear-algebra:lesson-change", event => {
    const detail = (event as CustomEvent<{chapter?: string; lesson?: number}>).detail;
    if (detail.chapter === chapter && Number.isFinite(detail.lesson)) setLesson(detail.lesson as number);
  });
  const $ = <T extends Element = HTMLElement>(selector: string) => root.querySelector<T>(selector);
  const value = (name: string) => Number(($<HTMLInputElement>(`[data-la-control="${name}"]`))?.value || 0);
  const setText = (selector: string, next: string) => {
    const el = $(selector);
    if (el) el.textContent = next;
  };
  const fmt = (n: number, fixed = false) => fixed ? n.toFixed(2) : String(n);
  const pointText = (p: Point, fixed = false) => `(${fmt(p[0],fixed)}, ${fmt(p[1],fixed)})`;

  const line = (key: Label, p: Point, caption: string, enabled = true): void => {
    const element = $<SVGLineElement>(`[data-la-line="${key}"]`);
    const label = $<SVGTextElement>(`[data-la-label="${key}"]`);
    if (!element || !label) return;
    element.style.display = enabled ? "" : "none";
    label.style.display = enabled ? "" : "none";
    if (!enabled) return;
    const x = ORIGIN_X + p[0] * GRID;
    const y = ORIGIN_Y - p[1] * GRID;
    element.setAttribute("x2", String(x));
    element.setAttribute("y2", String(y));
    // Anchor labels inside the SVG on both positive and negative sides.
    label.setAttribute("x", String(Math.max(145, Math.min(478, x + (p[0] < 0 ? -8 : 8)))));
    label.setAttribute("y", String(Math.max(34, Math.min(390, y - 11))));
    label.setAttribute("text-anchor", p[0] < 0 ? "end" : "start");
    label.textContent = caption;
  };

  if (chapter === "vectors") {
    const tabs = root.querySelectorAll<HTMLButtonElement>("[data-la-vector-tab]");
    const views = root.querySelectorAll<HTMLElement>("[data-la-vector-view]");
    const setView = (key: string) => {
      tabs.forEach(tab => {
        const selected = tab.dataset.laVectorTab === key;
        tab.setAttribute("aria-selected", String(selected));
      });
      views.forEach(view => { view.hidden = view.dataset.laVectorView !== key; });
    };
    tabs.forEach(tab => tab.addEventListener("click", () => setView(tab.dataset.laVectorTab || "components")));
    root.addEventListener("la:show-lesson", event => {
      const n = (event as CustomEvent<number>).detail;
      setView(n >= 28 ? "spaces" : n >= 21 && n <= 22 ? "complex" : n >= 18 && n <= 20 ? "products" : n >= 14 && n <= 17 ? "geometry" : "components");
    });
    root.querySelector<HTMLButtonElement>("[data-la-vector-reset]")?.addEventListener("click", () => {
      const defaults: Record<string, string> = { ax: "2", ay: "1", bx: "1", by: "2", "ga-x": "3", "ga-y": "4", "gb-x": "4", "gb-y": "0" };
      root.querySelectorAll<HTMLInputElement>("[data-la-control]").forEach(input => {
        const key = input.dataset.laControl;
        if (key && defaults[key] !== undefined) input.value = defaults[key];
      });
      update();
      updateGeometry();
    });
    const updateProducts = () => {
      const a = [2, 3, 4];
      const b = [5, -1, 2];
      setText('[data-la-result="hadamard"]', `[${hadamard(a,b).join(", ")}]`);
      setText('[data-la-result="product-dot"]', String(dot(a,b)));
      setText('[data-la-result="cross"]', `[${cross([1,0,0],[0,1,0]).join(", ")}]`);
      const heatmap = $("[data-la-heatmap]");
      if (heatmap) heatmap.innerHTML = outer([1,2], [3,4,5]).map(row => row.map(value => `<span style="--heat:${value}" title="${value}">${value}</span>`).join("")).join("");
    };
    const updateGeometry = () => {
      const a: Point = [value("ga-x"), value("ga-y")];
      const b: Point = [value("gb-x"), value("gb-y")];
      const labels: Record<string, string> = { "ga-x": String(a[0]), "ga-y": String(a[1]), "gb-x": String(b[0]), "gb-y": String(b[1]) };
      Object.entries(labels).forEach(([key, text]) => setText(`[data-la-value="${key}"]`, text));
      const na = magnitude(a);
      const nb = magnitude(b);
      const angle = angleDegrees(a, b);
      setText('[data-la-result="magnitude-a"]', na.toFixed(2));
      setText('[data-la-result="magnitude-b"]', nb.toFixed(2));
      setText('[data-la-result="geometry-dot"]', String(dot(a,b)));
      setText('[data-la-result="angle"]', angle === null ? "undefined (zero vector)" : `${angle.toFixed(2)}°`);
      setText('[data-la-result="cauchy"]', `${Math.abs(dot(a,b))} ≤ ${(na * nb).toFixed(2)}`);
      line("a", a, `a (${a[0]}, ${a[1]})`);
      line("b", b, `b (${b[0]}, ${b[1]})`);
      line("c", add(a,b), `a+b (${a[0]+b[0]}, ${a[1]+b[1]})`);
    };
    const update = () => {
      const a: Point = [value("ax"),value("ay")];
      const b: Point = [value("bx"),value("by")];
      const c = add(a, b);
      for (const key of ["ax","ay","bx","by"]) setText(`[data-la-value="${key}"]`,String(value(key)));
      setText('[data-la-result="a"]', pointText(a));
      setText('[data-la-result="b"]', pointText(b));
      setText('[data-la-result="c"]', pointText(c));
      setText('[data-la-result="dot"]', String(a[0]*b[0]+a[1]*b[1]));
      line("a",a,`a ${pointText(a)}`);
      line("b",b,`b ${pointText(b)}`);
      line("c",c,`a+b ${pointText(c)}`);
      const det = determinant2(a, b);
      const unit = normalize(a);
      setText('[data-la-result="span-det"]', fmt(det));
      setText('[data-la-result="span-kind"]', det === 0 ? (a[0] === 0 && a[1] === 0 ? "zero vector; no direction" : "dependent; one line") : "independent basis of ℝ²");
      setText('[data-la-result="unit"]', unit ? `[${unit[0].toFixed(2)}, ${unit[1].toFixed(2)}]` : "undefined (zero vector)");
      setText('[data-la-result="span-equation"]', `[${c[0]}, ${c[1]}] = 1a + 1b`);
    };
    root.querySelectorAll("input").forEach(i => i.addEventListener("input", () => {
      if (i.dataset.laControl?.startsWith("g")) updateGeometry();
      else update();
    }));
    update();
    updateGeometry();
    updateProducts();
  } else if (chapter === "matrices") {
    const update = () => {
      const [a,b,c,d] = ["a11","a12","a21","a22"].map(value);
      for (const key of ["a11","a12","a21","a22"]) setText(`[data-la-transposed="${key}"]`,String(value(key)));
      const result: Point = [a+b,c+d];
      setText('[data-la-result="c"]',pointText(result));
      line("a",[1,1],"v (1, 1)");
      line("b",[0,0],"",false);
      line("c",result,`Av ${pointText(result)}`);
    };
    root.querySelectorAll("input").forEach(i => i.addEventListener("input",update));
    update();
  } else if (chapter === "matrix-multiplication") {
    const A = [1,2,3,4];
    const B = [2,0,1,3];
    let selected = 0;
    const updateStep = () => {
      const row = Math.floor(selected/2);
      const col = selected%2;
      root.querySelectorAll('[data-la-cell]').forEach(cell=> cell.classList.remove("la-selected"));
      const cellsA = root.querySelectorAll('[data-la-matrix="A"] [data-la-cell]');
      const cellsB = root.querySelectorAll('[data-la-matrix="B"] [data-la-cell]');
      const cellsC = root.querySelectorAll('[data-la-matrix="C"] [data-la-cell]');
      for (let k=0;k<2;k++) {
        cellsA[row*2+k]?.classList.add("la-selected");
        cellsB[k*2+col]?.classList.add("la-selected");
      }
      cellsC[selected]?.classList.add("la-selected");
      const left1=A[row*2],left2=A[row*2+1],right1=B[col],right2=B[2+col];
      setText('[data-la-result="formula"]',`(${left1} × ${right1}) + (${left2} × ${right2}) = ${left1*right1+left2*right2}`);
      const subs = ["₁₁","₁₂","₂₁","₂₂"];
      setText('[data-la-result="cell"]',`C${subs[selected]}`);
    };
    $('[data-la-action="next"]')?.addEventListener("click",()=>{selected=(selected+1)%4;updateStep();});
    $('[data-la-action="back"]')?.addEventListener("click",()=>{selected=(selected+3)%4;updateStep();});
    const updatePlane = () => {
      const angle = value("angle");
      const scale = value("scale");
      const radians = angle*Math.PI/180;
      const p: Point = [scale*(3*Math.cos(radians)-Math.sin(radians)),scale*(3*Math.sin(radians)+Math.cos(radians))];
      setText('[data-la-value="angle"]',`${angle}°`);
      setText('[data-la-value="scale"]',`${scale.toFixed(2)}×`);
      setText('[data-la-result="c"]',pointText(p,true));
      line("a",[3,1],"v (3, 1)");
      line("b",[0,0],"",false);
      line("c",p,`Rv ${pointText(p,true)}`);
    };
    root.querySelectorAll<HTMLInputElement>('input[type="range"]').forEach(i=>i.addEventListener("input",updatePlane));
    updateStep();updatePlane();
  }
}
function init(): void { document.querySelectorAll<HTMLElement>(".la-learning-lab").forEach(initLab); }
init();
document.addEventListener("astro:page-load",init);
