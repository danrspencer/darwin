
import gm = require('gm');

import IResultImage = require('../../common/Result/IResultImage');
import ActionType = require('../../common/Test/ActionType');
import IAction = require('../../common/Test/IAction');
import ITest = require('../../common/Test/ITest');
import IScreenshotAction = require('../../common/Test/IScreenshotAction');

import Analyser = require('../Image/Analyser');
import ResultWriter = require('./ResultWriter');


class Processor {

  private _counter: number;
  private _resultImages: IResultImage[];

  constructor(private _analyser: Analyser,
              private _resultWriter: ResultWriter) {

  }

  public processResults(testName: string, test: ITest) {

    this._counter = 0;
    this._resultImages = [];

    test.actions.forEach((action: IAction) => {

      if (action.type !== ActionType.SCREENSHOT) {
        return;
      }

      this._counter++;

      this._processAction(testName, <IScreenshotAction>action);
    });
  }

  private _processAction(testName: string, action: IScreenshotAction) {
    this._analyser.process(testName, this._counter, action.segments, (resultImage: IResultImage) => {

      this._resultImages.push(resultImage);

      if (this._resultImages.length === this._counter) {
        this._resultWriter.save(this._resultImages);
      }
    });
  }
}

export = Processor;