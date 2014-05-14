
module.exports = function(grunt) {

  // Run grunt with '--typeCheck no' to not enforce type checking
  // when compiling TypeScript
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
      full: ["build"],
      cli: ["build/src/cli", "build/spec/cli"],
      browser: ["build/src/browser", "build/spec/browser"],
      common: ["build/src/common"]
    },
    jasmine_node: {
      projectRoot: "build/spec/cli",
      forceExit: true
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
      files: {
        src: ['src/**/*.ts', 'spec/**/*.ts']
      }
    },
    "tpm-install": {
      options: { dev: true },
      all: { src: 'package.json', dest: 'd.ts/' }
    },
    "tpm-index": {
      all: { src: ['d.ts/**/*.d.ts'], dest: 'd.ts/all.d.ts' }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-tslint');

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