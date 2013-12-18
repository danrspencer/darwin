/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import Darwin = require('../../../src/cli/Main/Darwin');

import fs = require('fs');
import promptly = require('promptly');
import webdriver = require('selenium-webdriver');

describe('Darwin', () => {

  var promptlySpy: typeof promptly;
  var fsSpy: typeof fs;
  var builderSpy: webdriver.Builder;
  var driverSpy: webdriver.Driver;
  var manageSpy: webdriver.Manage;
  var windowSpy: webdriver.Window;

  var capabilitiesDummy: any;

  var darwin: Darwin;

  beforeEach(() => {
    promptlySpy = jasmine.createSpyObj<typeof promptly>('promptlySpy', ['prompt']);
    fsSpy = jasmine.createSpyObj<typeof fs>('fsSpy', ['mkdirSync', 'readFileSync']);
    builderSpy = jasmine.createSpyObj<webdriver.Builder>('builderSpy', ['usingServer', 'withCapabilities', 'build']);
    driverSpy = jasmine.createSpyObj<webdriver.Driver>('driverSpy', ['manage', 'get', 'executeScript']);
    manageSpy = jasmine.createSpyObj<webdriver.Manage>('manageSpy', ['window']);
    windowSpy = jasmine.createSpyObj<webdriver.Window>('windowSpy', ['setSize', 'then']);

    setSpy(promptlySpy.prompt).toCallFake((value: string, callback: Function) => {
      callback(null, 'test desc');
    });

    setSpy(builderSpy.usingServer).toReturn(builderSpy);
    setSpy(builderSpy.withCapabilities).toReturn(builderSpy);
    setSpy(builderSpy.build).toReturn(driverSpy);

    setSpy(driverSpy.manage).toReturn(manageSpy);
    setSpy(manageSpy.window).toReturn(windowSpy);
    setSpy(windowSpy.setSize).toReturn(windowSpy);
    setSpy(windowSpy.then).toCallFake((callback: Function) => {
      callback();
    });

    capabilitiesDummy = { capabilities:"dummy" };

    darwin = new Darwin(
      fsSpy,
      promptlySpy,
      builderSpy,
      'browserScript.js',
      'http://serverUrl',
      capabilitiesDummy
    );
  });

  it('delegates to promptly to prompt the user to enter the test description', () => {
    darwin.init();

    expect(promptlySpy.prompt).toHaveBeenCalledWith('Enter a test description: ', jasmine.any(Function));
  });

  it('delegates to fs to create a directory named after the test', () => {
    darwin.init();

    expect(fsSpy.mkdirSync).toHaveBeenCalledWith('test desc');
  });

  it('delegates to fs to load the browser script', () => {
    darwin.init();

    expect(fsSpy.readFileSync).toHaveBeenCalledWith('browserScript.js', { encoding: 'utf8' });
  });

  it('delegates to webdriver.builder to create a webdriver', () => {
    darwin.init();

    expect(builderSpy.usingServer).toHaveBeenCalledWith('http://serverUrl');
    expect(builderSpy.withCapabilities).toHaveBeenCalledWith(capabilitiesDummy);
    expect(builderSpy.build).toHaveBeenCalled();
  });

  it('delegates to webdriver.window to setup the browser', () => {
    darwin.init();

    expect(windowSpy.setSize).toHaveBeenCalledWith(1280, 768);
    expect(windowSpy.then).toHaveBeenCalledWith(jasmine.any(Function));
  });

  it('delegates to webdriver.driver to launch the browser', () => {
    darwin.init();

    expect(driverSpy.get).toHaveBeenCalledWith('http://localhost');
  });

  it('delegates to webdriver.driver to inject the browser script', () => {
    setSpy(fsSpy.readFileSync).toReturn('fake script content to be injected');

    darwin.init();

    expect(driverSpy.executeScript).toHaveBeenCalledWith('fake script content to be injected');
  });

});