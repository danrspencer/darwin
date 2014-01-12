
import ActionType = require('../../common/Action/ActionType');

import IAction = require('../../common/Action/IAction');
import IKeypressEvent = require('../../common/Action/IKeypressEvent');

class KeyHandler {



  public keypress(event: KeyboardEvent) {

    if(event.which === 19
      && event.shiftKey === true
      && event.ctrlKey === true) {

      var screenshot: IAction = {
        type: ActionType.SCREENSHOT,
        delay: 0
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
      delay: 0
    };

    return result;
  }

}

export = KeyHandler;