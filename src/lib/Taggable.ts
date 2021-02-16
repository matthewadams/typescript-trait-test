import { Constructor, Empty } from './traitify';

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

export const Taggable = <S extends Constructor<object>>(superclass?: S) =>
  class extends (superclass || Empty)
    implements TTaggable {
    _tag?: string; // TODO: make protected when https://github.com/microsoft/TypeScript/issues/36060 is fixed

    constructor(...args: any[]) {
      super(...args);
    }

    get tag() {
      return this._tag;
    }

    set tag(tag) {
      this._doSetTag(this._testSetTag(tag));
    }

    _testSetTag(tag?: string) {
      return tag;
    }

    _doSetTag(tag?: string) {
      this._tag = tag;
    }
  };
