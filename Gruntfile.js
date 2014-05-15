
module.exports = function(grunt) {

  // Run grunt with '--typeCheck no' to not enforce type checking
  var ignoreError = typeof grunt.option('ignoreError') !== 'undefined';

  var cleaned = false;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      browser: {
        files: {
          'build/src/darwin-browser.js': ['build/src/browser/**/*.js']
        }
      }
    },
    clean: {
      full: ['build'],
      cli: ['build/src/cli', 'build/spec/cli'],
      browser: ['build/src/browser', 'build/spec/browser'],
      common: ['build/src/common']
    },
    jasmine_node: {
      cli: ['build/spec/cli/'],
      options: {
        forceExit: true
      }
    },
    karma: {
      browser: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS']
      }
    },
    typescript: {
      browser: {
        src: ['src/browser/**/*.ts', 'spec/browser/**/*.ts'],
        dest: 'build',
        options: { module: 'commonjs', ignoreError: ignoreError }
      },
      cli: {
        src: ['src/cli/**/*.ts', 'spec/cli/**/*.ts'],
        dest: 'build',
        options: { module: 'commonjs', ignoreError: ignoreError }
      },
      common: {
        src: ['src/common/**/*.ts'],
        dest: 'build',
        options: { module: 'commonjs', ignoreError: ignoreError }
      }
    },
    tslint: {
      options: {
        configuration: grunt.file.readJSON('tslint.json')
      },
      all: ['src/**/*.ts', 'spec/**/*.ts']
    }
  });

  // measures the time each task takes
  require('time-grunt')(grunt);

  // autoload grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', function() {

    cleaned = true;

    grunt.task.run(
      'tslint',
      'clean:full',
      'typescript:common',
      'browser',
      'cli'
    );
  });

  grunt.registerTask('browser', function() {

    if (cleaned === false) {
      grunt.task.run('clean:browser')
    }

    grunt.task.run(
      'typescript:browser',
      'browserify:browser',
      'karma:browser'
    );
  });

  grunt.registerTask('cli', function() {

    if (cleaned === false) {
      grunt.task.run('clean:cli')
    }

    grunt.task.run(
      'typescript:cli',
      'jasmine_node'
    );
  });

}