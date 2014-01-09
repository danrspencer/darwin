
class Scheduler {

  private _startTime: number;
  private _timeFromStart: number;

  private _callbackDelay: number;
  private _callback: Function;

  constructor() {
    this._callback = null;
  }

  public start() {
    this._startTime = Date.now();

    setInterval(() => { this._tick() }, 50);
  }

  public callAfter(delayFromStart: number, callback: Function) {
    if (delayFromStart < this._timeFromStart) {
      callback();
    } else {
      this._callback = callback;
      this._callbackDelay = delayFromStart;
    }
  }

  private _tick() {
    this._timeFromStart = Date.now() - this._startTime;

    if(this._callbackDelay <= this._timeFromStart &&
       this._callback !== null) {
      this._callback();

      this._callback = null;
    }
  }


}

export = Scheduler;