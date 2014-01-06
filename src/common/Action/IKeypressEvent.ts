
import IAction = require('IAction');

interface IKeypressEvent extends IAction {

  charCode: number;
  char: string;
  shift: boolean;
  alt: boolean;
  ctrl: boolean;

}

export = IKeypressEvent;