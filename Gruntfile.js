'use strict';

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
  var dist = 'angular-'+ NG_VERSION.full;

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
          middleware: function(connect, options){
            var base = Array.isArray(options.base) ? options.base[options.base.length - 1] : options.base;
            return [
              util.conditionalCsp(),
              util.rewrite(),
              e2e.middleware(),
              connect.favicon('images/favicon.ico'),
              connect.static(base),
              connect.directory(base)
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
          middleware: function(connect, options){
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
              connect.favicon('images/favicon.ico'),
              connect.static(base)
            ];
          }
        }
      }
    },


    tests: {
      jqlite: 'karma-jqlite.conf.js',
      jquery: 'karma-jquery.conf.js',
      docs: 'karma-docs.conf.js',
      modules: 'karma-modules.conf.js'
    },


    autotest: {
      jqlite: 'karma-jqlite.conf.js',
      jquery: 'karma-jquery.conf.js',
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

    jshint: {
      options: {
        jshintrc: true,
      },
      node: {
        files: { src: ['*.js', 'lib/**/*.js'] },
      },
      tests: {
        files: { src: 'test/**/*.js' },
      },
      ng: {
        files: { src: files['angularSrc'].concat('!src/angular.bind.js') },
      },
      ngAnimate: {
        files: { src: 'src/ngAnimate/**/*.js' },
      },
      ngCookies: {
        files: { src: 'src/ngCookies/**/*.js' },
      },
      ngLocale: {
        files: { src: 'src/ngLocale/**/*.js' },
      },
      ngMessageFormat: {
        files: { src: 'src/ngMessageFormat/**/*.js' },
      },
      ngMessages: {
        files: { src: 'src/ngMessages/**/*.js' },
      },
      ngMock: {
        files: { src: 'src/ngMock/**/*.js' },
      },
      ngResource: {
        files: { src: 'src/ngResource/**/*.js' },
      },
      ngRoute: {
        files: { src: 'src/ngRoute/**/*.js' },
      },
      ngSanitize: {
        files: { src: 'src/ngSanitize/**/*.js' },
      },
      ngScenario: {
        files: { src: 'src/ngScenario/**/*.js' },
      },
      ngTouch: {
        files: { src: 'src/ngTouch/**/*.js' },
      },
      ngAria: {
        files: {src: 'src/ngAria/**/*.js'},
      }
    },

    jscs: {
      src: [
        'src/**/*.js',
        'test/**/*.js',
        '!src/angular.bind.js' // we ignore this file since contains an early return statement
      ],
      options: {
        config: '.jscsrc'
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
      aria: 'build/angular-aria.js'
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
          'iit',
          'xit',
          'tthey',
          'xthey',
          'ddescribe',
          'xdescribe'
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
        options: {archive: 'build/' + dist +'.zip', mode: 'zip'},
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
  grunt.registerTask('test', 'Run unit, docs and e2e tests with Karma', ['jshint', 'jscs', 'package', 'test:unit', 'test:promises-aplus', 'tests:docs', 'test:protractor']);
  grunt.registerTask('test:jqlite', 'Run the unit tests with Karma' , ['tests:jqlite']);
  grunt.registerTask('test:jquery', 'Run the jQuery unit tests with Karma', ['tests:jquery']);
  grunt.registerTask('test:modules', 'Run the Karma module tests with Karma', ['build', 'tests:modules']);
  grunt.registerTask('test:docs', 'Run the doc-page tests with Karma', ['package', 'tests:docs']);
  grunt.registerTask('test:unit', 'Run unit, jQuery and Karma module tests with Karma', ['test:jqlite', 'test:jquery', 'test:modules']);
  grunt.registerTask('test:protractor', 'Run the end to end tests with Protractor and keep a test server running in the background', ['webdriver', 'connect:testserver', 'protractor:normal']);
  grunt.registerTask('test:travis-protractor', 'Run the end to end tests with Protractor for Travis CI builds', ['connect:testserver', 'protractor:travis']);
  grunt.registerTask('test:ci-protractor', 'Run the end to end tests with Protractor for Jenkins CI builds', ['webdriver', 'connect:testserver', 'protractor:jenkins']);
  grunt.registerTask('test:e2e', 'Alias for test:protractor', ['test:protractor']);
  grunt.registerTask('test:promises-aplus',['build:promises-aplus-adapter', 'shell:promises-aplus-tests']);

  grunt.registerTask('minify', ['bower', 'clean', 'build', 'minall']);
  grunt.registerTask('webserver', ['connect:devserver']);
  grunt.registerTask('package', ['bower', 'validate-angular-files', 'clean', 'buildall', 'minall', 'collect-errors', 'docs', 'copy', 'write', 'compress']);
  grunt.registerTask('ci-checks', ['ddescribe-iit', 'merge-conflict', 'jshint', 'jscs']);
  grunt.registerTask('default', ['package']);
};
