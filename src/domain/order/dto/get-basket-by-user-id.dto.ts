export class GetBasketByUserIdDto {
  readonly userId: string;
  constructor(params: GetBasketByUserIdDto) {
    this.userId = params.userId;
  }
}
