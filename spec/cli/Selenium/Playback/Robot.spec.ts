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

  var robot: Robot;

  beforeEach(() => {
    driverSpy = jasmine.createSpyObj<webdriver.Driver>('driverSpy', ['test']);

    performSpy = jasmine.createSpyObj<Perform>('performSpy', ['performAction']);
    schedulerSpy = jasmine.createSpyObj<Scheduler>('schedulerSpy', ['start', 'callAfter']);
    schedulerBuilderSpy = jasmine.createSpyObj<SchedulerBuilder>('SchedulerBuilderSpy', ['getScheduler']);

    setSpy(schedulerSpy.callAfter).toCallFake((delay, callback) => { triggerScheduler = callback });
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

    expect(performSpy.performAction).toHaveBeenCalledWith(driverSpy, { delay: 100 });
  });

  it('doesn\'t call Perform until the scheduler triggers', () => {
    robot.performActions(driverSpy, <IAction[]>[{ delay: 100 }]);

    expect(performSpy.performAction).not.toHaveBeenCalled();
  });

  

});