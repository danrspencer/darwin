import Click = require('../Event/Click');
import IMouseEvent = require('../Data/IMouseEvent');

class Monitor {

  private _data: IMouseEvent[];

  constructor(private _window: Window,
              private _console: Console,
              private _click: Click) {

    this._data = [];
  }

  public setup() {
    this._window.addEventListener('mousedown', (event: MouseEvent) => {
      var result = this._click.onMousedown(event);

      this._console.log(JSON.stringify(this._data));

      this._data.push(result);
    });

    this._window.addEventListener('keypress', (event: KeyboardEvent) => {

    });
  }

  public getOutput(): IMouseEvent[] {
    return this._data;
  }

}

export = Monitor;