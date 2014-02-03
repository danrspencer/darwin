/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import gm = require('gm');

import ActionType = require('../../../src/common/Action/ActionType');
import IAction = require('../../../src/common/Action/IAction');

import Analyser = require('../../../src/cli/Image/Analyser');

describe('Analyser', () => {

  var gmSpy: typeof gm;

  var analyser: Analyser;

  beforeEach(() => {
    gmSpy = jasmine.createSpyObj<typeof gm>('gm', ['compare']);

    analyser = new Analyser(gmSpy);
  });

  it('delegates to gm to compare screenshots for screenshot actions', () => {

    var actions = <IAction[]>[
      { type: ActionType.SCREENSHOT },
      { type: ActionType.SCREENSHOT },
      { type: ActionType.SCREENSHOT }
    ];

    analyser.analyseResults('testName', actions);

    expect(gmSpy.compare).toHaveBeenCalledWith(
      'testName/1.png',
      'testName/1_result.png',
      { file: 'testName/1_diff.png' },
      jasmine.any(Function)
    );

    expect(gmSpy.compare).toHaveBeenCalledWith(
      'testName/2.png',
      'testName/2_result.png',
      { file: 'testName/2_diff.png' },
      jasmine.any(Function)
    );

    expect(gmSpy.compare).toHaveBeenCalledWith(
      'testName/3.png',
      'testName/3_result.png',
      { file: 'testName/3_diff.png' },
      jasmine.any(Function)
    );
  });

  it('delegates to gm only for screenshot actions', () => {
    var actions = <IAction[]>[
      { type: ActionType.KEYPRESS },
      { type: ActionType.SCREENSHOT },
      { type: ActionType.SCREENSHOT },
      { type: ActionType.LEFTCLICK },
      { type: ActionType.SCREENSHOT }
    ];

    analyser.analyseResults('testName', actions);

    expect(spyOf(gmSpy.compare).callCount).toEqual(3);
  });

});