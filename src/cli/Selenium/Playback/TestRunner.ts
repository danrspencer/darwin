
import webdriver = require('selenium-webdriver');

import IAction = require('../../../common/Action/IAction');
import ISuite = require('../../Main/ISuite');

import Browser = require('../Browser');
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
      (driver: webdriver.Driver) => {

        var robot = this._robotBuilder.getRobot(driver, testName);

        robot.performActions(driver, actions);
      }
    );
  }

}

export = TestRunner;