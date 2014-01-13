/// <reference path="../ref.d.ts" />

import fs = require('fs');
import promptly = require('promptly');
import webdriver = require('selenium-webdriver');

import IAction = require('../../common/Action/IAction');
import ISuite = require('ISuite');

import Playback = require('../Selenium/Playback');
import Record = require('../Selenium/Record');

class Darwin {

  constructor(private _fs: typeof fs,
              private _promptly: typeof promptly,
              private _record: Record,
              private _playback: Playback) {

  }

  // TODO - Create init that downloads selenium, etc..
  // Should auto start selenium server

  public init() {
    this._promptly.prompt('Enter the url under test: ', (error: Error, value: string) => {

      var suite: ISuite = {
        browserSize: {
          width: 1280,
          height: 768
        },
        url: value
      }

      this._fs.writeFileSync('suite.json', JSON.stringify(suite, null, 2));
    });
  }

  public new() {
    this._promptly.prompt('Enter a test description: ', (error: Error, description: string) => {
      var suite = this._getSuite();

      this._fs.mkdirSync(description);

      this._record.start(description, suite);
    });
  }

  public run() {

    var suite = this._getSuite();

    this._playback.play(suite);
  }

  private _getSuite(): ISuite {

    var suiteString = <string><any>this._fs.readFileSync('suite.json', { encoding: 'utf8' });
    var suite: ISuite = <ISuite>JSON.parse(suiteString);

    return suite;
  }

}

export = Darwin;





