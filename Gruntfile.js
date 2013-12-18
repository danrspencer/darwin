
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    ts: {
      browser: {
        src: ['src/browser/**/*.ts', 'spec/browser/**/*.ts'],
        outDir: 'build',
        options: {
          module: 'commonjs',
          sourceMap: true
        }
      },
      cli: {
        src: ['src/cli/**/*.ts', 'spec/cli/**/*.ts'],
        outDir: 'build',
        options: {
          module: 'commonjs',
          sourceMap: true
        }
      }
    },

    typescript: {
      browser: {
        src: ['src/browser/**/*.ts', 'spec/browser/**/*.ts'],
        dest: 'build',
        options: {
          module: 'commonjs'
        }
      },
      cli: {
        src: ['src/cli/**/*.ts', 'spec/cli/**/*.ts'],
        dest: 'build',
        options: {
          module: 'commonjs'
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
    grunt.task.run('browser');
    grunt.task.run('cli');
  });

  grunt.registerTask('browser', 'Build browser scripts...', function() {
    grunt.task.run('ts:browser');
    grunt.task.run('browserify:browser');
    grunt.task.run('karma:browser');
  });

  grunt.registerTask('cli', 'Build cli scripts...', function() {
    grunt.task.run('typescript:cli');
    grunt.task.run('jasmine_node');
  });

}