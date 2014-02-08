/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import IDiff = require('../../../src/common/Result/IDiff');
import ActionType = require('../../../src/common/Test/ActionType');
import ISegment = require('../../../src/common/Test/Screenshot/ISegment');

import Cropper = require('../../../src/cli/Image/Cropper');
import SegmentAnalyser = require('../../../src/cli/Image/SegmentAnalyser');


describe('SegmentAnalyser', () => {

  var _cropper: Cropper;

  var segmentAnalyser: SegmentAnalyser;

  beforeEach(() => {
    _cropper = jasmine.createSpyObj<Cropper>('Cropper', ['crop']);

    segmentAnalyser = new SegmentAnalyser(_cropper);
  });

  it('delegates to Cropper to crop the image', () => {

    var segment: ISegment = { topLeft: { x: 4, y: 4 }, bottomRight: { x: 5, y: 5} };

    segmentAnalyser.process('testName/1', segment);



  });

});