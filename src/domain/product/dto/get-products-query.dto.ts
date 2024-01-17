export class GetProductsQueryDto {
  isActive?: boolean;
  limit?: number;
  cursor?: string;
  withName?: string;
  take?: number;
  skip?: number;

  constructor(data: GetProductsQueryDto) {
    this.isActive = data?.isActive;
    this.limit = data?.limit;
    this.cursor = data?.cursor;
    this.withName = data?.withName;
    this.take = data?.take;
    this.skip = data?.skip;
  }
}
