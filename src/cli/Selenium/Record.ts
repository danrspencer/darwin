/// <reference path="../ref.d.ts" />

import fs = require('fs');
import webdriver = require('selenium-webdriver');

import ActionType = require('../../common/Action/ActionType');
import IAction = require('../../common/Action/IAction');

import Session = require('./Session');

class Record {

  constructor(private _fs: typeof fs,
              private _session: Session,
              private _browserScriptPath: String) {

  }

  public start() {
    // Hack: Cast to 'any' then back to 'string' to get TS to recognise as a string
    var browserScript = <string><any>this._fs.readFileSync(this._browserScriptPath, { encoding: 'utf8' });

    this._session.start((driver: webdriver.Driver) => {
      this._insertRecordScript(driver, browserScript);
      this._setupCallback(driver);
    });
  }

  private _insertRecordScript(driver: webdriver.Driver, browserScript: string) {
    driver.manage().timeouts().setScriptTimeout(60000);
    driver.executeScript('(function() { ' + browserScript + ' }());');
  }

  private _setupCallback(driver: webdriver.Driver) {
    driver.executeAsyncScript((callback: Function) => {
      window['__darwinCallback'] = callback;
    }).then((result: IAction) => {
      this._setupCallback(driver);

      if(result.type === ActionType.SCREENSHOT) {
        driver
          .takeScreenshot()
          .then((rawImageBuffer) => {
            console.log('Write image');
            var imageBuffer = new Buffer(rawImageBuffer, 'base64');
            fs.writeFileSync('./test.png', imageBuffer);
          });
      }
    });
  }
}

export = Record;





