
import IAction = require('../../common/Test/IAction');
import IDarwinWindow = require('../../common/IDarwinWindow');
import IDarwinObject = require('../../common/IDarwinObject');

class WindowProxy {

  constructor(private _window: IDarwinWindow) {
    this._window.__darwin = {
      actions: [],
      pendingScreenshot: false,
      poll: () => {
        var clone: IDarwinObject = {
          actions: this._window.__darwin.actions,
          pendingScreenshot: this._window.__darwin.pendingScreenshot,
          poll: null
        };

        this._window.__darwin.pendingScreenshot = false;

        return clone;
      }
    };
  }

  public addAction(action: IAction) {
    this._window.__darwin.actions.push(action);
  }

  public setPendingScreenshot() {
    this._window.__darwin.pendingScreenshot = true;
  }

}

export = WindowProxy;