export interface KnapsackItem {
  weight: number;
  profit: number;
}
export interface KnapsackOptions {
  maxCells?: number;
}
export interface KnapsackResult {
  profit: number;
  weight: number;
  indices: number[];
}
export function solveKnapsack(
  items: readonly KnapsackItem[],
  capacity: number,
  options: KnapsackOptions = {},
): KnapsackResult {
  const maxCells = options.maxCells ?? 2000000;
  if (!Number.isSafeInteger(maxCells) || maxCells < 1 || maxCells > 10000000)
    throw new RangeError('Invalid maxCells');
  if (
    !Array.isArray(items) ||
    items.length > 10000 ||
    !Number.isSafeInteger(capacity) ||
    capacity < 0 ||
    capacity > 1000000
  )
    throw new RangeError('Invalid knapsack dimensions');
  if ((items.length + 1) * (capacity + 1) > maxCells)
    throw new RangeError('DP cell budget exceeded');
  let absoluteProfit = 0;
  for (const item of items) {
    if (!Number.isSafeInteger(item.weight) || item.weight < 0 || !Number.isSafeInteger(item.profit))
      throw new RangeError('Items require nonnegative integer weights and safe integer profits');
    absoluteProfit += Math.abs(item.profit);
    if (!Number.isSafeInteger(absoluteProfit))
      throw new RangeError('Profit magnitude budget overflow');
  }
  const table: Float64Array[] = [new Float64Array(capacity + 1)];
  for (let i = 0; i < items.length; i++) {
    const previous = table[i]!,
      item = items[i]!,
      next = new Float64Array(previous);
    for (let c = item.weight; c <= capacity; c++)
      next[c] = Math.max(previous[c]!, previous[c - item.weight]! + item.profit);
    table.push(next);
  }
  let remaining = capacity;
  const indices: number[] = [];
  for (let i = items.length; i > 0; i--) {
    if (table[i]![remaining]! > table[i - 1]![remaining]!) {
      indices.push(i - 1);
      remaining -= items[i - 1]!.weight;
    }
  }
  indices.reverse();
  return { profit: table[items.length]![capacity]!, weight: capacity - remaining, indices };
}
