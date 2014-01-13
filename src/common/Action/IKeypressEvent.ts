
import IAction = require('./IAction');

interface IKeypressEvent extends IAction {
  charCode: number;
  char: string;
}

export = IKeypressEvent;