/// <reference path="../ref.d.ts" />

import fs = require('fs');
import webdriver = require('selenium-webdriver');

class Screenshot {

  constructor(private _fs: typeof fs,
              private _driver: webdriver.Driver) {

  }

  public take(saveAs: string,
              callback: () => void) {

    this._driver
      .takeScreenshot()
      .then((result) => {
        var buffer = new Buffer(result, 'base64');

        this._fs.writeFileSync(saveAs, buffer);

        callback();
      });
  }

}

export = Screenshot;