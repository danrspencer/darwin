
import webdriver = require('selenium-webdriver');

import Perform = require('./Perform');
import Robot = require('./Robot');
import Scheduler = require('./Scheduler');

class RobotBuilder {

  public getScheduler() {
    return new Scheduler();
  }

  public getRobot(driver: webdriver.Driver) {


    return new Robot();
  }

}

export = RobotBuilder;