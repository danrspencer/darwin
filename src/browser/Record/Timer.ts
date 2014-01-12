
class Timer {

  private _previousTime;

  public start() {
    this._previousTime = Date.now();
  }

  public getInterval() {
    var currentTime = Date.now();
    var elapsedTime = currentTime - this._previousTime;
    this._previousTime = currentTime;

    return elapsedTime;
  }

}

export = Timer;