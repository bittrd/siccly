export class InjectionError extends Error {
  constructor(interfaceName: string) {
    super(`Interface has no bound implementation: ${interfaceName}`);
  }
}
