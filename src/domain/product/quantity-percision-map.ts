import { Quantity } from './quantity';

export const quantityPrecisionMap: { [key in Quantity]: number } = {
  [Quantity.Kilogram]: 0.01,
  [Quantity.Liter]: 1,
  [Quantity.Package]: 1,
  [Quantity.Piece]: 1,
};
