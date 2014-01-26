
import fs = require('fs');
import webdriver = require('selenium-webdriver');

import IAction = require('../../common/Action/IAction');
import ISuite = require('../Main/ISuite');

import TestRunner = require('./Playback/TestRunner');

class Playback {

  constructor(private _fs: typeof fs,
              private _testRunner: TestRunner) {

  }

  public play(suiteInfo: ISuite) {
    var filenames = this._fs.readdirSync('./');

    filenames.forEach((filename) => {
      var fileStat = this._fs.statSync('./' + filename)

      if (fileStat.isDirectory()) {
        this._runTest(suiteInfo, filename);
      }
    });
  }

  private _runTest(suiteInfo: ISuite, filename: string) {
    this._fs.readFile(
      './' + filename + '/actions.json',
      { encoding: 'utf8' },
      (error, content: string) => { this._startSession(suiteInfo, content) }
    );
  }

  private _startSession(suiteInfo: ISuite, actionsJson: string) {
    try {
      var actions = JSON.parse(actionsJson);
    } catch (error) {

    }

    this._testRunner.run(suiteInfo, actions);
  }

}

export = Playback;