
import IAction = require('Action/IAction');

interface IDarwinWindow extends Window {
  __darwinCallback(result: IAction[])
}

export = IDarwinWindow;