
import IAction = require('./IAction');

interface IScreenshotAction extends IAction {
  segments: {
    topLeft: { x: number; y: number };
    bottomRight: { x: number; y: number };
  };
}

export = IScreenshotAction;