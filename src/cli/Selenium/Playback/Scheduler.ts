
import webdriver = require('selenium-webdriver');

import IAction = require('../../../common/Action/IAction');

import Perform = require('./Perform');

class Scheduler {

  constructor(private _perform: Perform) {

  }

  public performActions(driver: webdriver.Driver, actions: IAction[]) {
    this._processAction(driver, actions, 0);
  }

  private _processAction(driver: webdriver.Driver, actions: IAction[], currentAction: number) {
    setTimeout(() => {
      this._perform.performAction(driver, actions[currentAction]);

      if (currentAction < actions.length - 1) {
        this._processAction(driver, actions, currentAction + 1);
      }
    }, actions[currentAction].delay);
  }

}

export = Scheduler;