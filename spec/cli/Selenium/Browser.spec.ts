/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import fs = require('fs');
import webdriver = require('selenium-webdriver');

import Browser = require('../../../src/cli/Selenium/Browser');


describe('Browser', () => {

  var fsSpy: typeof fs;

  var builderSpy: webdriver.Builder;
  var driverSpy: webdriver.Driver;
  var manageSpy: webdriver.Manage;
  var windowSpy: webdriver.Window
  var timeoutsSpy: webdriver.Timeouts;

  var capabilitiesDummy: any;

  var browser: Browser;

  beforeEach(() => {
    fsSpy = jasmine.createSpyObj<typeof fs>('fsSpy', ['writeFileSync']);

    builderSpy = jasmine.createSpyObj<webdriver.Builder>('builderSpy', ['usingServer', 'withCapabilities', 'build']);
    driverSpy = jasmine.createSpyObj<webdriver.Driver>('driverSpy', ['manage', 'get', 'executeScript', 'executeAsyncScript', 'then', 'takeScreenshot']);
    manageSpy = jasmine.createSpyObj<webdriver.Manage>('manageSpy', ['window', 'timeouts']);
    windowSpy = jasmine.createSpyObj<webdriver.Window>('windowSpy', ['setSize', 'then']);

    setSpy(builderSpy.usingServer).toReturn(builderSpy);
    setSpy(builderSpy.withCapabilities).toReturn(builderSpy);
    setSpy(builderSpy.build).toReturn(driverSpy);

    setSpy(driverSpy.manage).toReturn(manageSpy);
    setSpy(driverSpy.executeAsyncScript).toReturn(driverSpy);

    setSpy(manageSpy.window).toReturn(windowSpy);

    setSpy(windowSpy.setSize).toReturn(windowSpy);
    setSpy(windowSpy.then).toCallFake((callback: Function) => {
      callback();
    });

    capabilitiesDummy = { capabilities:"dummy" };

    browser = new Browser(
      builderSpy,
      'http://serverUrl',
      capabilitiesDummy
    );
  });

  it('creates a webdriver', () => {
    browser.start('', 0, 0, () => {});

    expect(builderSpy.usingServer).toHaveBeenCalledWith('http://serverUrl');
    expect(builderSpy.withCapabilities).toHaveBeenCalledWith(capabilitiesDummy);
    expect(builderSpy.build).toHaveBeenCalled();
  });

  it('sets the browser up with the given values', () => {
    browser.start('', 1280, 768, () => {});

    expect(windowSpy.setSize).toHaveBeenCalledWith(1280, 768);
  });

  it('launches the browser with the given URL', () => {
    browser.start('www.google.co.uk', 0, 0, () => {});

    expect(driverSpy.get).toHaveBeenCalledWith('www.google.co.uk');
  });

  it('triggers the callback once the session has started', () => {
    var callbackSpy = jasmine.createSpy('callback');

    browser.start('', 0, 0, callbackSpy);

    expect(callbackSpy).toHaveBeenCalledWith(driverSpy);
  });
});