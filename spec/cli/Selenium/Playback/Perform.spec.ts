/// <reference path="../../ref.d.ts" />
import jasmine_tss = require('../../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import webdriver = require('selenium-webdriver');

import ActionType = require('../../../../src/common/Action/ActionType');
import IAction = require('../../../../src/common/Action/IAction');
import IMouseEvent = require('../../../../src/common/Action/IMouseEvent');

import Perform = require('../../../../src/cli/Selenium/Playback/Perform');

describe('Perform', () => {

  var driverSpy: webdriver.Driver;

  var perform: Perform;

  beforeEach(() => {
    driverSpy = jasmine.createSpyObj<webdriver.Driver>('driverSpy', ['executeScript']);

    perform = new Perform();
  });

  it('inserts the script to find the element for click events', () => {
    var action = <IMouseEvent>{
      type: ActionType.LEFTCLICK,
      pos: { x: 100, y: 200 }
    };

    var expectedScript = 'var el = document.elementFromPoint(100,200);' +
      'if ((el.tagName === "TEXTAREA" || el.tagName === "INPUT") && document.caretPositionFromPoint) {' +
      'var range = document.caretPositionFromPoint(100,200);' +
      'var offset = range.offset;' +
      'document.elementFromPoint(100,200).setSelectionRange(offset, offset);' +
      '}' +
      'return document.elementFromPoint(100,200);';

    perform.performAction(driverSpy, action);

    expect(driverSpy.executeScript).toHaveBeenCalledWith(expectedScript);
  });


});