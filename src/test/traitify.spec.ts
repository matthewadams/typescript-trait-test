import { expect } from 'chai'
import * as Greetable from './Greetable'
import * as Greetable2 from './Greetable2'
import * as Taggable from './Taggable'
import * as Nameable from './Nameable'

describe('traits', function () {
  it('expresses the simplest possible "Hello, world!" trait', function () {
    class HelloWorld extends Greetable.trait() {
      constructor(greeting = 'Hello') {
        super()
        this.greeting = greeting
      }
    }

    const greeter = new HelloWorld()

    expect(greeter.greet('world')).to.equal('Hello, world!')
  })

  it('expresses a more realistic "Hello, world!" trait', function () {
    class HelloWorld2 extends Greetable2.trait() {
      constructor(greeting = 'Hello') {
        super()
        this.greeting = greeting
      }

      /**
       * Overrides default behavior
       */
      _testSetGreeting(value?: string): string | undefined {
        value = super._testSetGreeting(value)

        if (!value) {
          throw new Error('no greeting given')
        }

        return value.trim()
      }
    }

    const greeter = new HelloWorld2()

    expect(greeter.greet('world')).to.equal('Hello, world!')
    expect(() => {
      greeter.greeting = ''
    }).to.throw()
  })

  it('express a single trait with no superclass', function () {
    class Point extends Taggable.trait() {
      constructor(public x: number, public y: number) {
        super(x, y)
      }

      _testSetTag(tag?: string) {
        tag = super._testSetTag(tag)

        if (!tag) throw new Error('no tag given')
        else return tag.toLowerCase()
      }
    }

    const point = new Point(10, 20)
    point.tag = 'hello'

    expect(point.tag).to.equal('hello')
    expect(() => {
      point.tag = ''
    }).to.throw()
  })

  it('express a single trait overriding the generic parameter with no superclass', function () {
    class PointN extends Taggable.trait<number>() {
      constructor(public x: number, public y: number) {
        super(x, y)
      }

      _testSetTag(tag?: number) {
        tag = super._testSetTag(tag)

        if (!tag) throw new Error('no tag given')
        else return tag
      }
    }

    const point = new PointN(10, 20)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    point.tag = 42

    expect(point.tag).to.equal(42)
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      point.tag = 0
    }).to.throw()
  })

  it('express multiple traits with no superclass', function () {
    class Point2 extends Nameable.trait(Taggable.trait()) {
      // required to overcome TypeScript compiler bug?
      static new(x: number, y: number) {
        return new this(x, y) as Point2 & Taggable.Public & Nameable.Public
      }

      protected constructor(public x: number, public y: number) {
        super(x, y)
      }

      _testSetTag(tag?: string) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        tag = super._testSetTag(tag)

        if (!tag) throw new Error('no tag given')
        else return tag.toLowerCase()
      }

      _testSetName(name?: string) {
        name = super._testSetName(name)

        if (!name) throw new Error('no name given')
        else return name.toLowerCase()
      }
    }

    const point2 = Point2.new(10, 20)
    point2.tag = 'hello'

    expect(point2.tag).to.equal('hello')
    expect(() => (point2.tag = '')).to.throw()
  })

  it('express a single trait and extend a superclass', function () {
    class Sup extends Taggable.trait() {
      something = 'I am a base'

      _testSetTag(tag?: string): string | undefined {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        tag = super._testSetTag(tag)

        if (tag === 'throw') throw new Error('illegal tag value')
        return tag
      }
    }

    class Sub extends Sup {
      constructor() {
        super()
      }
    }

    const sub = new Sub()

    expect(sub instanceof Sub).to.equal(true)
    expect(sub instanceof Sup).to.equal(true)

    sub.tag = 'sub'

    expect(sub.tag).to.equal('sub')
    expect(() => (sub.tag = 'throw')).to.throw()
  })

  it('express multiple traits and extend a superclass', function () {
    class Animal {
      public weight = 100
    }

    class Person extends Nameable.trait(Taggable.trait(Animal)) {
      // required to overcome TypeScript compiler bug?
      static new(...args: never[]) {
        return new this(...args) as Person & Taggable.Public & Nameable.Public
      }

      protected constructor(...args: never[]) {
        super(...args)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.weight = 180
      }

      _testSetName(name?: string) {
        if (!name) throw new Error('no name given')
        return name.trim()
      }
    }

    const person = Person.new()

    expect(person instanceof Person)
    expect(person instanceof Animal)

    person.name = 'Felix'
    person.tag = 'something'

    expect(person.name).to.equal('Felix')
    expect(() => (person.name = undefined)).to.throw()

    expect(person.tag).to.equal('something')
  })

  it("superclass expresses a trait, subclass expresses another trait but overrides method in superclass's trait", function () {
    class Animal2 extends Nameable.trait() {
      constructor(...args: never[]) {
        super(...args)
      }

      _testSetName(name?: string) {
        if (!name) throw new Error('no name given')
        if (!name.toLowerCase().includes('animal'))
          throw new Error('name must include "animal"')
        return name
      }
    }

    const animal = new Animal2()
    animal.name = 'an animal'

    expect(animal.name).to.equal('an animal')
    expect(() => (animal.name = 'nothing')).to.throw()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    class Person2 extends Taggable.trait(Animal2) {
      // required to overcome TypeScript compiler bug?
      static new(...args: never[]) {
        return new this(...args) as Person2 & Taggable.Public & Nameable.Public
      }

      protected constructor(...args: never[]) {
        super(...args)
      }

      _testSetName(name?: string) {
        if (!name) throw new Error('no name given')
        if (!name.toLowerCase().includes('person'))
          throw new Error('name must include "person"')
        return name
      }
    }

    const p = Person2.new()
    expect(p instanceof Person2)
    expect(p instanceof Animal2)

    p.name = 'a person'

    expect(p.name).to.equal('a person')
    expect(() => (p.name = 'an animal')).to.throw()
    expect(() => (p.name = 'nothing')).to.throw()
  })
})
