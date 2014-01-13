
import webdriver = require('selenium-webdriver');

import Screenshot = require('../Screenshot');

import IAction = require('../../../common/Action/IAction');
import IDarwinObject = require('../../../common/IDarwinObject');


class BrowserSync {

  constructor(private _screenshot: Screenshot) {

  }

  public start(driver: webdriver.Driver, testName: string,  done: (actions: IAction[]) => void) {

     this._pollBrowser(driver, testName, done);
  }

  private _pollBrowser(driver: webdriver.Driver, testName: string,  done: (actions: IAction[]) => void) {
    var actions: IAction[];
    var screenshotCounter = 1;

    setTimeout(() => {
      driver
        .executeScript('return window.__darwin.poll();')
        .then((darwinObj: IDarwinObject) => {
          actions = darwinObj.actions;

          if (darwinObj.pendingScreenshot === true) {
            this._screenshot.captureAndSave(driver, testName + '/' + screenshotCounter++ + '.png', () => {
              this._pollBrowser(driver, testName, done);
            });
          } else {
            this._pollBrowser(driver, testName, done);
          }
        }, () => {
          done(actions);
        });
    }, 200);
  }

}

export = BrowserSync;