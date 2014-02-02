
import Screenshot = require('../Image/Screenshot');

class Capture {

  private _resultCounter: number;

  constructor(private _screenshot: Screenshot,
              private _testName: string) {


    this._resultCounter = 1;
  }

  public resultImage(done: () => void) {
    this._screenshot.take(this._testName + '/' + this._resultCounter + '_result.png', done);

    this._resultCounter++;
  }

}

export = Capture;