/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import Darwin = require('../../../src/cli/Main/Darwin');
import Playback = require('../../../src/cli/Playback/Playback');
import Record = require('../../../src/cli/Record/Record');

import ISuite = require('../../../src/cli/Main/ISuite');

import fs = require('fs');
import promptly = require('promptly');
import webdriver = require('selenium-webdriver');

describe('Darwin', () => {

  var _promptly: typeof promptly;
  var _fs: typeof fs;
  var _record: Record;
  var _playback: Playback;

  var darwin: Darwin;

  beforeEach(() => {
    _promptly = jasmine.createSpyObj<typeof promptly>('promptlySpy', ['prompt']);
    _fs = jasmine.createSpyObj<typeof fs>('fsSpy', ['mkdirSync', 'writeFileSync', 'readFileSync']);
    _record = jasmine.createSpyObj<Record>('recordSpy', ['start', 'onAction']);
    _playback = jasmine.createSpyObj<Playback>('playbackSpy', ['play']);

    setSpy(_fs.readFileSync).toReturn(JSON.stringify( { test: 'suite' }));

    darwin = new Darwin(
      _fs,
      _promptly,
      _record,
      _playback
    );
  });

  it('prompts the user to enter the url under test', () => {
    darwin.init();

    expect(_promptly.prompt).toHaveBeenCalledWith('Enter the url under test: ', jasmine.any(Function));
  });

  it('writes the suite.json with the suite information', () => {
    setSpy(_promptly.prompt).toCallFake((value: string, callback: Function) => {
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

    expect(_fs.writeFileSync).toHaveBeenCalledWith('suite.json', JSON.stringify(expectedSuite, null, 2));
  });

  it('prompts the user to enter the test description', () => {
    darwin.new();

    expect(_promptly.prompt).toHaveBeenCalledWith('Enter a test description: ', jasmine.any(Function));
  });

  it('creates a directory named after the test', () => {
    setSpy(_promptly.prompt).toCallFake((value: string, callback: Function) => {
      callback(null, 'test desc');
    });

    darwin.new();

    expect(_fs.mkdirSync).toHaveBeenCalledWith('test desc');
  });

  it('loads the suite.json when creating a new test', () => {
    setSpy(_promptly.prompt).toCallFake((value: string, callback: Function) => {
      callback(null, 'test desc');
    });

    darwin.new();

    expect(_fs.readFileSync).toHaveBeenCalledWith('suite.json', { encoding: 'utf8' });
  });

  it('delegates to record to start the browser', () => {
    setSpy(_promptly.prompt).toCallFake((value: string, callback: Function) => {
      callback(null, 'test desc');
    });

    darwin.new();

    expect(_record.start).toHaveBeenCalledWith('test desc', { test: 'suite' });
  });

  it('doesn\'t start selenium until the test name has been entered', () => {
    darwin.new();

    expect(spyOf(_record.start).callCount).toEqual(0);
  });

  it('delegates to playback to run the tests', () => {
    darwin.run();

    expect(_playback.play).toHaveBeenCalledWith({ test: 'suite' });
  });

});