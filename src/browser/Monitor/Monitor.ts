import Handler = require('../Event/Handler');

import ActionType = require('../../common/Action/ActionType');
import IDarwinWindow = require('../../common/IDarwinWindow');
import IMouseEvent = require('../../common/Action/IMouseEvent');

class Monitor {

  private _previousEventTime;

  constructor(private _window: IDarwinWindow,
              private _handler: Handler) {

  }

  public setup() {

    // Move handling of events to action manager
    // Move handling the darwin callback to the dispatcher

    this._previousEventTime = Date.now();

    this._window.addEventListener('mousedown', (event: MouseEvent) => {
      var result = this._handler.mouseDown(event, this.getDelay());

      this._window.__darwinCallback([result]);
    });

    this._window.addEventListener('keypress', (event: KeyboardEvent) => {
      var result = this._handler.keypress(event, this.getDelay());

      this._window.__darwinCallback([result]);
    });
  }

  private getDelay(): number {
    var currentEvent = Date.now();
    var elapsedTime = currentEvent - this._previousEventTime;
    this._previousEventTime = currentEvent;

    return elapsedTime;
  }

}

export = Monitor;