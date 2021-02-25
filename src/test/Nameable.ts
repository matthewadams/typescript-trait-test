import { Constructor, Empty } from '../main/traitify'

/**
 * Public trait interface
 */
export interface Public {
  name?: string
}

/**
 * Nonpublic trait interface
 */
export interface Implementation extends Public {
  _name?: string

  _testSetName(value?: string): string | undefined

  _doSetName(value?: string): void
}

/**
 * The trait function.
 */
// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/explicit-module-boundary-types
export const trait = <S extends Constructor<object>>(superclass?: S) =>
  /**
   * Class that implements the trait
   */
  class Nameable extends (superclass || Empty) implements Implementation {
    _name?: string

    /**
     * Constructor that simply delegates to the super's constructor
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args)
    }

    get name() {
      return this._name
    }

    set name(value) {
      this._doSetName(this._testSetName(value))
    }

    _testSetName(value?: string) {
      return value
    }

    _doSetName(value?: string) {
      this._name = value
    }
  }
