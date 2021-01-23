import { Constructor } from './traitify';

export interface ITaggable {
  tag?: string;
}

export const Taggable = <S>(superclass: Constructor<S>) =>
  class extends superclass implements ITaggable {
    protected _tag?: string;

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
