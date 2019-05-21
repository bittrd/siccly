import { Kernel } from '../src';
import { Runner } from './mocks/runner';
import { TYPES } from './mocks/kernel';
import { Me } from './mocks/me';
import { Shoes } from './mocks/shoes';
import { BittrdBrand } from './mocks/bittrd-brand';

describe('bind types', () => {
  it('should use the function for object creation', () => {
    const container = new Kernel();
    const expectedRunner = new Me(new BittrdBrand());
    container.bind(TYPES.Runner).toMethod(() => {
      return expectedRunner;
    });
    const firstGet = container.get(TYPES.Runner);
    const secondGet = container.get(TYPES.Runner);
    expect(firstGet).toBe(secondGet);
  });
  it('should use the lambda for object creation', () => {
    const container = new Kernel();
    const expectedRunner = new Me(new BittrdBrand());
    container.bind(TYPES.Runner).toMethod(() => expectedRunner);
    const firstGet = container.get(TYPES.Runner);
    const secondGet = container.get(TYPES.Runner);
    expect(firstGet).toBe(secondGet);
  });
});
