/**
 * Type definition of a constructor.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T> = new (...args: any[]) => T

/**
 * The empty class.
 */
export class Empty {}

/**
 * A "trait" is a function that takes a superclass of type `Superclass` and returns a new class that is of type `Superclass & TraitInterface`.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type Trait<Superclass extends Constructor<object>, TraitInterface> = (
  superclass: Superclass
) => Constructor<Superclass & TraitInterface>
