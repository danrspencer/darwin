/// <reference path="../ref.d.ts" />
import jasmine_tss = require('../../jasmine_tss'); var setSpy = jasmine_tss.setSpy, spyOf = jasmine_tss.spyOf;

import fs = require('fs');
import webdriver = require('selenium-webdriver');

import ISuite = require('../../../src/cli/Main/ISuite');

import Playback = require('../../../src/cli/Selenium/Playback');
import Session = require('../../../src/cli/Selenium/Session');
import Screenshot = require('../../../src/cli/Selenium/Screenshot');

describe('Playback', () => {

  var fsSpy: typeof fs;

  var sessionSpy: Session;

  var driverSpy: webdriver.Driver;
  var manageSpy: webdriver.Manage;

  var suiteStub: ISuite;

  var playback: Playback;

  beforeEach(() => {
    fsSpy = jasmine.createSpyObj<typeof fs>('fsSpy', ['readFileSync', 'writeFileSync']);

    sessionSpy = jasmine.createSpyObj<Session>('sessionSpy', ['start']);
    setSpy(sessionSpy.start).toCallFake((url, height, width, callback) => {
      callback(driverSpy);
    });

    driverSpy = jasmine.createSpyObj<webdriver.Driver>('driverSpy', ['manage', 'get', 'executeScript', 'executeAsyncScript', 'then']);
    manageSpy = jasmine.createSpyObj<webdriver.Manage>('manageSpy', ['window', 'timeouts']);

    setSpy(driverSpy.manage).toReturn(manageSpy);
    setSpy(driverSpy.executeAsyncScript).toReturn(driverSpy);

    suiteStub = {
      browserSize: {
        width: 1280,
        height: 768
      },
      url: 'www.google.co.uk'
    };

    playback = new Playback(fs, sessionSpy);
  });

  it('delegates to session to start a selenium session', () => {
    playback.play(suiteStub);

    expect(sessionSpy.start).toHaveBeenCalledWith('www.google.co.uk', 1280, 768, jasmine.any(Function));
  });


});