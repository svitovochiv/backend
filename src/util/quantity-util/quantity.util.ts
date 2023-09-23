import { Quantity, UkraineQuantity } from '../../domain';

export class QuantityUtil {
  normalizeQuantity(quantity: string): undefined | Quantity {
    const ukraineQuantity = this.getUkraineQuantity(quantity);
    if (ukraineQuantity) {
      return this.ukraineQuantityToEnglishQuantityMap[ukraineQuantity];
    }
  }

  getUkraineQuantity(quantity: string): undefined | UkraineQuantity {
    const ukraineQuantities = Object.values(UkraineQuantity);
    if (ukraineQuantities.includes(quantity as UkraineQuantity)) {
      return quantity as UkraineQuantity;
    }
  }
  private readonly ukraineQuantityToEnglishQuantityMap = {
    [UkraineQuantity.Piece]: Quantity.Piece,
    [UkraineQuantity.Kg]: Quantity.Kilogram,
    [UkraineQuantity.Package]: Quantity.Package,
    [UkraineQuantity.L]: Quantity.Liter,
  };
}
