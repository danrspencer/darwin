/// <reference path="../../ref.d.ts" />
import jasmine_tss = require('../../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import ISuite = require('../../../../src/cli/Main/ISuite');

import Browser = require('../../../../src/cli/Selenium/Browser');
import Robot = require('../../../../src/cli/Selenium/Playback/Robot');
import TestRunner = require('../../../../src/cli/Selenium/Playback/TestRunner');

describe('TestRunner', () => {

  var robot: Robot;
  var browser: Browser;

  var drive: Object;
  var suite: ISuite;

  var testRunner: TestRunner;

  beforeEach(() => {
    // Setup driver and session
    drive = { driver: 'fake' };
    browser = jasmine.createSpyObj<Browser>('sessionSpy', ['start']);
    setSpy(browser.start).toCallFake((url, height, width, callback) => {
      callback(drive);
    });

    // Setup robot, fake suite, etc...
    robot = jasmine.createSpyObj<Robot>('robotSpy', ['performActions']);

    suite = {
      browserSize: {
        width: 1280,
        height: 768
      },
      url: 'www.google.co.uk'
    };

    testRunner = new TestRunner(robot, browser);
  });

  it('delegates to Browser to start a selenium session', () => {
    testRunner.run(suite, {});

    expect(browser.start).toHaveBeenCalledWith('www.google.co.uk', 1280, 768, jasmine.any(Function));
  });

  it('delegates to Robot to run the test actions', () => {
    var actions = { fake: 'actions '};

    testRunner.run(suite, actions);

    expect(robot.performActions).toHaveBeenCalledWith(drive, actions);
  });
});