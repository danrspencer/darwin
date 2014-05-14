
import gm = require('gm');

import IResultSegment = require('../../common/Result/IResultSegment');
import ISegment = require('../../common/Test/Screenshot/ISegment');

import Postfixes = require('./Postfixes');

interface IState {
  baseName: string;
  segments: ISegment[];
  results: IResultSegment[];
  done: (resultSegments: IResultSegment[]) => void;
}

class Cropper {

  constructor(private _gm: typeof gm) {

  }

  public crop(baseName: string, segments: ISegment[], done: (resultSegments: IResultSegment[]) => void) {

    var state: IState = {
      baseName: baseName,
      segments: segments,
      results: [],
      done: done
    };

    if (segments.length > 0) {
      this._processSegments(state);
    } else {
      this._processNoCrops(state);
    }
  }

  private finish(state: IState) {
    if (state.segments.length === 0 ||
        state.segments.length === state.results.length)  {

      state.done(state.results);
    }
  }

  private _processNoCrops(state: IState) {
    state.results.push(this._createResultSegment(state.baseName));
    this.finish(state);
  }

  private _processSegments(state: IState) {
    var charPostfix = 'a';

    state.segments.forEach((segment) => {
        this._processSegment(segment, charPostfix, state);

        charPostfix = this._incrementChar(charPostfix);
    });
  }

  private _processSegment(segment: ISegment, charPostfix: string, state: IState) {
    var x = segment.topLeft.x;
    var y = segment.topLeft.y;
    var width = segment.bottomRight.x - segment.topLeft.x;
    var height = segment.bottomRight.y - segment.topLeft.y;

    var outputImage = state.baseName + charPostfix;

    this._gm(state.baseName + Postfixes.ACTUAL)
         .crop(width, height, x, y)
         .write(outputImage + Postfixes.ACTUAL, (err) => {
            state.results.push(this._createResultSegment(outputImage));
            this.finish(state);
          });
  }

  private _createResultSegment(partialImageName: string) {
    return {
      expected: partialImageName + Postfixes.EXPECTED,
      actual: partialImageName + Postfixes.ACTUAL,
      diff: '',
      diffValue: '',
      pass: false
    };
  }

  private _incrementChar(char: string) {
    return String.fromCharCode(char.charCodeAt(0) + 1);
  }
}

export = Cropper;
