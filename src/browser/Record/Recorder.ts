
import Binder = require('./Binder');
import Timer = require('./Timer');


class Recorder {

  constructor(private _binder: Binder,
              private _timer: Timer) {

  }

  public start() {
    this._timer.start();
    this._binder.bindEvents();
  }

}

export = Recorder;