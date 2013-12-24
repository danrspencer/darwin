import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import Handler = require('../../../src/browser/Event/Handler');
import ActionType = require('../../../src/browser/Data/ActionType');

import IMouseEvent = require('../../../src/browser/Data/IMouseEvent');
import IKeypressEvent = require('../../../src/browser/Data/IKeypressEvent');


describe('main', () => {

  var mouseEventFake: MouseEvent;
  var keyeventFake: KeyboardEvent;

  var handler: Handler;

  beforeEach(() => {
    mouseEventFake = <MouseEvent>{};
    mouseEventFake.clientX = 100;
    mouseEventFake.clientY = 200;
    mouseEventFake.target = <HTMLElement>{
      id: 'fakeId'
    };

    keyeventFake = <KeyboardEvent>{};
    keyeventFake.charCode = 50;
    keyeventFake.altKey = true;
    keyeventFake.shiftKey = false;
    keyeventFake.ctrlKey = false;

    handler = new Handler();
  });

  it('returns an object with a LEFTCLICK type for left clicks', () => {
    mouseEventFake.button = 0;

    var result = handler.mouseDown(mouseEventFake);

    expect(result.type).toEqual(ActionType.LEFTCLICK);
  });

  it('returns an object with a RIGHTCLICK type for right clicks', () => {
    mouseEventFake.button = 1;

    var result = handler.mouseDown(mouseEventFake);

    expect(result.type).toEqual(ActionType.RIGHTCLICK);
  });

  it('returns an object with the position of the click', () => {
    var result = handler.mouseDown(mouseEventFake);

    expect(result.pos.x).toEqual(100);
    expect(result.pos.y).toEqual(200);
  });

  it('returns an object containing the id of the element clicked on', () => {
    var result = handler.mouseDown(mouseEventFake);

    expect(result.el.id).toEqual('fakeId');
  });

  it('returns an object with a KEYPRESS type for keypress events', () => {
    var result = handler.keypress(keyeventFake);

    expect(result.type).toEqual(ActionType.KEYPRESS);
  });

  it('returns an object containing the details of a keypress', () => {
    var result = <IKeypressEvent>handler.keypress(keyeventFake);

    expect(result.char).toEqual(50);
    expect(result.alt).toEqual(true);
    expect(result.shift).toEqual(false);
    expect(result.ctrl).toEqual(false);
  });

  it('returns an object with a SCREENSHOT type for "ctrl shift s"', () => {
    keyeventFake.charCode = 's'.charCodeAt(0);
    keyeventFake.altKey = false;
    keyeventFake.ctrlKey = true;
    keyeventFake.shiftKey = true;

    var result = handler.keypress(keyeventFake);

    expect(result.type).toEqual(ActionType.SCREENSHOT);
  });


});