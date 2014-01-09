/// <reference path="../../ref.d.ts" />
import jasmine_tss = require('../../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import Scheduler = require('../../../../src/cli/Selenium/Playback/Scheduler');

describe('Scheduler', () => {

  var intervalSpy: Function;
  var intervalCallback: Function;

  var nowSpy: Function;
  var nowTime: number;

  var callbackSpy: Function;

  var scheduler: Scheduler;

  function tick(time: number) {
    var intervals = Math.floor(time / 50);

    for(var n = 0; n < intervals; n++) {
      nowTime += 50;
      intervalCallback();
    }

    nowTime += time - (intervals * 50);
  }

  beforeEach(() => {
    intervalSpy = spyOn(global, 'setInterval');
    setSpy(intervalSpy).toCallFake((callback) => {
      intervalCallback = callback;
    });

    nowTime = 1000;
    nowSpy = spyOn(Date, 'now');
    setSpy(nowSpy).toCallFake(() => { return nowTime; });

    callbackSpy = jasmine.createSpy('callbackSpy');

    scheduler = new Scheduler();
  });

  it('registers an interval with 50ms', () => {
    scheduler.start();

    expect(intervalSpy).toHaveBeenCalledWith(jasmine.any(Function), 50);
  });

  it('calls the callback if more than 100ms has passed since start', () => {
    scheduler.start();

    scheduler.callAfter(100, callbackSpy);

    expect(spyOf(callbackSpy).callCount).toEqual(0);
    tick(100);
    expect(spyOf(callbackSpy).callCount).toEqual(1);
  });

  it('does\'t call the callback more than once', () => {
    scheduler.start();

    scheduler.callAfter(100, callbackSpy);

    tick(200);
    expect(spyOf(callbackSpy).callCount).toEqual(1);
  });

  it('calls the callback instantly if the delay is less than time already passed', () => {
    scheduler.start();

    tick(200);

    scheduler.callAfter(100, callbackSpy);

    expect(spyOf(callbackSpy).callCount).toEqual(1);
  });

});