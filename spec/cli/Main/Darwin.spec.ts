/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import Darwin = require('../../../src/cli/Main/Darwin');
import Playback = require('../../../src/cli/Playback/Playback');
import Record = require('../../../src/cli/Selenium/Record');

import ISuite = require('../../../src/cli/Main/ISuite');

import fs = require('fs');
import promptly = require('promptly');
import webdriver = require('selenium-webdriver');

describe('Darwin', () => {

  var promptlySpy: typeof promptly;
  var fsSpy: typeof fs;
  var recordSpy: Record;
  var playbackSpy: Playback;

  var darwin: Darwin;

  beforeEach(() => {
    promptlySpy = jasmine.createSpyObj<typeof promptly>('promptlySpy', ['prompt']);
    fsSpy = jasmine.createSpyObj<typeof fs>('fsSpy', ['mkdirSync', 'writeFileSync', 'readFileSync']);
    recordSpy = jasmine.createSpyObj<Record>('recordSpy', ['start', 'onAction']);
    playbackSpy = jasmine.createSpyObj<Playback>('playbackSpy', ['play']);

    setSpy(fsSpy.readFileSync).toReturn(JSON.stringify( { test: 'suite' }));

    darwin = new Darwin(
      fsSpy,
      promptlySpy,
      recordSpy,
      playbackSpy
    );
  });

  it('prompts the user to enter the url under test', () => {
    darwin.init();

    expect(promptlySpy.prompt).toHaveBeenCalledWith('Enter the url under test: ', jasmine.any(Function));
  });

  it('writes the suite.json with the suite information', () => {
    setSpy(promptlySpy.prompt).toCallFake((value: string, callback: Function) => {
      callback(null, 'www.google.co.uk');
    });

    darwin.init();

    var expectedSuite: ISuite = {
      browserSize: {
        width: 1280,
        height: 768
      },
      url: 'www.google.co.uk'
    };

    expect(fsSpy.writeFileSync).toHaveBeenCalledWith('suite.json', JSON.stringify(expectedSuite, null, 2));
  });

  it('prompts the user to enter the test description', () => {
    darwin.new();

    expect(promptlySpy.prompt).toHaveBeenCalledWith('Enter a test description: ', jasmine.any(Function));
  });

  it('creates a directory named after the test', () => {
    setSpy(promptlySpy.prompt).toCallFake((value: string, callback: Function) => {
      callback(null, 'test desc');
    });

    darwin.new();

    expect(fsSpy.mkdirSync).toHaveBeenCalledWith('test desc');
  });

  it('loads the suite.json when creating a new test', () => {
    setSpy(promptlySpy.prompt).toCallFake((value: string, callback: Function) => {
      callback(null, 'test desc');
    });

    darwin.new();

    expect(fsSpy.readFileSync).toHaveBeenCalledWith('suite.json', { encoding: 'utf8' });
  });

  it('delegates to record to start the browser', () => {
    setSpy(promptlySpy.prompt).toCallFake((value: string, callback: Function) => {
      callback(null, 'test desc');
    });

    darwin.new();

    expect(recordSpy.start).toHaveBeenCalledWith('test desc', { test: 'suite' });
  });

  it('doesn\'t start selenium until the test name has been entered', () => {
    darwin.new();

    expect(spyOf(recordSpy.start).callCount).toEqual(0);
  });

  it('delegates to playback to run the tests', () => {
    darwin.run();

    expect(playbackSpy.play).toHaveBeenCalledWith({ test: 'suite' });
  });

});