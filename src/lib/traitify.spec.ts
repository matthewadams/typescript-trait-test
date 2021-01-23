import { trait, superclass, Constructor } from './traitify';

import test from 'ava';

test('traits', (t) => {
  interface ITaggable {
    tag?: string;
  }

  const Taggable = <S>(superclass: Constructor<S>) =>
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

  class Point extends trait(Taggable) {
    constructor(public x: number, public y: number) {
      super(...arguments);
    }

    _testSetTag(tag?: string) {
      tag = super._testSetTag(tag);

      if (!tag) throw new Error('no tag given');
      else return tag.toLowerCase();
    }
  }

  const point = new Point(10, 20);
  point.tag = 'hello';

  t.is(point.tag, 'hello');
  t.throws(() => point.tag = '');

  class Base {
    something: string = 'I am a base';
  }

  class Sub extends superclass(Base).with(Taggable).apply() {
    constructor() {
      super(...arguments);
    }

    _testSetTag(tag?: string): string | undefined {
      tag = super._testSetTag(tag);

      if (tag === 'throw') throw new Error('illegal tag value');
      return tag;
    }
  }

  const sub = new Sub();
  sub.tag = 'sub';

  t.is(sub.tag, 'sub');
  t.throws(() => sub.tag = 'throw');
});
