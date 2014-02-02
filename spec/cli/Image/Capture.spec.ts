/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import Capture = require('../../../src/cli/Image/Capture');
import Screenshot = require('../../../src/cli/Image/Screenshot');

describe('Capture', () => {

  var screenshot: Screenshot;

  var capture: Capture;

  beforeEach(() => {
    screenshot = jasmine.createSpyObj<Screenshot>('screenshot', ['take']);

    capture = new Capture(screenshot, "testName");
  });

  it('delegates to screenshot with "testName/1_result.png"', () => {

    var done = jasmine.createSpy('done');

    capture.resultImage(done);

    expect(screenshot.take).toHaveBeenCalledWith('testName/1_result.png', done);
  });

  it('increased filename integer by 1 after each call', () => {

    var done = jasmine.createSpy('done');

    capture.resultImage(done);
    expect(screenshot.take).toHaveBeenCalledWith('testName/1_result.png', done);

    capture.resultImage(done);
    expect(screenshot.take).toHaveBeenCalledWith('testName/2_result.png', done);

    capture.resultImage(done);
    expect(screenshot.take).toHaveBeenCalledWith('testName/3_result.png', done);

    capture.resultImage(done);
    expect(screenshot.take).toHaveBeenCalledWith('testName/4_result.png', done);
  });

});