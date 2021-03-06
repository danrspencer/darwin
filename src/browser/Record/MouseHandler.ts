
import Timer = require('./Timer');
import WindowProxy = require('./WindowProxy');

import ActionType = require('../../common/Test/ActionType');
import IMouseAction = require('../../common/Test/IMouseAction');

class MouseHandler {

  constructor(private _windowProxy: WindowProxy,
              private _timer: Timer) {

  }

  public mousedown(event: MouseEvent) {

    var element = <HTMLElement>event.target;

    var action: IMouseAction = {
      type: event.button === 0 ? ActionType.LEFTCLICK : ActionType.RIGHTCLICK,
      pos: {
        x: event.clientX,
        y: event.clientY
      },
      el: {
        id: element.id
      },
      delay: this._timer.getInterval()
    };

    this._windowProxy.addAction(action);
  }

}

export = MouseHandler;