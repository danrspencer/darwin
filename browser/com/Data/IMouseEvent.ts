
import IDataBase = require('com/Data/IDataBase');

interface IMouseEvent extends IDataBase {
  pos: { x: number; y: number }
  el: { id: string; };
}

export = IMouseEvent;