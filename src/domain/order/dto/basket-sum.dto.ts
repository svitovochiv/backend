export class BasketSumDto {
  sum: number;
  constructor(data: BasketSumDto) {
    this.sum = Math.round(data.sum * 100) / 100;
  }
}
