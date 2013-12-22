/// <reference path="../ref.d.ts" />

import webdriver = require('selenium-webdriver');

class Record {

  constructor(private _webDriverBuilder: webdriver.Builder,
              private _seleniumServerUrl: string,
              private _capabilities: any) {

  }

  public start(browserScript: string) {
    var driver = this._webDriverBuilder
      .usingServer(this._seleniumServerUrl)
      .withCapabilities(this._capabilities)
      .build();

    driver.manage()
      .window()
      .setSize(1280, 768)
      .then(() => {
        this._openPage(driver, browserScript);
        driver.manage().timeouts().setScriptTimeout(60000);
        driver.executeAsyncScript((callback: Function) => {
          window['__darwin_callback'] = callback;
        }).then((result) => {
            console.log(result);
          });
      });
  }

  private _openPage(driver: webdriver.Driver, browserScript: string) {
    driver.get('http://localhost');
    driver.executeScript('(function() { ' + browserScript + ' }());');
  }
}

export = Record;





