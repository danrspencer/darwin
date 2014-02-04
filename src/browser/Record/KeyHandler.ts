import Timer = require('./Timer');
import WindowProxy = require('./WindowProxy');

import ActionType = require('../../common/Test/ActionType');
import IAction = require('../../common/Test/IAction');
import IKeypressAction = require('../../common/Test/IKeypressAction');

class KeyHandler {

  constructor(private _windowProxy: WindowProxy,
              private _timer: Timer) {

  }

  public keypress(event: KeyboardEvent) {
    if(event.which === 19 && event.shiftKey === true && event.ctrlKey === true) {
      this._screenshot();
    } else {
      this._standardKeypress(event);
    }
  }

  private _screenshot() {
    var action: IAction = {
      type: ActionType.SCREENSHOT,
      delay: this._timer.getInterval()
    };

    this._windowProxy.addAction(action);
    this._windowProxy.setPendingScreenshot();
  }

  private _standardKeypress(event: KeyboardEvent) {
    var action: IKeypressAction = {
      type: ActionType.KEYPRESS,
      delay: this._timer.getInterval(),
      char: String.fromCharCode(event.charCode),
      charCode: event.charCode
    };

    this._windowProxy.addAction(action);
  }
}

export = KeyHandler;