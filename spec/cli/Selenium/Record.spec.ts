/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import fs = require('fs');
import webdriver = require('selenium-webdriver');

import ActionType = require('../../../src/common/Action/ActionType');
import ISuite = require('../../../src/cli/Main/ISuite');

import Record = require('../../../src/cli/Selenium/Record');
import Session = require('../../../src/cli/Selenium/Session');
import Screenshot = require('../../../src/cli/Selenium/Screenshot');

describe('Record', () => {

  var fsSpy: typeof fs;

  var sessionSpy: Session;
  var screenshotSpy: Screenshot;

  var driverSpy: webdriver.Driver;
  var manageSpy: webdriver.Manage;
  var timeoutsSpy: webdriver.Timeouts;

  var suiteStub: ISuite;

  var record: Record;

  beforeEach(() => {
    fsSpy = jasmine.createSpyObj<typeof fs>('fsSpy', ['readFileSync', 'writeFileSync']);

    sessionSpy = jasmine.createSpyObj<Session>('sessionSpy', ['start']);
    setSpy(sessionSpy.start).toCallFake((url, height, width, callback) => {
      callback(driverSpy);
    });

    screenshotSpy = jasmine.createSpyObj<Screenshot>('screenshotSpy', ['captureAndSave']);

    driverSpy = jasmine.createSpyObj<webdriver.Driver>('driverSpy', ['manage', 'get', 'executeScript', 'executeAsyncScript', 'then', 'takeScreenshot']);
    manageSpy = jasmine.createSpyObj<webdriver.Manage>('manageSpy', ['window', 'timeouts']);
    timeoutsSpy = jasmine.createSpyObj<webdriver.Timeouts>('timeoutsSpy', ['setScriptTimeout']);

    setSpy(driverSpy.manage).toReturn(manageSpy);
    setSpy(driverSpy.executeAsyncScript).toReturn(driverSpy);
    setSpy(driverSpy.takeScreenshot).toReturn(driverSpy);

    setSpy(manageSpy.timeouts).toReturn(timeoutsSpy);

    suiteStub = {
      browserSize: {
        width: 1280,
        height: 768
      },
      url: 'www.google.co.uk'
    };

    record = new Record(
      fsSpy,
      sessionSpy,
      screenshotSpy,
      'browserScript.js'
    );
  });

  it('delegates to session to start a selenium session', () => {
    record.start('', suiteStub);

    expect(sessionSpy.start).toHaveBeenCalledWith('www.google.co.uk', 1280, 768, jasmine.any(Function));
  });

  it('delegates to fs to load the browser script', () => {
    record.start('', suiteStub);

    expect(fsSpy.readFileSync).toHaveBeenCalledWith('browserScript.js', { encoding: 'utf8' });
  });

  it('injects the browser script', () => {
    setSpy(fsSpy.readFileSync).toReturn('function bootstrap() {}');

    record.start('', suiteStub);

    expect(driverSpy.executeScript).toHaveBeenCalledWith('(function() { function bootstrap() {} }());');
  });

  it('increases the selenium timeout', () => {
    record.start('', suiteStub);

    expect(timeoutsSpy.setScriptTimeout).toHaveBeenCalledWith(60*1000);
  });

  it('sets up the browser callback', () => {
    record.start('', suiteStub);

    expect(driverSpy.executeAsyncScript).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('rebinds the browser callback after each callback', () => {
    record.start('', suiteStub);

    for(var n = 0; n < 10; n++) {
      var callback = spyOf(driverSpy.then).argsForCall[n][0];

      callback({ type: ActionType.LEFTCLICK });
    }

    expect(spyOf(driverSpy.executeAsyncScript).callCount).toEqual(11);
  });

  it('takes a screenshot on a screenshot action', () => {
    record.start('testing something', suiteStub);

    var callback = spyOf(driverSpy.then).argsForCall[0][0];

    callback({ type: ActionType.SCREENSHOT });

    expect(screenshotSpy.captureAndSave).toHaveBeenCalledWith(driverSpy, 'testing something/image.png', jasmine.any(Function));
  });

  it('doesn\'t take a screenshot when the browser calback isn\'t a screenshot event', () => {
    record.start('', suiteStub);

    var callback = spyOf(driverSpy.then).argsForCall[0][0];

    callback({ type: ActionType.LEFTCLICK });

    expect(spyOf(screenshotSpy.captureAndSave).callCount).toEqual(0);
  });

  it('doesn\'t rebind the browser callback until the screenshot has been taken', () => {
    record.start('', suiteStub);

    var callback = spyOf(driverSpy.then).argsForCall[0][0];
    callback({ type: ActionType.SCREENSHOT });

    expect(spyOf(driverSpy.executeAsyncScript).callCount).toEqual(1);

    var screenshotCallback = spyOf(screenshotSpy.captureAndSave).argsForCall[0][2];
    screenshotCallback();

    expect(spyOf(driverSpy.executeAsyncScript).callCount).toEqual(2);
  });

  it('save\'s the actions to a file when the result of the callback is null', () => {
    var expectedResult = [
      { type: ActionType.LEFTCLICK },
      { type: ActionType.KEYPRESS },
      { type: ActionType.RIGHTCLICK }
    ]

    record.start('testing something', suiteStub);

    for(var n = 0; n < 3; n++) {
      var callback = spyOf(driverSpy.then).argsForCall[n][0];
      callback(expectedResult[n]);
    }

    var callback = spyOf(driverSpy.then).argsForCall[n][0];
    callback(null);

    expect(fsSpy.writeFileSync).toHaveBeenCalledWith('testing something/actions.json', JSON.stringify(expectedResult, null, 2));
  });
});