'use strict';

var serveFavicon = require('serve-favicon');
var serveStatic = require('serve-static');
var serveIndex = require('serve-index');
var files = require('./angularFiles').files;
var util = require('./lib/grunt/utils.js');
var versionInfo = require('./lib/versions/version-info');
var path = require('path');
var e2e = require('./test/e2e/tools');

module.exports = function(grunt) {
  //grunt plugins
  require('load-grunt-tasks')(grunt);

  grunt.loadTasks('lib/grunt');
  grunt.loadNpmTasks('angular-benchpress');

  var NG_VERSION = versionInfo.currentVersion;
  NG_VERSION.cdn = versionInfo.cdnVersion;
  var dist = 'angular-' + NG_VERSION.full;

  if (versionInfo.cdnVersion == null) {
    throw new Error('Unable to read CDN version, are you offline or has the CDN not been properly pushed?');
  }

  //config
  grunt.initConfig({
    NG_VERSION: NG_VERSION,
    bp_build: {
      options: {
        buildPath: 'build/benchmarks',
        benchmarksPath: 'benchmarks'
      }
    },

    connect: {
      devserver: {
        options: {
          port: 8000,
          hostname: '0.0.0.0',
          base: '.',
          keepalive: true,
          middleware: function(connect, options) {
            var base = Array.isArray(options.base) ? options.base[options.base.length - 1] : options.base;
            return [
              util.conditionalCsp(),
              util.rewrite(),
              e2e.middleware(),
              serveFavicon('images/favicon.ico'),
              serveStatic(base),
              serveIndex(base)
            ];
          }
        }
      },
      testserver: {
        options: {
          // We use end2end task (which does not start the webserver)
          // and start the webserver as a separate process (in travis_build.sh)
          // to avoid https://github.com/joyent/libuv/issues/826
          port: 8000,
          hostname: '0.0.0.0',
          middleware: function(connect, options) {
            var base = Array.isArray(options.base) ? options.base[options.base.length - 1] : options.base;
            return [
              function(req, resp, next) {
                // cache get requests to speed up tests on travis
                if (req.method === 'GET') {
                  resp.setHeader('Cache-control', 'public, max-age=3600');
                }

                next();
              },
              util.conditionalCsp(),
              e2e.middleware(),
              serveFavicon('images/favicon.ico'),
              serveStatic(base)
            ];
          }
        }
      }
    },


    tests: {
      jqlite: 'karma-jqlite.conf.js',
      jquery: 'karma-jquery.conf.js',
      'jquery-2.2': 'karma-jquery-2.2.conf.js',
      'jquery-2.1': 'karma-jquery-2.1.conf.js',
      docs: 'karma-docs.conf.js',
      modules: 'karma-modules.conf.js'
    },


    autotest: {
      jqlite: 'karma-jqlite.conf.js',
      jquery: 'karma-jquery.conf.js',
      'jquery-2.2': 'karma-jquery-2.2.conf.js',
      'jquery-2.1': 'karma-jquery-2.1.conf.js',
      modules: 'karma-modules.conf.js',
      docs: 'karma-docs.conf.js'
    },


    protractor: {
      normal: 'protractor-conf.js',
      travis: 'protractor-travis-conf.js',
      jenkins: 'protractor-jenkins-conf.js'
    },


    clean: {
      build: ['build'],
      tmp: ['tmp']
    },

    eslint: {
      all: {
        src: [
          '*.js',
          'benchmarks/**/*.js',
          'docs/**/*.js',
          'lib/**/*.js',
          'scripts/**/*.js',
          'src/**/*.js',
          'test/**/*.js',
          'i18n/**/*.js',
          '!docs/app/assets/js/angular-bootstrap/**',
          '!docs/bower_components/**',
          '!docs/config/templates/**',
          '!src/angular.bind.js',
          '!i18n/closure/**',
          '!src/ngParseExt/ucd.js'
        ]
      }
    },

    build: {
      scenario: {
        dest: 'build/angular-scenario.js',
        src: [
          'bower_components/jquery/dist/jquery.js',
          util.wrap([files['angularSrc'], files['angularScenario']], 'ngScenario/angular')
        ],
        styles: {
          css: ['css/angular.css', 'css/angular-scenario.css']
        }
      },
      angular: {
        dest: 'build/angular.js',
        src: util.wrap([files['angularSrc']], 'angular'),
        styles: {
          css: ['css/angular.css'],
          generateCspCssFile: true,
          minify: true
        }
      },
      loader: {
        dest: 'build/angular-loader.js',
        src: util.wrap(files['angularLoader'], 'loader')
      },
      touch: {
        dest: 'build/angular-touch.js',
        src: util.wrap(files['angularModules']['ngTouch'], 'module')
      },
      mocks: {
        dest: 'build/angular-mocks.js',
        src: util.wrap(files['angularModules']['ngMock'], 'module'),
        strict: false
      },
      sanitize: {
        dest: 'build/angular-sanitize.js',
        src: util.wrap(files['angularModules']['ngSanitize'], 'module')
      },
      resource: {
        dest: 'build/angular-resource.js',
        src: util.wrap(files['angularModules']['ngResource'], 'module')
      },
      messageformat: {
        dest: 'build/angular-message-format.js',
        src: util.wrap(files['angularModules']['ngMessageFormat'], 'module')
      },
      messages: {
        dest: 'build/angular-messages.js',
        src: util.wrap(files['angularModules']['ngMessages'], 'module')
      },
      animate: {
        dest: 'build/angular-animate.js',
        src: util.wrap(files['angularModules']['ngAnimate'], 'module')
      },
      route: {
        dest: 'build/angular-route.js',
        src: util.wrap(files['angularModules']['ngRoute'], 'module')
      },
      cookies: {
        dest: 'build/angular-cookies.js',
        src: util.wrap(files['angularModules']['ngCookies'], 'module')
      },
      aria: {
        dest: 'build/angular-aria.js',
        src: util.wrap(files['angularModules']['ngAria'], 'module')
      },
      parseext: {
        dest: 'build/angular-parse-ext.js',
        src: util.wrap(files['angularModules']['ngParseExt'], 'module')
      },
      'promises-aplus-adapter': {
        dest:'tmp/promises-aplus-adapter++.js',
        src:['src/ng/q.js', 'lib/promises-aplus/promises-aplus-test-adapter.js']
      }
    },


    min: {
      angular: 'build/angular.js',
      animate: 'build/angular-animate.js',
      cookies: 'build/angular-cookies.js',
      loader: 'build/angular-loader.js',
      messageformat: 'build/angular-message-format.js',
      messages: 'build/angular-messages.js',
      touch: 'build/angular-touch.js',
      resource: 'build/angular-resource.js',
      route: 'build/angular-route.js',
      sanitize: 'build/angular-sanitize.js',
      aria: 'build/angular-aria.js',
      parseext: 'build/angular-parse-ext.js'
    },


    'ddescribe-iit': {
      files: [
        'src/**/*.js',
        'test/**/*.js',
        '!test/ngScenario/DescribeSpec.js',
        '!src/ng/directive/attrs.js', // legitimate xit here
        '!src/ngScenario/**/*.js',
        '!test/helpers/privateMocks*.js'
      ],
      options: {
        disallowed: [
          'fit',
          'iit',
          'xit',
          'fthey',
          'tthey',
          'xthey',
          'fdescribe',
          'ddescribe',
          'xdescribe',
          'it.only',
          'describe.only'
        ]
      }
    },

    'merge-conflict': {
      files: [
        'src/**/*',
        'test/**/*',
        'docs/**/*',
        'css/**/*'
      ]
    },

    copy: {
      i18n: {
        files: [
          { src: 'src/ngLocale/**', dest: 'build/i18n/', expand: true, flatten: true }
        ]
      }
    },


    compress: {
      build: {
        options: {archive: 'build/' + dist + '.zip', mode: 'zip'},
        src: ['**'],
        cwd: 'build',
        expand: true,
        dot: true,
        dest: dist + '/'
      }
    },

    shell: {
      'npm-install': {
        command: 'node scripts/npm/check-node-modules.js'
      },

      'promises-aplus-tests': {
        options: {
          stdout: false,
          stderr: true,
          failOnError: true
        },
        command: path.normalize('./node_modules/.bin/promises-aplus-tests tmp/promises-aplus-adapter++.js')
      }
    },


    write: {
      versionTXT: {file: 'build/version.txt', val: NG_VERSION.full},
      versionJSON: {file: 'build/version.json', val: JSON.stringify(NG_VERSION)}
    },

    bump: {
      options: {
        files: ['package.json'],
        commit: false,
        createTag: false,
        push: false
      }
    }
  });

  // global beforeEach task
  if (!process.env.TRAVIS) {
    grunt.task.run('shell:npm-install');
  }



  //alias tasks
  grunt.registerTask('test', 'Run unit, docs and e2e tests with Karma', ['eslint', 'package', 'test:unit', 'test:promises-aplus', 'tests:docs', 'test:protractor']);
  grunt.registerTask('test:jqlite', 'Run the unit tests with Karma' , ['tests:jqlite']);
  grunt.registerTask('test:jquery', 'Run the jQuery (latest) unit tests with Karma', ['tests:jquery']);
  grunt.registerTask('test:jquery-2.2', 'Run the jQuery 2.2 unit tests with Karma', ['tests:jquery-2.2']);
  grunt.registerTask('test:jquery-2.1', 'Run the jQuery 2.1 unit tests with Karma', ['tests:jquery-2.1']);
  grunt.registerTask('test:modules', 'Run the Karma module tests with Karma', ['build', 'tests:modules']);
  grunt.registerTask('test:docs', 'Run the doc-page tests with Karma', ['package', 'tests:docs']);
  grunt.registerTask('test:unit', 'Run unit, jQuery and Karma module tests with Karma', ['test:jqlite', 'test:jquery', 'test:jquery-2.2', 'test:jquery-2.1', 'test:modules']);
  grunt.registerTask('test:protractor', 'Run the end to end tests with Protractor and keep a test server running in the background', ['webdriver', 'connect:testserver', 'protractor:normal']);
  grunt.registerTask('test:travis-protractor', 'Run the end to end tests with Protractor for Travis CI builds', ['connect:testserver', 'protractor:travis']);
  grunt.registerTask('test:ci-protractor', 'Run the end to end tests with Protractor for Jenkins CI builds', ['webdriver', 'connect:testserver', 'protractor:jenkins']);
  grunt.registerTask('test:e2e', 'Alias for test:protractor', ['test:protractor']);
  grunt.registerTask('test:promises-aplus',['build:promises-aplus-adapter', 'shell:promises-aplus-tests']);

  grunt.registerTask('minify', ['bower', 'clean', 'build', 'minall']);
  grunt.registerTask('webserver', ['connect:devserver']);
  grunt.registerTask('package', ['bower', 'validate-angular-files', 'clean', 'buildall', 'minall', 'collect-errors', 'docs', 'copy', 'write', 'compress']);
  grunt.registerTask('ci-checks', ['ddescribe-iit', 'merge-conflict', 'eslint']);
  grunt.registerTask('default', ['package']);
};
