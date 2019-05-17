import { isArray } from 'util';
import { ReBindError, InjectionError, DuplicateInterfaceName } from './errors';
import { InjectableClass } from './types/injectable-class';

type Class<T> = new (...args: any[]) => T;

const typeNames: Map<string, any> = new Map();
export function Type<T>(name: string): Class<T> {
  if (typeNames.has(name)) {
    throw new DuplicateInterfaceName(name);
  }
  const result: any = {
    name: name,
  };
  typeNames.set(name, result);
  return result;
}
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
  public get<TInterface>(x: Class<TInterface>): TInterface {
    const objectBuilder = this._bindMap.get(x.name);
    if (objectBuilder) {
      const args = [];
      if (this.canInject(objectBuilder)) {
        for (const type of objectBuilder.inject) {
          args.push(this.get(type));
        }
      }
      return new objectBuilder(...args);
    }
    throw new InjectionError(x.name);
  }
  private canInject<T>(x: any): x is InjectableClass & Class<T> {
    return isArray(x.inject);
  }
}
export class Bind<T> {
  constructor(
    private readonly kernel: Kernel,
    private readonly intf: Class<T>,
  ) {}
  public toClass(impl: Class<T>) {
    this.kernel.bind(this.intf, impl);
  }
  public toSingleton(instance: T) {
    class Singleton {
      constructor() {
        return instance;
      }
    }
    this.kernel.bind(this.intf, Singleton);
  }
}
