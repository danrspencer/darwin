
import ActionType = require('com/Data/ActionType');
import IMouseEvent = require('com/Data/IMouseEvent');

class Click {

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

export = Click;