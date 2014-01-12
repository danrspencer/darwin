
import IAction = require('Action/IAction');

interface IDarwinWindow extends Window {
  __darwin: {
    actions: IAction[];
    pendingScreenshot: boolean;
  }
}

export = IDarwinWindow;