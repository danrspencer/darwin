
import IResultImage = require('./IResultImage');

interface IResult {
  from: string;
  diffs: IResultImage[];
}

export = IResult;