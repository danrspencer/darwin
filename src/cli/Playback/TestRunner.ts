
import webdriver = require('selenium-webdriver');

import IAction = require('../../common/Test/IAction');
import ITest = require('../../common/Test/ITest');
import ISuite = require('../Main/ISuite');

import Processor = require('../Image/Processor');
import Browser = require('../Selenium/Browser');
import Robot = require('./Robot');
import RobotBuilder = require('./RobotBuilder');

class TestRunner {

  constructor(private _robotBuilder: RobotBuilder,
              private _browser: Browser,
              private _processor: Processor) {

  }

  public run(suiteInfo: ISuite, testName: string, test: ITest) {
    this._browser.start(
      suiteInfo.url,
      suiteInfo.browserSize.width,
      suiteInfo.browserSize.height,
      (driver: webdriver.Driver) => { this.startRobot(driver, testName, test); }
    );
  }

  private startRobot(driver: webdriver.Driver, testName: string, test: ITest) {
    var robot = this._robotBuilder.getRobot(driver, testName);

    robot.performActions(test.actions, () => {
      driver.quit();

      this._processor.processResults(testName, test);
    });
  }

}

export = TestRunner;