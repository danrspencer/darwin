/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import fs = require('fs');

import ActionType = require('../../../src/common/Test/ActionType');
import IAction = require('../../../src/common/Test/IAction');
import ITest = require('../../../src/common/Test/ITest');

import TestWriter = require('../../../src/cli/Record/TestWriter');


describe('TestWriter', () => {

  var _fs: typeof fs;

  var testWriter: TestWriter;

  beforeEach(() => {

    _fs = jasmine.createSpyObj<typeof fs>('fs', ['writeFileSync']);

    testWriter = new TestWriter(_fs);
  });

  it('save\'s the test to a file', () => {
    var actions: IAction[] = [
      { type: ActionType.LEFTCLICK, delay: 10 },
      { type: ActionType.KEYPRESS, delay: 20 },
      { type: ActionType.RIGHTCLICK, delay: 30 }
    ];

    var expectedTest: ITest = {
      options: {
        tolerance: '0.000000005'
      },
      actions: actions
    };

    var expectedJson = JSON.stringify(expectedTest, null, 2);

    testWriter.save('testing something', actions);

    expect(_fs.writeFileSync).toHaveBeenCalledWith('testing something/test.json', expectedJson);
  });

});