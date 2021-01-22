import Constructor from './Constructor';
import test from 'ava';

test('traits', (t) => {
  class Point {
    constructor(public x: number, public y: number) {
    }
  }

  class Person {
    constructor(public name: string) {
    }
  }

  interface Tagged<T> {
    _tag: T;
  }

  interface StringTagged extends Tagged<string> {
  }

  function StringTagged<T extends Constructor<{}>>(Base: T): Constructor<StringTagged> & T {
    return class extends Base {
      _tag: string;

      constructor(...args: any[]) {
        super(...args);
        this._tag = '';
      }
    };
  }

  const TaggedPoint = StringTagged(Point);

  let point = new TaggedPoint(10, 20);
  point._tag = 'hello';

  class Customer extends StringTagged(Person) {
    accountBalance: number = 0;
  }

  let customer = new Customer('Joe');
  customer._tag = 'test';
  customer.accountBalance = 0;

  t.is(customer._tag, 'test');
});
