import { expect } from 'chai';
import { Taggable } from './Taggable';
import { Nameable } from './Nameable';

describe('traits', function() {
  it('express a single trait with no superclass', function() {
    class Point extends Taggable() {
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

    expect(point.tag).to.equal('hello');
    expect(() => point.tag = '').to.throw();
  });

  it('express multiple traits with no superclass', function() {
    class Point2 extends Nameable(Taggable()) {
      constructor(public x: number, public y: number) {
        super(...arguments);
      }

      _testSetTag(tag?: string) {
        tag = super._testSetTag(tag);

        if (!tag) throw new Error('no tag given');
        else return tag.toLowerCase();
      }

      _testSetName(name?: string) {
        name = super._testSetName(name);

        if (!name) throw new Error('no name given');
        else return name.toLowerCase();
      }
    }

    const point2 = new Point(10, 20);
    point2.tag = 'hello';

    expect(point2.tag).to.equal('hello');
    expect(() => point2.tag = '').to.throw();
  });

  it('express a single trait and extend a superclass', function() {
    class Base {
      something: string = 'I am a base';
    }

    class Sub extends Taggable(Base) {
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

    expect(sub instanceof Sub).to.equal(true);
    expect(sub instanceof Base).to.equal(true);

    sub.tag = 'sub';

    expect(sub.tag).to.equal('sub');
    expect(() => sub.tag = 'throw').to.throw();
  });

  it('express multiple traits and extend a superclass', function() {
    class Animal {
      public weight = 100;
    }

    class Person extends Nameable(Taggable(Animal)) {
      constructor(...args: any[]) {
        super(args);
        this.weight = 180;
      }

      _testSetName(name?: string) {
        if (!name) throw new Error('no name given');
        return name.trim();
      }
    }

    const person = new Person();

    expect(person instanceof Person);
    expect(person instanceof Animal);

    person.name = 'Felix';

    expect(person.name).to.equal('Felix');
    expect(() => person.name = undefined).to.throw();
  });

  it('superclass expresses a trait, subclass expresses another trait but overrides method in superclass\'s trait', function() {
    class Animal extends Nameable() {
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

    expect(animal.name).to.equal('an animal');
    expect(() => animal.name = 'nothing').to.throw();

    class Person2 extends Taggable(Animal) {
      constructor(...args: any[]) {
        super(args);
      }

      _testSetName(name?: string) {
        if (!name) throw new Error('no name given');
        if (name.toLowerCase().includes('person')) throw new Error('name must include "person"');
        return name;
      }
    }

    const p = new Person2();
    expect(p instanceof Person2);
    expect(p instanceof Animal);

    p.name = 'a person';

    expect(p.name).to.equal( 'a person');
    expect(() => p.name = 'an animal').to.throw();
    expect(() => p.name = 'nothing').to.throw();
  });
});
