import KeyHandler = require('../Record/KeyHandler');
import MouseHandler = require('../Record/MouseHandler');

import IDarwinWindow = require('../../common/IDarwinWindow');

class Binder {

  constructor(private _window: IDarwinWindow,
              private _keyHandler: KeyHandler,
              private _mouseHandler: MouseHandler) {

  }

  public bindEvents() {

    this._window.addEventListener('keypress', this._keyHandler.keypress);
    this._window.addEventListener('mousedown', this._mouseHandler.mousedown);
  }

}

export = Binder;