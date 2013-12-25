/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import fs = require('fs');
import webdriver = require('selenium-webdriver');

import Record = require('../../../src/cli/Selenium/Record');
import Session = require('../../../src/cli/Selenium/Session');

import ActionType = require('../../../src/common/Action/ActionType');

describe('Record', () => {

  var fsSpy: typeof fs;

  var sessionSpy: Session;

  var driverSpy: webdriver.Driver;
  var manageSpy: webdriver.Manage;
  var windowSpy: webdriver.Window
  var timeoutsSpy: webdriver.Timeouts;

  var capabilitiesDummy: any;

  var record: Record;

  beforeEach(() => {
    fsSpy = jasmine.createSpyObj<typeof fs>('fsSpy', ['readFileSync', 'writeFileSync']);

    sessionSpy = jasmine.createSpyObj<Session>('sessionSpy', ['start']);
    setSpy(sessionSpy.start).toCallFake((callback) => {
      callback(driverSpy);
    });

    driverSpy = jasmine.createSpyObj<webdriver.Driver>('driverSpy', ['manage', 'get', 'executeScript', 'executeAsyncScript', 'then', 'takeScreenshot']);
    manageSpy = jasmine.createSpyObj<webdriver.Manage>('manageSpy', ['window', 'timeouts']);
    timeoutsSpy = jasmine.createSpyObj<webdriver.Timeouts>('timeoutsSpy', ['setScriptTimeout']);

    setSpy(driverSpy.manage).toReturn(manageSpy);
    setSpy(driverSpy.executeAsyncScript).toReturn(driverSpy);
    setSpy(driverSpy.takeScreenshot).toReturn(driverSpy);

    setSpy(manageSpy.timeouts).toReturn(timeoutsSpy);

    record = new Record(
      fsSpy,
      sessionSpy,
      'browserScript.js'
    );
  });

  it('delegates to session to start a selenium session', () => {
    record.start();

    expect(sessionSpy.start).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('delegates to fs to load the browser script', () => {
    record.start();

    expect(fsSpy.readFileSync).toHaveBeenCalledWith('browserScript.js', { encoding: 'utf8' });
  });

  it('injects the browser script', () => {
    setSpy(fsSpy.readFileSync).toReturn('function bootstrap() {}');

    record.start();

    expect(driverSpy.executeScript).toHaveBeenCalledWith('(function() { function bootstrap() {} }());');
  });

  it('increases the selenium timeout', () => {
    record.start();

    expect(timeoutsSpy.setScriptTimeout).toHaveBeenCalledWith(60*1000);
  });

  it('sets up the browser callback', () => {
    record.start();

    expect(driverSpy.executeAsyncScript).toHaveBeenCalledWith(jasmine.any(Function));
    expect(driverSpy.then).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('rebinds the browser callback after each callback', () => {
    record.start('');

    for(var n = 0; n < 9; n++) {
      var callback = spyOf(driverSpy.then).argsForCall[n][0];

      callback({ type: ActionType.LEFTCLICK });
    }

    expect(spyOf(driverSpy.executeAsyncScript).callCount).toEqual(10);
    expect(spyOf(driverSpy.then).callCount).toEqual(10);
  });

  it('takes a screenshot when the browser callback contains a screenshot event', () => {
    record.start();

    var callback = spyOf(driverSpy.then).argsForCall[0][0];

    callback({ type: ActionType.SCREENSHOT });

    expect(driverSpy.takeScreenshot).toHaveBeenCalled();
  });

  it('doesn\'t take a screenshot when the browser calback isn\'t a screenshot event', () => {
    record.start();

    var callback = spyOf(driverSpy.then).argsForCall[0][0];

    callback({ type: ActionType.LEFTCLICK });

    expect(spyOf(driverSpy.takeScreenshot).callCount).toEqual(0);
  });
//
//  it('write the screenshot to disk', () => {
//    record.start('');
//
//    var callback = spyOf(driverSpy.then).argsForCall[0][0];
//    callback({ type: ActionType.SCREENSHOT });
//
//    expect(fsSpy.writeFileSync).toHaveBeenCalledWith()
//  });
});