/// <reference path="ref.d.ts" />

import commander = require('commander');
import fs = require('fs');
import promptly = require('promptly');

import webdriver = require('selenium-webdriver');

import Darwin = require('./Main/Darwin');

function bootstrap(version: string, argv: string[]) {

  commander
    .version(version)
    .parse(argv);

  var webDriverBuilder = new webdriver.Builder();
  var darwin = new Darwin(
    fs,
    promptly,
    webDriverBuilder,
    'build/src/darwin-browser.js',
    'http://localhost:9515',
    webdriver.Capabilities.chrome()
  );

  darwin.init();
}

export = bootstrap;
