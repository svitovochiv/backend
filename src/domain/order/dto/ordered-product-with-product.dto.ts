import {OrderedProductDto} from "./ordered-product.dto";
import {ProductDto} from "../../product";

export class OrderedProductWithProductDto extends OrderedProductDto {
  product: ProductDto;
  constructor(data: OrderedProductWithProductDto) {
    super(data);
    this.product = data.product;
  }

}