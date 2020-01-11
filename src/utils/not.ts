export const not = <A>(predicate: (x: A) => boolean) => (x: A) => !predicate(x);
