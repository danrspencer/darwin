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
    driverSpy = jasmine.createSpyObj<webdriver.Driver>('driverSpy', ['takeScreenshot']);
    fsSpy = jasmine.createSpyObj<typeof fs>('fsSpy', ['writeFileSync'])

    screenshot = new Screenshot();
  });

  it('captures a screenshot with selenium', () => {
    screenshot.captureAndSave(driverSpy, '', () => {});

    expect(driverSpy.takeScreenshot).toHaveBeenCalled();
  });

//  it('writes the screenshot to disk', () =>{
//    screenshot.captureAndSave(driverSpy, 'image1.png', () => {});
//
//    expect(fsSpy.writeFileSync).toHaveBeenCalledWith('image1.png');
//  });

});