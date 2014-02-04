/// <reference path="../ref.d.ts" />

import fs = require('fs');
import webdriver = require('selenium-webdriver');

import ActionType = require('../../common/Test/ActionType');
import IAction = require('../../common/Test/IAction');
import ISuite = require('../Main/ISuite');

import Browser = require('../Selenium/Browser');
import BrowserSync = require('./BrowserSync');
import TestWriter = require('./TestWriter');

class Record {

  constructor(private _fs: typeof fs,
              private _browser: Browser,
              private _browserSync: BrowserSync,
              private _testWriter: TestWriter,
              private _browserScriptPath: string) {

  }

  public start(testName: string, suiteInfo: ISuite): void {
    // Hack: Cast to 'any' then back to 'string' to get TS to recognise as a string
    var browserScript = <string><any>this._fs.readFileSync(
      this._browserScriptPath,
      { encoding: 'utf8' }
    );

    this._browser.start(
      suiteInfo.url,
      suiteInfo.browserSize.width,
      suiteInfo.browserSize.height,
      (driver: webdriver.Driver) => {
        this._insertRecordScript(driver, browserScript);
        this._browserSync.start(driver, testName, (actions: IAction[]) => {
          this._testWriter.save(testName, actions);
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





