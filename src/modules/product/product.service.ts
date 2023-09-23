import { Injectable } from '@nestjs/common';
import { AddProductDto, UploadProductViaFileDto } from '../../domain';
import { ExcelUtil, QuantityUtil } from '../../util';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  private readonly excelUtil = new ExcelUtil();
  private readonly quantityUtil = new QuantityUtil();

  constructor(private readonly productRepository: ProductRepository) {}

  async createProductsViaFile(
    uploadProductViaFileDto: UploadProductViaFileDto,
  ) {
    const products = this.parseProduct(uploadProductViaFileDto.file.buffer);
    if (products) {
      await this.productRepository.addManyProducts(products);
    }
  }

  async getProducts() {
    return await this.productRepository.getProducts();
  }

  private parseProduct(productFile: Buffer) {
    const parsedProducts = this.excelUtil.parseExcelFirstSheet(productFile);
    const endAdditionalInformationRowIndex = parsedProducts.findIndex(
      (values) => values.includes('Ном'),
    );
    const startProductsInformationIndex =
      endAdditionalInformationRowIndex > 0
        ? endAdditionalInformationRowIndex + 1
        : undefined;
    if (startProductsInformationIndex) {
      parsedProducts.splice(0, startProductsInformationIndex);
      const endProductsInformationIndex = parsedProducts.findIndex(
        (values) => values[0] === '',
      );
      parsedProducts.splice(endProductsInformationIndex);
      return parsedProducts.map((values) => {
        const quantity = this.quantityUtil.normalizeQuantity(values[2]);
        if (!quantity) throw new Error(`Invalid quantity ${values[2]}`);
        return new AddProductDto({
          name: values[1],
          quantity: quantity,
          price: values[3],
        });
      });
    }
  }
}
