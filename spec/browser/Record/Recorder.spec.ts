import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import Binder = require('../../../src/browser/Record/Binder');
import Recorder = require('../../../src/browser/Record/Recorder');
import Timer = require('../../../src/browser/Record/Timer');

describe('Recorder', () => {

  var binder: Binder;
  var timer: Timer;

  var recorder: Recorder;

  beforeEach(() => {
    binder = jasmine.createSpyObj<Binder>('binder', ['bindEvents']);
    timer = jasmine.createSpyObj<Timer>('timer', ['start']);

    recorder = new Recorder(binder, timer);
  });

  it('delegates to Timer.start', () => {
    recorder.start();

    expect(binder.bindEvents).toHaveBeenCalled();
  });

  it('delegates to Binder.bindEvents', () => {
    recorder.start();

    expect(binder.bindEvents).toHaveBeenCalled();
  });


});