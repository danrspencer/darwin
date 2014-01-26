/// <reference path="ref.d.ts" />

import commander = require('commander');
import fs = require('fs');
import promptly = require('promptly');

import webdriver = require('selenium-webdriver');

import Darwin = require('./Main/Darwin');
import Playback = require('./Selenium/Playback');
import Perform = require('./Selenium/Playback/Perform');
import Robot = require('./Selenium/Playback/Robot');
import SchedulerBuilder = require('./Selenium/Playback/SchedulerBuilder');
import Record = require('./Selenium/Record');
import BrowserSync = require('./Selenium/Record/BrowserSync');
import Screenshot = require('./Selenium/Screenshot');
import Session = require('./Selenium/Browser');


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

  var screenshot = new Screenshot(fs);

  var browserSync = new BrowserSync(screenshot);

  var record = new Record(
    fs,
    session,
    browserSync,
    basePath + '/../build/src/darwin-browser.js'
  );

  var robot = new Robot(new SchedulerBuilder(), new Perform());

  var playback = new Playback(
    fs,
    robot,
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
