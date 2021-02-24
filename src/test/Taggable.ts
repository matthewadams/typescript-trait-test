import { Constructor, Empty } from '../main/traitify'

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Taggable {
  // public trait interface
  export interface Public {
    tag?: string
  }

  // non-public trait interface
  export interface Trait extends Public {
    _tag?: string

    _testSetTag(tag?: string): string | undefined

    _doSetTag(tag?: string): void
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  export const trait = <S extends Constructor<object>>(superclass?: S) =>
    class extends (superclass || Empty) implements Trait {
      _tag?: string // TODO: make protected when https://github.com/microsoft/TypeScript/issues/36060 is fixed

      constructor(...args: unknown[]) {
        super(...args)
      }

      get tag() {
        return this._tag
      }

      set tag(tag) {
        this._doSetTag(this._testSetTag(tag))
      }

      _testSetTag(tag?: string) {
        return tag
      }

      _doSetTag(tag?: string) {
        this._tag = tag
      }
    }
}
