
import gm = require('gm');

import IResultSegment = require('../../common/Result/IResultSegment');
import ISegment = require('../../common/Test/Screenshot/ISegment');

import Postfixes = require('./Postfixes');

class Cropper {

  public constructor(private _gm: typeof gm) {

  }

  public crop(baseName: string, segments: ISegment[], done: (resultSegments: IResultSegment[]) => void) {

    console.log('cropping...');

    this._gm(baseName + Postfixes.ACTUAL)
        .crop(100, 100, 0, 0)
        .write(baseName + 'a' + Postfixes.ACTUAL, (err) => {
        console.log(err);
      });

    var results: IResultSegment[] = [];

    results.push({
     expected: baseName + Postfixes.EXPECTED,
     actual: baseName + Postfixes.ACTUAL,
     diff: '',
     diffValue: '',
     pass: false
    });

    done(results);
  }
//  private _nextChar(char: string) {
//    return String.fromCharCode(char.charCodeAt(0) + 1);
//  }
}

export = Cropper;