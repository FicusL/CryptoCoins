export function waitMiliseconds(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}