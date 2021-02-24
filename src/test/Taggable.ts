import { Constructor, Empty } from '../main/traitify'

// public trait interface
export interface Public {
  tag?: string
}

// non-public trait interface
export interface Trait extends Public {
  _tag?: string

  _testSetTag(value?: string): string | undefined

  _doSetTag(value?: string): void
}

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/explicit-module-boundary-types
export const trait = <S extends Constructor<object>>(superclass?: S) => {
  const Taggable = class extends (superclass || Empty) implements Trait {
    _tag?: string // TODO: make protected when https://github.com/microsoft/TypeScript/issues/36060 is fixed

    constructor(...args: unknown[]) {
      super(...args)
    }

    get tag() {
      return this._tag
    }

    set tag(value) {
      this._doSetTag(this._testSetTag(value))
    }

    _testSetTag(value?: string) {
      return value
    }

    _doSetTag(value?: string) {
      this._tag = value
    }
  }

  return Taggable
}
