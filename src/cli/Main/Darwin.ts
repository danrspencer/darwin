/// <reference path="../ref.d.ts" />

import fs = require('fs');
import promptly = require('promptly');
import webdriver = require('selenium-webdriver');

import IAction = require('../../common/Action/IAction');

import Record = require('../Selenium/Record')

class Darwin {

  constructor(private _fs: typeof fs,
              private _promptly: typeof promptly,
              private _record: Record) {

  }

  // TODO - Create init that downloads selenium, etc..
  // Should auto start selenium server

  public new() {
    this._promptly.prompt('Enter a test description: ', (error: Error, value: string) => {
      this._fs.mkdirSync(value);

      this._record.start(value);
    });
  }
}

export = Darwin;





