import Handler = require('../Event/Handler');

import ActionType = require('../../common/Action/ActionType');
import IDarwinWindow = require('../../common/IDarwinWindow');
import IMouseEvent = require('../../common/Action/IMouseEvent');

class Monitor {

  private _data: Object[];

  constructor(private _window: IDarwinWindow,
              private _console: Console,
              private _handler: Handler) {

    this._data = [];
  }

  public setup() {
    this._window.addEventListener('mousedown', (event: MouseEvent) => {
      var result = this._handler.mouseDown(event);

      this._data.push(result);
    });

    this._window.addEventListener('keypress', (event: KeyboardEvent) => {
      var result = this._handler.keypress(event);

      this._data.push(result);

      if (result.type === ActionType.SCREENSHOT) {
        this._window.__darwinCallback(result);
      }
    });
  }

  public getOutput(): Object[] {
    return this._data;
  }

}

export = Monitor;