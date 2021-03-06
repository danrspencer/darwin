
import fs = require('fs');
import webdriver = require('selenium-webdriver');

import ITest = require('../../common/Test/ITest');
import ISuite = require('../Main/ISuite');

import TestRunner = require('./TestRunner');

class Playback {

  constructor(private _fs: typeof fs,
              private _testRunner: TestRunner) {

  }

  public play(suiteInfo: ISuite) {
    var filenames = this._fs.readdirSync('./');

    filenames.forEach((filename) => {
      var fileStat = this._fs.statSync('./' + filename);

      if (fileStat.isDirectory()) {
        this._runTest(suiteInfo, filename);
      }
    });
  }

  private _runTest(suiteInfo: ISuite, testName: string) {
    this._fs.readFile(
      './' + testName + '/test.json',
      { encoding: 'utf8' },
      (error, content: string) => { this._startSession(suiteInfo, testName, content); }
    );
  }

  private _startSession(suiteInfo: ISuite, testName: string, json: string) {
    try {
      var test: ITest = JSON.parse(json);
    } catch (error) {

    }

    this._testRunner.run(suiteInfo, testName, test);
  }

}

export = Playback;