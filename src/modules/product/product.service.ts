import { Injectable } from '@nestjs/common';
import {
  AddProductDto,
  ParsedProductDto,
  ProductDto,
  UploadProductViaFileDto,
} from '../../domain';
import { ExcelUtil, QuantityUtil } from '../../util';
import { ProductRepository } from './product.repository';
import {
  BadRequestError,
  SeveralProductsWithTheSameNameError,
} from '../../exceptions';

@Injectable()
export class ProductService {
  private readonly excelUtil = new ExcelUtil();
  private readonly quantityUtil = new QuantityUtil();

  constructor(private readonly productRepository: ProductRepository) {}

  async createProductsViaFile(
    uploadProductViaFileDto: UploadProductViaFileDto,
  ) {
    const uploadedProducts = this.parseProduct(
      uploadProductViaFileDto.file.buffer,
    );
    if (uploadedProducts) {
      this.checkDuplicateProducts(uploadedProducts);
      const existedProducts = await this.getProducts();
      const existedProductsMap = new Map<string, ProductDto>();
      existedProducts.forEach((product) => {
        existedProductsMap.set(product.name, product);
      });
      const productsToAdd: AddProductDto[] = [];
      const productsToUpdate: AddProductDto[] = [];
      const uploadedProductsNames = new Set<string>();

      uploadedProducts.forEach((newProduct) => {
        uploadedProductsNames.add(newProduct.name);
        const isProductExisted = existedProducts.find(
          (product) => product.name === newProduct.name,
        );

        if (!isProductExisted) {
          const productToAdd = new AddProductDto({
            name: newProduct.name,
            quantity: newProduct.quantity,
            price: newProduct.price,
            isActive: true,
          });
          productsToAdd.push(productToAdd);
        } else {
          const existedProduct = existedProductsMap.get(newProduct.name);
          if (existedProduct) {
            const productToUpdate = new AddProductDto({
              name: newProduct.name,
              quantity: newProduct.quantity,
              price: newProduct.price,
              isActive: true,
            });
            productsToUpdate.push(productToUpdate);
          }
        }
      });
      const productsToDeactivate: string[] = [];
      existedProducts.forEach((existedProduct) => {
        if (!uploadedProductsNames.has(existedProduct.name)) {
          productsToDeactivate.push(existedProduct.name);
        }
      });
      await this.productRepository.addManyProducts(productsToAdd);
      await this.productRepository.updateManyProducts(productsToUpdate);
      await this.productRepository.deactivateProducts(productsToDeactivate);
    }
  }

  async getProducts() {
    const existedProducts: ProductDto[] = [];
    (await this.productRepository.getProducts()).forEach((product) => {
      const normalizedQuantity = this.quantityUtil.normalizeQuantity(
        product.quantity,
      );
      if (normalizedQuantity) {
        const existedProduct = new ProductDto({
          id: product.id,
          name: product.name,
          quantity: normalizedQuantity,
          price: product.price,
          isActive: product.isActive,
        });
        existedProducts.push(existedProduct);
      }
    });
    return existedProducts;
  }

  private parseProduct(productFile: Buffer) {
    const parsedProductsRaw = this.excelUtil.parseExcelFirstSheet(productFile);
    const endAdditionalInformationRowIndex = parsedProductsRaw.findIndex(
      (values) => values.includes('Ном'),
    );
    const startProductsInformationIndex =
      endAdditionalInformationRowIndex > 0
        ? endAdditionalInformationRowIndex + 1
        : undefined;
    if (startProductsInformationIndex) {
      parsedProductsRaw.splice(0, startProductsInformationIndex);
      const endProductsInformationIndex = parsedProductsRaw.findIndex(
        (values) => values[0] === '',
      );
      parsedProductsRaw.splice(endProductsInformationIndex);
      const parsedProducts: ParsedProductDto[] = [];
      parsedProductsRaw.forEach((values) => {
        const quantity = this.quantityUtil.normalizeQuantity(values[2]);
        if (!quantity) throw new Error(`Invalid quantity ${values[2]}`);
        parsedProducts.push(
          new ParsedProductDto({
            position: values[0],
            name: values[1],
            quantity: quantity,
            price: values[3],
          }),
        );
      });
      return parsedProducts;
    }
    throw new BadRequestError(
      'Не знайдено початок таблиці. Початком таблиці є рядок з клітинкою Товар',
    );
  }

  private checkDuplicateProducts(parsedProducts: ParsedProductDto[]) {
    // check on several products with the same name
    const duplicates = new Map<string, ParsedProductDto[]>();
    const duplicatesNames = new Set<string>();
    parsedProducts.forEach((product) => {
      const duplicateStore = duplicates.get(product.name);
      if (!duplicateStore) {
        duplicates.set(product.name, [product]);
      } else {
        duplicatesNames.add(product.name);
        duplicateStore.push(product);
      }
    });

    if (duplicatesNames.size > 0) {
      const formattedDuplicates: ParsedProductDto[] = [];
      duplicatesNames.forEach((name) => {
        const duplicatesToAdd = duplicates.get(name);
        if (duplicatesToAdd) {
          formattedDuplicates.push(...duplicatesToAdd);
        }
      });
      throw new SeveralProductsWithTheSameNameError(formattedDuplicates);
    }
  }
}
