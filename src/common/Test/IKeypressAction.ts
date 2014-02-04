
import IAction = require('./IAction');

interface IKeypressAction extends IAction {
  charCode: number;
  char: string;
}

export = IKeypressAction;