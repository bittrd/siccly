import { Kernel } from './kernel';
import { Class } from './class';

export class Bind<T> {
  constructor(
    private readonly kernel: Kernel,
    private readonly intf: Class<T>,
  ) {}
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
