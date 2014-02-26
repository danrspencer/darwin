import IResultSegment = require('./IResultSegment');

interface IResultImage {
  image: string;
  comparisons: IResultSegment[];
}

export = IResultImage;