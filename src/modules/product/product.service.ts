import { Injectable } from '@nestjs/common';
import { UploadProductViaFileDto } from '../../domain';
import { ExcelUtil, QuantityUtil } from '../../util';

@Injectable()
export class ProductService {
  private readonly excelUtil = new ExcelUtil();
  private readonly quantityUtil = new QuantityUtil();

  createProductsViaFile(uploadProductViaFileDto: UploadProductViaFileDto) {
    const parsedProducts = this.excelUtil.parseExcelFirstSheet(
      uploadProductViaFileDto.file.buffer,
    );
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
      const mappedProducts = parsedProducts.map((values) => {
        const quantity = this.quantityUtil.normalizeQuantity(values[2]);
        if (!quantity) throw new Error(`Invalid quantity ${values[2]}`);
        return {
          name: values[1],
          quantity: quantity,
          price: values[3],
        };
      });
      return mappedProducts;
    }
    return parsedProducts;
  }
}
