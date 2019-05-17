import { Runner } from './runner';
import { Shoes } from './shoes';
import { TYPES } from './kernel';
export class Me implements Runner {
  static inject = [TYPES.Shoes];
  public constructor(private readonly shoes: Shoes) {}
  run(): string {
    if (this.shoes.areTied()) {
      return 'I am running with my shoes tied';
    }
    return 'I am tripping over shoelaces';
  }
}
