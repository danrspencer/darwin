/// <reference path="../../ref.d.ts" />
import jasmine_tss = require('../../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import webdriver = require('selenium-webdriver');

import IAction = require('../../../../src/common/Action/IAction');

import Perform = require('../../../../src/cli/Selenium/Playback/Perform');
import Robot = require('../../../../src/cli/Selenium/Playback/Robot');

describe('Robot', () => {

  var driverSpy: webdriver.Driver;
  var performSpy: Perform

  var timeoutSpy: Function;
  var timeoutCallback: Function;

  var robot: Robot;

  beforeEach(() => {
    driverSpy = jasmine.createSpyObj<webdriver.Driver>('driverSpy', ['test']);
    performSpy = jasmine.createSpyObj<Perform>('performSpy', ['performAction']);

    timeoutSpy = spyOn(global, 'setTimeout');
    setSpy(timeoutSpy).toCallFake((callback) => { timeoutCallback = callback });

    robot = new Robot(performSpy);
  });

  it('creates a timeout for the first action', () => {
    robot.performActions(driverSpy, <IAction[]>[ { delay: 100 } ]);

    expect(timeoutSpy).toHaveBeenCalledWith(jasmine.any(Function), 100);
  });

  it('delegates to Perform for the first action', () => {
    robot.performActions(driverSpy, <IAction[]>[ { delay: 100 } ]);

    timeoutCallback();
    expect(performSpy.performAction).toHaveBeenCalledWith(driverSpy, { delay: 100 });
  });

  it('doesn\'t delegate to Perform until the timeout has completed', () => {
    robot.performActions(driverSpy, <IAction[]>[ { delay: 100 } ]);

    expect(spyOf(performSpy.performAction).callCount).toEqual(0);
  });

  it('creates a timeout for the second action', () => {
    robot.performActions(driverSpy, <IAction[]>[ { delay: 100 }, { delay: 200 } ]);

    timeoutCallback();
    expect(timeoutSpy).toHaveBeenCalledWith(jasmine.any(Function), 200);
  });

  it('delegates to Perform for the second action', () => {
    robot.performActions(driverSpy, <IAction[]>[ { delay: 100 }, { delay: 200 } ]);

    timeoutCallback();
    expect(performSpy.performAction).toHaveBeenCalledWith(driverSpy, { delay: 100 });

    timeoutCallback();
    expect(performSpy.performAction).toHaveBeenCalledWith(driverSpy, { delay: 200 });
  });

  it('doesn\'t process the second action until the first timeout has completed', () => {
    robot.performActions(driverSpy, <IAction[]>[ { delay: 100 }, { delay: 200 } ]);

    expect(spyOf(timeoutSpy).callCount).toEqual(1);

    timeoutCallback();
    expect(spyOf(performSpy.performAction).callCount).toEqual(1);
  });



});