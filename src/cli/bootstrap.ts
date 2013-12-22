/// <reference path="ref.d.ts" />

import commander = require('commander');
import fs = require('fs');
import promptly = require('promptly');

import webdriver = require('selenium-webdriver');

import Darwin = require('./Main/Darwin');
import Record = require('./Selenium/Record');

function bootstrap(version: string, argv: string[]) {

  commander
    .version(version)
    .parse(argv);

  var webDriverBuilder = new webdriver.Builder();

  var record = new Record(
    webDriverBuilder,
    'http://www.google.co.uk',
    { 'browserName': 'chrome' }
  );

  var darwin = new Darwin(
    fs,
    promptly,
    record,
    'build/src/darwin-browser.js'
  );

  darwin.init();
}

export = bootstrap;
