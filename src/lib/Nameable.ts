import { Constructor } from './traitify';

export interface INameable {
  name?: string;
}

export const Nameable = <S extends Constructor<object>>(superclass: S) =>
  class extends superclass implements INameable {
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
      return this;
    }
  };
