
import IAction = require('../../common/Action/IAction');
import IDarwinWindow = require('../../common/IDarwinWindow');

class WindowProxy {

  constructor(private _window: IDarwinWindow) {
    this._window.__darwin = {
      actions: [],
      pendingScreenshot: false
    };
  }

  public addAction(action: IAction) {
    this._window.__darwin.actions.push(action);
  }

  public setPendingScreenshot(value: boolean) {
    this._window.__darwin.pendingScreenshot = value;
  }

}

export = WindowProxy;