import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import MouseHandler = require('../../../src/browser/Record/MouseHandler');
import Timer = require('../../../src/browser/Record/Timer');
import WindowProxy = require('../../../src/browser/Record/WindowProxy');

import ActionType = require('../../../src/common/Test/ActionType');
import IMouseEvent = require('../../../src/common/Test/IMouseAction');

describe('MouseHandler', () => {

  var mouseEvent: MouseEvent;
  var timer: Timer;
  var windowProxy: WindowProxy;

  var mouse: MouseHandler;

  beforeEach(() => {
    mouseEvent = <MouseEvent>{};
    mouseEvent.clientX = 100;
    mouseEvent.clientY = 200;
    mouseEvent.target = <HTMLElement>{
      id: 'fakeId'
    };

    timer = jasmine.createSpyObj<Timer>('timer', ['getInterval']);
    windowProxy = jasmine.createSpyObj<WindowProxy>('windowProxy', ['addAction']);

    mouse = new MouseHandler(windowProxy, timer);
  });

  it('delegates to windowProxy with the created Action', () => {
    mouse.mousedown(mouseEvent);

    expect(windowProxy.addAction).toHaveBeenCalled();
  });

  it('creates an action with a LEFTCLICK type for left clicks', () => {
    mouseEvent.button = 0;

    mouse.mousedown(mouseEvent);

    var action = <IMouseEvent>spyOf(windowProxy.addAction).mostRecentCall['args'][0];
    expect(action.type).toEqual(ActionType.LEFTCLICK);
  });

  it('creates an action with a RIGHTCLICK type for right clicks', () => {
    mouseEvent.button = 1;

    mouse.mousedown(mouseEvent);

    var action = <IMouseEvent>spyOf(windowProxy.addAction).mostRecentCall['args'][0];
    expect(action.type).toEqual(ActionType.RIGHTCLICK);
  });

  it('creates an action with the position of the click', () => {
    mouse.mousedown(mouseEvent);

    var action = <IMouseEvent>spyOf(windowProxy.addAction).mostRecentCall['args'][0];
    expect(action.pos.x).toEqual(100);
    expect(action.pos.y).toEqual(200);
  });

  it('creates an action containing the id of the element clicked on', () => {
    mouse.mousedown(mouseEvent);

    var action = <IMouseEvent>spyOf(windowProxy.addAction).mostRecentCall['args'][0];
    expect(action.el.id).toEqual('fakeId');
  });

  it('delegates to Timer.getInterval to get the delay', () => {
    mouse.mousedown(mouseEvent);

    expect(timer.getInterval).toHaveBeenCalled();
  });

  it('creates an action with the delay', () => {
    setSpy(timer.getInterval).toReturn(200);

    mouse.mousedown(mouseEvent);

    var action = <IMouseEvent>spyOf(windowProxy.addAction).mostRecentCall['args'][0];
    expect(action.delay).toEqual(200);
  });


});