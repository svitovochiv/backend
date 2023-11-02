export class CountAndPriceDto {
  price: number;
  count: number;
  constructor(data: CountAndPriceDto) {
    this.price = data.price;
    this.count = data.count;
  }
}
