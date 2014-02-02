/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import fs = require('fs');
import webdriver = require('selenium-webdriver');

import Screenshot = require('../../../src/cli/Image/Screenshot');

describe('Screenshot', () => {

  var screenshot: Screenshot;

  var driver: webdriver.Driver;
  var fsSpy: typeof fs;

  beforeEach(() => {
    driver = jasmine.createSpyObj<webdriver.Driver>('driver', ['takeScreenshot', 'then']);
    fsSpy = jasmine.createSpyObj<typeof fs>('fsSpy', ['writeFileSync']);

    setSpy(driver.takeScreenshot).toReturn(driver);

    screenshot = new Screenshot(fsSpy, driver);
  });

  it('captures a screenshot with selenium', () => {
    screenshot.take('', () => {});

    expect(driver.takeScreenshot).toHaveBeenCalled();
  });

  it('writes the screenshot to disk', () =>{
    setSpy(driver.then).toCallFake((callback) => {
      callback('fakeImageData');
    });

    var expectedBuffer = (new Buffer('fakeImageData', 'base64')).toString();

    screenshot.take('image1.png', () => {});

    expect(fsSpy.writeFileSync).toHaveBeenCalledWith('image1.png', jasmine.any(Buffer));
    expect(spyOf(fsSpy.writeFileSync).argsForCall[0][1].toString()).toEqual(expectedBuffer);
  });

  it('triggers the callback after the file is written', () => {
    var callbackSpy = jasmine.createSpy('callbackSpy');

    setSpy(driver.then).toCallFake((callback) => {
      callback('fakeImageData');
    });

    screenshot.take('', callbackSpy);

    expect(callbackSpy).toHaveBeenCalled();
  });

});