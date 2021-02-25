import { Constructor, Empty } from '../main/traitify'

/**
 * Public trait interface
 */
export interface Public<T = string> {
  tag?: T
}

/**
 * Nonpublic trait interface
 */
export interface Implementation<T = string> extends Public<T> {
  _tag?: T

  _testSetTag(value?: T): T | undefined

  _doSetTag(value?: T): void
}

/**
 * The trait function.
 */
// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const trait = <T = string, S extends Constructor<object> = any>(
  superclass?: S
) =>
  /**
   * Class that implements the trait
   */
  class Taggable extends (superclass || Empty) implements Implementation<T> {
    _tag?: T

    /**
     * Constructor that simply delegates to the super's constructor
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args)
    }

    get tag(): T | undefined {
      return this._tag
    }

    set tag(value: T | undefined) {
      this._doSetTag(this._testSetTag(value))
    }

    _testSetTag(value?: T) {
      return value
    }

    _doSetTag(value?: T) {
      this._tag = value
    }
  }
