/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import IAction = require('../../../src/common/Action/IAction');

import Perform = require('../../../src/cli/Playback/Perform');
import Robot = require('../../../src/cli/Playback/Robot');
import Scheduler = require('../../../src/cli/Playback/Scheduler');

describe('Robot', () => {

  var perform: Perform;
  var scheduler: Scheduler;

  var triggerScheduler: Function;
  var triggerPerformCallback: Function;

  var robot: Robot;

  beforeEach(() => {


    perform = jasmine.createSpyObj<Perform>('perform', ['performAction', 'finish']);
    setSpy(perform.performAction).toCallFake((action, callback) => { triggerPerformCallback = callback });

    scheduler = jasmine.createSpyObj<Scheduler>('scheduler', ['start', 'callAfter']);
    setSpy(scheduler.callAfter).toCallFake((delay, callback) => { triggerScheduler = callback });

    robot = new Robot(scheduler, perform);
  });

  it('starts the Scheduler', () => {
    robot.performActions(<IAction[]>[{ delay: 100 }], () => {});

    expect(scheduler.start).toHaveBeenCalled();
  });

  it('delegates to Scheduler for the first action', () => {
    robot.performActions(<IAction[]>[{ delay: 100 }], () => {});

    expect(scheduler.callAfter).toHaveBeenCalledWith(100, jasmine.any(Function));
  });

  it('delegates to Perform for the first action when the scheduler callback is triggered', () => {
    robot.performActions(<IAction[]>[{ delay: 100 }], () => {});

    triggerScheduler();

    expect(perform.performAction).toHaveBeenCalledWith({ delay: 100 }, jasmine.any(Function));
  });

  it('doesn\'t call Perform until the scheduler triggers', () => {
    robot.performActions(<IAction[]>[{ delay: 100 }], () => {});

    expect(perform.performAction).not.toHaveBeenCalled();
  });

  it('delegates to Scheduler for the second action with the sum of the delays', () => {
    robot.performActions(<IAction[]>[{ delay: 100 }, { delay: 300 }], () => {});

    triggerScheduler();
    triggerPerformCallback();

    expect(scheduler.callAfter).toHaveBeenCalledWith(400, jasmine.any(Function));
  });

  it('doesn\'t delegate to Scheduler for the second action until the first action has completed', () => {
    robot.performActions(<IAction[]>[{ delay: 100 }, { delay: 300 }], () => {});

    triggerScheduler();

    expect(scheduler.callAfter).not.toHaveBeenCalledWith(400, jasmine.any(Function));
  });

  it('delegates to Perform for the second action', () => {
    robot.performActions(<IAction[]>[{ delay: 100 }, { delay: 300 }], () => {});

    triggerScheduler();
    triggerPerformCallback();
    triggerScheduler();

    expect(perform.performAction).toHaveBeenCalledWith({ delay: 300 }, jasmine.any(Function));
  });

  it('delegates to Scheduler for the 5th action with the sum of the delays', () => {
    robot.performActions(<IAction[]>[
      { delay: 100 }, { delay: 200 }, { delay: 300 }, { delay: 400 }, { delay: 500 }
    ], () => {});

    for (var n = 0; n < 5; n++) {
      triggerScheduler();
      triggerPerformCallback();
    }

    expect(scheduler.callAfter).toHaveBeenCalledWith(1500, jasmine.any(Function));
  });

  it('doesn\'t delegate to Scheduler for the 5th action until the 4th action has completed', () => {
    robot.performActions(<IAction[]>[{ delay: 100 }, { delay: 300 }], () => {});

    for (var n = 0; n < 4; n++) {
      triggerScheduler();
      triggerPerformCallback();
    }

    expect(scheduler.callAfter).not.toHaveBeenCalledWith(1500, jasmine.any(Function));
  });

  it('calls the done callback when all actions are done', () => {
    var done = jasmine.createSpy('done');

    robot.performActions(<IAction[]>[{ delay: 100 }, { delay: 300 }], done);

    expect(done).not.toHaveBeenCalled();

    for (var n = 0; n < 4; n++) {
      triggerScheduler();
      triggerPerformCallback();
    }

    expect(done).toHaveBeenCalled();
  });

});