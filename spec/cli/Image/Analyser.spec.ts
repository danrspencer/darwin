/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import IResultImage = require('../../../src/common/Result/IResultImage');
import ActionType = require('../../../src/common/Test/ActionType');
import ISegment = require('../../../src/common/Test/Screenshot/ISegment');

import Analyser = require('../../../src/cli/Image/Analyser');
import Comparer = require('../../../src/cli/Image/Comparer');
import Cropper = require('../../../src/cli/Image/Cropper');

describe('Analyser', () => {

  var _cropper: Cropper;
  var _comparer: Comparer;

  var analyser: Analyser;

  beforeEach(function() {
    _comparer = jasmine.createSpyObj<Comparer>('Comparer', ['compare']);
    _cropper = jasmine.createSpyObj<Cropper>('Cropper', ['crop']);

    analyser = new Analyser(_cropper, _comparer);
  });

  it('delegates to Cropper to create a cropped images', () => {
    var segments: ISegment[] = [
      { topLeft: { x: 2, y: 2 }, bottomRight: { x: 3, y: 3} }
    ];

    analyser.process('testName', 1, segments, () => {});

    expect(_cropper.crop).toHaveBeenCalledWith(
      'testName/1', segments, jasmine.any(Function)
    );
  });

  it('can handle different test names and image numbers', () => {
    analyser.process('differentTestName', 2, [], () => {});

    expect(_cropper.crop).toHaveBeenCalledWith('differentTestName/2', 2, [], () => {});
  });

  it('delegates to Comparer with the results of Cropper', () => {
    var croppedImages = ['img1', 'img2'];

    setSpy(_cropper.crop).toCallFake((baseImageName, segments, callback) => {
      callback(croppedImages);
    });

    analyser.process('anotherTest', 1, [], () => {});

    expect(_comparer.compare).toHaveBeenCalledWith(
      'anotherTest', croppedImages, jasmine.any(Function)
    );
  });

  it('calls the done callback with an IResultImage object containing the results', () => {
    setSpy(_cropper.crop).toCallFake((baseImageName, segments, callback) => {
      callback();
    });

    var diffs = [1,2,3,4];
    setSpy(_comparer.compare).toCallFake((testName, images, callback) => {
      callback(diffs);
    });

    var done = jasmine.createSpy('done');
    analyser.process('test', 1, [], done);

    expect(done).toHaveBeenCalledWith({ image: '1', comparisons: diffs });
  });

});