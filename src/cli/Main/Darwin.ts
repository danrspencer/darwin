/// <reference path="../ref.d.ts" />

import fs = require('fs');
import promptly = require('promptly');
import webdriver = require('selenium-webdriver');


class Darwin {

  constructor(private _fs: typeof fs,
              private _promptly: typeof promptly,
              private _webDriverBuilder: webdriver.Builder,
              private _browserScriptPath: string,
              private _seleniumServerUrl: string,
              private _capabilities: any) {

  }

  public init() {
    var browserScript = this._fs.readFileSync(this._browserScriptPath, 'utf8');

    var driver = this._webDriverBuilder.usingServer(this._seleniumServerUrl)
      .withCapabilities(this._capabilities)
      .build();

    this._promptly.prompt('Enter a test description: ', (error: Error, value: string) => {
      this._fs.mkdirSync(value);

      driver.manage().window()
        .setSize(1280, 768)
        .then(() => {
          driver.get('http://www.google.com');
          driver.executeScript(browserScript);
        });
    });
  }

}

export = Darwin;