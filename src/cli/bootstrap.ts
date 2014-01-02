/// <reference path="ref.d.ts" />

import commander = require('commander');
import fs = require('fs');
import promptly = require('promptly');

import webdriver = require('selenium-webdriver');

import Darwin = require('./Main/Darwin');
import Record = require('./Selenium/Record');
import Session = require('./Selenium/Session');
import Screenshot = require('./Selenium/Screenshot');

function bootstrap(version: string, basePath: string, argv: string[]) {

  commander
    .version(version)
    .option('-i, --init', 'initialise a new darwin test suite at the current path')
    .option('-n, --new', 'create new tests')
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

  var darwin = new Darwin(
    fs,
    promptly,
    record
  );

  if (commander['new'] === true) {
    darwin.new();
  } else if (commander['init'] === true) {
    darwin.init();
  } else {
    commander['outputHelp']();
  }
}

export = bootstrap;
