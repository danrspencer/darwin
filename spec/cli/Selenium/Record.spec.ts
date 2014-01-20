/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import fs = require('fs');
import webdriver = require('selenium-webdriver');

import ActionType = require('../../../src/common/Action/ActionType');
import ISuite = require('../../../src/cli/Main/ISuite');

import Record = require('../../../src/cli/Selenium/Record');
import Session = require('../../../src/cli/Selenium/Session');
import BrowserSync = require('../../../src/cli/Selenium/Record/BrowserSync');

describe('Record', () => {

  var filesystem: typeof fs;

  var session: Session;
  var browserSync: BrowserSync;

  var driver: webdriver.Driver;
  var manage: webdriver.Manage;
  var timeouts: webdriver.Timeouts;

  var suiteStub: ISuite;

  var record: Record;

  beforeEach(() => {
    filesystem = jasmine.createSpyObj<typeof fs>('fs', ['readFileSync', 'writeFileSync']);

    session = jasmine.createSpyObj<Session>('session', ['start']);
    setSpy(session.start).toCallFake((url, height, width, callback) => {
      callback(driver);
    });

    browserSync = jasmine.createSpyObj<BrowserSync>('browserSync', ['start']);

    driver = jasmine.createSpyObj<webdriver.Driver>('driver', ['manage', 'get', 'executeScript', 'executeAsyncScript', 'then', 'takeScreenshot']);
    manage = jasmine.createSpyObj<webdriver.Manage>('manage', ['window', 'timeouts']);
    timeouts = jasmine.createSpyObj<webdriver.Timeouts>('timeouts', ['setScriptTimeout']);

    setSpy(driver.manage).toReturn(manage);
    setSpy(driver.executeAsyncScript).toReturn(driver);
    setSpy(driver.takeScreenshot).toReturn(driver);

    setSpy(manage.timeouts).toReturn(timeouts);

    suiteStub = {
      browserSize: {
        width: 1280,
        height: 768
      },
      url: 'www.google.co.uk'
    };

    record = new Record(
      filesystem,
      session,
      browserSync,
      'browserScript.js'
    );
  });

  it('delegates to session to start a selenium session', () => {
    record.start('', suiteStub);

    expect(session.start).toHaveBeenCalledWith('www.google.co.uk', 1280, 768, jasmine.any(Function));
  });

  it('delegates to fs to load the browser script', () => {
    record.start('', suiteStub);

    expect(filesystem.readFileSync).toHaveBeenCalledWith('browserScript.js', { encoding: 'utf8' });
  });

  it('injects the browser script', () => {
    setSpy(filesystem.readFileSync).toReturn('function bootstrap() {}');

    record.start('', suiteStub);

    expect(driver.executeScript).toHaveBeenCalledWith('(function() { function bootstrap() {} }());');
  });

  it('increases the selenium timeout', () => {
    record.start('', suiteStub);

    expect(timeouts.setScriptTimeout).toHaveBeenCalledWith(60*1000);
  });

  it('delegates to BrowserSync once the session has started', () => {
    record.start('test name', suiteStub);

    expect(browserSync.start).toHaveBeenCalledWith(driver, 'test name', jasmine.any(Function));
  });

  it('save\'s the actions to a file when the result of the callback is null', () => {
    var expectedResult = [
      { type: ActionType.LEFTCLICK },
      { type: ActionType.KEYPRESS },
      { type: ActionType.RIGHTCLICK }
    ]

    setSpy(browserSync.start).toCallFake((driver, testName, done) => {
      done(expectedResult);
    });

    record.start('testing something', suiteStub);

    expect(filesystem.writeFileSync).toHaveBeenCalledWith('testing something/actions.json', JSON.stringify(expectedResult, null, 2));
  });
});