/// <reference path="../ref.d.ts" />

import fs = require('fs');
import webdriver = require('selenium-webdriver');

class Session {

  constructor(private _webDriverBuilder: webdriver.Builder,
              private _seleniumServerUrl: string,
              private _capabilities: any) {

  }

  public start(success: (driver: webdriver.Driver) => void) {
    var driver = this._webDriverBuilder
      .usingServer(this._seleniumServerUrl)
      .withCapabilities(this._capabilities)
      .build();

    driver.manage()
      .window()
      .setSize(1280, 768)
      .then(() => {
        driver.get('http://localhost');

        success(driver);
      });
  }
}

export = Session;





