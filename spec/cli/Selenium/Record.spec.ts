/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import Record = require('../../../src/cli/Selenium/Record');

import webdriver = require('selenium-webdriver');

describe('Record', () => {

  var builderSpy: webdriver.Builder;
  var driverSpy: webdriver.Driver;
  var manageSpy: webdriver.Manage;
  var windowSpy: webdriver.Window
  var timeoutsSpy: webdriver.Timeouts;

  var capabilitiesDummy: any;

  var record: Record;

  beforeEach(() => {
    builderSpy = jasmine.createSpyObj<webdriver.Builder>('builderSpy', ['usingServer', 'withCapabilities', 'build']);
    driverSpy = jasmine.createSpyObj<webdriver.Driver>('driverSpy', ['manage', 'get', 'executeScript', 'executeAsyncScript', 'then']);
    manageSpy = jasmine.createSpyObj<webdriver.Manage>('manageSpy', ['window', 'timeouts']);
    windowSpy = jasmine.createSpyObj<webdriver.Window>('windowSpy', ['setSize', 'then']);
    timeoutsSpy = jasmine.createSpyObj<webdriver.Timeouts>('timeoutsSpy', ['setScriptTimeout']);

    setSpy(builderSpy.usingServer).toReturn(builderSpy);
    setSpy(builderSpy.withCapabilities).toReturn(builderSpy);
    setSpy(builderSpy.build).toReturn(driverSpy);

    setSpy(driverSpy.manage).toReturn(manageSpy);
    setSpy(driverSpy.executeAsyncScript).toReturn(driverSpy);

    setSpy(manageSpy.window).toReturn(windowSpy);
    setSpy(manageSpy.timeouts).toReturn(timeoutsSpy);

    setSpy(windowSpy.setSize).toReturn(windowSpy);
    setSpy(windowSpy.then).toCallFake((callback: Function) => {
      callback();
    });

    capabilitiesDummy = { capabilities:"dummy" };

    record = new Record(
      builderSpy,
      'http://serverUrl',
      capabilitiesDummy
    );
  });


  it('creates a webdriver', () => {
    record.start('');

    expect(builderSpy.usingServer).toHaveBeenCalledWith('http://serverUrl');
    expect(builderSpy.withCapabilities).toHaveBeenCalledWith(capabilitiesDummy);
    expect(builderSpy.build).toHaveBeenCalled();
  });

  it('sets the browser up', () => {
    record.start('');

    expect(windowSpy.setSize).toHaveBeenCalledWith(1280, 768);
    expect(windowSpy.then).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('launches the browser', () => {
    record.start('');

    expect(driverSpy.get).toHaveBeenCalledWith('http://localhost');
  });

  it('injects the browser script', () => {
    record.start('function bootstrap() {}');

    expect(driverSpy.executeScript).toHaveBeenCalledWith('(function() { function bootstrap() {} }());');
  });

  it('increase the selenium timeout', () => {
    record.start('');

    expect(timeoutsSpy.setScriptTimeout).toHaveBeenCalledWith(60*1000);
  });

  it('sets up an async browser script', () => {
    record.start('');

    expect(driverSpy.executeAsyncScript).toHaveBeenCalledWith(jasmine.any(Function));
    expect(driverSpy.then).toHaveBeenCalledWith(jasmine.any(Function));
  });

});