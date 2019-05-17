import { Shoes } from './shoes';

export class BittrdBrand implements Shoes {
  areTied(): boolean {
    return true;
  }
}
