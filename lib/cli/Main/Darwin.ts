/// <reference path="../ref.d.ts" />

import fs = require('fs');
import promptly = require('promptly');
import webdriver = require('selenium-webdriver');


class Darwin {

  constructor(private _fs: typeof fs,
              private _promptly: typeof promptly) {

  }

  public init() {
    this._promptly.prompt('Enter a test description: ', (error: Error, value: string) => {
      this._fs.mkdirSync(value);

      var driver = new webdriver.Builder()
        .usingServer('http://localhost:9515')
        .withCapabilities(webdriver.Capabilities.chrome())
        .build();

      driver.manage().window()
        .setSize(1280, 768)
        .then(() => {
          driver.get('http://jx-adbuilder.dev/app');
        });
    });
  }

}

export = Darwin;