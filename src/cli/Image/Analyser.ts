
import gm = require('gm');

import ActionType = require('../../../src/common/Action/ActionType');
import IAction = require('../../common/Action/IAction');

class Analyse {

  constructor(private _gm: typeof gm) {

  }

  public analyseResults(testName: string, actions: IAction[]) {

    var imageCounter = 1;

    actions.forEach((action: IAction) => {

      if (action.type !== ActionType.SCREENSHOT) {
        return;
      }

      this._processImages(testName, imageCounter);

      imageCounter++;
    });

  }

  private _processImages(testName: string, imageCounter: number) {

    var imageNameBase = testName + '/' + imageCounter;
    var baseImage = imageNameBase + '.png';
    var resultImage = imageNameBase + '_result.png';
    var diffImage = imageNameBase + '_diff.png';

    var options = { file: diffImage };

    this._gm.compare(baseImage, resultImage, options, (err, equal, equality, rawOutput) => {

      console.log(arguments);
      console.log(testName + ': ' + equality);
    });
  }

}

export = Analyse;