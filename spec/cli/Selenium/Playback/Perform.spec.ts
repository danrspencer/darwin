/// <reference path="../../ref.d.ts" />
import jasmine_tss = require('../../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import webdriver = require('selenium-webdriver');

import ActionType = require('../../../../src/common/Action/ActionType');
import IAction = require('../../../../src/common/Action/IAction');
import IMouseEvent = require('../../../../src/common/Action/IMouseEvent');
import IKeypressEvent = require('../../../../src/common/Action/IKeypressEvent');

import Perform = require('../../../../src/cli/Selenium/Playback/Perform');
import Screenshot = require('../../../../src/cli/Selenium/Screenshot');


describe('Perform', () => {

  var driver: webdriver.Driver;

  var screenshot: Screenshot;

  var perform: Perform;

  beforeEach(() => {
    driver = jasmine.createSpyObj<webdriver.Driver>('driver', ['executeScript', 'then']);
    setSpy(driver.executeScript).toReturn(driver);

    screenshot = jasmine.createSpyObj<Screenshot>('screenshot', ['captureAndSave']);

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

    perform.performAction(driver, action, () => {});

    expect(driver.executeScript).toHaveBeenCalledWith(expectedScript);
  });

  it('uses selenium to click on the element', () => {
    var action = <IMouseEvent>{
      type: ActionType.LEFTCLICK,
      pos: { x: 100, y: 200 }
    };

    var elementSpy = jasmine.createSpyObj<HTMLElement>('elementSpy', ['click']);

    setSpy(driver.then).toCallFake((callback) => {
      callback(elementSpy);
    });

    perform.performAction(driver, action, () => {});

    expect(elementSpy.click).toHaveBeenCalled();
  });

  it('triggers the done callback after sending the click', () => {
    var action = <IMouseEvent>{ type: ActionType.LEFTCLICK, pos: { x: 100, y: 200 } };

    var doneSpy = jasmine.createSpy('doneSpy');
    var elementSpy = jasmine.createSpyObj<HTMLElement>('elementSpy', ['click']);

    setSpy(driver.then).toCallFake((callback) => {
      callback(elementSpy);
    });

    perform.performAction(driver, action, doneSpy);

    expect(doneSpy).toHaveBeenCalled();
  });

  it('inserts a script to get the current active element', () => {
    var action = <IKeypressEvent>{
      type: ActionType.KEYPRESS,
      char: 'a'
    };

    var expectedScript = 'return document.activeElement;';

    perform.performAction(driver, action, () => {});

    expect(driver.executeScript).toHaveBeenCalledWith(expectedScript);
  });

  it('uses selenium to send the keypress', () => {
    var action = <IKeypressEvent>{
      type: ActionType.KEYPRESS,
      char: 'a'
    };

    var elementSpy = jasmine.createSpyObj<HTMLElement>('elementSpy', ['sendKeys']);

    setSpy(driver.then).toCallFake((callback) => {
      callback(elementSpy);
    });

    perform.performAction(driver, action, () => {});

    expect(elementSpy['sendKeys']).toHaveBeenCalledWith('a');
  });

  it('triggers the done callback after sending the keypress', () => {
    var action = <IKeypressEvent>{
      type: ActionType.KEYPRESS,
      char: 'a'
    };

    var doneSpy = jasmine.createSpy('doneSpy');
    var elementSpy = jasmine.createSpyObj<HTMLElement>('elementSpy', ['sendKeys']);

    setSpy(driver.then).toCallFake((callback) => {
      callback(elementSpy);
    });

    perform.performAction(driver, action, doneSpy);

    expect(doneSpy).toHaveBeenCalled();
  });

//  it('delegates to Screenshot for screenshot actions', () => {
//    var action = <IAction>{ type: ActionType.SCREENSHOT };
//    var done = jasmine.createSpy('done');
//
//    perform.performAction(driver, action, done);
//
//    expect(screenshot.captureAndSave).toHaveBeenCalledWith(driver, )
//  });
});