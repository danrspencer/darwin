/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import webdriver = require('selenium-webdriver');

import ActionType = require('../../../src/common/Test/ActionType');
import IAction = require('../../../src/common/Test/IAction');
import IMouseAction = require('../../../src/common/Test/IMouseAction');
import IKeypressAction = require('../../../src/common/Test/IKeypressAction');

import Capture = require('../../../src/cli/Image/Capture');
import Perform = require('../../../src/cli/Playback/Perform');


describe('Perform', () => {

  var driver: webdriver.Driver;

  var capture: Capture;

  var perform: Perform;

  beforeEach(() => {
    driver = jasmine.createSpyObj<webdriver.Driver>('driver', ['executeScript', 'then', 'quit']);
    setSpy(driver.executeScript).toReturn(driver);

    capture = jasmine.createSpyObj<Capture>('capture', ['resultImage']);

    perform = new Perform(driver, capture);
  });

  it('inserts the script to find the element for click events', () => {
    var action = <IMouseAction>{
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

    perform.performAction(action, () => {});

    expect(driver.executeScript).toHaveBeenCalledWith(expectedScript);
  });

  it('uses selenium to click on the element', () => {
    var action = <IMouseAction>{
      type: ActionType.LEFTCLICK,
      pos: { x: 100, y: 200 }
    };

    var elementSpy = jasmine.createSpyObj<HTMLElement>('elementSpy', ['click']);

    setSpy(driver.then).toCallFake((callback) => {
      callback(elementSpy);
    });

    perform.performAction(action, () => {});

    expect(elementSpy.click).toHaveBeenCalled();
  });

  it('triggers the done callback after sending the click', () => {
    var action = <IMouseAction>{ type: ActionType.LEFTCLICK, pos: { x: 100, y: 200 } };

    var doneSpy = jasmine.createSpy('doneSpy');
    var elementSpy = jasmine.createSpyObj<HTMLElement>('elementSpy', ['click']);

    setSpy(driver.then).toCallFake((callback) => {
      callback(elementSpy);
    });

    perform.performAction(action, doneSpy);

    expect(doneSpy).toHaveBeenCalled();
  });

  it('inserts a script to get the current active element', () => {
    var action = <IKeypressAction>{
      type: ActionType.KEYPRESS,
      char: 'a'
    };

    var expectedScript = 'return document.activeElement;';

    perform.performAction(action, () => {});

    expect(driver.executeScript).toHaveBeenCalledWith(expectedScript);
  });

  it('uses selenium to send the keypress', () => {
    var action = <IKeypressAction>{
      type: ActionType.KEYPRESS,
      char: 'a'
    };

    var elementSpy = jasmine.createSpyObj<HTMLElement>('elementSpy', ['sendKeys']);

    setSpy(driver.then).toCallFake((callback) => {
      callback(elementSpy);
    });

    perform.performAction(action, () => {});

    expect(elementSpy['sendKeys']).toHaveBeenCalledWith('a');
  });

  it('triggers the done callback after sending the keypress', () => {
    var action = <IKeypressAction>{
      type: ActionType.KEYPRESS,
      char: 'a'
    };

    var doneSpy = jasmine.createSpy('doneSpy');
    var elementSpy = jasmine.createSpyObj<HTMLElement>('elementSpy', ['sendKeys']);

    setSpy(driver.then).toCallFake((callback) => {
      callback(elementSpy);
    });

    perform.performAction(action, doneSpy);

    expect(doneSpy).toHaveBeenCalled();
  });

  it('delegates to Capture for Screenshot events', () => {
    var action = <IKeypressAction>{
      type: ActionType.SCREENSHOT,
      char: 'a'
    };

    var done = jasmine.createSpy('done');

    perform.performAction(action, done);

    expect(capture.resultImage).toHaveBeenCalledWith(done);
  });
});