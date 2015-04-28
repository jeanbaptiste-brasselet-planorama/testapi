module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-githooks');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-mocha-cov');


  var CHECK_MATCH = [
    '**/*.js',
    '!**/node_modules/**'
  ];


  grunt.initConfig({

    /**
     * Git pre-commit hook
     */
    githooks: {
      all: {
        'pre-commit': 'check'
      }
    },

    /**
     * JSHint
     */
    jshint: {
      options: {
        jshintrc: true,
        reporter: require('jshint-stylish')
      },
      all: CHECK_MATCH
    },

    /**
     * JS Code Sniffer
     */
    jscs: {
      all: CHECK_MATCH,
      options: {
        config: '.jscsrc'
      }
    },

    /**
     * Mocha
     */
    mochacov: {
      test: {
        options: {
          reporter: 'spec',
          recursive: true,
          require: [
            'test/common.js'
          ]
        },
        src: ['test/**/*.test.js']
      },
      coverage: {
        options: {
          reporter: 'html-cov',
          output: 'coverage.html',
          quiet: true,
          recursive: true,
          require: [
            'test/common.js'
          ],
          src: ['test/**/*.test.js']
        }
      }
    }
  });

  grunt.registerTask('hook', 'githooks');
  grunt.registerTask('test', 'mochacov:test');
  grunt.registerTask('cov', ['mochacov:test', 'mochacov:coverage']);
  grunt.registerTask('check', ['hook', 'jshint', 'jscs', 'mochacov:test']);
  grunt.registerTask('default', 'check');
};
