
interface IDiff {
  image: string;
  segments: {
    segment: string;
    diff: string;
    pass: boolean;
  }[];
}

export = IDiff;