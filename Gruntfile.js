
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-jasmine-node');

  grunt.registerTask('default', 'Building everything...', function() {
    grunt.task.run('common');
    grunt.task.run('browser');
    grunt.task.run('cli');
  });

  grunt.registerTask('browser', 'Build browser scripts...', function() {
    grunt.task.run('typescript:browser');
    grunt.task.run('browserify:browser');
    grunt.task.run('karma:browser');
  });

  grunt.registerTask('cli', 'Build cli scripts...', function() {
    grunt.task.run('typescript:cli');
    grunt.task.run('jasmine_node');
  });

  grunt.registerTask('common', 'Build common scripts...', function() {
    grunt.task.run('typescript:common');
  });

}