
import IResultImage = require('../../common/Result/IResultImage');
import ISegment = require('../../common/Test/Screenshot/ISegment');

import Postfixes = require('./Postfixes');

class Cropper {

  public crop(resultImage: IResultImage, segments: ISegment[], done: (resultImage: IResultImage) => void) {

   resultImage.comparisons = [];

   resultImage.comparisons.push({
     expected: resultImage.image + Postfixes.EXPECTED,
     actual: resultImage.image + Postfixes.ACTUAL,
     diff: '',
     diffValue: '',
     pass: false
   });

   done(resultImage);
  }

}

export = Cropper;