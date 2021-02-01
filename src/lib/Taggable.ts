import { Constructor } from './traitify';

// public trait interface
export interface ITaggable {
  tag?: string;
}

// non-public trait interface
export interface TTaggable extends ITaggable {
  _tag?: string

  _testSetTag(tag?: string): string | null | undefined

  _doSetTag(tag?: string): void
}

export const Taggable = <S extends Constructor<object>, TTaggable>(superclass: S) =>
  class extends superclass implements TTaggable {
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
    }
  };
