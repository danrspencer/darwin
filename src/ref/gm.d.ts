/**
 * Incomplete and probably inaccurate gm definition
 */

declare module 'gm' {

  export function compare(
    path1: string,
    path2: string,
    tolerance: number,
    callback: (err: Error, equal: boolean, equality: Number, rawOutput) => void
  );

  export function compare(
    path1: string,
    path2: string,
    options: {
      file: string;
      highlightColor?: string;
    },
    callback: (err: Error, equal: boolean, equality: number, rawOutput) => void
  );

}