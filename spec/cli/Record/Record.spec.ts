/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import fs = require('fs');
import webdriver = require('selenium-webdriver');

import ActionType = require('../../../src/common/Test/ActionType');
import ISuite = require('../../../src/cli/Main/ISuite');

import Record = require('../../../src/cli/Record/Record');
import BrowserSync = require('../../../src/cli/Record/BrowserSync');
import TestWriter = require('../../../src/cli/Record/TestWriter');
import Browser = require('../../../src/cli/Selenium/Browser');

describe('Record', () => {

  var _fs: typeof fs;

  var _browser: Browser;
  var _browserSync: BrowserSync;
  var _testWriter: TestWriter;

  var driver: webdriver.Driver;
  var manage: webdriver.Manage;
  var timeouts: webdriver.Timeouts;

  var suiteStub: ISuite;

  var record: Record;

  beforeEach(() => {
    _fs = jasmine.createSpyObj<typeof fs>('fs', ['readFileSync', 'writeFileSync']);

    _browser = jasmine.createSpyObj<Browser>('browser', ['start']);
    setSpy(_browser.start).toCallFake((url, height, width, callback) => {
      callback(driver);
    });

    _browserSync = jasmine.createSpyObj<BrowserSync>('browserSync', ['start']);

    _testWriter = jasmine.createSpyObj<TestWriter>('testWritter', ['save']);

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
      _fs,
      _browser,
      _browserSync,
      _testWriter,
      'browserScript.js'
    );
  });

  it('delegates to session to start a selenium session', () => {
    record.start('', suiteStub);

    expect(_browser.start).toHaveBeenCalledWith('www.google.co.uk', 1280, 768, jasmine.any(Function));
  });

  it('delegates to fs to load the browser script', () => {
    record.start('', suiteStub);

    expect(_fs.readFileSync).toHaveBeenCalledWith('browserScript.js', { encoding: 'utf8' });
  });

  it('injects the browser script', () => {
    setSpy(_fs.readFileSync).toReturn('function bootstrap() {}');

    record.start('', suiteStub);

    expect(driver.executeScript).toHaveBeenCalledWith('(function() { function bootstrap() {} }());');
  });

  it('increases the selenium timeout', () => {
    record.start('', suiteStub);

    expect(timeouts.setScriptTimeout).toHaveBeenCalledWith(60*1000);
  });

  it('delegates to BrowserSync once the session has started', () => {
    record.start('test name', suiteStub);

    expect(_browserSync.start).toHaveBeenCalledWith(driver, 'test name', jasmine.any(Function));
  });

  it('delegates to TestWritter to save the test', () => {
    var actions = [
      { type: ActionType.LEFTCLICK },
      { type: ActionType.KEYPRESS },
      { type: ActionType.RIGHTCLICK }
    ];

    setSpy(_browserSync.start).toCallFake((driver, testName, done) => {
      done(actions);
    });

    record.start('testing something', suiteStub);

    expect(_testWriter.save).toHaveBeenCalledWith('testing something', actions);
  });
});