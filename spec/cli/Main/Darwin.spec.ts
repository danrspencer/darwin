/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import Darwin = require('../../../src/cli/Main/Darwin');

import fs = require('fs');
import promptly = require('promptly');


describe('Darwin', () => {

  var promptlySpy: typeof promptly;
  var fsSpy: typeof fs;

  var darwin: Darwin;

  beforeEach(() => {
    promptlySpy = jasmine.createSpyObj<typeof promptly>('promptlySpy', ['prompt']);
    fsSpy = jasmine.createSpyObj<typeof fs>('fsSpy', ['mkdirSync']);

    darwin = new Darwin(fsSpy, promptlySpy);
  });

  it('delegates to promptly to prompt the user to enter the test description', () => {
    darwin.init();

    expect(promptlySpy.prompt).toHaveBeenCalledWith('Enter a test description: ', jasmine.any(Function));
  });

  it('delegates creates a directory named after the test', () => {

    setSpy(promptlySpy.prompt).toCallFake((value: string, callback: Function) => {
      callback(null, 'test desc');
    });

    darwin.init();

    expect(fsSpy.mkdirSync).toHaveBeenCalledWith('test desc');
  });

});