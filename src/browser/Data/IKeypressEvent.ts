
import IAction = require('IAction');

interface IKeypressEvent extends IAction {

  char: number;
  shift: boolean;
  alt: boolean;
  ctrl: boolean;

}

export = IKeypressEvent;