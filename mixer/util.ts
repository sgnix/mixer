export function shard(amount: number, count: number): Array<number> {
  if (count <= 1) {
    return [amount];
  }

  const percent = Math.random() / count;
  const part = amount * percent;
  const remainder = amount - part;

  return [part].concat(shard(remainder, count - 1));
}
