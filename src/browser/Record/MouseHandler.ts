
import ActionType = require('../../common/Action/ActionType');

import IMouseEvent = require('../../common/Action/IMouseEvent');

class MouseHandler {

  public mousedown(event: MouseEvent): IMouseEvent {

    var element = <HTMLElement>event.target;

    var result: IMouseEvent = {
      type: event.button === 0 ? ActionType.LEFTCLICK : ActionType.RIGHTCLICK,
      pos: {
        x: event.clientX,
        y: event.clientY
      },
      el: {
        id: element.id
      },
      delay: 0
    };

    return result;
  }

}

export = MouseHandler