import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import Monitor = require('../../../src/browser/Monitor/Monitor');
import Handler = require('../../../src/browser/Event/Handler');

import ActionType = require('../../../src/common/Action/ActionType');
import IDarwinWindow = require('../../../src/common/IDarwinWindow');

describe('main', () => {

  var windowSpy: IDarwinWindow;
  var handlerSpy: Handler;

  var windowListeners: { [type: string]: Function } = {};

  var monitor: Monitor;

  beforeEach(() => {
    windowSpy = jasmine.createSpyObj<IDarwinWindow>('windowSpy', ['addEventListener', '__darwinCallback']);
    setSpy(windowSpy.addEventListener).toCallFake((type, listener) => {
      windowListeners[type] = listener;
    });

    handlerSpy = jasmine.createSpyObj<Handler>('handlerSpy', ['mouseDown', 'keypress']);

    monitor = new Monitor(windowSpy, handlerSpy);
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

    expect(handlerSpy.mouseDown).toHaveBeenCalledWith(eventFake, jasmine.any(Number));
  });

  it('delegates to Handler to process the keypress event', () => {
    setSpy(handlerSpy.keypress).toReturn({
      type: ActionType.KEYPRESS
    });

    monitor.setup();

    var eventFake = <KeyboardEvent>{};

    windowListeners['keypress'](eventFake);

    expect(handlerSpy.keypress).toHaveBeenCalledWith(eventFake, jasmine.any(Number));
  });

  it('calls the darwin callback on keypress with the action object', () => {
    setSpy(handlerSpy.keypress).toReturn({
      type: ActionType.SCREENSHOT
    });

    monitor.setup();

    windowListeners['keypress']({});

    expect(windowSpy.__darwinCallback).toHaveBeenCalledWith({ type: ActionType.SCREENSHOT});
  });

  it('calls the drawin callback on mousedown with the action object', () => {
    setSpy(handlerSpy.mouseDown).toReturn({
      type: ActionType.LEFTCLICK
    });

    monitor.setup();

    windowListeners['mousedown']({});

    expect(windowSpy.__darwinCallback).toHaveBeenCalledWith({ type: ActionType.LEFTCLICK });
  });

  it('calls the handler with the delay since the last event', () => {
    setSpy(handlerSpy.mouseDown).toReturn({});
    setSpy(handlerSpy.keypress).toReturn({});

    setSpy(dateSpy.getTime).toReturn(1000);

    monitor.setup();

    setSpy(dateSpy.getTime).toReturn(1100);
    windowListeners['mousedown']({});
    expect(handlerSpy.mouseDown).toHaveBeenCalledWith(jasmine.any(Object), 100);

    setSpy(dateSpy.getTime).toReturn(1150);
    windowListeners['keypress']({});
    expect(handlerSpy.keypress).toHaveBeenCalledWith(jasmine.any(Object), 50);

    setSpy(dateSpy.getTime).toReturn(3150);
    windowListeners['keypress']({});
    expect(handlerSpy.keypress).toHaveBeenCalledWith(jasmine.any(Object), 2000);
  });

});