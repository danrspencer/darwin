
import IDiff = require('./IDiff');

interface IResult {
  from: string;
  diffs: IDiff[];
}

export = IResult;