
import IAction = require('Test/IAction');

interface IDarwinObject {
  actions: IAction[];
  pendingScreenshot: boolean;
  poll: () => IDarwinObject;
}

export = IDarwinObject;