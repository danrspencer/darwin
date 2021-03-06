/// <reference path="ref.d.ts" />

import commander = require('commander');
import fs = require('fs');
import promptly = require('promptly');

import gm = require('gm');
import webdriver = require('selenium-webdriver');

import Darwin = require('./Main/Darwin');

import Analyser = require('./Image/Analyser');
import Comparer = require('./Image/Comparer');
import Cropper = require('./Image/Cropper');

import Playback = require('./Playback/Playback');
import Perform = require('./Playback/Perform');
import Robot = require('./Playback/Robot');
import RobotBuilder = require('./Playback/RobotBuilder');
import TestRunner = require('./Playback/TestRunner');
import BrowserSync = require('./Record/BrowserSync');

import Record = require('./Record/Record');
import TestWriter = require('./Record/TestWriter');

import Processor = require('./Result/Processor');
import ResultWriter = require('./Result/ResultWriter');

import Browser = require('./Selenium/Browser');
import Screenshot = require('./Selenium/Screenshot');

function bootstrap(version: string, basePath: string, argv: string[]) {

  commander
    .version(version)
    .option('init', 'initialise a new darwin test suite at the current path')
    .option('new', 'create new tests')
    .option('run', 'run the suite\'s tests')
    .parse(argv);

  var webDriverBuilder = new webdriver.Builder();
  var browser = new Browser(
    webDriverBuilder,
    'http://localhost:9515',
    webdriver.Capabilities.chrome()
  );

  var screenshot = new Screenshot(fs);
  var browserSync = new BrowserSync(screenshot);
  var testWriter = new TestWriter(fs);

  var record = new Record(
    fs,
    browser,
    browserSync,
    testWriter,
    basePath + '/../build/src/darwin-browser.js'
  );

  var cropper = new Cropper(gm);
  var comparer = new Comparer();

  var analyser = new Analyser(cropper, comparer);
  var resultWriter = new ResultWriter();
  var robotBuilder = new RobotBuilder();
  var processor = new Processor(analyser, resultWriter);
  var testRunner = new TestRunner(robotBuilder, browser, processor);
  var playback = new Playback(
    fs,
    testRunner
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