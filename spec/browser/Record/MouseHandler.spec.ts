import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import MouseHandler = require('../../../src/browser/Record/MouseHandler');

import ActionType = require('../../../src/common/Action/ActionType');
import IMouseEvent = require('../../../src/common/Action/IMouseEvent');

describe('MouseHandler', () => {

  var mouseEventFake: MouseEvent;

  var mouse: MouseHandler;

  beforeEach(() => {
    mouseEventFake = <MouseEvent>{};
    mouseEventFake.clientX = 100;
    mouseEventFake.clientY = 200;
    mouseEventFake.target = <HTMLElement>{
      id: 'fakeId'
    };

    mouse = new MouseHandler();
  });

  it('returns an object with a LEFTCLICK type for left clicks', () => {
    mouseEventFake.button = 0;

    var result = mouse.mousedown(mouseEventFake);

    expect(result.type).toEqual(ActionType.LEFTCLICK);
  });

  it('returns an object with a RIGHTCLICK type for right clicks', () => {
    mouseEventFake.button = 1;

    var result = mouse.mousedown(mouseEventFake);

    expect(result.type).toEqual(ActionType.RIGHTCLICK);
  });

  it('returns an object with the position of the click', () => {
    var result = mouse.mousedown(mouseEventFake);

    expect(result.pos.x).toEqual(100);
    expect(result.pos.y).toEqual(200);
  });

  it('returns an object containing the id of the element clicked on', () => {
    var result = mouse.mousedown(mouseEventFake);

    expect(result.el.id).toEqual('fakeId');
  });

  it('adds the delay to action for mousedown', () => {
    var result = mouse.mousedown(mouseEventFake);

    expect(result.delay).toEqual(200);
  });


});