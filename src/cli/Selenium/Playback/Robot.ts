
import webdriver = require('selenium-webdriver');

import IAction = require('../../../common/Action/IAction');

import Perform = require('./Perform');
import Scheduler = require('./Scheduler');
import SchedulerBuilder = require('./SchedulerBuilder');

class Robot {

  constructor(private _schedulerBuilder: SchedulerBuilder,
              private _perform: Perform) {

  }

  public performActions(driver: webdriver.Driver, testName: string, actions: IAction[]) {
    var scheduler = this._schedulerBuilder.getScheduler();

    scheduler.start();

    this._scheduleNextAction(driver, testName, actions, scheduler, 0);
  }

  private _scheduleNextAction(driver: webdriver.Driver, testName: string, actions: IAction[], scheduler: Scheduler, cumulativeDelay: number) {
    cumulativeDelay += actions[0].delay;

    scheduler.callAfter(cumulativeDelay, () => {
      this._doNextAction(driver, testName, actions, scheduler, cumulativeDelay);
    });
  }

  private _doNextAction(driver: webdriver.Driver, testName: string, actions: IAction[], scheduler: Scheduler, cumulativeDelay: number) {
    this._perform.performAction(driver, testName, actions[0], () => {
      this._progressActionQueue(driver, testName, actions, scheduler, cumulativeDelay);
    });
  }

  private _progressActionQueue(driver: webdriver.Driver, testName: string, actions: IAction[], scheduler: Scheduler, cumulativeDelay: number) {
    if (actions.length > 1) {
      actions.shift();

      this._scheduleNextAction(driver, testName, actions, scheduler, cumulativeDelay);
    }
  }

}

export = Robot;