import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
const chapters = [
  ['vectors',7,30],['matrices',31,40],['matrix-multiplication',41,61],
  ['matrix-rank',62,71],['matrix-spaces',72,79],['solving-systems',80,86],
  ['matrix-determinant',87,94],['matrix-inverse',95,106],
  ['projections-orthogonalization',108,119],['least-squares',120,127],
  ['eigendecomposition',128,146],['singular-value-decomposition',147,160],
  ['quadratic-forms',161,170]
];
const problems=[];let lessons=0,blocks=0;
for(const [slug,first,last] of chapters){
  const path=resolve('src','content','notes',slug+'.md');
  let text;try{text=await readFile(path,'utf8')}catch{problems.push(`Missing note: ${slug}`);continue;}
  const ids=[...text.matchAll(/^### (\d+)\. /gm)].map(m=>Number(m[1]));
  const expected=Array.from({length:last-first+1},(_,i)=>first+i);
  if(JSON.stringify(ids)!==JSON.stringify(expected))problems.push(`Lesson sequence: ${slug}`);
  if(!text.includes('subject: Linear Algebra'))problems.push(`Wrong subject: ${slug}`);
  if(text.includes('\\boxed{'))problems.push(`Legacy boxed math: ${slug}`);
  if((text.match(/^\$\$$/gm)||[]).length%2!==0)problems.push(`Unbalanced display-math delimiters: ${slug}`);
  const math=[...text.matchAll(/^\$\$\s*\n([\s\S]*?)\n\$\$/gm)];
  lessons+=ids.length;blocks+=math.length;
  if(first>=72){
    if(!text.includes('data-course-demo='))problems.push(`No inline demo: ${slug}`);
    const svg=resolve('public','images','linear-algebra','course',slug+'.svg');
    try{await access(svg)}catch{problems.push(`Missing SVG: ${slug}`);}
  }
}
console.log(JSON.stringify({passed:problems.length===0,chapters:chapters.length,lessons,displayEquations:blocks,problems},null,2));
if(problems.length)process.exit(1);
