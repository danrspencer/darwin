/// <reference path="ref.d.ts" />

import commander = require('commander');
import fs = require('fs');
import promptly = require('promptly');

import Darwin = require('./Main/Darwin');

function bootstrap(version: string, argv: string[]) {

  commander
    .version(version)
    .parse(argv);

  var darwin = new Darwin(fs, promptly);

  darwin.init();
}

export = bootstrap;
