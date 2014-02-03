/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import webdriver = require('selenium-webdriver');

import ActionType = require('../../../src/common/Action/ActionType');
import IAction = require('../../../src/common/Action/IAction');
import ISuite = require('../../../src/cli/Main/ISuite');

import Browser = require('../../../src/cli/Selenium/Browser');

import Analyser = require('../../../src/cli/Image/Analyser');
import Robot = require('../../../src/cli/Playback/Robot');
import RobotBuilder = require('../../../src/cli/Playback/RobotBuilder');
import TestRunner = require('../../../src/cli/Playback/TestRunner');

describe('TestRunner', () => {

  var analyser: Analyser;
  var robotBuilder: RobotBuilder;
  var robot: Robot;
  var browser: Browser;

  var driver: webdriver.Driver;
  var suite: ISuite;

  var testRunner: TestRunner;

  beforeEach(() => {
    driver = jasmine.createSpyObj<webdriver.Driver>('driver', ['quit']);
    browser = jasmine.createSpyObj<Browser>('browser', ['start']);
    setSpy(browser.start).toCallFake((url, height, width, callback) => {
      callback(driver);
    });

    robotBuilder = jasmine.createSpyObj<RobotBuilder>('robotBuilder', ['getRobot']);
    robot = jasmine.createSpyObj<Robot>('robot', ['performActions']);
    setSpy(robotBuilder.getRobot).toReturn(robot);

    analyser = jasmine.createSpyObj<Analyser>('analyse', ['analyseResults']);

    suite = {
      browserSize: {
        width: 1280,
        height: 768
      },
      url: 'www.google.co.uk'
    };

    testRunner = new TestRunner(robotBuilder, browser, analyser);
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
    var actions = [<IAction>{ type: ActionType.KEYPRESS }];

    testRunner.run(suite, '', actions);

    expect(robot.performActions).toHaveBeenCalledWith(actions, jasmine.any(Function));
  });

  it('closes the browser after the Robot is finished', () => {
    var actions = [<IAction>{ type: ActionType.KEYPRESS }];

    var robotFinished: Function;

    setSpy(robot.performActions).toCallFake((actions, done) => {
      robotFinished = done;
    });

    testRunner.run(suite, '', actions);

    expect(driver.quit).not.toHaveBeenCalled();

    robotFinished();
    expect(driver.quit).toHaveBeenCalled();
  });

  it('delegates to Analyse after the Robot is finished', () => {
    var actions = [<IAction>{ type: ActionType.KEYPRESS }];

    var robotFinished: Function;

    setSpy(robot.performActions).toCallFake((actions, done) => {
      robotFinished = done;
    });

    testRunner.run(suite, 'awesome test', actions);

    expect(analyser.analyseResults).not.toHaveBeenCalled();

    robotFinished();
    expect(analyser.analyseResults).toHaveBeenCalledWith('awesome test', actions);
  });
});

