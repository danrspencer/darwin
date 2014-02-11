/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import Cropper = require('../../../src/cli/Image/Cropper');
import IImageOutput = require('../../../src/cli/Image/IImageOutput');

describe('Cropper', () => {

  var done: (images: IImageOutput[]) => void;

  var cropper: Cropper;

  beforeEach(() => {
    done = jasmine.createSpy('done');

    cropper = new Cropper();
  });

  it('calls done with paths to the base images if there are no segments', () => {
    cropper.crop('testName/1', [], done);

    expect(done).toHaveBeenCalledWith([{
      expected: 'testName/1_expected.png',
      actual: 'testName/1_actual.png'
    }]);
  });

  it('delegates to gm to crop a segment', () => {

  });

});