/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import fs = require('fs');
import webdriver = require('selenium-webdriver');

import Screenshot = require('../../../src/cli/Selenium/Screenshot');

describe('Screenshot', () => {

  var screenshot: Screenshot;

  var driverSpy: webdriver.Driver;
  var fsSpy: typeof fs;

  beforeEach(() => {
    driverSpy = jasmine.createSpyObj<webdriver.Driver>('driverSpy', ['takeScreenshot', 'then']);
    fsSpy = jasmine.createSpyObj<typeof fs>('fsSpy', ['writeFileSync']);

    setSpy(driverSpy.takeScreenshot).toReturn(driverSpy);

    screenshot = new Screenshot(fsSpy);
  });

  it('captures a screenshot with selenium', () => {
    screenshot.captureAndSave(driverSpy, '', () => {});

    expect(driverSpy.takeScreenshot).toHaveBeenCalled();
  });

  it('writes the screenshot to disk', () =>{
    setSpy(driverSpy.then).toCallFake((callback) => {
      callback('fakeImageData');
    });

    var expectedBuffer = (new Buffer('fakeImageData', 'base64')).toString();

    screenshot.captureAndSave(driverSpy, 'image1.png', () => {});

    expect(fsSpy.writeFileSync).toHaveBeenCalledWith('image1.png', jasmine.any(Buffer));
    expect(spyOf(fsSpy.writeFileSync).argsForCall[0][1].toString()).toEqual(expectedBuffer);
  });

  it('triggers the callback after the file is written', () => {
    var callbackSpy = jasmine.createSpy('callbackSpy');

    setSpy(driverSpy.then).toCallFake((callback) => {
      callback('fakeImageData');
    });

    screenshot.captureAndSave(driverSpy, '', callbackSpy);

    expect(callbackSpy).toHaveBeenCalled();
  });

});