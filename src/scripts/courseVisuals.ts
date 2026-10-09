/** Dependency-free mathematical diagrams for later Linear Algebra chapters.
 * SVGs are created only when near the viewport, or when the drawer is opened.
 */
type Mode = "spaces" | "systems" | "determinant" | "inverse" | "projection" | "least-squares" | "eigen" | "svd" | "quadratic";
type Point = readonly [number,number];
const svgNS="http://www.w3.org/2000/svg";
const modes:Mode[]=["spaces","systems","determinant","inverse","projection","least-squares","eigen","svd","quadratic"];
const labels:Record<Mode,{name:string,parameter:string,default:number,min:number,max:number,step:number}>={
  spaces:{name:"Column space",parameter:"Second vector y",default:2,min:-3,max:3,step:1},
  systems:{name:"Two equations",parameter:"Second line slope",default:-1,min:-2,max:2,step:.5},
  determinant:{name:"Signed area",parameter:"Second vector y",default:2,min:-3,max:3,step:1},
  inverse:{name:"Inverse transformation",parameter:"Scale x",default:2,min:-3,max:3,step:1},
  projection:{name:"Orthogonal projection",parameter:"Target y",default:3,min:-3,max:4,step:1},
  "least-squares":{name:"Least-squares fit",parameter:"Middle-point error",default:0,min:-3,max:3,step:.5},
  eigen:{name:"Eigen-directions",parameter:"First eigenvalue",default:3,min:-3,max:3,step:.5},
  svd:{name:"Singular-value spectrum",parameter:"Second singular value",default:2,min:0,max:5,step:.5},
  quadratic:{name:"Quadratic-form slices",parameter:"Second eigenvalue",default:1,min:-3,max:3,step:.5},
};
const cv = (n:number) => Number.isFinite(n) ? String(Math.round(n*100)/100) : "undefined";
function element<K extends keyof SVGElementTagNameMap>(tag:K,attributes:Record<string,string|number>,content?:string):SVGElementTagNameMap[K]{
  const e=document.createElementNS(svgNS,tag);
  for(const [k,v] of Object.entries(attributes))e.setAttribute(k,String(v));
  if(content!==undefined)e.textContent=content;
  return e;
}
function makeSVG(root:HTMLElement):SVGSVGElement{
  const svg=element("svg",{viewBox:"0 0 480 278",role:"img","aria-label":"Interactive mathematical graph","class":"course-graph"});
  root.append(svg);return svg;
}
function render(svg:SVGSVGElement, mode:Mode, parameter:number, lesson=0):string{
  svg.replaceChildren();
  const ox=240,oy=144,k=29,stroke="#94a3b8",blue="#60a5fa",orange="#fb923c",purple="#c4b5fd";
  const point=(p:Point):Point=>[ox+p[0]*k,oy-p[1]*k];
  const addLine=(a:Point,b:Point,color:string,width=2,dashed=false)=>{
    const p=point(a),q=point(b);svg.append(element("line",{x1:p[0],y1:p[1],x2:q[0],y2:q[1],stroke:color,"stroke-width":width,"stroke-linecap":"round",...(dashed?{"stroke-dasharray":"5 5"}:{})}));
  };
  const dot=(p:Point,color:string)=>{const q=point(p);svg.append(element("circle",{cx:q[0],cy:q[1],r:4.8,fill:color}));};
  const text=(x:number,y:number,s:string,c="currentColor")=>svg.append(element("text",{x,y,fill:c,"font-size":12,"font-family":"system-ui,sans-serif"},s));
  for(let i=-7;i<=7;i++){
    addLine([i,-4.1],[i,4.1],"#718096",.5);addLine([-7.6,i],[7.6,i],"#718096",.5);
  }
  addLine([-7.6,0],[7.6,0],stroke,1.6);addLine([0,-4.1],[0,4.1],stroke,1.6);
  text(454,133,"x");text(248,21,"y");
  if(mode==="spaces" && lesson>=75 && lesson<=78){
    addLine([0,0],[2,0],blue,4);addLine([0,0],[0,parameter],orange,4);
    const r=parameter===0?1:2;
    return `rank = ${r} · nullity = ${2-r} · rank + nullity = 2`;
  }
  if(mode==="spaces"){
    addLine([0,0],[2,0],blue,4); addLine([0,0],[1,parameter],orange,4);dot([2,0],blue);dot([1,parameter],orange);
    return parameter===0?"rank = 1 · both vectors lie on one line":"rank = 2 · two independent directions";
  }
  if(mode==="systems" && lesson>=82){
    addLine([0,0],[1,2],blue,4);addLine([0,0],[2,4+parameter],orange,4);
    const r=parameter===0?1:2;
    return `matrix [[1, 2], [2, ${cv(4+parameter)}]] · pivots = ${r}`;
  }
  if(mode==="systems"){
    addLine([-4,-3],[3,4],blue,3);addLine([-4,-4*parameter],[4,4*parameter],orange,3);
    if(parameter!==1){const x=-1/(1-parameter),y=x+1; if(Math.abs(x)<7.4 && Math.abs(y)<4){dot([x,y],purple);}}
    return parameter===1?"No solution · parallel distinct lines":`One solution · x = ${cv(-1/(1-parameter))}`;
  }
  if(mode==="determinant"){
    const vertices:Point[]=[[0,0],[2,0],[3,parameter],[1,parameter]];
    svg.append(element("polygon",{points:vertices.map(p=>point(p).join(",")).join(" "),fill:purple,"fill-opacity":.18,stroke:purple,"stroke-width":1.6}));
    addLine([0,0],[2,0],blue,4);addLine([0,0],[1,parameter],orange,4);
    return `det(A) = ${cv(2*parameter)} · area = ${cv(Math.abs(2*parameter))}`;
  }
  if(mode==="inverse"){
    addLine([0,0],[parameter,0],blue,4);addLine([0,0],[0,2],orange,4);
    return parameter===0?"Singular matrix · no inverse":`A = diag(${cv(parameter)}, 2) · A⁻¹ = diag(${cv(1/parameter)}, 0.5)`;
  }
  if(mode==="projection"){
    addLine([-4,-4],[4,4],purple,2);addLine([0,0],[3,parameter],orange,3);
    const t=(3+parameter)/2;addLine([0,0],[t,t],blue,4);addLine([t,t],[3,parameter],"#34d399",2,true);dot([t,t],blue);
    return `projection = (${cv(t)}, ${cv(t)}) · residual is perpendicular`;
  }
  if(mode==="least-squares"){
    const xs=[-3,-2,-1,0,1,2,3],ys=xs.map(x=>1+.7*x+(x===0?parameter:0));
    const meanY=ys.reduce((s,v)=>s+v,0)/ys.length;
    const slope=xs.reduce((s,x,i)=>s+x*(ys[i]-meanY),0)/xs.reduce((s,x)=>s+x*x,0);
    addLine([-4,meanY-4*slope],[4,meanY+4*slope],orange,3);xs.forEach((x,i)=>dot([x,ys[i]],blue));
    return `fit: y = ${cv(meanY)} + ${cv(slope)}x · residual at x=0: ${cv(parameter*(6/7))}`;
  }
  if(mode==="eigen"){
    addLine([0,0],[parameter,0],blue,4);addLine([0,0],[0,2],orange,4);
    return `eigenvalues: ${cv(parameter)}, 2 · eigenvectors: coordinate axes`;
  }
  if(mode==="svd"){
    const vals=[5,parameter,1];vals.forEach((v,i)=>{const x=155+i*76; svg.append(element("rect",{x,y:235-v*29,width:43,height:v*29,rx:4,fill:[blue,orange,purple][i]}));text(x+12,257,cv(v));});
    return `singular values: 5, ${cv(parameter)}, 1 · rank = ${parameter===0?2:3}`;
  }
  const coeff=parameter;
  const drawCurve=(factor:number,color:string)=>{
    for(let i=-28;i<28;i++){
      const x=i/8,nx=(i+1)/8,y=factor*x*x,ny=factor*nx*nx;
      if(Math.abs(y)<4&&Math.abs(ny)<4)addLine([x,y],[nx,ny],color,2);
    }
  };
  drawCurve(0.5,blue);drawCurve(coeff/3,orange);
  return `q(x,y)=2x²+${cv(parameter)}y² · ${parameter>0?"positive definite":parameter===0?"positive semidefinite":"indefinite"}`;
}
function setup(root:HTMLElement){
  if(root.dataset.courseReady==="true")return;
  root.dataset.courseReady="true";
  const mode=root.dataset.courseDemo as Mode;if(!modes.includes(mode))return;
  const info=labels[mode];const container=document.createElement("div");container.className="course-demo-ui";
  const control=document.createElement("label");control.className="course-demo-control";
  const controlName=document.createElement("span");controlName.textContent=info.parameter;
  const output=document.createElement("output");output.textContent=String(info.default);
  const input=document.createElement("input");input.type="range";input.min=String(info.min);input.max=String(info.max);input.step=String(info.step);input.value=String(info.default);
  control.append(controlName,output,input);
  const figure=document.createElement("div");figure.className="course-demo-figure";
  const drawing=makeSVG(figure);const summary=document.createElement("output");summary.className="course-demo-result";
  const update=()=>{
    const v=Number(input.value),lesson=Number(root.dataset.courseLesson||0);
    controlName.textContent = mode==="systems" && lesson>=82 ? "Second-row offset" : mode==="spaces" && lesson>=75 && lesson<=78 ? "Second diagonal" : info.parameter;
    output.textContent=cv(v);summary.textContent=render(drawing,mode,v,lesson);
  };
  root.addEventListener("course:lesson",update);
  input.addEventListener("input",update);
  container.append(figure,control,summary);root.append(container);update();
}
const inlineObserver=typeof IntersectionObserver!=="undefined"?new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){setup(e.target as HTMLElement);inlineObserver?.unobserve(e.target);}}},{rootMargin:"350px 0px"}):undefined;
function init(){
  document.querySelectorAll<HTMLElement>(".course-interactive[data-course-demo]").forEach(e=>{if(e.dataset.courseReady)return;if(inlineObserver)inlineObserver.observe(e);else setup(e);});
  document.querySelectorAll<HTMLElement>(".course-drawer[data-course-demo]").forEach(root=>{
    if(root.dataset.courseDrawerReady==="yes")return;root.dataset.courseDrawerReady="yes";
    const lesson=root.querySelector<HTMLElement>("[data-course-current]");
    const chapter=root.dataset.courseChapter;
    const sync=()=>{
      const active=document.querySelector<HTMLElement>("[data-study-article]")?.dataset.activeLesson||"";
      const [c,n]=active.split(":");if(c!==chapter||!n)return;
      const heading=document.querySelector<HTMLElement>(`h3[data-lesson-id="${n}"]`);
      if(lesson&&heading)lesson.textContent=heading.textContent||`Lesson ${n}`;
      root.dataset.courseLesson=n;root.dispatchEvent(new Event("course:lesson"));
    };
    window.addEventListener("linear-algebra:lesson-change",sync);
    const button=root.querySelector<HTMLButtonElement>("[data-course-show]");
    button?.addEventListener("click",()=>{setup(root);button.hidden=true;});
    // Start with the latest reading position; the demo remains hidden until opened.
    sync();
    const drawer=document.querySelector<HTMLElement>("[data-reading-panel]");
    if(drawer&&typeof MutationObserver!=="undefined"){
      const observer=new MutationObserver(()=>{if(!drawer.hidden&&root.closest<HTMLElement>("[data-reading-view=demo]")?.hidden===false){setup(root);button?.setAttribute("hidden","");sync();}});
      observer.observe(drawer,{attributes:true,attributeFilter:["hidden"]});
      const body=root.closest<HTMLElement>("[data-reading-view=demo]");if(body)observer.observe(body,{attributes:true,attributeFilter:["hidden"]});
    }
  });
}
init();document.addEventListener("astro:page-load",init);
