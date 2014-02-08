
import ITest = require('../../common/Test/ITest');

import ProcessorBuilder = require('./ProcessorBuilder');

class ResultHandler {

  constructor(private _processorBuilder: ProcessorBuilder) {

  }

  public handleResults(testName: string, test: ITest) {
    var processor = this._processorBuilder.getProcessor(testName);

    processor.processResults(test);
  }

}

export = ResultHandler;