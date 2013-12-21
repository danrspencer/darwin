import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import Handler = require('../../../src/browser/Event/Handler');
import ActionType = require('../../../src/browser/Data/ActionType');

import IMouseEvent = require('../../../src/browser/Data/IMouseEvent');

describe('main', () => {

  var eventFake: MouseEvent;

  var handler: Handler;

  beforeEach(() => {
    eventFake = <MouseEvent>{};
    eventFake.clientX = 100;
    eventFake.clientY = 200;
    eventFake.target = <HTMLElement>{
      id: 'fakeId'
    };

    handler = new Handler();
  });

  it('returns an object with a LEFTCLICK type for left clicks', () => {
    eventFake.button = 0;

    var result = handler.onMousedown(eventFake);

    expect(result.type).toEqual(ActionType.LEFTCLICK);
  });

  it('returns an object with a RIGHTCLICK type for right clicks', () => {
    eventFake.button = 1;

    var result = handler.onMousedown(eventFake);

    expect(result.type).toEqual(ActionType.RIGHTCLICK);
  });

  it('returns an object with the position of the click', () => {
    var result = handler.onMousedown(eventFake);

    expect(result.pos.x).toEqual(100);
    expect(result.pos.y).toEqual(200);
  });

  it('returns an object containing the id of the element clicked on', () => {
    var result = handler.onMousedown(eventFake);

    expect(result.el.id).toEqual('fakeId');
  });

});