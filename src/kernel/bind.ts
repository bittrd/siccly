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
  public toSingleton(instance: T) {
    class Singleton {
      constructor() {
        return instance;
      }
    }
    this.kernel.bind(this.intf, Singleton);
  }
}
