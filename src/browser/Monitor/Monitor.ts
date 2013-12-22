import Handler = require('../Event/Handler');

import IDarwinWindow = require('../../common/IDarwinWindow');
import IMouseEvent = require('../Data/IMouseEvent');

class Monitor {

  private _data: Object[];

  constructor(private _window: IDarwinWindow,
              private _console: Console,
              private _handler: Handler) {

    this._data = [];
  }

  public setup() {
    this._window.addEventListener('mousedown', (event: MouseEvent) => {
      var result = this._handler.onMousedown(event);

      this._console.log(JSON.stringify(this._data));

      this._data.push(result);
    });

    this._window.addEventListener('keypress', (event: KeyboardEvent) => {
      this._data.push({"screenshot": true});
    });
  }

  public getOutput(): Object[] {
    return this._data;
  }

}

export = Monitor;