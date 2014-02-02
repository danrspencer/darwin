
import webdriver = require('selenium-webdriver');

import IAction = require('../../common/Action/IAction');

import Perform = require('./Perform');
import Scheduler = require('./Scheduler');

class Robot {

  private _actions: IAction[];
  private _cumulativeDelay: number;
  private _done: () => void;

  constructor(private _scheduler: Scheduler,
              private _perform: Perform) {

  }

  public performActions(actions: IAction[], done: () => void) {
    this._actions = actions;
    this._done = done;
    this._cumulativeDelay = 0;

    this._scheduler.start();

    this._scheduleNextAction();
  }

  private _scheduleNextAction() {
    this._cumulativeDelay += this._actions[0].delay;

    this._scheduler.callAfter(this._cumulativeDelay, () => {
      this._doNextAction();
    });
  }

  private _doNextAction() {
    this._perform.performAction(this._actions[0], () => {
      this._progressActionQueue();
    });
  }

  private _progressActionQueue() {
    if (this._actions.length > 1) {
      this._actions.shift();

      this._scheduleNextAction();

    } else {
      this._done();
    }
  }

}

export = Robot;