
import IAction = require('./IAction');
import ISegment = require('./Screenshot/ISegment');

interface IScreenshotAction extends IAction {
  segments: ISegment[];
}

export = IScreenshotAction;