import { Constructor, Empty } from '../main/traitify'

/**
 * Public trait interface
 */
export interface Public {
  greeting?: string

  greet(greetee: string): string
}

/**
 * Nonpublic trait interface
 */
export interface Implementation {
  _greeting?: string

  /**
   * Validates, scrubs & returns given value
   */
  _testSetGreeting(value?: string): string | undefined

  /**
   * Actually sets given value
   */
  _doSetGreeting(value?: string): void
}

/**
 * The trait function.
 */
// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/explicit-module-boundary-types
export const trait = <S extends Constructor<object>>(superclass?: S) =>
  /**
   * Class that implements the trait
   */
  class Greetable2 extends (superclass || Empty) implements Implementation {
    _greeting?: string

    /**
     * Constructor that simply delegates to the super's constructor
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args)
    }

    get greeting() {
      return this._greeting
    }

    set greeting(value: string | undefined) {
      this._doSetGreeting(this._testSetGreeting(value))
    }

    greet(greetee: string): string {
      return `${this.greeting}, ${greetee}!`
    }

    _testSetGreeting(value?: string) {
      return value
    }

    _doSetGreeting(value?: string) {
      this._greeting = value
    }
  }
