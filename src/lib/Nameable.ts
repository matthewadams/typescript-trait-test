import { Constructor, Empty } from './traitify';

// public trait interface
export interface INameable {
  name?: string;
}

// non-public trait interface
export interface TNameable extends INameable {
  _name?: string

  _testSetName(name?: string): string | null | undefined

  _doSetName(name?: string): void
}

export const Nameable = <S extends Constructor<object>>(superclass?: S) =>
  class extends (superclass || Empty)
    implements TNameable {
    _name?: string; // TODO: make protected when https://github.com/microsoft/TypeScript/issues/36060 is fixed

    constructor(...args: any[]) {
      super(...args);
    }

    get name() {
      return this._name;
    }

    set name(name) {
      this._doSetName(this._testSetName(name));
    }

    _testSetName(name?: string) { // TODO: make protected
      return name;
    }

    _doSetName(name?: string) { // TODO: make protected
      this._name = name;
    }
  };
