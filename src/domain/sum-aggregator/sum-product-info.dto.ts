export class SumProductInfoDto {
  price: number;
  count: number;
  constructor(data: SumProductInfoDto) {
    this.price = data.price;
    this.count = data.count;
  }
}
