import { trait, superclass } from './traitify';

import test from 'ava';
import { Taggable } from './Taggable';
import { Nameable } from './Nameable';

test('express a single trait with no superclass', (t) => {
  class Point extends trait(Taggable)
    .apply() {
    constructor(public x: number, public y: number) {
      super(...arguments);
      this.x = x;
      this.y = y;
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
});

test('express a single trait and extend a superclass', (t) => {
  class Base {
    something: string = 'I am a base';
  }

  class Sub extends superclass(Base)
    .with(Taggable)
    .apply() {

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

  t.assert(sub instanceof Sub);
  t.assert(sub instanceof Base);

  sub.tag = 'sub';

  t.is(sub.tag, 'sub');
  t.throws(() => sub.tag = 'throw');
});

test('express multiple traits and extend a superclass', (t) => {
  class Animal {
  }

  class Person extends superclass(Animal)
    .with(Nameable)
    .with(Taggable)
    .apply() {

    constructor(...args: any[]) {
      super(args);
    }

    _testSetName(name?: string) {
      if (!name) throw new Error('no name given');
      return name.trim();
    }
  }

  const person = new Person();

  t.assert(person instanceof Person);
  t.assert(person instanceof Animal);

  person.name = 'Felix';

  t.is(person.name, 'Felix');
  t.throws(() => person.name = null);
});

test('superclass expresses a trait, subclass expresses another trait but overrides method in superclass\'s trait', (t) => {
  class Animal extends trait(Nameable)
    .apply() {
    constructor(...args: any[]) {
      super(args);
    }

    _testSetName(name?: string) {
      if (!name) throw new Error('no name given');
      if (name.toLowerCase().includes('animal')) throw new Error('name must include "animal"');
      return name;
    }
  }

  const animal = new Animal();
  animal.name = 'an animal';

  t.is(animal.name, 'an animal');
  t.throws(() => animal.name = 'nothing');

  class Person extends superclass(Animal)
    .with(Taggable).apply() {

    constructor(...args: any[]) {
      super(args);
    }

    _testSetName(name?: string) {
      if (!name) throw new Error('no name given');
      if (name.toLowerCase().includes('person')) throw new Error('name must include "person"');
      return name;
    }
  }

  const person = new Person();
  t.assert(person instanceof Person);
  t.assert(person instanceof Animal);

  person.name = 'a person';

  t.is(person.name, 'a person');
  t.throws(() => person.name = 'an animal');
  t.throws(() => person.name = 'nothing');
});
