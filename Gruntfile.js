
module.exports = function(grunt) {

  var tsTypeCheck = true;

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
        options: { module: 'commonjs', ignoreTypeCheck: tsTypeCheck }
      },
      cli: {
        src: ['src/cli/**/*.ts', 'spec/cli/**/*.ts'],
        dest: 'build',
        options: { module: 'commonjs', ignoreTypeCheck: tsTypeCheck }
      },
      common: {
        src: ['src/common/**/*.ts'],
        dest: 'build',
        options: { module: 'commonjs', ignoreTypeCheck: tsTypeCheck }
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

  grunt.registerTask('default', [
    //'tslint',
    'clean:full',
    'common',
    'browser',
    'cli'
  ]);

  grunt.registerTask('browser', [
    'clean:browser',
    'typescript:browser',
    'browserify:browser',
    'karma:browser'
  ]);

  grunt.registerTask('cli', [
    'clean:cli',
    'typescript:cli',
    'jasmine_node'
  ]);

  grunt.registerTask('common', [
    'clean:common',
    'typescript:common'
  ]);

  // Dev tasks - won't fail on TypeScript type mismatches
  grunt.registerTask('dev', 'Build without type checking', function(thing) {
    tsTypeCheck = false;

    grunt.task.run('browser', 'cli', 'common');
  });

  grunt.registerTask('browser_dev', 'Build browser without type checking', function() {
    tsTypeCheck = false;

    grunt.task.run('browser');
  });

  grunt.registerTask('cli_dev', 'Build cli without type checking', function() {
    tsTypeCheck = false;

    grunt.task.run('cli');
  });
}