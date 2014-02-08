/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import ITest = require('../../../src/common/Test/ITest');

import Processor = require('../../../src/cli/Result/Processor');
import ProcessorBuilder = require('../../../src/cli/Result/ProcessorBuilder');
import ResultHandler = require('../../../src/cli/Result/ResultHandler');

describe('ResultHandler', () => {

  var _processorBuilder: ProcessorBuilder;
  var _processor: Processor;

  var resultHandler: ResultHandler;

  beforeEach(() => {

    _processorBuilder = jasmine.createSpyObj<ProcessorBuilder>('ProcessorBuilder', ['getProcessor']);
    _processor = jasmine.createSpyObj<ProcessorBuilder>('Processor', ['processResults']);
    setSpy(_processorBuilder.getProcessor).toReturn(_processor);

    resultHandler = new ResultHandler(_processorBuilder);
  });

  it('delegates to ProcessorBuilder to get a Processor', () => {
    resultHandler.handleResults('testName', <ITest>{ options: {} });

    expect(_processorBuilder.getProcessor).toHaveBeenCalledWith('testName');
  });

  it('delegates to Processor to get the results', () => {
    var test = <ITest>{ options: {} };

    resultHandler.handleResults('testName', test);

    expect(_processor.processResults).toHaveBeenCalledWith(test);
  });

});