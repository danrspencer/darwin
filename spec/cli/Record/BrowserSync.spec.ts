/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import fs = require('fs');
import webdriver = require('selenium-webdriver');

import ActionType = require('../../../src/common/Test/ActionType');
import ISuite = require('../../../src/cli/Main/ISuite');

import BrowserSync = require('../../../src/cli/Record/BrowserSync');
import Session = require('../../../src/cli/Selenium/Browser');
import Screenshot = require('../../../src/cli/Selenium/Screenshot');

describe('BrowserSync', () => {

  var driver: webdriver.Driver;
  var screenshot: Screenshot;

  var browserSync: BrowserSync;

  beforeEach(() => {
    jasmine.Clock.useMock();

    driver = jasmine.createSpyObj<webdriver.Driver>('driver', ['executeScript', 'then']);
    setSpy(driver.then).toCallFake((handler) => { handler(); });

    screenshot = jasmine.createSpyObj<Screenshot>('Screenshot', ['captureAndSave']);
    setSpy(screenshot.captureAndSave).toCallFake((driver, testName, done) => { done(); });

    setSpy(driver.executeScript).toReturn(driver);

    browserSync = new BrowserSync(screenshot);
  });

  it('injects a script to get the Darwin window object', () => {
    browserSync.start(driver, '', () => {});

    jasmine.Clock.tick(1000);
    expect(driver.executeScript).toHaveBeenCalledWith('return window.__darwin.poll();');
  });

  it('gets the Darwin window object every 200ms', () => {
    browserSync.start(driver, '', () => {});

    jasmine.Clock.tick(1000);
    expect(spyOf(driver.executeScript).callCount).toEqual(5);

    jasmine.Clock.tick(1000);
    expect(spyOf(driver.executeScript).callCount).toEqual(10);
  });

  it('calls the done callback with the recorded actions on a Driver error', () => {
    var done = jasmine.createSpy('done');
    var darwinObject = { actions: [ { a1: '1', a2: '2'} ] };

    setSpy(driver.then).toCallFake((handler) => { handler(darwinObject); });

    browserSync.start(driver, '', done);

    jasmine.Clock.tick(1000);
    setSpy(driver.then).toCallFake((handler, error) => { error(); });
    jasmine.Clock.tick(1000);

    expect(done).toHaveBeenCalledWith(darwinObject.actions);
  });

  it('calls the done callback with the recorded actions on a Null poll result', () => {
    var done = jasmine.createSpy('done');
    var darwinObject = { actions: [ { a1: '1', a2: '2'} ] };

    browserSync.start(driver, '', done);

    setSpy(driver.then).toCallFake((handler) => { handler(darwinObject); });
    jasmine.Clock.tick(1000);
    setSpy(driver.then).toCallFake((handler) => { handler(null); });
    jasmine.Clock.tick(1000);

    expect(done).toHaveBeenCalledWith(darwinObject.actions);
  });

  it('doesn\'t throw an exception on a Null poll result', () => {
    var done = jasmine.createSpy('done');

    browserSync.start(driver, '', done);

    setSpy(driver.then).toCallFake((handler) => { handler(null); });
    jasmine.Clock.tick(1000);

    // Need to figure out how to test this...
  });

  it('calls the done callback with the latest actions', () => {
    var done = jasmine.createSpy('done');
    var darwinObject = { actions: [ { a1: '1', a2: '2'} ]  };
    var darwinObject2 = { actions: [ { a1: '1', a2: '2', a3: '3'} ] };

    browserSync.start(driver, '', done);

    setSpy(driver.then).toCallFake((handler) => { handler(darwinObject); });
    jasmine.Clock.tick(1000);
    setSpy(driver.then).toCallFake((handler) => { handler(darwinObject2); });
    jasmine.Clock.tick(200);
    setSpy(driver.then).toCallFake((handler, error) => { error(); });
    jasmine.Clock.tick(1000);

    expect(done).toHaveBeenCalledWith(darwinObject2.actions);
  });

  it('delegates to Screenshot if the screenShot pending value is true', () => {
    browserSync.start(driver, 'testing something', () => {});

    setSpy(driver.then).toCallFake((handler) => { handler({ pendingScreenshot: true }); });
    jasmine.Clock.tick(200);

    expect(screenshot.captureAndSave).toHaveBeenCalledWith(driver, 'testing something/1_expected.png', jasmine.any(Function));
  });

  it('uses ascending numeric count as image name for screenshot',  () => {
    browserSync.start(driver, 'testing something', () => {});

    setSpy(driver.then).toCallFake((handler) => { handler({ pendingScreenshot: true }); });
    jasmine.Clock.tick(600);

    expect(screenshot.captureAndSave).toHaveBeenCalledWith(driver, 'testing something/1_expected.png', jasmine.any(Function));
    expect(screenshot.captureAndSave).toHaveBeenCalledWith(driver, 'testing something/2_expected.png', jasmine.any(Function));
    expect(screenshot.captureAndSave).toHaveBeenCalledWith(driver, 'testing something/3_expected.png', jasmine.any(Function));
  });

  it('doesn\'t rebind the browser callback until the screenshot has been taken', () => {
    // Disable the callback from captureAndSave
    setSpy(screenshot.captureAndSave).toReturn(null);

    browserSync.start(driver, '', () => {});

    jasmine.Clock.tick(1000);
    setSpy(driver.then).toCallFake((handler) => { handler({ pendingScreenshot: true }); });
    jasmine.Clock.tick(1000);

    expect(spyOf(driver.executeScript).callCount).toEqual(6);
  });

  it('stops calling executeScript after a driver error', () => {

    browserSync.start(driver, '', () => {});

    jasmine.Clock.tick(1000);
    setSpy(driver.then).toCallFake((handler, error) => { error(); });
    jasmine.Clock.tick(1000);

    expect(spyOf(driver.executeScript).callCount).toEqual(6);
  });

});