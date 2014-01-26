/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import fs = require('fs');
import webdriver = require('selenium-webdriver');

import ISuite = require('../../../src/cli/Main/ISuite');

import Playback = require('../../../src/cli/Selenium/Playback');
import TestRunner = require('../../../src/cli/Selenium/Playback/TestRunner');

describe('Playback', () => {

  var fsSpy: typeof fs;

  var suiteStub: ISuite;

  var testRunner: TestRunner;

  var playback: Playback;

  beforeEach(() => {
    fsSpy = jasmine.createSpyObj<typeof fs>('fsSpy', ['readFile', 'readdirSync', 'statSync']);
    setSpy(fsSpy.readdirSync).toReturn(['Test 1', 'Test 2', 'randomfile.html']);
    setSpy(fsSpy.statSync).toCallFake((filename: string) => {
      return {
        isDirectory: () => { return filename !== './randomfile.html' }
      }
    });
    setSpy(fsSpy.readFile).toCallFake((filename: string, options: Object, callback: Function) => {
      callback();
    });

    testRunner = jasmine.createSpyObj<TestRunner>('testRunner', ['run']);

    suiteStub = <ISuite>{ fake: 'suite' };

    playback = new Playback(fsSpy, testRunner);
  });

  it('gets the contents of the current directory', () => {
    playback.play(suiteStub);

    expect(fsSpy.readdirSync).toHaveBeenCalledWith('./');
  });

  it('it gets the stats for each item in the directory', () => {
    playback.play(suiteStub);

    expect(fsSpy.statSync).toHaveBeenCalledWith('./Test 1');
    expect(fsSpy.statSync).toHaveBeenCalledWith('./Test 2');
    expect(fsSpy.statSync).toHaveBeenCalledWith('./randomfile.html');
  });

  it('loads the actions.json from each sub directory', () => {
    playback.play(suiteStub);

    expect(fsSpy.readFile).toHaveBeenCalledWith('./Test 1/actions.json', { encoding: 'utf8' }, jasmine.any(Function));
    expect(fsSpy.readFile).toHaveBeenCalledWith('./Test 2/actions.json', { encoding: 'utf8' }, jasmine.any(Function));
  });

  it('only loads the actions.json for directories', () => {
    playback.play(suiteStub);

    expect(spyOf(fsSpy.readFile).callCount).toEqual(2);
  });

  it('delegates to TestRunner to run the test actions', () => {
    var file1Data = { test1: 'data' };
    var file2Data = { test2: 'stuff' };

    setSpy(fsSpy.readFile).toCallFake((filename: string, options: Object, callback: Function) => {
      var fakeResult = JSON.stringify(filename === './Test 1/actions.json' ? file1Data : file2Data);

      callback({}, fakeResult);
    });

    playback.play(suiteStub);

    expect(testRunner.run).toHaveBeenCalledWith(suiteStub, 'Test 1', file1Data);
    expect(testRunner.run).toHaveBeenCalledWith(suiteStub, 'Test 2', file2Data);
  });


});