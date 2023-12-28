export class GetProductsInBasketQuery {
  readonly userId: string;
  readonly isProductActive?: boolean;
  constructor(params: GetProductsInBasketQuery) {
    this.userId = params.userId;
    this.isProductActive = params.isProductActive;
  }
}
