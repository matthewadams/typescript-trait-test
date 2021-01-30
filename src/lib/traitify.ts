/*
 * Trait-enabling library.
 * Only supports instance members.
 * This library attempting to enable class declarations like:
 * `class Person extends traits(Nameable).apply() { ... }`, (no superclass, single trait)
 * `class FlyingFish extends traits(CanFly).with(CanSwim).apply() { ... }` (no superclass, multiple traits), and
 * `class MeowingDog extends superclass(Animal).with(CanMeow).with(CanBark).apply() { ... }` (superclass, one or more traits).
 */

/**
 * Type definition of a constructor.
 */
export type Constructor<T> = new(...args: any[]) => T;

/**
 * The empty class.
 */
class Empty {
}

/**
 * A "trait" is a function that takes a superclass `Superclass` and returns a new class that is of type `Superclass & TraitInterface`.
 */
export type Trait<Superclass extends Constructor<object>, TraitInterface> =
  (superclass: Superclass) => Constructor<Superclass & TraitInterface>

/**
 * Convenient function when defining a class that
 * * extends a superclass, and
 * * expresses one or more traits.
 */
export const superclass = <Superclass extends Constructor<object>>(s?: Superclass) => new TraitBuilder(s);

/**
 * Convenient function to be used when a class
 * * does not extend a superclass, and
 * * expresses multiple traits.
 */
export const traits = <Superclass extends Constructor<object>, TraitInterface>(t: Trait<Superclass, TraitInterface>) => superclass().with(t);

/**
 * A convenient trait applier class that uses a builder pattern to apply traits.
 */
class TraitBuilder<Superclass extends Constructor<object>> {
  superclass: Superclass;

  constructor(superclass?: Superclass) {
    this.superclass = (superclass || Empty) as Superclass; // TODO: how to remove as?
  }

  /**
   * Applies the trait to the current superclass then returns a new `TraitBuilder`.
   * @param trait The trait that the current superclass should express.
   */
  with<Superclass, TraitInterface>(trait: Trait<Superclass, TraitInterface>) {
    // need to apply the given trait to this.superclass to get a new class c, then return a new TraitBuilder(c)
    return new TraitBuilder(trait(this.superclass));
  }

  /**
   * Return the class with all traits expressed.
   */
  apply() {
    return this.superclass || Empty;
  }
}
