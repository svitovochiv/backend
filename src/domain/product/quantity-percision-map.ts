import { Quantities } from './quantities';

export const quantityPrecisionMap: { [key in Quantities]: number } = {
  [Quantities.Kilogram]: 0.01,
  [Quantities.Liter]: 1,
  [Quantities.Package]: 1,
  [Quantities.Piece]: 1,
};
