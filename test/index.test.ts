import { TYPES } from './mocks/kernel';
import { Shoes } from './mocks/shoes';
import { Me } from './mocks/me';
import { BittrdBrand } from './mocks/bittrd-brand';
import { BadBrand } from './mocks/bad-brand';
import { Kernel, Type } from '../src';
import {
  InjectionError,
  ReBindError,
  DuplicateInterfaceName,
} from '../src/errors';

describe('kernel tests', () => {
  it('should resolve Nike class for Shoes', () => {
    const container = new Kernel();
    container.bind(TYPES.Shoes).toClass(BittrdBrand);
    const me = container.get(TYPES.Shoes);
    const result = me.areTied();
    expect(result).toBeTruthy();
    expect((<Object>(<unknown>me)).constructor.name).toBe(BittrdBrand.name);
  });
  it('should resolve Adidas class for Shoes', () => {
    const container = new Kernel();
    container.bind(TYPES.Shoes).toClass(BadBrand);
    const me = container.get(TYPES.Shoes);
    const result = me.areTied();
    expect(result).toBeFalsy();
    expect((<Object>(<unknown>me)).constructor.name).toBe(BadBrand.name);
  });
  it('should return new instance every time for class binding', () => {
    const container = new Kernel();
    container.bind(TYPES.Shoes).toClass(BittrdBrand);
    const first = container.get(TYPES.Shoes);
    const second = container.get(TYPES.Shoes);
    expect(first).not.toBe(second);
  });
  it('should return same instance every time for singleton binding', () => {
    const container = new Kernel();
    const singleton = new BittrdBrand();
    container.bind(TYPES.Shoes).toSingleton(singleton);
    const first = container.get(TYPES.Shoes);
    const second = container.get(TYPES.Shoes);
    expect(first).toBe(singleton);
    expect(first).toBe(second);
  });
  it('should return same instance every time for singleton class binding', () => {
    const container = new Kernel();
    container.bind(TYPES.Shoes).toSingleton(BittrdBrand);
    const first = container.get(TYPES.Shoes);
    const second = container.get(TYPES.Shoes);
    expect(first).toBe(second);
  });
  it('should inject shoes into runner that are tied', () => {
    const container = new Kernel();
    container.bind(TYPES.Shoes).toClass(BittrdBrand);
    container.bind(TYPES.Runner).toClass(Me);
    const runner = container.get(TYPES.Runner);
    const result = runner.run();
    expect(result).toEqual('I am running with my shoes tied');
  });
  it('should inject shoes into runner that are untied', () => {
    const container = new Kernel();
    container.bind(TYPES.Shoes).toClass(BadBrand);
    container.bind(TYPES.Runner).toClass(Me);
    const runner = container.get(TYPES.Runner);
    const result = runner.run();
    expect(result).toEqual('I am tripping over shoelaces');
  });
  it('should throw error is shoes are not bound', () => {
    const container = new Kernel();
    container.bind(TYPES.Runner).toClass(Me);
    expect(() => {
      container.get(TYPES.Runner);
    }).toThrow(new InjectionError('Shoes'));
  });
  it('should throw error if you bind the same interface twice', () => {
    const container = new Kernel();
    container.bind(TYPES.Shoes).toClass(BittrdBrand);
    expect(() => {
      container.bind(TYPES.Shoes).toClass(BadBrand);
    }).toThrow(new ReBindError('Shoes', BadBrand.name));
  });
  it('should succeed if you rebind the same interface after binding once', () => {
    const container = new Kernel();
    container.bind(TYPES.Shoes).toClass(BittrdBrand);
    const nike = container.get(TYPES.Shoes);
    container.rebind(TYPES.Shoes).toClass(BadBrand);
    const adidas = container.get(TYPES.Shoes);
    expect(nike).toBeInstanceOf(BittrdBrand);
    expect(adidas).toBeInstanceOf(BadBrand);
  });
  it('should throw error if you try converting the same interface to a type twice', () => {
    Type<Shoes>('TestBinding');
    expect(() => {
      Type<Shoes>('TestBinding');
    }).toThrow(new DuplicateInterfaceName('TestBinding'));
  });
});
