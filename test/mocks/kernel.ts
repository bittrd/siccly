import { Runner } from './runner';
import { Shoes } from './shoes';
import { Type } from '../../src/index';

export const TYPES = {
  Runner: Type<Runner>('Runner'),
  Shoes: Type<Shoes>('Shoes'),
};
