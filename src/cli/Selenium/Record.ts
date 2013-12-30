/// <reference path="../ref.d.ts" />

import fs = require('fs');
import webdriver = require('selenium-webdriver');

import ActionType = require('../../common/Action/ActionType');
import IAction = require('../../common/Action/IAction');

import Session = require('./Session');
import Screenshot = require('./Screenshot');

class Record {

  constructor(private _fs: typeof fs,
              private _session: Session,
              private _screenshot: Screenshot,
              private _browserScriptPath: string) {

  }

  public start(testName: string): void {
    // Hack: Cast to 'any' then back to 'string' to get TS to recognise as a string
    var browserScript = <string><any>this._fs.readFileSync(
      this._browserScriptPath,
      { encoding: 'utf8' }
    );

    this._session.start((driver: webdriver.Driver) => {
      this._insertRecordScript(driver, browserScript);
      this._setupCallback(testName, driver, []);
    });
  }

  private _insertRecordScript(driver: webdriver.Driver, browserScript: string) {
    driver.manage().timeouts().setScriptTimeout(60000);
    driver.executeScript('(function() { ' + browserScript + ' }());');
  }

  private _setupCallback(testName: string, driver: webdriver.Driver, actions: IAction[]) {
    driver.executeAsyncScript((callback: Function) => {
      window['__darwinCallback'] = callback;
    }).then((result: IAction) => {
      this._handleBrowserCallback(testName, driver, actions, result);
    });
  }

  private _handleBrowserCallback(testName: string, driver: webdriver.Driver, actions: IAction[], result: IAction) {
    console.log(result);

    if (result === null) {
      this._fs.writeFileSync(testName + '/actions.json', JSON.stringify(actions));
      return;
    }

    actions.push(result);

    if (result.type === ActionType.SCREENSHOT) {
      this._screenshot.captureAndSave(driver, testName + '/image.png', () => {
        this._setupCallback(testName, driver, actions);
      });
    } else {
      this._setupCallback(testName, driver, actions);
    }
  }
}

export = Record;





