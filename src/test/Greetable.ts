import { Constructor, Empty } from '../main/traitify'

/*
 * Absolutely minimal demonstration of the trait pattern, in the spirit of "Hello, world!" demos.
 * This is missing some common stuff because it's so minimal.
 * See Greetable2 for a more realistic example.
 */

/**
 * Public trait interface
 */
export interface Public {
  greeting?: string

  greet(greetee: string): string
}

/**
 * The trait function.
 */
// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/explicit-module-boundary-types
export const trait = <S extends Constructor<object>>(superclass?: S) =>
  /**
   * Class that implements the trait
   */
  class Greetable extends (superclass || Empty) implements Public {
    greeting?: string

    /**
     * Constructor that simply delegates to the super's constructor
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args)
    }

    greet(greetee: string): string {
      return `${this.greeting}, ${greetee}!`
    }
  }
