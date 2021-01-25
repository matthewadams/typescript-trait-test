import { Constructor } from './traitify';

export interface ITaggable {
  tag?: string;
}

export const Taggable = <S extends Constructor<object>>(superclass: S) =>
  class extends superclass implements ITaggable {
    _tag?: string; // TODO: make this protected

    get tag() {
      return this._tag;
    }

    set tag(tag) {
      this._doSetTag(this._testSetTag(tag));
    }

    constructor(...args: any[]) {
      super(...args);
    }

    _testSetTag(tag?: string) {
      return tag;
    }

    _doSetTag(tag?: string) {
      this._tag = tag;
      return this;
    }
  };
