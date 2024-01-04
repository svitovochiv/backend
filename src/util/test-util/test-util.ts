export class TestUtil {
  static getRandomObjects<T>(arr: T[], count: number): T[] {
    const indices = new Set<number>();

    count = Math.min(count, arr.length);

    while (indices.size < count) {
      const randomIndex = Math.floor(Math.random() * arr.length);
      indices.add(randomIndex);
    }

    const sortedIndices = Array.from(indices).sort((a, b) => a - b);

    return sortedIndices.map((index) => arr[index]);
  }

  static getRandomValue<T>(arr: T[]): T | undefined {
    if (arr.length === 0) {
      return undefined; // Return undefined if the array is empty
    }

    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }
}
