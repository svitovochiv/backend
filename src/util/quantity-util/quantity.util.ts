import { Quantities, UkraineQuantity, UnknownQuantity } from '../../domain';

export class QuantityUtil {
  normalizeQuantity(quantity: string): typeof UnknownQuantity | Quantities {
    const ukraineQuantity = this.getUkraineQuantity(quantity);
    if (Object.values(Quantities).includes(quantity as Quantities)) {
      return quantity as Quantities;
    }
    if (ukraineQuantity) {
      return this.ukraineQuantityToEnglishQuantityMap[ukraineQuantity];
    }
    return UnknownQuantity;
  }

  getUkraineQuantity(quantity: string): undefined | UkraineQuantity {
    const ukraineQuantities = Object.values(UkraineQuantity);
    if (ukraineQuantities.includes(quantity as UkraineQuantity)) {
      return quantity as UkraineQuantity;
    }
  }
  private readonly ukraineQuantityToEnglishQuantityMap = {
    [UkraineQuantity.Piece]: Quantities.Piece,
    [UkraineQuantity.Kg]: Quantities.Kilogram,
    [UkraineQuantity.Package]: Quantities.Package,
    [UkraineQuantity.L]: Quantities.Liter,
  };
}
