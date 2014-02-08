
import IDiff = require('../../common/Result/IDiff');
import ISegment = require('../../common/Test/Screenshot/ISegment');

class SegmentAnalyser {

  constructor() {

  }

  public process(baseImageName: string, segment: ISegment, done: (diff: IDiff) => void) {



  }

}

export = SegmentAnalyser;



//    var expectedPostfix = '_expected.png';
//    var actualPostfix = '_actual.png';
//    var diffPostfix = '_diff.png';
//
//    var imageNameBase = this._testName + '/' + imageIndex;
//    var expectedImage = imageNameBase + expectedPostfix;
//    var actualImage = imageNameBase + actualPostfix;
//    var diffImage = imageNameBase + diffPostfix;
//
//    this._comparer.compare(expectedImage, actualImage, diffImage, () => {});