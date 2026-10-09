export type Point = readonly [number, number];
export type Triple = readonly [number, number, number];

export const add = (a: Point, b: Point): Point => [a[0] + b[0], a[1] + b[1]];
export const subtract = (a: Point, b: Point): Point => [a[0] - b[0], a[1] - b[1]];
export const dot = (a: readonly number[], b: readonly number[]): number =>
  a.reduce((sum, value, index) => sum + value * b[index], 0);
export const magnitude = (v: readonly number[]): number => Math.sqrt(dot(v, v));
export const normalize = (v: Point): Point | null => {
  const length = magnitude(v);
  return length === 0 ? null : [v[0] / length, v[1] / length];
};
export const angleDegrees = (a: Point, b: Point): number | null => {
  const denominator = magnitude(a) * magnitude(b);
  if (denominator === 0) return null;
  return Math.acos(Math.max(-1, Math.min(1, dot(a, b) / denominator))) * 180 / Math.PI;
};
export const hadamard = (a: readonly number[], b: readonly number[]): number[] =>
  a.map((value, index) => value * b[index]);
export const outer = (a: readonly number[], b: readonly number[]): number[][] =>
  a.map(row => b.map(column => row * column));
export const cross = (a: Triple, b: Triple): Triple => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
export const determinant2 = (a: Point, b: Point): number => a[0] * b[1] - a[1] * b[0];
