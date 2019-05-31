import { DuplicateInterfaceName } from '../errors';
import { Class } from './class';
export const typeNames: Map<string, any> = new Map();
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
