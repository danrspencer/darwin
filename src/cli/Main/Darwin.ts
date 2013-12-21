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
    // Hack: Cast to 'any' then back to 'string' go get TS to recognise as a string
    var browserScript = <string><any>this._fs.readFileSync(this._browserScriptPath, { encoding: 'utf8' });

    this._promptly.prompt('Enter a test description: ', (error: Error, value: string) => {
      this._fs.mkdirSync(value);

      var driver = this._webDriverBuilder
        .usingServer(this._seleniumServerUrl)
        .withCapabilities(this._capabilities)
        .build();

      driver.manage()
        .window()
        .setSize(1280, 768)
        .then(() => {
          driver.get('http://localhost');
          driver.executeScript('(function() { '+ browserScript + ' bootstrap(); })();');
        });

      setInterval(() => {
        console.log('test');
      }, 100);
    });
  }
}

export = Darwin;