import { Shoes } from './shoes';

export class BadBrand implements Shoes {
  areTied(): boolean {
    return false;
  }
}
