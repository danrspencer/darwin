
import IResultImage = require('../../common/Result/IResultImage');
import ISegment = require('../../common/Test/Screenshot/ISegment');

import Postfixes = require('./Postfixes');

class Cropper {

  public crop(baseName: string, segments: ISegment[], done: (resultImage: IResultImage) => void) {

//    var results: IImageOutput[] = [];
//
//    results.push({
//      expected: baseName + Postfixes.EXPECTED,
//      actual: baseName + Postfixes.ACTUAL
//    });
//
//    done(results);
  }

}

export = Cropper;