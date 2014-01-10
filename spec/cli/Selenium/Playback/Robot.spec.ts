/// <reference path="../../ref.d.ts" />
import jasmine_tss = require('../../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import webdriver = require('selenium-webdriver');

import IAction = require('../../../../src/common/Action/IAction');

import Perform = require('../../../../src/cli/Selenium/Playback/Perform');
import Robot = require('../../../../src/cli/Selenium/Playback/Robot');
import Scheduler = require('../../../../src/cli/Selenium/Playback/Scheduler');
import SchedulerBuilder = require('../../../../src/cli/Selenium/Playback/SchedulerBuilder');


describe('Robot', () => {

  var driverSpy: webdriver.Driver;

  var performSpy: Perform
  var schedulerSpy: Scheduler;
  var schedulerBuilderSpy: SchedulerBuilder;

  var triggerScheduler: Function;
  var triggerPerformCallback: Function;

  var robot: Robot;

  beforeEach(() => {
    driverSpy = jasmine.createSpyObj<webdriver.Driver>('driverSpy', ['test']);

    performSpy = jasmine.createSpyObj<Perform>('performSpy', ['performAction']);
    setSpy(performSpy.performAction).toCallFake((driver, action, callback) => { triggerPerformCallback = callback });

    schedulerSpy = jasmine.createSpyObj<Scheduler>('schedulerSpy', ['start', 'callAfter']);
    setSpy(schedulerSpy.callAfter).toCallFake((delay, callback) => { triggerScheduler = callback });

    schedulerBuilderSpy = jasmine.createSpyObj<SchedulerBuilder>('SchedulerBuilderSpy', ['getScheduler']);
    setSpy(schedulerBuilderSpy.getScheduler).toReturn(schedulerSpy);

    robot = new Robot(schedulerBuilderSpy, performSpy);
  });

  it('delegates to SchedulerBuilder to get a new Scheduler', () => {
    robot.performActions(driverSpy, <IAction[]>[{ delay: 100 }]);

    expect(schedulerBuilderSpy.getScheduler).toHaveBeenCalled();
  });

  it('starts the Scheduler', () => {
    robot.performActions(driverSpy, <IAction[]>[{ delay: 100 }]);

    expect(schedulerSpy.start).toHaveBeenCalled();
  });

  it('delegates to Scheduler for the first action', () => {
    robot.performActions(driverSpy, <IAction[]>[{ delay: 100 }]);

    expect(schedulerSpy.callAfter).toHaveBeenCalledWith(100, jasmine.any(Function));
  });

  it('delegates to Perform for the first action when the scheduler callback is triggered', () => {
    robot.performActions(driverSpy, <IAction[]>[{ delay: 100 }]);

    triggerScheduler();

    expect(performSpy.performAction).toHaveBeenCalledWith(driverSpy, { delay: 100 }, jasmine.any(Function));
  });

  it('doesn\'t call Perform until the scheduler triggers', () => {
    robot.performActions(driverSpy, <IAction[]>[{ delay: 100 }]);

    expect(performSpy.performAction).not.toHaveBeenCalled();
  });

  it('delegates to Scheduler for the second action with the sum of the delays', () => {
    robot.performActions(driverSpy, <IAction[]>[{ delay: 100 }, { delay: 300 }]);

    triggerScheduler();
    triggerPerformCallback();

    expect(schedulerSpy.callAfter).toHaveBeenCalledWith(400, jasmine.any(Function));
  });

  it('doesn\'t delegate to Scheduler for the second action until the first action has completed', () => {
    robot.performActions(driverSpy, <IAction[]>[{ delay: 100 }, { delay: 300 }]);

    triggerScheduler();

    expect(schedulerSpy.callAfter).not.toHaveBeenCalledWith(400, jasmine.any(Function));
  });

  it('delegates to Perform for the second action', () => {
    robot.performActions(driverSpy, <IAction[]>[{ delay: 100 }, { delay: 300 }]);

    triggerScheduler();
    triggerPerformCallback();
    triggerScheduler();

    expect(performSpy.performAction).toHaveBeenCalledWith(driverSpy, { delay: 300 }, jasmine.any(Function));
  });

  it('delegates to Scheduler for the 5th action with the sum of the delays', () => {
    robot.performActions(driverSpy, <IAction[]>[
      { delay: 100 }, { delay: 200 }, { delay: 300 }, { delay: 400 }, { delay: 500 }
    ]);

    for (var n = 0; n < 5; n++) {
      triggerScheduler();
      triggerPerformCallback();
    }

    expect(schedulerSpy.callAfter).toHaveBeenCalledWith(1500, jasmine.any(Function));
  });

  it('doesn\'t delegate to Scheduler for the 5th action until the 4th action has completed', () => {
    robot.performActions(driverSpy, <IAction[]>[{ delay: 100 }, { delay: 300 }]);

    for (var n = 0; n < 4; n++) {
      triggerScheduler();
      triggerPerformCallback();
    }

    expect(schedulerSpy.callAfter).not.toHaveBeenCalledWith(1500, jasmine.any(Function));
  });



});