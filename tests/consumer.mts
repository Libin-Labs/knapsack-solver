import {
  solveKnapsack,
  type KnapsackItem,
  type KnapsackOptions,
  type KnapsackResult,
} from '@lp-labs/knapsack-solver';
export type PublicTypes = [KnapsackItem, KnapsackOptions, KnapsackResult];
void solveKnapsack;
const result: KnapsackResult = solveKnapsack([{ weight: 1, profit: 2 }], 3);
void result;
// @ts-expect-error item weight is numeric
solveKnapsack([{ weight: '1', profit: 2 }], 3);
