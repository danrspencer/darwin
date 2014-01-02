
import fs = require('fs');
import webdriver = require('selenium-webdriver');

import ISuite = require('../Main/ISuite');

import Session = require('./Session');

class Playback {

  constructor(private _fs: typeof fs,
              private _session: Session) {

  }

  public play(suiteInfo: ISuite) {
    this._session.start(
      suiteInfo.url,
      suiteInfo.browserSize.width,
      suiteInfo.browserSize.height,
      (driver: webdriver.Driver) => {

      }
    );
  }

}

export = Playback;