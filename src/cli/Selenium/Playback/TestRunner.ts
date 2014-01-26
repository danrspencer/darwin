
import webdriver = require('selenium-webdriver');

import IAction = require('../../../common/Action/IAction');
import ISuite = require('../../Main/ISuite');

import Robot = require('./Robot');
import Browser = require('../Browser');

class TestRunner {

  constructor(private _robot: Robot,
              private _browser: Browser) {

  }

  public run(suiteInfo: ISuite, actions: IAction[]) {
    this._browser.start(
      suiteInfo.url,
      suiteInfo.browserSize.width,
      suiteInfo.browserSize.height,
      (driver: webdriver.Driver) => {

        this._robot.performActions(driver, actions);
      }
    );
  }

}

export = TestRunner;