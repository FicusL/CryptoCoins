export function createIdGenerator(firstValue = 0) {
  return function next() {
    return firstValue++;
  };
}