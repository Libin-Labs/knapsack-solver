# @lp-labs/knapsack-solver

Exact bounded 0/1 integer knapsack with item reconstruction. Zero runtime and peer dependencies. MIT. Node.js 18+; ES2022-compatible browser runtimes with BigInt where used. No browser globals accessed at import.

## Install

```sh
npm install @lp-labs/knapsack-solver
```

## Quick start

```js
import { solveKnapsack } from '@lp-labs/knapsack-solver';
console.log(
  solveKnapsack(
    [
      { weight: 3, profit: 4 },
      { weight: 4, profit: 5 },
      { weight: 2, profit: 3 },
    ],
    6,
  ),
); // { profit: 8, weight: 6, indices: [1,2] }
```

ES modules use named imports above. CommonJS uses `const { solveKnapsack } = require('@lp-labs/knapsack-solver');`. Both formats ship declarations.

## Public API and customization

- `KnapsackItem`: nonnegative safe-integer `weight`, signed safe-integer `profit`.
- `KnapsackOptions`: `maxCells?`, default 2,000,000, maximum 10,000,000.
- `KnapsackResult`: `profit`, `weight`, ascending selected `indices`.
- `solveKnapsack(items, capacity, options?): KnapsackResult`: each item at most once, weight at most capacity; empty selection permitted. Zero-weight positive items work even at capacity zero. Ties exclude the later item (not a minimum-weight tie policy).

All runtime exports and public declaration types are listed above. Options are per call/instance; no global configuration.

## Errors, ownership and limits

Exact integer DP, O(nC) time/storage, including reconstruction table. Capacity 0..1,000,000, at most 10,000 items. Budget is exactly (n+1)(C+1) cells. All invalid dimensions, cell exhaustion, fractional weights/profits, and sum of absolute profits beyond MAX_SAFE_INTEGER throw RangeError before allocation. No approximate mode, fractional items or unbounded reuse. Input is not mutated.

Algorithms are synchronous and CPU/memory bounded by the stated limits, not cancellable or real-time. Validation does not sandbox hostile getters, proxies, callbacks or infinite iterables. TypeScript signatures are the supported input contract. No I/O, network, persistence or cryptographic guarantees.

## Development

```sh
npm ci --offline
npm run build
npm run typecheck
npm test
npm run format:check
```

Strict TypeScript, ESM/CommonJS, bare installed-package consumers with negative type assertions, and deterministic reference-oracle tests are included. Only TypeScript and Prettier are development dependencies.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
