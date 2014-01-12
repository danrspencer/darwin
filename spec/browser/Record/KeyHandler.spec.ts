import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import KeyHandler = require('../../../src/browser/Record/KeyHandler');

import ActionType = require('../../../src/common/Action/ActionType');
import IKeypressEvent = require('../../../src/common/Action/IKeypressEvent');

describe('KeyHandler', () => {

  var mouseEventFake: MouseEvent;
  var keyeventFake: KeyboardEvent;

  var keyHandler: KeyHandler;

  beforeEach(() => {
    keyeventFake = <KeyboardEvent>{};
    keyeventFake.charCode = 50;
    keyeventFake.altKey = true;
    keyeventFake.shiftKey = false;
    keyeventFake.ctrlKey = false;

    keyHandler = new KeyHandler();
  });

  it('returns an object with a KEYPRESS type for keypress events', () => {
    var result = keyHandler.keypress(keyeventFake);

    expect(result.type).toEqual(ActionType.KEYPRESS);
  });

  it('returns an object containing the details of a keypress', () => {
    var result = <IKeypressEvent>keyHandler.keypress(keyeventFake);

    expect(result.char).toEqual(String.fromCharCode(50));
    expect(result.charCode).toEqual(50);
    expect(result.alt).toEqual(true);
    expect(result.shift).toEqual(false);
    expect(result.ctrl).toEqual(false);
  });

  it('returns an object with a SCREENSHOT type for "ctrl shift s"', () => {
    keyeventFake.which = 19;
    keyeventFake.altKey = false;
    keyeventFake.ctrlKey = true;
    keyeventFake.shiftKey = true;

    var result = keyHandler.keypress(keyeventFake);

    expect(result.type).toEqual(ActionType.SCREENSHOT);
  });

  it('adds the delay to action for keypress', () => {
    var result = keyHandler.keypress(keyeventFake);

    expect(result.delay).toEqual(100);
  });

  it('adds the delay to screenshot actions', () => {
    keyeventFake.which = 19;
    keyeventFake.altKey = false;
    keyeventFake.ctrlKey = true;
    keyeventFake.shiftKey = true;

    var result = keyHandler.keypress(keyeventFake);

    expect(result.delay).toEqual(300);
  });


});