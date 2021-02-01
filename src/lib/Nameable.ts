import { Constructor } from './traitify';

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

export const Nameable = <S extends Constructor<object>, TNameable>(superclass: S) =>
  class extends superclass implements TNameable {
    _name?: string; // TODO: make protected when https://github.com/microsoft/TypeScript/issues/36060 is fixed

    get name() {
      return this._name;
    }

    set name(name) {
      this._doSetName(this._testSetName(name));
    }

    constructor(...args: any[]) {
      super(...args);
    }

    _testSetName(name?: string) { // TODO: make protected
      return name;
    }

    _doSetName(name?: string) { // TODO: make protected
      this._name = name;
    }
  };
