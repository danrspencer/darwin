
import fs = require('fs');
import webdriver = require('selenium-webdriver');

import IAction = require('../../common/Action/IAction');
import ISuite = require('../Main/ISuite');

import Robot = require('./Playback/Robot');
import Session = require('./Session');

class Playback {

  constructor(private _fs: typeof fs,
              private _robot: Robot,
              private _session: Session) {

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
    this._session.start(
      suiteInfo.url,
      suiteInfo.browserSize.width,
      suiteInfo.browserSize.height,
      (driver: webdriver.Driver) => {
        try {
          var actions = JSON.parse(actionsJson);
        } catch (error) {

        }

        this._robot.performActions(driver, actions);
      }
    );
  }

}

export = Playback;