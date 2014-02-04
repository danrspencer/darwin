import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import Binder = require('../../../src/browser/Record/Binder');
import KeyHandler = require('../../../src/browser/Record/KeyHandler');
import MouseHandler = require('../../../src/browser/Record/MouseHandler');


import ActionType = require('../../../src/common/Test/ActionType');

describe('Binder', () => {

  var window: Window;
  var keyHandler: KeyHandler;
  var mouseHandler: MouseHandler;

  var windowListeners: { [type: string]: Function } = {};

  var binder: Binder;

  beforeEach(() => {
    window = jasmine.createSpyObj<Window>('window', ['addEventListener']);
    setSpy(window.addEventListener).toCallFake((type, listener) => {
      windowListeners[type] = listener;
    });

    keyHandler = jasmine.createSpyObj<KeyHandler>('keyHandler', ['keypress']);
    mouseHandler = jasmine.createSpyObj<MouseHandler>('mouseHandler', ['mousedown']);

    binder = new Binder(window, keyHandler, mouseHandler);
  });

  it('listens to mousedown events on the window', () => {
    binder.bindEvents();

    expect(window.addEventListener).toHaveBeenCalledWith('mousedown', jasmine.any(Function));
  });

  it('listens to the keypress event on the window', () => {
    binder.bindEvents();

    expect(window.addEventListener).toHaveBeenCalledWith('keypress', jasmine.any(Function));
  });

  it('delegates to Handler to process the mousedown event', () => {
    binder.bindEvents();

    var eventFake = <MouseEvent>{};
    windowListeners['mousedown'](eventFake);

    expect(mouseHandler.mousedown).toHaveBeenCalledWith(eventFake);
  });

  it('delegates to Handler to process the keypress event', () => {
    binder.bindEvents();

    var eventFake = <KeyboardEvent>{};
    windowListeners['keypress'](eventFake);

    expect(keyHandler.keypress).toHaveBeenCalledWith(eventFake);
  });


});