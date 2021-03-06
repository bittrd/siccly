import { isArray } from 'util';
import { ReBindError, InjectionError } from '../errors';
import { InjectableClass } from '../types/injectable-class';
import { Bind } from './bind';
import { Class } from './class';
export class Kernel {
  private _bindMap: Map<string, Class<any>> = new Map();
  public bind<TInterface>(intf: Class<TInterface>): Bind<TInterface>;
  public bind<TInterface>(
    intf: Class<TInterface>,
    impl?: Class<TInterface>,
  ): void;
  public bind<TInterface>(
    intf: Class<TInterface>,
    impl?: Class<TInterface>,
  ): Bind<TInterface> | void {
    if (!impl) {
      return new Bind<TInterface>(this, intf);
    }
    if (this._bindMap.has(intf.name)) {
      throw new ReBindError(intf.name, impl.name);
    }
    this._bindMap.set(intf.name, impl);
  }
  public rebind<TInterface>(intf: Class<TInterface>): Bind<TInterface>;
  public rebind<TInterface>(
    intf: Class<TInterface>,
    impl?: Class<TInterface>,
  ): void;
  public rebind<TInterface>(
    intf: Class<TInterface>,
    impl?: Class<TInterface>,
  ): Bind<TInterface> | void {
    this._bindMap.delete(intf.name);
    return this.bind(intf, impl);
  }
  public get<TInterface>(x: Class<TInterface>): TInterface {
    const objectBuilder = this._bindMap.get(x.name);
    if (objectBuilder) {
      return this.createOne(objectBuilder);
    }
    throw new InjectionError(x.name);
  }
  public createOne<TInterface>(objectBuilder: Class<TInterface>): TInterface {
    const args = [];
    if (this.canInject(objectBuilder)) {
      for (const type of objectBuilder.inject) {
        args.push(this.get(type));
      }
    }
    return new objectBuilder(...args);
  }
  private canInject<T>(x: any): x is InjectableClass & Class<T> {
    return isArray(x.inject);
  }
}
