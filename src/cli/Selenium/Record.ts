/// <reference path="../ref.d.ts" />

import fs = require('fs');
import webdriver = require('selenium-webdriver');

import ActionType = require('../../common/Action/ActionType');
import IAction = require('../../common/Action/IAction');
import ISuite = require('../Main/ISuite');

import Session = require('./Session');
import BrowserSync = require('./Record/BrowserSync');

class Record {

  constructor(private _fs: typeof fs,
              private _session: Session,
              private _browserSync: BrowserSync,
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
        this._browserSync.start(driver, testName, (actions: IAction[]) => {
          console.log('here!');

          this._fs.writeFileSync(testName + '/actions.json', JSON.stringify(actions, null, 2));
        });
      }
    );
  }

  private _insertRecordScript(driver: webdriver.Driver, browserScript: string) {
    driver.manage().timeouts().setScriptTimeout(60000);
    driver.executeScript('(function() { ' + browserScript + ' }());');
  }

}

export = Record;





