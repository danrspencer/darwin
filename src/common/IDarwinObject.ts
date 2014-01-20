
import IAction = require('Action/IAction');

interface IDarwinObject {
  actions: IAction[];
  pendingScreenshot: boolean;
  poll: () => IDarwinObject;
}

export = IDarwinObject;