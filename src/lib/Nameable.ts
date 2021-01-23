import { Constructor } from './traitify';

export interface INameable {
  name?: string;
}

export const Nameable = <S>(superclass: Constructor<S>) =>
  class extends superclass implements INameable {
    protected _name?: string;

    get name() {
      return this._name;
    }

    set name(name) {
      this._doSetName(this._testSetName(name));
    }

    constructor(...args: any[]) {
      super(...args);
    }

    _testSetName(name?: string) {
      return name;
    }

    _doSetName(name?: string) {
      this._name = name;
      return this;
    }
  };
