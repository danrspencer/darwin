
import fs = require('fs');
import webdriver = require('selenium-webdriver');

import Perform = require('./Perform');
import Robot = require('./Robot');
import Scheduler = require('./Scheduler');

import Capture = require('../Image/Capture');
import Screenshot = require('../Image/Screenshot');

class RobotBuilder {

  public getRobot(driver: webdriver.Driver, testName: string) {

    var screenshot = new Screenshot(fs, driver);
    var capture = new Capture(screenshot, testName);

    var scheduler = new Scheduler();
    var perform = new Perform(driver, capture);

    return new Robot(scheduler, perform);
  }

}

export = RobotBuilder;