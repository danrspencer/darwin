import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import KeyHandler = require('../../../src/browser/Record/KeyHandler');
import Timer = require('../../../src/browser/Record/Timer');
import WindowProxy = require('../../../src/browser/Record/WindowProxy');

import ActionType = require('../../../src/common/Action/ActionType');
import IKeypressEvent = require('../../../src/common/Action/IKeypressEvent');

describe('KeyHandler', () => {

  var keyboardEvent: KeyboardEvent;
  var timer: Timer;
  var windowProxy: WindowProxy;

  var keyHandler: KeyHandler;

  beforeEach(() => {
    keyboardEvent = <KeyboardEvent>{};
    keyboardEvent.charCode = 50;

    timer = jasmine.createSpyObj<Timer>('timer', ['getInterval']);
    windowProxy = jasmine.createSpyObj<WindowProxy>('windowProxy', ['addAction', 'setPendingScreenshot']);

    keyHandler = new KeyHandler(windowProxy, timer);
  });

  it('delegates to WindowProxy with the created Action', () => {
    keyHandler.keypress(keyboardEvent);

    expect(windowProxy.addAction).toHaveBeenCalled();
  });

  it('delegates to WindowProxy with a KEYPRESS type for keypress events', () => {
    keyHandler.keypress(keyboardEvent);

    var action = <IKeypressEvent>spyOf(windowProxy.addAction).mostRecentCall['args'][0];
    expect(action.type).toEqual(ActionType.KEYPRESS);
  });

  it('delegates to WindowProxy containing the details of a keypress', () => {
    keyHandler.keypress(keyboardEvent);

    var action = <IKeypressEvent>spyOf(windowProxy.addAction).mostRecentCall['args'][0];
    expect(action.char).toEqual(String.fromCharCode(50));
    expect(action.charCode).toEqual(50);
  });

  it('delegates to WindowProxy with a SCREENSHOT type for "ctrl shift s"', () => {
    keyboardEvent.which = 19;
    keyboardEvent.shiftKey = true;
    keyboardEvent.ctrlKey = true;

    keyHandler.keypress(keyboardEvent);

    var action = <IKeypressEvent>spyOf(windowProxy.addAction).mostRecentCall['args'][0];
    expect(action.type).toEqual(ActionType.SCREENSHOT);
  });

  it('delegates to WindowProxy to set a pending screenshot', () => {
    keyboardEvent.which = 19;
    keyboardEvent.shiftKey = true;
    keyboardEvent.ctrlKey = true;

    keyHandler.keypress(keyboardEvent);

    expect(windowProxy.setPendingScreenshot).toHaveBeenCalled();
  });

  it('delegates to Timer.getInterval to get the delay', () => {
    keyHandler.keypress(keyboardEvent);

    expect(timer.getInterval).toHaveBeenCalled();
  });

  it('adds the delay to action for keypress', () => {
    setSpy(timer.getInterval).toReturn(100);

    keyHandler.keypress(keyboardEvent);

    var action = <IKeypressEvent>spyOf(windowProxy.addAction).mostRecentCall['args'][0];
    expect(action.delay).toEqual(100);
  });

  it('adds the delay to screenshot actions', () => {
    setSpy(timer.getInterval).toReturn(300);

    keyboardEvent.which = 19;
    keyboardEvent.shiftKey = true;
    keyboardEvent.ctrlKey = true;

    keyHandler.keypress(keyboardEvent);

    var action = <IKeypressEvent>spyOf(windowProxy.addAction).mostRecentCall['args'][0];
    expect(action.delay).toEqual(300);
  });



});