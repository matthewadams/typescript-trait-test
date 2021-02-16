type Constructor<T> = new(...args: any[]) => T;

type nullish<T> = T | null | undefined;

class Nothing {
}

const Taggable = <B extends Constructor<object>>(Base?: B) =>
  class Taggable extends (Base || Nothing) {
    _tag: nullish<string>;

    get tag() {
      return this._tag;
    }

    set tag(tag: nullish<string>) {
      this._doSetTag(this._testSetTag(tag));
    }

    constructor(...args: any[]) {
      super(...args);
    }

    _testSetTag(tag: nullish<string>) { // default implementation of tag validation allows anything
      return tag;
    }

    _doSetTag(tag: nullish<string>) {
      this._tag = tag;
    }

    commonMethod() {
      return 'Taggable';
    }
  };

const Nameable = <B extends Constructor<object>>(Base?: B) =>
  class Nameable extends (Base || Nothing) {
    _name: nullish<string>;

    get name() {
      return this._name;
    }

    set name(name: nullish<string>) {
      this._doSetName(this._testSetName(name));
    }

    constructor(...args: any[]) {
      super(...args);
    }

    _testSetName(name: nullish<string>) { // default implementation of tag validation allows anything
      return name;
    }

    _doSetName(name: nullish<string>) {
      this._name = name;
    }

    commonMethod() {
      return 'Nameable';
    }
  };

class Point extends Taggable(Nameable()) {
  constructor(...args: any[]) {
    super(...args);
  }

  _testSetTag(tag: nullish<string>) { // override method provided by Taggable to disallow empty tag
    if (!tag) throw new Error('no tag given');
    return tag.toLowerCase();
  }

  _testSetName(name: nullish<string>) { // override method provided by Taggable to disallow empty tag
    if (!name) throw new Error('no name given');
    return name.toLowerCase();
  }
}

const p = new Point();

p.tag = 'hello';
console.log(p.tag);

p.name = 'bob';
console.log(p.name);

(() => {
  try {
    p.tag = undefined;
    throw new Error('should have thrown')
  } catch (e) {
    // :)
  }
})();

(() => {
  try {
    p.name = undefined;
    throw new Error('should have thrown')
  } catch (e) {
    // :)
  }
})();

if (p.commonMethod() !== 'Taggable') {
  throw new Error('commonMethod should have returned Taggable')
}

console.log('it worked');
