
import IAction = require('IAction');

interface IMouseEvent extends IAction {
  pos: { x: number; y: number }
  el: { id: string; };
}

export = IMouseEvent;