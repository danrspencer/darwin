import KeyHandler = require('../Record/KeyHandler');
import MouseHandler = require('../Record/MouseHandler');

class Binder {

  constructor(private _window: Window,
              private _keyHandler: KeyHandler,
              private _mouseHandler: MouseHandler) {

  }

  public bindEvents() {
    this._window.addEventListener('keypress', (event) => {
      this._keyHandler.keypress(event);
    });

    this._window.addEventListener('mousedown', (event) => {
      this._mouseHandler.mousedown(event);
    });
  }

}

export = Binder;