/** Validates coverage and accepted answers for every Stage 2 source exercise. */
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const ts = require('typescript');
function loadTs(path) {
  const text = readFileSync(new URL(path, import.meta.url), 'utf8');
  const built = ts.transpileModule(text, {
    reportDiagnostics: true,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  });
  assert.equal(built.diagnostics?.filter(d => d.category === ts.DiagnosticCategory.Error).length, 0);
  const module = { exports: {} };
  new Function('module', 'exports', built.outputText)(module, module.exports);
  return module.exports;
}
const { stage2Groups } = loadTs('../src/data/english/stage2.ts');
const { isCorrectAnswer } = loadTs('../src/data/english/answer-check.ts');
const mdx = readFileSync(new URL('../src/content/notes/english-stage-2.mdx', import.meta.url), 'utf8');
const component = readFileSync(new URL('../src/components/english/EnglishStage2Exercise.astro', import.meta.url), 'utf8');
const reader = readFileSync(new URL('../src/scripts/studyReader.ts', import.meta.url), 'utf8');
const route = readFileSync(new URL('../src/pages/notes/[...slug].astro', import.meta.url), 'utf8');
const expected = {p31:[10,34],p32:[10,24],p33:[10,10],p34:[39,39],p35:[10,10],p36:[10,10],p37a:[10,16],p37b:[23,23],p38a:[18,18],p38b:[10,10],p38c:[10,10],p38d:[10,10],p39a:[30,30],p39b:[15,19],p39c:[14,14]};
assert.deepEqual(Object.keys(stage2Groups),Object.keys(expected));
let inputs=0;
for (const [id,g] of Object.entries(stage2Groups)) {
  assert.equal(g.id,id);
  assert.equal(g.questions.length,expected[id][0],`${id} question/turn count`);
  const count=g.questions.reduce((sum,q)=>sum+q.gaps.length,0);
  assert.equal(count,expected[id][1],`${id} blank count`);
  inputs+=count;
  for(const q of g.questions){
    assert.equal((q.template.match(/\[\[\d+\]\]/g)??[]).length, q.mode==='sentence'||q.mode==='self'?0:q.gaps.length, `${id} question ${q.number} placeholders`);
    for(const gap of q.gaps){
      assert.ok(gap.answers.length && gap.answers.every(ans=>isCorrectAnswer(ans,gap.answers)),`${id} question ${q.number}`);
      if(gap.options)assert.ok(gap.answers.every(ans=>gap.options.includes(ans)),`${id} question ${q.number} option mismatch`);
    }
  }
}
assert.equal(inputs,277);
assert.deepEqual(Array.from(mdx.matchAll(/groupId="([^"]+)"/g),m=>m[1]),Object.keys(expected));
for(let lesson=31;lesson<=39;lesson++)assert.ok(mdx.includes(`### ${lesson}.`),`Lesson ${lesson} missing`);
assert.ok(mdx.includes('Grand Hotel') && mdx.includes('Sea View Hotel'));
assert.ok(mdx.includes('a litre of milk') && mdx.includes('a bottle of water'));
assert.ok(mdx.includes('friendlier') && mdx.includes('hard → hard'));
assert.equal(stage2Groups.p37b.questions.reduce((n,q)=>n+q.gaps.length,0),23);
assert.ok(component.includes("event.key === 'Tab'") && component.includes("event.key === 'Enter'"));
assert.ok(route.includes('EnglishStage2LiveDemo') && reader.includes('english-stage-2'));
assert.ok(existsSync(new URL('../public/images/english/stage2/measure-objects.webp',import.meta.url)));
assert.equal(isCorrectAnswer('MORE EXPENSIVE THAN!',['more expensive than']),true);
assert.equal(isCorrectAnswer('more expensiver',['more expensive']),false);
console.log(`PASS: lessons 31–39, ${Object.keys(expected).length} practice groups and ${inputs} original answer positions; navigation, UI, assets, and model checking validated.`);
