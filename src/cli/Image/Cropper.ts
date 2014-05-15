
import gm = require('gm');
import Q = require('q');

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

    var promises;

    if (segments.length > 0) {
      promises = this._processSegments(state);
    } else {
      promises = this._processNoCrops(state);
    }

    var promise = Q.all(promises);

    promise.then(
      (results) => {
        done(results);
      }
    );

    return promise;
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

    return state.segments.map((segment) => {
      charPostfix = this._incrementChar(charPostfix);

      return this._processSegment(segment, charPostfix, state);

        /*charPostfix = this._incrementChar(charPostfix);*/
    });
  }

  private _processSegment(segment: ISegment, charPostfix: string, state: IState) {
    var x = segment.topLeft.x;
    var y = segment.topLeft.y;
    var width = segment.bottomRight.x - segment.topLeft.x;
    var height = segment.bottomRight.y - segment.topLeft.y;

    var outputImage = state.baseName + charPostfix;

    var returned = this._gm(state.baseName + Postfixes.ACTUAL)
                       .crop(width, height, x, y);

    return Q.ninvoke(returned, "write", outputImage + Postfixes.ACTUAL);


         /*.write(outputImage + Postfixes.ACTUAL, (err) => {
            state.results.push(this._createResultSegment(outputImage));
            this.finish(state);
          });*/
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
