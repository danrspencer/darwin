
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      full: ["build"],
      cli: ["build/src/cli", "build/spec/cli"],
      browser: ["build/src/browser", "build/spec/browser"],
      common: ["build/src/common"]
    },
    typescript: {
      browser: {
        src: ['src/browser/**/*.ts', 'spec/browser/**/*.ts'],
        dest: 'build',
        options: {
          module: 'commonjs',
          ignoreTypeCheck: false
        }
      },
      cli: {
        src: ['src/cli/**/*.ts', 'spec/cli/**/*.ts'],
        dest: 'build',
        options: {
          module: 'commonjs',
          ignoreTypeCheck: false
        }
      },
      common: {
        src: ['src/common/**/*.ts'],
        dest: 'build',
        options: {
          module: 'commonjs',
          ignoreTypeCheck: false
        }
      },
      browser_dev: {
        src: ['src/browser/**/*.ts', 'spec/browser/**/*.ts'],
        dest: 'build',
        options: {
          module: 'commonjs',
          ignoreTypeCheck: true
        }
      },
      cli_dev: {
        src: ['src/cli/**/*.ts', 'spec/cli/**/*.ts'],
        dest: 'build',
        options: {
          module: 'commonjs',
          ignoreTypeCheck: true
        }
      }
    },
    browserify: {
      browser: {
        files: {
          'build/src/darwin-browser.js': ['build/src/browser/**/*.js']
        }
      }
    },
    karma: {
      browser: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS']
      }
    },
    jasmine_node: {
      projectRoot: "build/spec/cli"
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-jasmine-node');

  grunt.registerTask('default', [
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
  grunt.registerTask('dev', [
    'browser_dev',
    'cli_dev'
  ]);

  grunt.registerTask('browser_dev', [
    'clean:browser',
    'typescript:browser_dev',
    'browserify:browser',
    'karma:browser'
  ]);
  grunt.registerTask('cli_dev', [
    'clean:cli',
    'typescript:cli_dev',
    'jasmine_node'
  ]);
}