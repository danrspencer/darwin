/// <reference path="../ref.d.ts" />

import fs = require('fs');
import promptly = require('promptly');
import webdriver = require('selenium-webdriver');

import Record = require('../Selenium/Record')

class Darwin {

  constructor(private _fs: typeof fs,
              private _promptly: typeof promptly,
              private _record: Record,
              private _browserScriptPath: string) {

  }

  public init() {
    // Hack: Cast to 'any' then back to 'string' to get TS to recognise as a string
    var browserScript = <string><any>this._fs.readFileSync(this._browserScriptPath, { encoding: 'utf8' });

    this._promptly.prompt('Enter a test description: ', (error: Error, value: string) => {
      //this._fs.mkdirSync(value);

      this._record.start(browserScript);
    });
  }
}

export = Darwin;





