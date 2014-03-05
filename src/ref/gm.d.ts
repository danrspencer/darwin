/**
 * Incomplete and probably inaccurate gm definition
 */

interface GmStatic {
  (image: string): Gm;

  compare(
    path1: string,
    path2: string,
    tolerance: number,
    callback: (err: Error, equal: boolean, equality: Number, rawOutput) => void
    );

  compare(
    path1: string,
    path2: string,
    options: {
      file: string;
      highlightColor?: string;
    },
    callback: (err: Error, equal: boolean, equality: number, rawOutput) => void
  );
}

interface Gm {

  crop(
    width: number,
    height: number,
    x: number,
    y: number
  );
}

declare var gm: GmStatic;

declare module "gm" {
  export = gm;
}