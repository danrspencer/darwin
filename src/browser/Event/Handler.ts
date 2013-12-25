
import ActionType = require('../../common/Action/ActionType');

import IAction = require('../../common/Action/IAction');
import IMouseEvent = require('../../common/Action/IMouseEvent');
import IKeypressEvent = require('../../common/Action/IKeypressEvent');

class Handler {

  public mouseDown(event: MouseEvent): IMouseEvent {

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

  public keypress(event: KeyboardEvent): IAction {

    if(event.which === 19
      && event.shiftKey === true
      && event.ctrlKey === true) {

      var screenshot: IAction = {
        type: ActionType.SCREENSHOT
      }

      return screenshot;
    }

    var result: IKeypressEvent = {
      type: ActionType.KEYPRESS,
      char: event.charCode,
      shift: event.shiftKey,
      alt: event.altKey,
      ctrl: event.ctrlKey
    };

    return result;
  }

}

export = Handler;