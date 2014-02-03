/// <reference path="../ref.d.ts" />

import webdriver = require('selenium-webdriver');

import ActionType = require('../../common/Action/ActionType');
import IAction = require('../../common/Action/IAction');
import IMouseEvent = require('../../common/Action/IMouseEvent');
import IKeypressEvent = require('../../common/Action/IKeypressEvent');

import Capture = require('../Image/Capture');

class Perform {

  constructor(private _driver: webdriver.Driver,
              private _capture: Capture) {

  }

  public performAction(action: IAction, done: () => void) {

    if (action.type === ActionType.LEFTCLICK || action.type === ActionType.RIGHTCLICK) {
      this._handleMouseEvent(<IMouseEvent>action, done);
    } else if (action.type === ActionType.SCREENSHOT) {
      this._capture.resultImage(done);
    } else {
      this._handleKeypress(<IKeypressEvent>action, done);
    }
  }

  private _handleKeypress(action: IKeypressEvent, done: Function) {
    var script = 'return document.activeElement;';

    this._driver
      .executeScript(script)
      .then((el) => {
        el.sendKeys(action.char);
        done();
      });
  }

  private _handleMouseEvent(action: IMouseEvent, done: Function) {
    var position = action.pos.x + ',' + action.pos.y;

    var script = 'var el = document.elementFromPoint(' + position + ');' +
                'if ((el.tagName === "TEXTAREA" || el.tagName === "INPUT") && document.caretPositionFromPoint) {' +
                'var range = document.caretPositionFromPoint(' + position + ');' +
                'var offset = range.offset;' +
                'document.elementFromPoint(' + position + ').setSelectionRange(offset, offset);' +
                '}' +
                'return document.elementFromPoint(' + position + ');';

    this._driver
      .executeScript(script)
      .then((el) => {
        el.click();
        done();
      });
  }


}

export = Perform;