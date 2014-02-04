/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import IDiff = require('../../../src/common/Result/IDiff');
import ActionType = require('../../../src/common/Test/ActionType');
import IAction = require('../../../src/common/Test/IAction');
import ITest = require('../../../src/common/Test/ITest');

import Analyser = require('../../../src/cli/Image/Analyser');
import Processor = require('../../../src/cli/Result/Processor');
import ResultWriter = require('../../../src/cli/Result/ResultWriter');

describe('Analyser', () => {

  var _analyser: Analyser;
  var _resultWriter: ResultWriter;

  var processor: Processor;

  beforeEach(() => {
    _analyser = jasmine.createSpyObj<Analyser>('analyser', ['process']);
    _resultWriter = jasmine.createSpyObj<ResultWriter>('resultWriter', ['save']);

    processor = new Processor(_analyser, _resultWriter);
  });

  it('delegates to Analyser for each action', () => {
    var test = <ITest>{
      actions: [
        { type: ActionType.SCREENSHOT, delay: 10 },
        { type: ActionType.SCREENSHOT, delay: 50 },
        { type: ActionType.SCREENSHOT, delay: 100 }
      ]
    };

    processor.processResults('testName', test);

    expect(_analyser.process).toHaveBeenCalledWith('testName', test.actions[0], 1, jasmine.any(Function));
    expect(_analyser.process).toHaveBeenCalledWith('testName', test.actions[1], 2, jasmine.any(Function));
    expect(_analyser.process).toHaveBeenCalledWith('testName', test.actions[2], 3, jasmine.any(Function));
  });

  it('delegates to Analyser only for screenshot actions', () => {

    var test = <ITest>{
      actions: [
        { type: ActionType.KEYPRESS, delay: 10 },
        { type: ActionType.SCREENSHOT, delay: 10 },
        { type: ActionType.SCREENSHOT, delay: 10 },
        { type: ActionType.LEFTCLICK, delay: 10 },
        { type: ActionType.SCREENSHOT, delay: 10 }
      ]
    };

    processor.processResults('testName', test);

    expect(spyOf(_analyser.process).callCount).toEqual(3);
  });

  it('delegates to ResultWriter after each image has been analysed', () => {
    var test = <ITest>{
      options: {
        tolerance: '0.0005'
      },
      actions: [
        { type: ActionType.SCREENSHOT, delay: 10 },
        { type: ActionType.SCREENSHOT, delay: 50 },
        { type: ActionType.SCREENSHOT, delay: 100 }
      ]
    };

    var analyserCallbacks = [];
    setSpy(_analyser.process).toCallFake((testName, action, counter, callback) => {
      analyserCallbacks.push(callback);
    });

    processor.processResults('testName', test);

    var diffs = [
      <IDiff>{ image: '1' },
      <IDiff>{ image: '2' },
      <IDiff>{ image: '3' },
    ]

    analyserCallbacks[0](diffs[0]);
    analyserCallbacks[1](diffs[1]);
    expect(_resultWriter.save).not.toHaveBeenCalled();

    analyserCallbacks[2](diffs[2]);
    expect(_resultWriter.save).toHaveBeenCalledWith('testName', diffs);
  });


});