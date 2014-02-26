/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import gm = require('gm');

import Cropper = require('../../../src/cli/Image/Cropper');
import IResultSegment = require('../../../src/common/Result/IResultSegment');

describe('Cropper', () => {

  var _gm: typeof gm;

  var done: (resultSegments: IResultSegment[]) => void;
  var cropper: Cropper;

  beforeEach(() => {
    _gm = jasmine.createSpyObj<typeof gm>('gm', ['crop']);

    done = jasmine.createSpy('done');

    cropper = new Cropper(_gm);
  });

  it('calls done with paths to the base images if there are no segments', () => {
    cropper.crop('testName/1', [], done);

    expect(done).toHaveBeenCalledWith([{
      expected: 'testName/1_expected.png',
      actual: 'testName/1_actual.png',
      diff: '',
      diffValue: '',
      pass: false
    }]);
  });

  it('delegates to gm to crop a segment', () => {

  });

});