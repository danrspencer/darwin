/// <reference path="../jasmine_tss.ts" />

import Main = require('com/Main');
import Click = require('com/Event/Click')

describe('main', () => {

  var windowSpy: Window;
  var consoleSpy: Console;
  var clickSpy: Click;

  var windowListeners: { [type: string]: Function } = {};

  var main: Main;

  beforeEach(() => {
    windowSpy = jasmine.createSpyObj<Window>('windowSpy', ['addEventListener']);
    setSpy(windowSpy.addEventListener).toCallFake((type, listener) => {
      windowListeners[type] = listener;
    });

    consoleSpy = jasmine.createSpyObj<Console>('consoleSpy', ['log']);
    clickSpy = jasmine.createSpyObj<Click>('handlerSpy', ['onMousedown']);

    main = new Main(windowSpy, consoleSpy, clickSpy);
  });

  it('listens to mousedown events on the window', () => {
    main.setup();

    expect(windowSpy.addEventListener).toHaveBeenCalledWith('mousedown', jasmine.any(Function));
  });

  it('listens to the keypress event on the window', () => {
    main.setup();

    expect(windowSpy.addEventListener).toHaveBeenCalledWith('keypress', jasmine.any(Function));
  });

  it('delegates to Handler to process the mousedown event', () => {
    main.setup();

    var eventFake = <MouseEvent>{};

    windowListeners['mousedown'](eventFake)

    expect(clickSpy.onMousedown).toHaveBeenCalledWith(eventFake);
  });

  it('returns all of the captured data', () => {
    main.setup();

    var resultsFake = [
      { "fake": "result" },
      { "fake2": "blah" },
      { "fake3": "something" }
    ];

    setSpy(clickSpy.onMousedown).toReturn(resultsFake[0]);
    windowListeners['mousedown'](<MouseEvent>{});

    setSpy(clickSpy.onMousedown).toReturn(resultsFake[1]);
    windowListeners['mousedown'](<MouseEvent>{});

    setSpy(clickSpy.onMousedown).toReturn(resultsFake[2]);
    windowListeners['mousedown'](<MouseEvent>{});

    expect(main.getOutput()).toEqual(resultsFake);
  });

});