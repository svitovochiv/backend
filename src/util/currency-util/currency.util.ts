export class CurrencyUtil {
  static round(amount: number): number {
    return Math.round(amount * 100) / 100;
  }
}
