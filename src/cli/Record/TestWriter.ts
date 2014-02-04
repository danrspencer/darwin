
import fs = require('fs');

import IAction = require('../../common/Test/IAction');
import ITest = require('../../common/Test/ITest');

class TestWriter {

  constructor(private _fs: typeof fs) {

  }

  public save(testName: string, actions: IAction[]) {
    var test: ITest = {
      options: {
        tolerance: '0.000000005'
      },
      actions: actions
    };

    var json = JSON.stringify(test, null, 2);

    this._fs.writeFileSync(testName + '/test.json', json);
  }

}

export = TestWriter;