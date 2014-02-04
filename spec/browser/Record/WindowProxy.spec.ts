import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import WindowProxy = require('../../../src/browser/Record/WindowProxy');

import IAction = require('../../../src/common/Test/IAction');
import IDarwinWindow = require('../../../src/common/IDarwinWindow');

describe('WindowProxy', () => {

  var window: IDarwinWindow;

  var windowProxy: WindowProxy;

  beforeEach(() => {
    window = <IDarwinWindow>{};

    windowProxy = new WindowProxy(window);
  });

  it('initialises the window Darwin object', () => {
    expect(window.__darwin).not.toBeUndefined();
    expect(window.__darwin.actions).toEqual([]);
    expect(window.__darwin.pendingScreenshot).toEqual(false);
  });

  it('adds actions to the actions array', () => {
    var action1 = <IAction>{ type: 1 };
    var action2 = <IAction>{ type: 2 };
    var action3 = <IAction>{ type: 3 };

    windowProxy.addAction(action1);
    windowProxy.addAction(action2);
    windowProxy.addAction(action3);

    expect(window.__darwin.actions[0]).toBe(action1);
    expect(window.__darwin.actions[1]).toBe(action2);
    expect(window.__darwin.actions[2]).toBe(action3);
  });

  it('sets the pendingScreenshot status', () => {
    windowProxy.setPendingScreenshot();

    expect(window.__darwin.pendingScreenshot).toEqual(true);
  });

});