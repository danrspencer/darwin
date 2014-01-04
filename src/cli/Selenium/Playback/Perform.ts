
import webdriver = require('selenium-webdriver');

import IAction = require('../../../common/Action/IAction');

class Perform {

  public performAction(driver: webdriver.Driver, action: IAction) {
    driver.executeScript('var el = document.elementFromPoint(100,200);' +
      'if ((el.tagName === "TEXTAREA" || el.tagName === "INPUT") && document.caretPositionFromPoint) {' +
      'var range = document.caretPositionFromPoint(100,200);' +
      'var offset = range.offset;' +
      'document.elementFromPoint(100,200).setSelectionRange(offset, offset);' +
      '}' +
      'return document.elementFromPoint(100,200);');
  }

}

export = Perform;