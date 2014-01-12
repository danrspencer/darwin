import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import Binder = require('../../../src/browser/Record/Binder');
import KeyHandler = require('../../../src/browser/Record/KeyHandler');
import MouseHandler = require('../../../src/browser/Record/MouseHandler');


import ActionType = require('../../../src/common/Action/ActionType');
import IDarwinWindow = require('../../../src/common/IDarwinWindow');

describe('Binder', () => {

  var windowSpy: IDarwinWindow;
  var keyHandlerSpy: KeyHandler;
  var mouseHandlerSpy: MouseHandler;

  var windowListeners: { [type: string]: Function } = {};

  var binder: Binder;

  beforeEach(() => {
    windowSpy = jasmine.createSpyObj<IDarwinWindow>('windowSpy', ['addEventListener']);
    setSpy(windowSpy.addEventListener).toCallFake((type, listener) => {
      windowListeners[type] = listener;
    });

    keyHandlerSpy = jasmine.createSpyObj<KeyHandler>('keyHandlerSpy', ['keypress']);
    mouseHandlerSpy = jasmine.createSpyObj<MouseHandler>('mouseHandlerSpy', ['mousedown']);

    binder = new Binder(windowSpy, keyHandlerSpy, mouseHandlerSpy);
  });

  it('listens to mousedown events on the window', () => {
    binder.bindEvents();

    expect(windowSpy.addEventListener).toHaveBeenCalledWith('mousedown', mouseHandlerSpy.mousedown);
  });

  it('listens to the keypress event on the window', () => {
    binder.bindEvents();

    expect(windowSpy.addEventListener).toHaveBeenCalledWith('keypress', keyHandlerSpy.keypress);
  });


});