function shuffleArray<T = any>(arr: T[]): T[] {
  return arr.sort(() => (Math.random() > 0.5 ? 1 : -1));
}

export default shuffleArray;
