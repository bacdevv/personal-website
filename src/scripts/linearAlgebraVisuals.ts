import { angleDegrees, determinant2, dot, magnitude, normalize, type Point } from "./vectorMath";

type Chapter = "vectors" | "matrices" | "matrix-multiplication" | "matrix-rank";
type Matrix = number[][];
const chapterFromPath = (): Chapter | null => {
  const slug = location.pathname.match(/\/notes\/([^/]+)/)?.[1];
  return ["vectors", "matrices", "matrix-multiplication", "matrix-rank"].includes(slug || "") ? slug as Chapter : null;
};
const el = <K extends keyof HTMLElementTagNameMap>(tag: K, text = ""): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  node.textContent = text;
  return node;
};
const svg = (mount: HTMLElement, label: string): SVGSVGElement => {
  const node = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  node.setAttribute("viewBox", "0 0 520 220");
  node.setAttribute("role", "img");
  node.setAttribute("aria-label", label);
  mount.append(node);
  return node;
};
const line = (node: SVGSVGElement, x1: number, y1: number, x2: number, y2: number, color: string, width = 3, dash = "") => {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "line");
  Object.entries({ x1, y1, x2, y2, stroke: color, "stroke-width": width, "stroke-linecap": "round" }).forEach(([key, value]) => path.setAttribute(key, String(value)));
  if (dash) path.setAttribute("stroke-dasharray", dash);
  node.append(path);
};
const text = (node: SVGSVGElement, x: number, y: number, value: string, color = "currentColor") => {
  const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
  label.setAttribute("x", String(x)); label.setAttribute("y", String(y)); label.setAttribute("fill", color); label.setAttribute("font-size", "14"); label.setAttribute("font-family", "ui-monospace,monospace");
  label.textContent = value; node.append(label);
};
const graph = (node: SVGSVGElement, a: Point, b: Point, result?: Point) => {
  const ox = 260, oy = 150, scale = 25;
  line(node, 30, oy, 490, oy, "currentColor", 1);
  line(node, ox, 205, ox, 15, "currentColor", 1);
  for (let i = -8; i <= 8; i++) line(node, ox + i * scale, 15, ox + i * scale, 205, "currentColor", .45);
  for (let i = -5; i <= 5; i++) line(node, 30, oy - i * scale, 490, oy - i * scale, "currentColor", .45);
  const draw = (p: Point, color: string, label: string, dashed = false) => {
    line(node, ox, oy, ox + p[0] * scale, oy - p[1] * scale, color, 4, dashed ? "7 5" : "");
    text(node, ox + p[0] * scale + 7, oy - p[1] * scale - 8, `${label} (${p[0]}, ${p[1]})`, color);
  };
  draw(a, "#2563eb", "a"); draw(b, "#b45309", "b"); if (result) draw(result, "#7c3aed", "a+b", true);
};
const input = (label: string, value: string, onInput: (value: number) => void) => {
  const wrapper = el("label", label);
  const field = document.createElement("input");
  field.type = "number"; field.value = value; field.min = "-8"; field.max = "8"; field.step = "1";
  field.addEventListener("input", () => onInput(Number(field.value)));
  wrapper.append(field); return wrapper;
};
const rank = (matrix: Matrix): number => {
  const a = matrix.map(row => [...row]); let pivot = 0;
  for (let col = 0; col < (a[0]?.length || 0) && pivot < a.length; col++) {
    let best = pivot;
    for (let row = pivot + 1; row < a.length; row++) if (Math.abs(a[row][col]) > Math.abs(a[best][col])) best = row;
    if (Math.abs(a[best][col]) < 1e-9) continue;
    [a[pivot], a[best]] = [a[best], a[pivot]];
    for (let row = pivot + 1; row < a.length; row++) {
      const factor = a[row][col] / a[pivot][col];
      for (let c = col; c < a[0].length; c++) a[row][c] -= factor * a[pivot][c];
    }
    pivot++;
  }
  return pivot;
};
const cvValue=(n:number)=>Number(n.toFixed(2)).toString();
const matrixMarkup = (matrix: Matrix) => matrix.map(row => `[${row.join(", ")}]`).join(" ");

function renderVector(mount: HTMLElement, lesson: number) {
  const a: Point = [2, 1], b: Point = [1, 2]; let currentA = [...a] as Point; let currentB = [...b] as Point;
  const title = lesson >= 28 ? "Span and independence" : lesson === 15 ? "Angle and dot product" : lesson >= 10 && lesson <= 17 ? "Dot product and length" : lesson===23 ? "Unit vector" : "Vector operations";
  mount.append(el("h4", title));
  const controls = el("div", ""); controls.className = "la-inline-controls";
  controls.append(input("aₓ", String(a[0]), value => { currentA = [value, currentA[1]]; update(); }), input("aᵧ", String(a[1]), value => { currentA = [currentA[0], value]; update(); }), input("bₓ", String(b[0]), value => { currentB = [value, currentB[1]]; update(); }), input("bᵧ", String(b[1]), value => { currentB = [currentB[0], value]; update(); }));
  mount.append(controls);
  const drawing = svg(mount, "Interactive vector coordinate graph"); const result = el("output"); result.className = "la-inline-result"; mount.append(result);
  function update() {
    const sum: Point = [currentA[0] + currentB[0], currentA[1] + currentB[1]];
    const angle = angleDegrees(currentA, currentB), na=magnitude(currentA), nb=magnitude(currentB);
    const unit = normalize(currentA), product=dot(currentA,currentB), determinant=determinant2(currentA,currentB);
    drawing.replaceChildren();
    graph(drawing,currentA,currentB,[7,8,9].includes(lesson)?sum:undefined);
    if(lesson===10)result.textContent=`a · b = ${product}`;
    else if(lesson===14)result.textContent=`‖a‖ = ${na.toFixed(2)} · ‖b‖ = ${nb.toFixed(2)}`;
    else if(lesson===15)result.textContent=`a · b = ${product} · angle = ${angle===null?"undefined":angle.toFixed(1)+"°"}`;
    else if(lesson===16)result.textContent=`|a · b| = ${Math.abs(product)} ≤ ${cvValue(na*nb)}`;
    else if(lesson===17)result.textContent=`dot product = ${product} · ${product<0?"obtuse":product>0?"acute":"perpendicular or zero vector"}`;
    else if(lesson===23)result.textContent=`unit(a) = ${unit?`(${unit.map(v=>v.toFixed(2)).join(", ")})`:"undefined for zero vector"}`;
    else if(lesson>=28)result.textContent=`det([a b]) = ${determinant} · ${determinant!==0?"independent directions":na===0&&nb===0?"no independent direction":"dependent directions"}`;
    else result.textContent=`a + b = (${sum[0]}, ${sum[1]}) · a − b = (${currentA[0]-currentB[0]}, ${currentA[1]-currentB[1]})`;
  }

  update();
}
function renderMatrix(mount: HTMLElement, lesson: number) {
  const matrix: Matrix = [[2, 6, 1], [4, 3, 5]];
  mount.append(el("h4", "Matrix grid"));
  const grid = el("div"); grid.className = "la-inline-matrix";
  matrix.forEach((row, r) => row.forEach((value, c) => { const cell = el("span", String(value)); cell.title = `a${r + 1}${c + 1}`; cell.tabIndex = 0; cell.addEventListener("focus", () => cell.classList.add("is-highlighted")); cell.addEventListener("blur", () => cell.classList.remove("is-highlighted")); grid.append(cell); }));
  const output = el("output", lesson === 36 ? "Transpose: [[2, 4], [6, 3], [1, 5]]" : lesson === 38 ? "Diagonal = [2, 3], trace = 5" : lesson === 40 ? "Broadcasting maps a row vector across each matrix row when the shapes are compatible." : "2 rows × 3 columns; focus a cell to inspect its row and column index.");
  output.className = "la-inline-result"; mount.append(grid,output);
  const additional=lesson===36?[[2,4],[6,3],[1,5]]:lesson===40?[[3,8,4],[5,5,8]]:null;
  if(additional){
    const wrap=el("div");wrap.className="la-inline-grid-pair";
    const name=el("span",lesson===36?"Aᵀ":"A + [1, 2, 3]");
    const second=el("div");second.className="la-inline-matrix";
    second.style.gridTemplateColumns=`repeat(${additional[0].length},minmax(38px,1fr))`;
    additional.flat().forEach(n=>second.append(el("span",String(n))));
    wrap.append(name,second);mount.append(wrap);
  }
  if(lesson===38){grid.querySelectorAll("span").forEach((x,i)=>{if(i===0||i===4)x.classList.add("is-highlighted")});}

}
function renderMultiplication(mount: HTMLElement, lesson: number) {
  mount.append(el("h4", [47,48,49].includes(lesson) ? "Geometric transformation" : lesson === 56 ? "Fourier spectrum" : "Matrix multiplication"));
  const output = el("output"); output.className = "la-inline-result";
  const A = [[1, 2], [3, 4]], B = [[5, 6], [7, 8]], C = [[19, 22], [43, 50]];
  if ([47,48,49].includes(lesson)) {
    const drawing = svg(mount, "Transformable square under a matrix"); const angle = Math.PI / 6;
    line(drawing, 40, 175, 480, 175, "currentColor", 1); line(drawing, 260, 205, 260, 20, "currentColor", 1);
    [[0, 0], [2, 0], [2, 1], [0, 1], [0, 0]].forEach((p, i, points) => { const q = [p[0] * Math.cos(angle) - p[1] * Math.sin(angle), p[0] * Math.sin(angle) + p[1] * Math.cos(angle)]; const next = points[i + 1]; if (next) { const n = [next[0] * Math.cos(angle) - next[1] * Math.sin(angle), next[0] * Math.sin(angle) + next[1] * Math.cos(angle)]; line(drawing, 260 + q[0] * 55, 175 - q[1] * 55, 260 + n[0] * 55, 175 - n[1] * 55, "#7c3aed", 4); } });
    output.textContent = "Rotation by 30° maps each point using the same linear rule, so straight lines remain straight.";
  } else if (lesson === 56) {
    const signal = [1, 0, -1, 0]; const amplitude = signal.map((_, k) => Math.sqrt(signal.reduce((sum, value, n) => sum + value * Math.cos(2 * Math.PI * k * n / signal.length), 0) ** 2 + signal.reduce((sum, value, n) => sum - value * Math.sin(2 * Math.PI * k * n / signal.length), 0) ** 2));
    const drawing = svg(mount, "Discrete Fourier transform magnitude spectrum"); signal.forEach((value, i) => line(drawing, 60 + i * 100, 170, 60 + i * 100, 170 - value * 55, "#2563eb", 8)); amplitude.forEach((value, i) => line(drawing, 60 + i * 100, 80, 60 + i * 100, 80 - value * 25, "#b45309", 8)); output.textContent = `Signal [${signal.join(", ")}] has DFT magnitudes [${amplitude.map(v => v.toFixed(1)).join(", ")}].`;
  } else {
    const drawing = svg(mount, "Step-by-step matrix multiplication"); drawing.replaceChildren(); text(drawing, 30, 35, "A × B = C"); text(drawing, 30, 75, matrixMarkup(A)); text(drawing, 210, 75, "×"); text(drawing, 250, 75, matrixMarkup(B)); text(drawing, 30, 145, `C = ${matrixMarkup(C)}`, "#7c3aed"); output.textContent = "Each output entry is one row-by-column dot product; the four views produce the same C.";
  }
  mount.append(output);
}
function renderRank(mount: HTMLElement, lesson: number) {
  mount.append(el("h4", "Column directions"));
  const drawing = svg(mount, "Column space and rank graph"); const A: Point = lesson === 62 ? [2, 1] : [1, 2]; const B: Point = lesson === 62 ? [4, 2] : [2, -1]; graph(drawing, A, B);
  const matrix: Matrix = [[...A], [...B]];
  const result = el("output", lesson === 64
    ? `A = [[1, 0], [0, 0]] (rank 1), B = [[0, 0], [0, 1]] (rank 1), A + B = I₂ (rank ${rank([[1, 0], [0, 1]])}). Product rank is bounded above by both input ranks.`
    : `A = ${matrixMarkup(matrix)}; rank(A) = ${rank(matrix)}. ${lesson === 69 ? "A diagonal shift changes rank only when it avoids or hits eigenvalue cancellation." : "Independent column directions increase the dimension of the column space."}`);
  result.className = "la-inline-result"; mount.append(result);
}
function renderMount(mount: HTMLElement, chapter: Chapter, lesson: number) {
  if (mount.dataset.rendered === `${chapter}:${lesson}`) return;
  mount.replaceChildren(); mount.dataset.rendered = `${chapter}:${lesson}`; mount.dataset.lessonId = `${chapter}:${lesson}`;
  if (chapter === "vectors") renderVector(mount, lesson);
  else if (chapter === "matrices") renderMatrix(mount, lesson);
  else if (chapter === "matrix-multiplication") renderMultiplication(mount, lesson);
  else renderRank(mount, lesson);
}

let lazyObserver:IntersectionObserver|undefined;
function init() {
  const chapter = chapterFromPath(); const article = document.querySelector<HTMLElement>("[data-study-article]");
  if (!chapter || !article || article.dataset.laVisualsReady === "true") return;
  article.dataset.laVisualsReady = "true";
  lazyObserver?.disconnect();
  lazyObserver = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(entries=>{
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const mount=e.target as HTMLElement;
      const [c,id]=(mount.dataset.inlineLesson||"").split(":");
      if(c && id)renderMount(mount,c as Chapter,Number(id));
      lazyObserver?.unobserve(mount);
    }
  },{rootMargin:"320px 0px"}):undefined;
  const headings = Array.from(article.querySelectorAll<HTMLElement>("h3[data-lesson-id]"));
  const supported: Record<Chapter, Set<number>> = {
    vectors:new Set([7,8,9,10,14,15,16,17,23,28,29,30]),
    matrices:new Set([31,32,33,34,36,38,39,40]),
    "matrix-multiplication":new Set([41,42,43,46,47,48,49,56]),
    "matrix-rank":new Set([62]),
  };
  headings.forEach(heading => {
    const lesson = Number(heading.dataset.lessonId);
    if (!supported[chapter].has(lesson)) return; const mount = el("section");
    mount.className = "la-inline-visual"; mount.dataset.inlineLesson = `${chapter}:${lesson}`; mount.setAttribute("aria-label", `Inline visualization for lesson ${lesson}`);
    heading.after(mount); if(lazyObserver)lazyObserver.observe(mount);else renderMount(mount,chapter,lesson);
  });
}
if (typeof document !== "undefined") { init(); document.addEventListener("astro:page-load", init); }
