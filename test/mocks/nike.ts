import { Shoes } from './shoes';

export class Nike implements Shoes {
  areTied(): boolean {
    return true;
  }
}
