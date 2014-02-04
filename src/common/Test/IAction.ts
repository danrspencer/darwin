
import ActionType = require('./ActionType');

interface IAction {
  type: ActionType;
  delay: number;
}

export = IAction;