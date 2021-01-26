import { Constructor } from './traitify';

export interface ITaggable {
  tag?: string;
}

export const Taggable = <S extends Constructor<object>>(superclass: S) =>
  class extends superclass implements ITaggable {
    _tag?: string; // TODO: make protected when https://github.com/microsoft/TypeScript/issues/36060 is fixed

    get tag() {
      return this._tag;
    }

    set tag(tag) {
      this._doSetTag(this._testSetTag(tag));
    }

    constructor(...args: any[]) {
      super(...args);
    }

    _testSetTag(tag?: string) { // TODO: make protected
      return tag;
    }

    _doSetTag(tag?: string) { // TODO: make protected
      this._tag = tag;
      return this;
    }
  };
