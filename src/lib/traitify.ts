/**
 * Type definition of a constructor.
 */
export type Constructor<T> = new(...args: any[]) => T;

/**
 * A "trait" is a function that takes a superclass `S` and returns a new class `T extends S`.
 */
export type Trait<S extends Constructor<object>, T extends S> = (superclass: S) => T

/**
 * Convenient function when defining a class that
 * * extends a superclass, and
 * * expresses one or more traits.
 */
export const superclass = <S extends Constructor<object>>(superclass?: S) => new TraitBuilder(superclass)

/**
 * Convenient function to be used when a class
 * * does not extend a superclass, and
 * * expresses multiple traits.
 */
export const traits = <S extends Constructor<object>, T extends S>(t: Trait<S, T>) => superclass().with(t)

/**
 * Convenient function to be used when defining a class that
 * * does not extend a superclass, and
 * * expresses exactly one trait.
 */
export const trait = <S extends Constructor<object>, T extends S>(t: Trait<S, T>) => traits(t).apply()

/**
 * A convenient trait applier class.
 */
class TraitBuilder<S extends Constructor<object>> {
  superclass: S;

  constructor (superclass?: S) {
    this.superclass = superclass || class {} as S // TODO: remove "as S" when figured out
  }

  /**
   * Applies the trait to the current superclass then returns a new `TraitBuilder`.
   * @param trait The trait that the current superclass should express.
   */
  with <S extends Constructor<object>, T extends S>(trait: Trait<S, T>) {
    // we have to return a new builder here because there's no way to take a collection of traits of differing types.
    return new TraitBuilder(trait(this.superclass))
  }

  /**
   * Return the class with all traits expressed.
   */
  apply() {
    return this.superclass || class {}
  }
}
