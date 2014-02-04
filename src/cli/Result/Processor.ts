
import gm = require('gm');

import IDiff = require('../../common/Result/IDiff');
import ActionType = require('../../common/Test/ActionType');
import IAction = require('../../common/Test/IAction');
import ITest = require('../../common/Test/ITest');

import Analyser = require('../Image/Analyser');
import ResultWriter = require('./ResultWriter');


class Processor {

  constructor(private _analyser: Analyser,
              private _resultWriter: ResultWriter) {

  }

  public processResults(testName: string, test: ITest) {

    var counter = 0;
    var doneCounter = 0;

    var diffs: IDiff[] = [];

    test.actions.forEach((action: IAction) => {

      if (action.type !== ActionType.SCREENSHOT) {
        return;
      }

      counter++;

      this._analyser.process(testName, action, counter, (diff: IDiff) => {

        doneCounter++;
        diffs.push(diff);

        if (doneCounter === counter) {
          this._resultWriter.save(testName, diffs);
        }
      });
    });
  }

//  private _processImages(testName: string, imageCounter: number) {
//
//    var imageNameBase = testName + '/' + imageCounter;
//    var baseImage = imageNameBase + '_expected.png';
//    var resultImage = imageNameBase + '_actual.png';
//    var diffImage = imageNameBase + '_diff.png';
//
//    var options = { file: diffImage };
//
//    this._gm.compare(baseImage, resultImage, options, (err, equal, equality, rawOutput) => {
//      // Todo - Handle error
//    });
//  }

}

export = Processor;