/// <reference path="ref.d.ts" />

import commander = require('commander');
import fs = require('fs');
import promptly = require('promptly');

import webdriver = require('selenium-webdriver');

import Darwin = require('./Main/Darwin');
import Playback = require('./Selenium/Playback');
import Record = require('./Selenium/Record');
import Session = require('./Selenium/Session');
import Screenshot = require('./Selenium/Screenshot');

function bootstrap(version: string, basePath: string, argv: string[]) {

  commander
    .version(version)
    .option('init', 'initialise a new darwin test suite at the current path')
    .option('new', 'create new tests')
    .option('run', 'run the suite\'s tests')
    .parse(argv);

  var webDriverBuilder = new webdriver.Builder();
  var session = new Session(
    webDriverBuilder,
    'http://localhost:9515',
    webdriver.Capabilities.chrome()
  );

  var screenshot = new Screenshot(
    fs
  );

  var record = new Record(
    fs,
    session,
    screenshot,
    basePath + '/../build/src/darwin-browser.js'
  );

  var playback = new Playback(
    fs,
    session
  );

  var darwin = new Darwin(
    fs,
    promptly,
    record,
    playback
  );

  if (commander['init'] === true) {
    darwin.init();
  } else if (commander['new'] === true) {
    darwin.new();
  } else if (commander['run'] === true) {
    darwin.run();
  } else {
    commander['outputHelp']();
  }
}

export = bootstrap;
