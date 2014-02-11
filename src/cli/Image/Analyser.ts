
import IResultImage = require('../../common/Result/IResultImage');
import ISegment = require('../../common/Test/Screenshot/ISegment');

import Postfixes = require('./Postfixes');

import Comparer = require('./Comparer');
import Cropper = require('./Cropper');

class Analyser {

  constructor(private _cropper: Cropper,
              private _comparer: Comparer) {

  }

  public process(testName: string, imageIndex: number, segments: ISegment[], done: (resultImage: IResultImage) => void) {

    this._cropper.crop(
      'testName/' + imageIndex,
      segments,
      (resultImage: IResultImage) => {
        this._processCropped(resultImage, done);
      }
    );
  }

  private _processCropped(resultImage: IResultImage, done: (resultImage: IResultImage) => void) {
    this._comparer.compare(
      resultImage,
      (resultImage: IResultImage) => {
        done(resultImage);
      }
    );
  }

//  private _nextChar(char: string) {
//    return String.fromCharCode(char.charCodeAt(0) + 1);
//  }
}

export = Analyser;