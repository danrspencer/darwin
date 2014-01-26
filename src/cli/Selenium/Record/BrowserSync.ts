
import webdriver = require('selenium-webdriver');

import Screenshot = require('../Screenshot');

import IAction = require('../../../common/Action/IAction');
import IDarwinObject = require('../../../common/IDarwinObject');

class BrowserSync {

  private _actions: IAction[];
  private _screenshotCounter = 1;
  private _driver: webdriver.Driver;
  private _testName: string;
  private _done: (actions: IAction[]) => void;

  constructor(private _screenshot: Screenshot) {

  }

  public start(driver: webdriver.Driver, testName: string, done: (actions: IAction[]) => void) {
    this._screenshotCounter = 1;
    this._driver = driver;
    this._testName = testName;
    this._done = done;

    this._pollBrowser();
  }

  private _pollBrowser() {
    setTimeout(() => {
      this._driver
        .executeScript('return window.__darwin.poll();')
        .then((darwinObj: IDarwinObject) => {
          this._handleBrowserResult(darwinObj);
        }, (error) => {

          // TODO check that error is expected error (browser closed)

          this._done(this._actions);
        });
    }, 200);
  }

  private _handleBrowserResult(darwinObj: IDarwinObject) {
    if(darwinObj === null) {
      this._done(this._actions);
      return;
    }

    if(typeof darwinObj === 'undefined') {
      this._pollBrowser();
    }

    this._actions = darwinObj.actions;

    if (darwinObj.pendingScreenshot === true) {
      var screenshotPath = this._testName + '/' + this._screenshotCounter++ + '.png';

      this._screenshot.captureAndSave(this._driver, screenshotPath, () => {
        this._pollBrowser();
      });
    } else {
      this._pollBrowser();
    }
  }

}

export = BrowserSync;