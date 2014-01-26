
import webdriver = require('selenium-webdriver');

import Perform = require('./Perform');
import Robot = require('./Robot');
import Scheduler = require('./Scheduler');

class RobotBuilder {

  public getRobot(driver: webdriver.Driver, testName: string) {


    return new Robot();
  }

}

export = RobotBuilder;