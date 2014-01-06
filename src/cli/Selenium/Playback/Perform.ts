/// <reference path="../../ref.d.ts" />

import webdriver = require('selenium-webdriver');

import ActionType = require('../../../common/Action/ActionType');
import IAction = require('../../../common/Action/IAction');
import IMouseEvent = require('../../../common/Action/IMouseEvent');
import IKeypressEvent = require('../../../common/Action/IKeypressEvent');

class Perform {

  public performAction(driver: webdriver.Driver, action: IAction) {

    if (action.type === ActionType.LEFTCLICK || action.type === ActionType.RIGHTCLICK) {
      this._handleMouseEvent(driver, <IMouseEvent>action);
    } else {
      this._handleKeypress(driver, <IKeypressEvent>action);
    }

  }

  private _handleKeypress(driver: webdriver.Driver, action: IKeypressEvent) {
    var script = 'return document.activeElement;';

    driver
      .executeScript(script)
      .then((el) => {
        el.sendKeys(action.char);
      });
  }

  private _handleMouseEvent(driver: webdriver.Driver, action: IMouseEvent) {
    var position = action.pos.x + ',' + action.pos.y;

    var script = 'var el = document.elementFromPoint(' + position + ');' +
                'if ((el.tagName === "TEXTAREA" || el.tagName === "INPUT") && document.caretPositionFromPoint) {' +
                'var range = document.caretPositionFromPoint(' + position + ');' +
                'var offset = range.offset;' +
                'document.elementFromPoint(' + position + ').setSelectionRange(offset, offset);' +
                '}' +
                'return document.elementFromPoint(' + position + ');'

    driver
      .executeScript(script)
      .then((el) => {
        el.click();
      });
  }

}

export = Perform;