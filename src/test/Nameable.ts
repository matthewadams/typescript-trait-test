import { Constructor, Empty } from '../main/traitify'

// public trait interface
export interface Public {
  name?: string
}

// non-public trait interface
export interface Trait extends Public {
  _name?: string

  _testSetName(value?: string): string | undefined

  _doSetName(value?: string): void
}

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/explicit-module-boundary-types
export const trait = <S extends Constructor<object>>(superclass?: S) =>
  class extends (superclass || Empty) implements Trait {
    _name?: string // TODO: make protected when https://github.com/microsoft/TypeScript/issues/36060 is fixed

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
