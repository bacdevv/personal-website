import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const ts = require("typescript");
const source = readFileSync("src/scripts/vectorMath.ts", "utf8");
const compiled = ts.transpileModule(source, {
  fileName: "vectorMath.ts",
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  reportDiagnostics: true,
});
assert.equal(compiled.diagnostics.filter(d => d.category === ts.DiagnosticCategory.Error).length, 0);
const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled.outputText).toString("base64")}`;
const math = await import(moduleUrl);
assert.deepEqual(math.add([2, 1], [1, 2]), [3, 3]);
assert.deepEqual(math.subtract([2, 1], [1, 2]), [1, -1]);
assert.equal(math.dot([1, 2, 3], [4, -1, 2]), 8);
assert.equal(math.magnitude([3, 4]), 5);
assert.deepEqual(math.normalize([3, 4]).map(value => Number(value.toFixed(2))), [0.6, 0.8]);
assert.equal(math.normalize([0, 0]), null);
assert.equal(math.angleDegrees([1, 0], [0, 1]), 90);
assert.equal(math.angleDegrees([0, 0], [1, 0]), null);
assert.deepEqual(math.hadamard([2, 3, 4], [5, -1, 2]), [10, -3, 8]);
assert.deepEqual(math.outer([1, 2], [3, 4, 5]), [[3, 4, 5], [6, 8, 10]]);
assert.deepEqual(math.cross([1, 0, 0], [0, 1, 0]), [0, 0, 1]);
assert.equal(math.determinant2([1, 2], [2, 4]), 0);
console.log("PASS: vector math operations, zero-vector guards, products, and independence determinant");
