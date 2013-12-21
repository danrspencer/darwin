
import ActionType = require('../Data/ActionType');
import IMouseEvent = require('../Data/IMouseEvent');

class Handler {

  public onMousedown(event: MouseEvent): IMouseEvent {

    var element = <HTMLElement>event.target;

    var result: IMouseEvent = {
      type: event.button === 0 ? ActionType.LEFTCLICK : ActionType.RIGHTCLICK,
      pos: {
        x: event.clientX,
        y: event.clientY
      },
      el: {
        id: element.id
      }
    };

    return result;
  }

}

export = Handler;