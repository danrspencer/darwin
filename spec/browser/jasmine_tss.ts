/// <reference path="../../bower_components/DefinitelyTyped/jasmine/jasmine.d.ts" />

/**
 * Jasmine TypeScript Spies
 */

/**
 * Casts an object as a spy to be used in expect statements
 *
 * e.g. expect(spyOf(mock.method).callCount).toEqual(3)
 *
 * @param spy
 * @returns {jasmine.Spy}
 */
function spyOf(spy: Object): jasmine.Spy {
  return <jasmine.Spy>spy;
}

/**
 * Used to make retraining a spy more readable
 *
 * @param spy
 * @returns {WithSpy}
 */
function setSpy(spy: Object): SetSpy {
  return new SetSpy(<jasmine.Spy>spy);
}

/**
 * Set spy wrapper class to make retraining a spy
 * more readable
 */
class SetSpy {

  private _spy: jasmine.Spy;

  constructor(spy: jasmine.Spy) {
    this._spy = spy;
  }

  public toCallFake(fakeFunc: Function): jasmine.Spy {
    return this._spy.andCallFake(fakeFunc);
  }

  public toCallThrough(): jasmine.Spy {
    return this._spy.andCallThrough();
  }

  public toReturn(value: any): jasmine.Spy {
    return this._spy.andReturn(value);
  }
}
