
import IAction = require('./IAction');

interface IMouseAction extends IAction {
  pos: { x: number; y: number };
  el: { id: string; };
}

export = IMouseAction;