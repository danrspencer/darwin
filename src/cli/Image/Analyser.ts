
import IResultImage = require('../../common/Result/IResultImage');
import IResultSegment = require('../../common/Result/IResultSegment');
import ISegment = require('../../common/Test/Screenshot/ISegment');

import Postfixes = require('./Postfixes');

import Comparer = require('./Comparer');
import Cropper = require('./Cropper');

interface IState {
  testName: string;
  imageIndex: number;
  done: (resultImage: IResultImage) => void;
}

class Analyser {

  constructor(private _cropper: Cropper,
              private _comparer: Comparer) {

  }

  public process(testName: string, imageIndex: number, segments: ISegment[], done: (resultImage: IResultImage) => void) {

    var state: IState = {
      testName: testName,
      imageIndex: imageIndex,
      done: done
    };

    this._cropper.crop(
      testName + '/' + imageIndex,
      segments,
      (resultSegments: IResultSegment[]) => {

        console.log('Starting compare...');

        this._processCropped(state, resultSegments);
      }
    );
  }

  private _processCropped(state: IState, resultSegments: IResultSegment[]) {

    this._comparer.compare(
      state.testName,
      resultSegments,
      (resultSegments: IResultSegment[]) => {
        this._processResults(state, resultSegments);
      }
    );
  }

  private _processResults(state: IState, resultSegments: IResultSegment[]) {
    var resultImage = {
      image: state.imageIndex.toString(),
      comparisons: resultSegments
    };

    state.done(resultImage);
  }

}

export = Analyser;