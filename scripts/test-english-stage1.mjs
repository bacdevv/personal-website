/** Offline exercise-data regression checks. Requires project's TypeScript dev dependency. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const ts = require('typescript');
function loadTs(path) {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8');
  const built = ts.transpileModule(source, {
    reportDiagnostics: true,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  });
  assert.equal(built.diagnostics?.filter(d => d.category === ts.DiagnosticCategory.Error).length, 0, `${path} has syntax errors`);
  const module = { exports: {} };
  new Function('module', 'exports', built.outputText)(module, module.exports);
  return module.exports;
}
const { exerciseGroups, TEST_GROUP_IDS, LESSON_GROUP_IDS } = loadTs('../src/data/english/stage1.ts');
const { isCorrectAnswer, normalizeAnswer } = loadTs('../src/data/english/answer-check.ts');
const source = readFileSync(new URL('../src/content/notes/english-stage-1.mdx', import.meta.url), 'utf8');

assert.deepEqual(LESSON_GROUP_IDS, ['p25', 'p27', 'p28a', 'p28b', 'p29a', 'p29b', 'p30']);
assert.deepEqual(TEST_GROUP_IDS, ['testA', 'testB', 'testC', 'testD']);
const expectedCounts = { p25:12,p27:12,p28a:18,p28b:18,p29a:10,p29b:10,p30:10,testA:10,testB:10,testC:7,testD:10,review:7 };
let totalQuestions = 0;
const allIds = new Set();
for (const [id,group] of Object.entries(exerciseGroups)) {
  assert.equal(group.questions.length, expectedCounts[id], `Question count for ${id}`);
  assert.equal(group.id, id);
  for (const question of group.questions) {
    assert.ok(question.id && question.prompt && question.explanation, `Incomplete question ${question.id}`);
    assert.ok(!allIds.has(question.id), `Duplicate question ID ${question.id}`);
    allIds.add(question.id);
    if (question.kind === 'self') assert.ok(question.model && group.scoring === 'self');
    else {
      assert.ok(question.answers.length > 0);
      for (const answer of question.answers) assert.ok(isCorrectAnswer(answer, question.answers), `Rejected correct answer ${question.id}`);
    }
  }
  totalQuestions += group.questions.length;
}
assert.equal(totalQuestions, 134);
assert.equal(Object.values(exerciseGroups).filter(g=>g.scoring !== 'self').length,11);
assert.equal(TEST_GROUP_IDS.reduce((sum,id)=>sum + exerciseGroups[id].maxScore,0),50);
assert.equal((exerciseGroups.testA.passage.match(/\[\[\d+\]\]/g)??[]).length,10);
assert.deepEqual(Array.from(source.matchAll(/groupId="([^"]+)"/g), m=>m[1]), Object.keys(exerciseGroups));
for (const lesson of [25,27,28,29,30]) assert.ok(source.includes(`### ${lesson}.`), `Missing lesson ${lesson}`);
assert.ok(source.includes('### Part A') && source.includes('### Part D'));
assert.equal(normalizeAnswer('She didn’t go.'),normalizeAnswer('she did not go'));
assert.equal(isCorrectAnswer('THEY WEREN’T AT SCHOOL YESTERDAY!',exerciseGroups.testD.questions[7].answers),true);
assert.equal(isCorrectAnswer('He did not phone me.',exerciseGroups.testD.questions[8].answers),false);
assert.equal(isCorrectAnswer('swimmimg',['swimming']),false);
assert.equal(isCorrectAnswer('to going',['to go']),false);
console.log(`PASS: ${totalQuestions} questions in ${Object.keys(exerciseGroups).length} groups; source order and 50-point test verified.`);
