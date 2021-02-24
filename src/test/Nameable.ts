import { Constructor, Empty } from '../main/traitify'

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Nameable {
  // public trait interface
  export interface Public {
    name?: string
  }

  // non-public trait interface
  export interface Trait extends Public {
    _name?: string

    _testSetName(name?: string): string | undefined

    _doSetName(name?: string): void
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  export const trait = <S extends Constructor<object>>(superclass?: S) =>
    class extends (superclass || Empty) implements Trait {
      _name?: string // TODO: make protected when https://github.com/microsoft/TypeScript/issues/36060 is fixed

      constructor(...args: unknown[]) {
        super(...args)
      }

      get name() {
        return this._name
      }

      set name(name) {
        this._doSetName(this._testSetName(name))
      }

      _testSetName(name?: string) {
        // TODO: make protected
        return name
      }

      _doSetName(name?: string) {
        // TODO: make protected
        this._name = name
      }
    }
}
