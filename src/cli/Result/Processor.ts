
import gm = require('gm');

import IDiff = require('../../common/Result/IDiff');
import ActionType = require('../../common/Test/ActionType');
import IAction = require('../../common/Test/IAction');
import ITest = require('../../common/Test/ITest');

import Analyser = require('../Image/Analyser');
import ResultWriter = require('./ResultWriter');


class Processor {

  private _counter: number;
  private _diffs: IDiff[];

  constructor(private _analyser: Analyser,
              private _resultWriter: ResultWriter) {

  }

  public processResults(test: ITest) {

    this._counter = 0;
    this._diffs = [];

    test.actions.forEach((action: IAction) => {

      if (action.type !== ActionType.SCREENSHOT) {
        return;
      }

      this._counter++;

      this._processAction(action);
    });
  }

  private _processAction(action: IAction) {
    this._analyser.process(action, this._counter, (diff: IDiff) => {

      this._diffs.push(diff);

      if (this._diffs.length === this._counter) {
        this._resultWriter.save(this._diffs);
      }
    });
  }
}

export = Processor;