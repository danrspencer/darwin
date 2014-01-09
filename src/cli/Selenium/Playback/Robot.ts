
import webdriver = require('selenium-webdriver');

import IAction = require('../../../common/Action/IAction');

import Perform = require('./Perform');
import Scheduler = require('./Scheduler');
import SchedulerBuilder = require('./SchedulerBuilder');

class Robot {

  constructor(private _schedulerBuilder: SchedulerBuilder,
              private _perform: Perform) {

  }

  public performActions(driver: webdriver.Driver, actions: IAction[]) {
    var scheduler = this._schedulerBuilder.getScheduler();

    scheduler.start();
    scheduler.callAfter(actions[0].delay, () => {
      this._perform.performAction(driver, actions[0]);
    });
  }

}

export = Robot;