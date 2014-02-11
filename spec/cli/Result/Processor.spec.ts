/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import IResultImage = require('../../../src/common/Result/IResultImage');
import ActionType = require('../../../src/common/Test/ActionType');
import IAction = require('../../../src/common/Test/IAction');
import ITest = require('../../../src/common/Test/ITest');

import Analyser = require('../../../src/cli/Image/Analyser');
import Processor = require('../../../src/cli/Result/Processor');
import ResultWriter = require('../../../src/cli/Result/ResultWriter');

describe('Processor', () => {

  var _analyser: Analyser;
  var _resultWriter: ResultWriter;

  var processor: Processor;

  beforeEach(() => {
    _analyser = jasmine.createSpyObj<Analyser>('analyser', ['process']);
    _resultWriter = jasmine.createSpyObj<ResultWriter>('resultWriter', ['save', 'addDiff']);

    processor = new Processor(_analyser, _resultWriter);
  });

  it('delegates to Analyser for each action', () => {
    var test = <ITest>{
      actions: [
        { type: ActionType.SCREENSHOT, delay: 10, segments: [ { topLeft: 0 } ] },
        { type: ActionType.SCREENSHOT, delay: 50, segments: [ { topLeft: 5 } ] },
        { type: ActionType.SCREENSHOT, delay: 100, segments: [ { topLeft: 10 } ] }
      ]
    };

    processor.processResults('testName', test);

    expect(_analyser.process).toHaveBeenCalledWith('testName', 1, [ { topLeft: 0 } ], jasmine.any(Function));
    expect(_analyser.process).toHaveBeenCalledWith('testName', 2, [ { topLeft: 5 } ], jasmine.any(Function));
    expect(_analyser.process).toHaveBeenCalledWith('testName', 3, [ { topLeft: 10 } ], jasmine.any(Function));
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

    processor.processResults('', test);

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
    setSpy(_analyser.process).toCallFake((testName, counter, segments, callback) => {
      analyserCallbacks.push(callback);
    });

    processor.processResults('testName', test);

    var resultImages = [
      <IResultImage>{ image: '1' },
      <IResultImage>{ image: '2' },
      <IResultImage>{ image: '3' }
    ];

    analyserCallbacks[0](resultImages[0]);
    analyserCallbacks[1](resultImages[1]);
    expect(_resultWriter.save).not.toHaveBeenCalled();

    analyserCallbacks[2](resultImages[2]);
    expect(_resultWriter.save).toHaveBeenCalledWith(resultImages);
  });

});