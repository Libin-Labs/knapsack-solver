import test from 'node:test';
import assert from 'node:assert/strict';
import * as lib from '../dist/esm/index.js';
function random(seed = 123456789) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
test('known optimum with reconstruction', () => {
  const r = lib.solveKnapsack(
    [
      { weight: 3, profit: 4 },
      { weight: 4, profit: 5 },
      { weight: 2, profit: 3 },
    ],
    6,
  );
  assert.deepEqual(r, { profit: 8, weight: 6, indices: [1, 2] });
});
test('zero weights are used once including capacity zero', () => {
  assert.deepEqual(
    lib.solveKnapsack(
      [
        { weight: 0, profit: 4 },
        { weight: 0, profit: 2 },
      ],
      0,
    ),
    { profit: 6, weight: 0, indices: [0, 1] },
  );
});
test('negative profits and empty selection', () => {
  assert.deepEqual(
    lib.solveKnapsack(
      [
        { weight: 0, profit: -3 },
        { weight: 1, profit: -1 },
      ],
      5,
    ),
    { profit: 0, weight: 0, indices: [] },
  );
});
test('ties prefer excluding later item', () => {
  assert.deepEqual(
    lib.solveKnapsack(
      [
        { weight: 1, profit: 2 },
        { weight: 1, profit: 2 },
      ],
      1,
    ).indices,
    [0],
  );
  assert.equal(lib.solveKnapsack([], 0).profit, 0);
});
test('exact budgets and unsafe arithmetic rejected', () => {
  assert.throws(
    () => lib.solveKnapsack([{ weight: 1, profit: 2 }], 2, { maxCells: 5 }),
    RangeError,
  );
  assert.equal(lib.solveKnapsack([{ weight: 1, profit: 2 }], 2, { maxCells: 6 }).profit, 2);
  assert.throws(() => lib.solveKnapsack([{ weight: 0.5, profit: 1 }], 2), RangeError);
  assert.throws(
    () =>
      lib.solveKnapsack(
        [
          { weight: 0, profit: Number.MAX_SAFE_INTEGER },
          { weight: 0, profit: 1 },
        ],
        0,
      ),
    RangeError,
  );
});
test('seeded exhaustive subset oracle', () => {
  const rng = random();
  for (let t = 0; t < 180; t++) {
    const items = Array.from({ length: 9 }, () => ({
        weight: Math.floor(rng() * 6),
        profit: Math.floor(rng() * 15) - 4,
      })),
      cap = Math.floor(rng() * 16);
    let best = 0;
    for (let mask = 0; mask < 1 << items.length; mask++) {
      let w = 0,
        p = 0;
      items.forEach((x, i) => {
        if (mask & (1 << i)) {
          w += x.weight;
          p += x.profit;
        }
      });
      if (w <= cap) best = Math.max(best, p);
    }
    const r = lib.solveKnapsack(items, cap);
    assert.equal(r.profit, best);
    assert.equal(new Set(r.indices).size, r.indices.length);
    assert.equal(
      r.indices.reduce((s, i) => s + items[i].weight, 0),
      r.weight,
    );
    assert.equal(
      r.indices.reduce((s, i) => s + items[i].profit, 0),
      best,
    );
    assert.ok(r.weight <= cap);
  }
});
