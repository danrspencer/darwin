
import webdriver = require('selenium-webdriver');

import IAction = require('../../common/Action/IAction');
import ISuite = require('../Main/ISuite');

import Browser = require('../Selenium/Browser');
import Robot = require('./Robot');
import RobotBuilder = require('./RobotBuilder');

class TestRunner {

  constructor(private _robotBuilder: RobotBuilder,
              private _browser: Browser) {

  }

  public run(suiteInfo: ISuite, testName: string, actions: IAction[]) {
    this._browser.start(
      suiteInfo.url,
      suiteInfo.browserSize.width,
      suiteInfo.browserSize.height,
      (driver: webdriver.Driver) => { this.startRobot(driver, testName, actions) }
    );
  }

  private startRobot(driver: webdriver.Driver, testName: string, actions: IAction[]) {
    var robot = this._robotBuilder.getRobot(driver, testName);
    robot.performActions(actions, () => {
      driver.quit();
    });
  }

}

export = TestRunner;