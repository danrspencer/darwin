/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import gm = require('gm');

import Cropper = require('../../../src/cli/Image/Cropper');
import Postfixes = require('../../../src/cli/Image/Postfixes');

import IResultSegment = require('../../../src/common/Result/IResultSegment');
import ISegment = require('../../../src/common/Test/Screenshot/ISegment');

describe('Cropper', () => {

  var _gm: typeof gm;
  var _gmObj; // Not sure how to type this for now...

  var done: (resultSegments: IResultSegment[]) => void;
  var cropper: Cropper;

  beforeEach(() => {
    _gm = <typeof gm><any>jasmine.createSpy('gm');
    _gmObj = jasmine.createSpyObj('gmObj', ['crop', 'write']);

    setSpy(_gm).toReturn(_gmObj);
    setSpy(_gmObj.crop).toReturn(_gmObj);
    setSpy(_gmObj.write).toCallFake((filename, callback) => {
      callback();
    });

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
    var segments: ISegment[] = [
      { topLeft: { x: 50, y: 10 }, bottomRight: { x: 70, y: 150 }  }
    ];

    cropper.crop('testName/1', segments, done).then(() => {
      expect(_gm).toHaveBeenCalledWith('testName/1' + Postfixes.ACTUAL);
      expect(_gmObj.crop).toHaveBeenCalledWith(20, 140, 50, 10);
      expect(_gmObj.write).toHaveBeenCalled();
    }, (err) => {
      throw err;
    });


  });

  it('delegates to gm to crop multiple segments', () => {
    var segments: ISegment[] = [
      { topLeft: { x: 150, y: 100 }, bottomRight: { x: 200, y: 250 }  },
      { topLeft: { x: 0, y: 0 }, bottomRight: { x: 20, y: 30 }  },
      { topLeft: { x: 1000, y: 100 }, bottomRight: { x: 1500, y: 500 }  }
    ];

    cropper.crop('testName/2', segments, done);

    expect(_gm).toHaveBeenCalledWith('testName/2' + Postfixes.ACTUAL);
    expect(_gmObj.crop).toHaveBeenCalledWith(50, 150, 150, 100);
    expect(_gmObj.write).toHaveBeenCalled();

    expect(_gm).toHaveBeenCalledWith('testName/2' + Postfixes.ACTUAL);
    expect(_gmObj.crop).toHaveBeenCalledWith(20, 30, 0, 0);
    expect(_gmObj.write).toHaveBeenCalled();

    expect(_gm).toHaveBeenCalledWith('testName/2' + Postfixes.ACTUAL);
    expect(_gmObj.crop).toHaveBeenCalledWith(500, 400, 1000, 100);
    expect(_gmObj.write).toHaveBeenCalled();
  });

  it('writes each segment with an incremented alphabetic postfix', () => {
    var segments: ISegment[] = [
      { topLeft: { x: 150, y: 100 }, bottomRight: { x: 200, y: 250 }  },
      { topLeft: { x: 0, y: 0 }, bottomRight: { x: 20, y: 30 }  },
      { topLeft: { x: 1000, y: 100 }, bottomRight: { x: 1500, y: 500 }  }
    ];

    cropper.crop('differentTest/3', segments, done)
           .then(() => {
      expect(_gmObj.write).toHaveBeenCalledWith('differentTest/3a' + Postfixes.ACTUAL, jasmine.any(Function));
      expect(_gmObj.write).toHaveBeenCalledWith('differentTest/3b' + Postfixes.ACTUAL, jasmine.any(Function));
      expect(_gmObj.write).toHaveBeenCalledWith('differentTest/3c' + Postfixes.ACTUAL, jasmine.any(Function));
    }, (err) => {
        throw err;
      });
  });

  it('calls done with correct result segments after processing multiple segments', () => {
    var segments: ISegment[] = [
      { topLeft: { x: 150, y: 100 }, bottomRight: { x: 200, y: 250 }  },
      { topLeft: { x: 0, y: 0 }, bottomRight: { x: 20, y: 30 }  },
      { topLeft: { x: 1000, y: 100 }, bottomRight: { x: 1500, y: 500 }  }
    ];

    cropper.crop('t1000/9', segments, done);

    expect(done).toHaveBeenCalledWith([
      { expected: 't1000/9a_expected.png', actual: 't1000/9a_actual.png', diff: '', diffValue: '', pass: false },
      { expected: 't1000/9b_expected.png', actual: 't1000/9b_actual.png', diff: '', diffValue: '', pass: false },
      { expected: 't1000/9c_expected.png', actual: 't1000/9c_actual.png', diff: '', diffValue: '', pass: false },
    ]);
  });

  it('doesnt call done until all images have been processed', () => {
    var segments: ISegment[] = [
      { topLeft: { x: 150, y: 100 }, bottomRight: { x: 200, y: 250 }  },
      { topLeft: { x: 0, y: 0 }, bottomRight: { x: 20, y: 30 }  },
      { topLeft: { x: 1000, y: 100 }, bottomRight: { x: 1500, y: 500 }  }
    ];

    var writeCallbacks = [];

    setSpy(_gmObj.write).toCallFake((filename, callback) => {
      writeCallbacks.push(callback);
    });

    cropper.crop('t1000/9', segments, done);

    writeCallbacks[0]();
    writeCallbacks[1]();
    expect(done).not.toHaveBeenCalled();

    writeCallbacks[2]();
    expect(done).toHaveBeenCalled();
  });

});
