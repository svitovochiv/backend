import { ValueObject } from '../../ddd';
import { Quantities, UnknownQuantity } from '../product';

export class Quantity extends ValueObject<{
  value: Quantities | typeof UnknownQuantity;
}> {
  constructor(value: string) {
    if (!value) {
      throw new Error('Quantity cannot be empty');
    }
    if (Quantity.isValid(value)) {
      super({ value });
    } else {
      super({ value: UnknownQuantity });
    }
  }

  static isValid(value: string): value is Quantities {
    return Object.values(Quantities).includes(value as Quantities);
  }

  isValid(): boolean {
    return Quantity.isValid(this.value);
  }

  get value() {
    return this.props.value;
  }
}
