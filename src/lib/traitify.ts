/**
 * Type definition of a constructor.
 */
export type Constructor<T> = new(...args: any[]) => T;

/**
 * A "trait" is a function that takes a superclass `S` and returns new class of type `S & T`.
 */
export type Trait<T> = <S>(superclass: Constructor<S>) => Constructor<S & T>

/**
 * Convenient function when defining a class that
 * * extends a superclass, and
 * * expresses one or more traits.
 */
export const superclass = <S>(superclass?: Constructor<S>) => new TraitBuilder(superclass)

/**
 * Convenient function to be used when a class expresses multiple traits.
 */
export const traits = <T>(t: Trait<T>) => superclass().with(t)

/**
 * Convenient function to be used when defining a class that
 * * does not extend a superclass, and
 * * expresses one or more traits.
 */
export const trait = <T>(t: Trait<T>) => traits(t).apply()

/**
 * A convenient trait applier class.
 */
class TraitBuilder<S> {
  superclass?: Constructor<S>;

  constructor (superclass?: Constructor<S>) {
    this.superclass = superclass
  }

  /**
   * Applies the trait to the current superclass then returns a new `TraitBuilder`.
   * @param trait The trait that the current superclass should express.
   */
  with <T>(trait: Trait<T>) {
    // we have to return a new builder here because there's no way to take a collection of traits of differing types.
    return new TraitBuilder(trait(this.superclass || class {}))
  }

  /**
   * Return the class with all traits expressed.
   */
  apply() {
    return this.superclass || class {}
  }
}
