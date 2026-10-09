/** Lightweight matrix-rank SVG demonstrations, loaded only on the matrix-rank note. */
type Matrix = number[][];
type Choice = { label: string; matrix?: Matrix };
const svgNS = "http://www.w3.org/2000/svg";
const copy = (A: Matrix): Matrix => A.map(row => [...row]);
const transpose = (A: Matrix): Matrix => A[0].map((_, j) => A.map(row => row[j]));
const multiply = (A: Matrix, B: Matrix): Matrix => A.map(row => B[0].map((_, j) => row.reduce((v, a, k) => v + a * B[k][j], 0)));
const add = (A: Matrix, B: Matrix): Matrix => A.map((row, i) => row.map((v, j) => v + B[i][j]));
const scale = (A: Matrix, n: number): Matrix => A.map(row => row.map(value => value * n));
const diag = (values: number[]): Matrix => values.map((value, i) => values.map((_, j) => i === j ? value : 0));

/** Gaussian elimination; exact-ish examples use eps=1e-9, explicit SVD toy uses a chosen tolerance. */
export function matrixRank(A: Matrix, eps = 1e-9): number {
  if (!A.length || !A[0]?.length || A.some(row => row.length !== A[0].length)) return 0;
  const M = copy(A), rows = M.length, cols = M[0].length;
  let pivotRow = 0;
  for (let col = 0; col < cols && pivotRow < rows; col++) {
    let best = pivotRow;
    for (let r = pivotRow + 1; r < rows; r++) if (Math.abs(M[r][col]) > Math.abs(M[best][col])) best = r;
    if (Math.abs(M[best][col]) <= eps) continue;
    [M[best], M[pivotRow]] = [M[pivotRow], M[best]];
    const p = M[pivotRow][col];
    for (let r = pivotRow + 1; r < rows; r++) {
      const factor = M[r][col] / p;
      for (let c = col; c < cols; c++) M[r][c] -= factor * M[pivotRow][c];
    }
    pivotRow++;
  }
  return pivotRow;
}

const presetValues: Record<string, string[]> = {
  "62": ["Rank 0", "Rank 1", "Rank 2", "Rank 3"],
  "63": ["Choose tolerance"],
  "64": ["Complementary A and B", "Cancellation B = -A"],
  "65": ["Change the inner dimension r"],
  "66": ["Change scalar λ"],
  "67": ["Independent columns", "Dependent columns"],
  "68": ["Orthogonal row spaces", "Aligned row spaces"],
  "69": ["Choose a diagonal shift"],
  "70": ["Move vector above the span"],
  "71": ["Complete the four learning steps"],
};
const svgElement = <K extends keyof SVGElementTagNameMap>(tag: K, attributes: Record<string,string>): SVGElementTagNameMap[K] => {
  const element = document.createElementNS(svgNS, tag);
  Object.entries(attributes).forEach(([key,value]) => element.setAttribute(key,value));
  return element;
};
function label(svg: SVGSVGElement, x:number,y:number,value:string,size=14,color="#E8F0FB",weight="400") {
  const node=svgElement("text",{x:String(x),y:String(y),"font-size":String(size),fill:color,"font-family":"ui-monospace,monospace","font-weight":weight});
  node.textContent=value;svg.append(node);
}
function tile(svg:SVGSVGElement, x:number,y:number,w:number,h:number,fill:string,r=6){svg.append(svgElement("rect",{x:String(x),y:String(y),width:String(w),height:String(h),rx:String(r),fill}));}
function matrixDraw(svg:SVGSVGElement, A:Matrix, x:number, y:number, title:string, highlight="#60A5FA") {
  label(svg,x,y,title,14,"#E8F0FB","600");
  const n=A[0].length,m=A.length, cell=Math.min(49,168/Math.max(n,m));
  for(let r=0;r<m;r++) for(let c=0;c<n;c++){
    const v=A[r][c], tx=x+c*(cell+4),ty=y+11+r*(cell+4);
    tile(svg,tx,ty,cell,cell,Math.abs(v)>1e-10?"#314F72":"#24374E",4);
    const str=Math.abs(v)<1e-11?"0":Number(v.toPrecision(4)).toString();
    label(svg,tx+cell/2-str.length*4.5,ty+cell/2+4,str,Math.min(13,cell/3),v===0?"#B6C3D6":highlight,"500");
  }
}
function initOne(root:HTMLElement) {
  if(root.dataset.initialized==="true")return;
  root.dataset.initialized="true";
  const lesson=root.querySelector<HTMLSelectElement>("[data-mr-lesson]")!;
  const preset=root.querySelector<HTMLSelectElement>("[data-mr-preset]")!;
  const presetLabel=root.querySelector<HTMLElement>("[data-mr-preset-label]")!;
  const sliderWrap=root.querySelector<HTMLElement>("[data-mr-slider-wrap]")!;
  const slider=root.querySelector<HTMLInputElement>("[data-mr-slider]")!;
  const sliderLabel=root.querySelector<HTMLElement>("[data-mr-slider-label]")!;
  const sliderValue=root.querySelector<HTMLOutputElement>("[data-mr-slider-value]")!;
  const checklist=root.querySelector<HTMLElement>("[data-mr-checklist]")!;
  const metrics=root.querySelector<HTMLElement>("[data-mr-metrics]")!;
  const insight=root.querySelector<HTMLElement>("[data-mr-insight]")!;
  const canvas=root.querySelector<SVGSVGElement>("[data-mr-svg]")!;
  const scaleSets: Record<string, {label:string,values:number[],format?:(n:number)=>string}>={
    "63":{label:"Numerical tolerance",values:[1e-4,1e-6,1e-10,1e-12],format:n=>n.toExponential(0)},
    "65":{label:"Target rank r",values:[1,2,3]},
    "66":{label:"Scalar λ",values:[-3,-1,0,1,3]},
    "69":{label:"Diagonal shift λ",values:[-2,0,0.01,1,10]},
    "70":{label:"Out-of-plane z",values:[-2,-1,0,1,2]},
  };
  const state={lesson:"62",option:0,step:0};
  function initControls(){
    state.lesson=lesson.value;state.option=0;
    preset.replaceChildren(...presetValues[state.lesson].map((name,i)=>{const o=document.createElement("option");o.value=String(i);o.textContent=name;return o;}));
    preset.value="0";preset.hidden=presetValues[state.lesson].length<2; presetLabel.hidden=preset.hidden;
    const ss=scaleSets[state.lesson];sliderWrap.hidden=!ss;
    if(ss){slider.min="0";slider.max=String(ss.values.length-1);slider.step="1";slider.value=String(Math.floor(ss.values.length/2));sliderLabel.textContent=ss.label;}
    checklist.hidden=state.lesson!=="71";
    draw();
  }
  function draw(){
    const mode=state.lesson,n=Number(preset.value||0),idx=Number(slider.value||0),ss=scaleSets[mode];
    const value=ss?.values[idx]??0;if(ss)sliderValue.textContent=ss.format?.(value)??String(value);
    let left:Matrix=[[1,0],[0,1]],right:Matrix=left,lname="Input",rname="Output",note="",vals:[string,string][]=[];
    if(mode==="62"){
      left=diag([0,0,0]);right=[diag([0,0,0]),[[1,2,3],[2,4,6],[3,6,9]],diag([2,1,0]),diag([2,1,3])][n];
      lname="3 × 3 reference";rname=`Chosen matrix`;vals=[["Matrix size","3 × 3"],["Rank",String(matrixRank(right))]];
      note="The shape stays 3 × 3. Only independent directions change.";
    } else if(mode==="63"){
      left=diag([3,1,1e-8]);right=left;lname="Singular values";rname="Thresholded rank";
      const r=[3,1,1e-8].filter(x=>x>value).length;
      vals=[["Exact rank","3"],["Numerical rank",String(r)]];
      note=`Count only singular values greater than ${value.toExponential(0)}. The last value is 1e-8.`;
    } else if(mode==="64"){
      left=[[1,0],[0,0]];const B=n===0?[[0,0],[0,1]]:[[-1,0],[0,0]];right=add(left,B);lname="A (rank 1)";rname="A + B";
      vals=[["rank(A+B)",String(matrixRank(right))],["rank(A×B)",String(matrixRank(multiply(left,B)))]];
      note=n===0?"Independent rank-one contributions add to rank two.":"Cancellation makes the sum zero despite nonzero inputs.";
    } else if(mode==="65"){
      const r=value;left=Array.from({length:4},(_,i)=>Array.from({length:r},(_,j)=>i===j?j+1:0));
      const Y=Array.from({length:r},(_,i)=>Array.from({length:4},(_,j)=>i===j?1:0));
      right=multiply(left,Y);lname=`X (4 × ${r})`;rname=`XY (4 × 4)`;
      vals=[["Target r",String(r)],["Actual rank",String(matrixRank(right))]];
      note="The inner dimension limits the product to at most r independent directions.";
    } else if(mode==="66"){
      left=diag([1,2]);right=scale(left,value);lname="A";rname=`λA (λ=${value})`;
      vals=[["rank(A)",String(matrixRank(left))],["rank(λA)",String(matrixRank(right))]];
      note=value===0?"Multiplying by zero collapses every column to zero.":"Any nonzero scalar preserves the independent directions.";
    } else if(mode==="67"){
      left=n===0?[[1,0],[0,1],[1,1]]:[[1,2],[2,4],[3,6]];
      right=multiply(transpose(left),left);lname="A (3 × 2)";rname="AᵀA (2 × 2)";
      vals=[["rank(A)",String(matrixRank(left))],["rank(AᵀA)",String(matrixRank(right))]];
      note=`rank(AAᵀ) = ${matrixRank(multiply(left,transpose(left)))} too, even though AAᵀ is 3 × 3.`;
    } else if(mode==="68"){
      const A=[[1,0,0,0],[0,1,0,0]],B=n===0?[[0,0,1,0],[0,0,0,1]]:A;
      left=multiply(transpose(A),A);const G2=multiply(transpose(B),B);
      right=add(left,G2);lname="AᵀA (rank 2)";rname="AᵀA+BᵀB";
      vals=[["rank(sum)",String(matrixRank(right))],["rank(product)",String(matrixRank(multiply(left,G2)))]];
      note=n===0?"Distinct row spaces: sum rank 4, product rank 0.":"Same row spaces: both sum and product remain rank 2.";
    } else if(mode==="69"){
      left=diag([2,0,0]);right=diag([2+value,value,value]);lname="A (rank 1)";rname=`A + ${value}I`;
      vals=[["rank(A)","1"],["rank(shifted)",String(matrixRank(right))]];
      note=value===-2?"Exception: -2 cancels an existing eigenvalue (2).":value===0?"Zero shift leaves the original singular matrix unchanged.":"A non-exceptional shift makes all three diagonal entries nonzero.";
    } else if(mode==="70"){
      left=[[1,0],[0,1],[0,0]];right=left.map((row,i)=>[...row,[1,2,value][i]]);
      lname="S (3 × 2)";rname="[S | v] (3 × 3)";
      vals=[["rank(S)",String(matrixRank(left))],["rank([S|v])",String(matrixRank(right))]];
      note=value===0?"z = 0: the vector stays in the plane spanned by S.":"z ≠ 0: the new column adds an out-of-plane direction.";
    } else if(mode==="71"){
      const checked=root.querySelectorAll<HTMLInputElement>("[data-mr-step]:checked").length;
      left=diag([1,1,1,1]);right=diag(Array.from({length:4},(_,i)=>i<checked?1:0));
      lname="Four-step plan";rname="Completed steps";
      vals=[["Steps finished",`${checked}/4`],["Progress",`${checked*25}%`]];
      note="Predict, test, explain, and review. Mark the steps as you complete them.";
    }
    canvas.replaceChildren();
    tile(canvas,0,0,450,255,"#18273C",11);
    label(canvas,18,31,`Lesson ${mode} • Interactive matrix view`,16,"#F2F5FD","600");
    matrixDraw(canvas,left,24,63,lname);
    matrixDraw(canvas,right,239,63,rname,"#FBBF24");
    label(canvas,215,153,"→",28,"#C4B5FD","600");
    label(canvas,17,248,"Blue: input  •  Gold: result  •  Change the controls above",11,"#C6D5E7");
    metrics.replaceChildren(...vals.map(([key,val])=>{
      const item=document.createElement("div");item.className="mr-lab__metric";
      const a=document.createElement("small");a.textContent=key;
      const b=document.createElement("strong");b.textContent=val;
      item.append(a,b);return item;
    }));
    insight.textContent=note;
    canvas.setAttribute("aria-label",`Lesson ${mode}. ${note}. ${vals.map(([k,v])=>`${k}: ${v}`).join('; ')}`);
  }
  lesson.addEventListener("change",initControls);
  preset.addEventListener("change",draw);
  slider.addEventListener("input",draw);
  checklist.addEventListener("change",draw);
  initControls();
}
function init(){document.querySelectorAll<HTMLElement>("[data-matrix-rank-lab]").forEach(initOne);}
if(typeof document!=="undefined"){
  init();document.addEventListener("astro:page-load",init);
}
