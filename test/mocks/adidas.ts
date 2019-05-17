import { Shoes } from './shoes';

export class Adidas implements Shoes {
  areTied(): boolean {
    return false;
  }
}
