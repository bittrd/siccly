import { Kernel } from './kernel';
import { Class } from './class';

export class Bind<T> {
  constructor(
    private readonly kernel: Kernel,
    private readonly intf: Class<T>,
  ) {}
  public toMethod(method: () => T): void;
  public toMethod(method: (container: Kernel) => T): void;
  public toMethod(method: (container: Kernel) => T) {
    const scope = this;
    class Method {
      constructor() {
        return method(scope.kernel);
      }
    }
    this.kernel.bind(this.intf, Method);
  }
  public toClass(impl: Class<T>) {
    this.kernel.bind(this.intf, impl);
  }
  public toSingleton(impl: Class<T>): void;
  public toSingleton(impl: T): void;
  public toSingleton(instanceOrClass: T | Class<T>) {
    const instance = this.isInstanceOfClass(instanceOrClass)
      ? instanceOrClass
      : this.kernel.createOne(instanceOrClass);
    class Singleton {
      constructor() {
        return instance;
      }
    }
    this.kernel.bind(this.intf, Singleton);
  }
  private isInstanceOfClass(
    instanceOrClass: T | Class<T>,
  ): instanceOrClass is T {
    return typeof instanceOrClass !== 'function';
  }
}
