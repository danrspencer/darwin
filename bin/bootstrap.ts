/// <reference path="../bower_components/DefinitelyTyped/commander/commander.d.ts" />
/// <reference path="../bower_components/DefinitelyTyped/node/node.d.ts" />

import commander = require('commander');
import fs = require('fs');
import promptly = require('promptly');

import Darwin = require('../lib/cli/Main/Darwin');

function bootstrap(version: string, argv: string[]) {

  commander
    .version(version)
    .parse(argv);

  var darwin = new Darwin(fs, promptly);

  darwin.init();
}

export = bootstrap;