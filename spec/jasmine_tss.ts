/// <reference path="../bower_components/DefinitelyTyped/jasmine/jasmine-1.3.d.ts" />

module jasmine_tss {

  /**
   * Casts an object as a spy to be used in expect statements
   *
   * e.g. expect(spyOf(mock.method).callCount).toEqual(3)
   *
   * @param spy
   * @returns {jasmine.Spy}
   */
  export function spyOf(spy: Object): jasmine.Spy {
    return <jasmine.Spy>spy;
  }

  /**
   * Used to make retraining a spy more readable
   *
   * @param spy
   * @returns {WithSpy}
   */
  export function setSpy(spy: Object): SetSpy {
    return new SetSpy(<jasmine.Spy>spy);
  }

  /**
   * Set spy wrapper class to make retraining a spy
   * more readable
   */
  export class SetSpy {

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
}

export = jasmine_tss;