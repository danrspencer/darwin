/// <reference path="../ref.d.ts" />

import fs = require('fs');
import webdriver = require('selenium-webdriver');

import ActionType = require('../../common/Action/ActionType');
import IAction = require('../../common/Action/IAction');
import ISuite = require('../Main/ISuite');

import Session = require('./Session');
import Screenshot = require('./Screenshot');

class Record {

  constructor(private _fs: typeof fs,
              private _session: Session,
              private _screenshot: Screenshot,
              private _browserScriptPath: string) {

  }

  public start(testName: string, suiteInfo: ISuite): void {
    // Hack: Cast to 'any' then back to 'string' to get TS to recognise as a string
    var browserScript = <string><any>this._fs.readFileSync(
      this._browserScriptPath,
      { encoding: 'utf8' }
    );

    this._session.start(
      suiteInfo.url,
      suiteInfo.browserSize.width,
      suiteInfo.browserSize.height,
      (driver: webdriver.Driver) => {
        this._insertRecordScript(driver, browserScript);
        this._setupCallback(testName, driver, [], 0);
      }
    );
  }

  private _insertRecordScript(driver: webdriver.Driver, browserScript: string) {
    driver.manage().timeouts().setScriptTimeout(60000);
    driver.executeScript('(function() { ' + browserScript + ' }());');
  }

  private _setupCallback(testName: string, driver: webdriver.Driver, actions: IAction[], screenshotNum: Number) {
    driver.executeAsyncScript((callback: Function) => {
      window['__darwinCallback'] = callback;
    }).then((result: IAction) => {
      this._handleBrowserCallback(testName, driver, actions, result, screenshotNum);
    });
  }

  private _handleBrowserCallback(testName: string, driver: webdriver.Driver, actions: IAction[], result: IAction, screenshotNum: Number) {
    console.log(result);

    if (result === null) {
      this._fs.writeFileSync(testName + '/actions.json', JSON.stringify(actions, null, 2));
      return;
    }

    actions.push(result);

    if (result.type === ActionType.SCREENSHOT) {

      screenshotNum++;

      this._screenshot.captureAndSave(driver, testName + '/' + screenshotNum + '.png', () => {
        this._setupCallback(testName, driver, actions, screenshotNum);
      });

    } else {
      this._setupCallback(testName, driver, actions, screenshotNum);
    }
  }
}

export = Record;





