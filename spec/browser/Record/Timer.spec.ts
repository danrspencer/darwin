import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import Timer = require('../../../src/browser/Record/Timer');

describe('Timer', () => {



  it('returns the number of milliseconds since the previous call', () => {

    var now = spyOn(Date, 'now').andReturn(1000);
    var timer = new Timer();

    timer.start();

    setSpy(now).toReturn(1500);
    expect(timer.getInterval()).toEqual(500);

    setSpy(now).toReturn(2500);
    expect(timer.getInterval()).toEqual(1000);

    setSpy(now).toReturn(2600);
    expect(timer.getInterval()).toEqual(100);
  });




});

