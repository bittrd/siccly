import { TYPES } from './mocks/kernel';
import { Shoes } from './mocks/shoes';
import { Me } from './mocks/me';
import { Nike } from './mocks/nike';
import { Adidas } from './mocks/adidas';
import { Kernel, Type } from '../src';
import {
  InjectionError,
  ReBindError,
  DuplicateInterfaceName,
} from '../src/errors';

describe('kernel tests', () => {
  it('should resolve Nike class for Shoes', () => {
    const container = new Kernel();
    container.bind(TYPES.Shoes).toClass(Nike);
    const me = container.get(TYPES.Shoes);
    const result = me.areTied();
    expect(result).toBeTruthy();
    expect((<Object>(<unknown>me)).constructor.name).toBe(Nike.name);
  });
  it('should resolve Adidas class for Shoes', () => {
    const container = new Kernel();
    container.bind(TYPES.Shoes).toClass(Adidas);
    const me = container.get(TYPES.Shoes);
    const result = me.areTied();
    expect(result).toBeFalsy();
    expect((<Object>(<unknown>me)).constructor.name).toBe(Adidas.name);
  });
  it('should return new instance every time for class binding', () => {
    const container = new Kernel();
    container.bind(TYPES.Shoes).toClass(Nike);
    const first = container.get(TYPES.Shoes);
    const second = container.get(TYPES.Shoes);
    expect(first).not.toBe(second);
  });
  it('should return same instance every time for singleton binding', () => {
    const container = new Kernel();
    const singleton = new Nike();
    container.bind(TYPES.Shoes).toSingleton(singleton);
    const first = container.get(TYPES.Shoes);
    const second = container.get(TYPES.Shoes);
    expect(first).toBe(singleton);
    expect(first).toBe(second);
  });
  it('should inject shoes into runner that are tied', () => {
    const container = new Kernel();
    container.bind(TYPES.Shoes).toClass(Nike);
    container.bind(TYPES.Runner).toClass(Me);
    const runner = container.get(TYPES.Runner);
    const result = runner.run();
    expect(result).toEqual('I am running with my shoes tied');
  });
  it('should inject shoes into runner that are untied', () => {
    const container = new Kernel();
    container.bind(TYPES.Shoes).toClass(Adidas);
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
  it('should throw error if you rebind the same interface', () => {
    const container = new Kernel();
    container.bind(TYPES.Shoes).toClass(Nike);
    expect(() => {
      container.bind(TYPES.Shoes).toClass(Adidas);
    }).toThrow(new ReBindError('Shoes', Adidas.name));
  });
  it('should throw error if you try converting the same interface to a type twice', () => {
    Type<Shoes>('TestBinding');
    expect(() => {
      Type<Shoes>('TestBinding');
    }).toThrow(new DuplicateInterfaceName('TestBinding'));
  });
});
