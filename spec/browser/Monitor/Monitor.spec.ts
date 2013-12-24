import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import Monitor = require('../../../src/browser/Monitor/Monitor');
import Handler = require('../../../src/browser/Event/Handler');


import IDarwinWindow = require('../../../src/common/IDarwinWindow');

describe('main', () => {

  var windowSpy: IDarwinWindow;
  var consoleSpy: Console;
  var handler: Handler;

  var windowListeners: { [type: string]: Function } = {};

  var monitor: Monitor;

  beforeEach(() => {
    windowSpy = jasmine.createSpyObj<IDarwinWindow>('windowSpy', ['addEventListener', '__darwinCallback']);
    setSpy(windowSpy.addEventListener).toCallFake((type, listener) => {
      windowListeners[type] = listener;
    });

    consoleSpy = jasmine.createSpyObj<Console>('consoleSpy', ['log']);
    handler = jasmine.createSpyObj<Handler>('handlerSpy', ['onMousedown']);

    monitor = new Monitor(windowSpy, consoleSpy, handler);
  });

  it('listens to mousedown events on the window', () => {
    monitor.setup();

    expect(windowSpy.addEventListener).toHaveBeenCalledWith('mousedown', jasmine.any(Function));
  });

  it('listens to the keypress event on the window', () => {
    monitor.setup();

    expect(windowSpy.addEventListener).toHaveBeenCalledWith('keypress', jasmine.any(Function));
  });

  it('delegates to Handler to process the mousedown event', () => {
    monitor.setup();

    var eventFake = <MouseEvent>{};

    windowListeners['mousedown'](eventFake);

    expect(handler.onMousedown).toHaveBeenCalledWith(eventFake);
  });

  it('returns all of the captured data', () => {
    monitor.setup();

    var resultsFake = [
      { "fake": "result" },
      { "fake2": "blah" },
      { "fake3": "something" }
    ];

    setSpy(handler.onMousedown).toReturn(resultsFake[0]);
    windowListeners['mousedown'](<MouseEvent>{});

    setSpy(handler.onMousedown).toReturn(resultsFake[1]);
    windowListeners['mousedown'](<MouseEvent>{});

    setSpy(handler.onMousedown).toReturn(resultsFake[2]);
    windowListeners['mousedown'](<MouseEvent>{});

    expect(monitor.getOutput()).toEqual(resultsFake);
  });

  it('records "ctrl shift s" as a screenshot in the output object', () => {
    monitor.setup();

    var eventFake = <KeyboardEvent>{
      shiftKey: true,
      ctrlKey: true,
      charCode: 115
    };

    windowListeners['keypress'](eventFake);

    expect(monitor.getOutput()).toEqual([{
     "screenshot": true
    }]);
  });

  it('calls the darwin callback on screenshots', () => {
    monitor.setup();

    var eventFake = <KeyboardEvent>{
      shiftKey: true,
      ctrlKey: true,
      charCode: 115
    };

    windowListeners['keypress'](eventFake);

    expect(windowSpy.__darwinCallback).toHaveBeenCalledWith({ "screenshot": true });
  });

});