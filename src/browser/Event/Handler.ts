
import ActionType = require('../../common/Action/ActionType');

import IAction = require('../../common/Action/IAction');
import IMouseEvent = require('../../common/Action/IMouseEvent');
import IKeypressEvent = require('../../common/Action/IKeypressEvent');

class Handler {

  public mouseDown(event: MouseEvent, delay: number): IMouseEvent {

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
      delay: delay
    };

    return result;
  }

  public keypress(event: KeyboardEvent, delay: number): IAction {

    if(event.which === 19
      && event.shiftKey === true
      && event.ctrlKey === true) {

      var screenshot: IAction = {
        type: ActionType.SCREENSHOT,
        delay: delay
      };

      return screenshot;
    }

    var result: IKeypressEvent = {
      type: ActionType.KEYPRESS,
      char: String.fromCharCode(event.charCode),
      charCode: event.charCode,
      shift: event.shiftKey,
      alt: event.altKey,
      ctrl: event.ctrlKey,
      delay: delay
    };

    return result;
  }

}

export = Handler;