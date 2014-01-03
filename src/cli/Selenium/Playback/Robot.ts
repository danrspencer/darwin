
import webdriver = require('selenium-webdriver');

import IAction = require('../../../common/Action/IAction');

class Robot {

  public performActions(driver: webdriver.Driver, actions: IAction[]) {
    console.log(actions);
  }

}

export = Robot;