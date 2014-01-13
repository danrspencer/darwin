
import IAction = require('Action/IAction');

interface IDarwinObject {
  actions: IAction[];
  pendingScreenshot: boolean;
}

export = IDarwinObject;