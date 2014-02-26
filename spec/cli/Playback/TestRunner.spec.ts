/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import webdriver = require('selenium-webdriver');

import ActionType = require('../../../src/common/Test/ActionType');
import IAction = require('../../../src/common/Test/IAction');
import ITest = require('../../../src/common/Test/ITest');
import ISuite = require('../../../src/cli/Main/ISuite');

import Browser = require('../../../src/cli/Selenium/Browser');

import Processor = require('../../../src/cli/Result/Processor');
import Robot = require('../../../src/cli/Playback/Robot');
import RobotBuilder = require('../../../src/cli/Playback/RobotBuilder');
import TestRunner = require('../../../src/cli/Playback/TestRunner');

describe('TestRunner', () => {

  var _processor: Processor;
  var _robotBuilder: RobotBuilder;
  var _robot: Robot;
  var _browser: Browser;

  var driver: webdriver.Driver;
  var suite: ISuite;

  var testRunner: TestRunner;

  beforeEach(() => {
    driver = jasmine.createSpyObj<webdriver.Driver>('driver', ['quit']);
    _browser = jasmine.createSpyObj<Browser>('browser', ['start']);
    setSpy(_browser.start).toCallFake((url, height, width, callback) => {
      callback(driver);
    });

    _robotBuilder = jasmine.createSpyObj<RobotBuilder>('robotBuilder', ['getRobot']);
    _robot = jasmine.createSpyObj<Robot>('robot', ['performActions']);
    setSpy(_robotBuilder.getRobot).toReturn(_robot);

    _processor = jasmine.createSpyObj<Processor>('analyse', ['processResults']);

    suite = {
      browserSize: {
        width: 1280,
        height: 768
      },
      url: 'www.google.co.uk'
    };

    testRunner = new TestRunner(_robotBuilder, _browser, _processor);
  });

  it('delegates to Browser to start a selenium session', () => {
    testRunner.run(suite, '', <ITest>{});

    expect(_browser.start).toHaveBeenCalledWith('www.google.co.uk', 1280, 768, jasmine.any(Function));
  });

  it('delegates to RobotBuilder to get an instance of Robot', () => {
    testRunner.run(suite, 'test name', <ITest>{});

    expect(_robotBuilder.getRobot).toHaveBeenCalledWith(driver, 'test name');
  });

  it('delegates to Robot to run the test actions', () => {
    var test = <ITest>{ actions: [{ type: ActionType.KEYPRESS }] };

    testRunner.run(suite, '', test);

    expect(_robot.performActions).toHaveBeenCalledWith(test.actions, jasmine.any(Function));
  });

  it('closes the browser after the Robot is finished', () => {
    var test = <ITest>{ actions: [{ type: ActionType.KEYPRESS }] };

    var robotFinished: Function;

    setSpy(_robot.performActions).toCallFake((actions, done) => {
      robotFinished = done;
    });

    testRunner.run(suite, '', test);

    expect(driver.quit).not.toHaveBeenCalled();

    robotFinished();
    expect(driver.quit).toHaveBeenCalled();
  });

  it('delegates to Processor after the Robot is finished', () => {
    var test = <ITest>{ actions: [{ type: ActionType.KEYPRESS }] };

    var robotFinished: Function;

    setSpy(_robot.performActions).toCallFake((actions, done) => {
      robotFinished = done;
    });

    testRunner.run(suite, 'awesome test', test);

    expect(_processor.processResults).not.toHaveBeenCalled();

    robotFinished();
    expect(_processor.processResults).toHaveBeenCalledWith('awesome test', test);
  });
});

