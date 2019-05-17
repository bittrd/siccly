export class DuplicateInterfaceName extends Error {
  constructor(name: string) {
    super(
      `This name has already been tied to an interface and must be unique: ${name}`,
    );
  }
}
