export class ReBindError extends Error {
  constructor(interfaceName: string, className: string) {
    super(
      `This interface is already bound: ${interfaceName} - tried to rebind to: ${className}`,
    );
  }
}
