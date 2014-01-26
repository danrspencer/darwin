/// <reference path="../../ref.d.ts" />
import jasmine_tss = require('../../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import ISuite = require('../../../../src/cli/Main/ISuite');

import Browser = require('../../../../src/cli/Selenium/Browser');
import Robot = require('../../../../src/cli/Selenium/Playback/Robot');
import RobotBuilder = require('../../../../src/cli/Selenium/Playback/RobotBuilder');
import TestRunner = require('../../../../src/cli/Selenium/Playback/TestRunner');

describe('TestRunner', () => {

  var robotBuilder: RobotBuilder;
  var robot: Robot;
  var browser: Browser;

  var driver: Object;
  var suite: ISuite;

  var testRunner: TestRunner;

  beforeEach(() => {
    driver = { driver: 'fake' };
    browser = jasmine.createSpyObj<Browser>('browser', ['start']);
    setSpy(browser.start).toCallFake((url, height, width, callback) => {
      callback(driver);
    });

    robotBuilder = jasmine.createSpyObj<RobotBuilder>('robotBuilder', ['getRobot']);
    robot = jasmine.createSpyObj<Robot>('robot', ['performActions']);
    setSpy(robotBuilder.getRobot).toReturn(robot);

    suite = {
      browserSize: {
        width: 1280,
        height: 768
      },
      url: 'www.google.co.uk'
    };

    testRunner = new TestRunner(robotBuilder, browser);
  });

  it('delegates to Browser to start a selenium session', () => {
    testRunner.run(suite, '', [<IAction>{}]);

    expect(browser.start).toHaveBeenCalledWith('www.google.co.uk', 1280, 768, jasmine.any(Function));
  });

  it('delegates to RobotBuilder to get an instance of Robot', () => {
    testRunner.run(suite, 'test name', [<IAction>{}]);

    expect(robotBuilder.getRobot).toHaveBeenCalledWith(driver, 'test name');
  });

  it('delegates to Robot to run the test actions', () => {
    var actions = [<IAction>{ fake: 'actions '}];

    testRunner.run(suite, '', actions);

    expect(robot.performActions).toHaveBeenCalledWith(driver, actions);
  });
});