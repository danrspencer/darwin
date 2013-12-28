/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import Darwin = require('../../../src/cli/Main/Darwin');
import Record = require('../../../src/cli/Selenium/Record');

import fs = require('fs');
import promptly = require('promptly');
import webdriver = require('selenium-webdriver');

describe('Darwin', () => {

  var promptlySpy: typeof promptly;
  var fsSpy: typeof fs;
  var recordSpy: Record;

  var darwin: Darwin;

  beforeEach(() => {
    promptlySpy = jasmine.createSpyObj<typeof promptly>('promptlySpy', ['prompt']);
    fsSpy = jasmine.createSpyObj<typeof fs>('fsSpy', ['mkdirSync', 'readFileSync']);
    recordSpy = jasmine.createSpyObj<Record>('recordSpy', ['start', 'onAction']);

    darwin = new Darwin(
      fsSpy,
      promptlySpy,
      recordSpy
    );
  });

  it('delegates to promptly to prompt the user to enter the test description', () => {
    darwin.init();

    expect(promptlySpy.prompt).toHaveBeenCalledWith('Enter a test description: ', jasmine.any(Function));
  });

  it('delegates to fs to create a directory named after the test', () => {
    setSpy(promptlySpy.prompt).toCallFake((value: string, callback: Function) => {
      callback(null, 'test desc');
    });

    darwin.init();

    expect(fsSpy.mkdirSync).toHaveBeenCalledWith('test desc');
  });

  it('delegates to selenium.record to start the browser', () => {
    setSpy(promptlySpy.prompt).toCallFake((value: string, callback: Function) => {
      callback(null, 'test desc');
    });

    darwin.init();

    expect(recordSpy.start).toHaveBeenCalledWith('test desc');
  });

  it('doesn\'t start selenium until the test name has been entered', () => {
    darwin.init();

    expect(spyOf(recordSpy.start).callCount).toEqual(0);
  });

});