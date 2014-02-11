
interface IResultImage {
  image: string;
  comparisons: {
    expected: string;
    actual: string;
    diff: string;
    diffValue: string;
    pass: boolean;
  }[];
}

export = IResultImage;