
import ISegment = require('../../common/Test/Screenshot/ISegment');

import Postfixes = require('./Postfixes');

import Comparer = require('./Comparer');
import Cropper = require('./Cropper');
import IImageOutput = require('./IImageOutput');

class Analyser {

  constructor(private _cropper: Cropper,
              private _comparer: Comparer) {

  }

  public process(testName: string, imageIndex: number, segments: ISegment[], done: (diffs: Number[]) => void) {

    this._cropper.crop(
      'testName/' + imageIndex,
      segments,
      (croppedImages: IImageOutput[]) => {
        this._processCropped(croppedImages, done);
      }
    );
  }

  private _processCropped(croppedImages: IImageOutput[], done: (diffs: Number[]) => void) {
    this._comparer.compare(
      croppedImages,
      (diffs: number[]) => {
        done(diffs);
      }
    );
  }

//  private _nextChar(char: string) {
//    return String.fromCharCode(char.charCodeAt(0) + 1);
//  }
}

export = Analyser;