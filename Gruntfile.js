'use strict';

var serveFavicon = require('serve-favicon');
var serveStatic = require('serve-static');
var serveIndex = require('serve-index');
var files = require('./angularFiles').files;
var mergeFilesFor = require('./angularFiles').mergeFilesFor;
var util = require('./lib/grunt/utils.js');
var versionInfo = require('./lib/versions/version-info');
var path = require('path');
var e2e = require('./test/e2e/tools');

var semver = require('semver');
var exec = require('shelljs').exec;
var pkg = require(__dirname + '/package.json');

var docsScriptFolder = util.docsScriptFolder;

// Node.js version checks
if (!semver.satisfies(process.version, pkg.engines.node)) {
  reportOrFail('Invalid node version (' + process.version + '). ' +
               'Please use a version that satisfies ' + pkg.engines.node);
}

// Yarn version checks
var expectedYarnVersion = pkg.engines.yarn;
var currentYarnVersion = exec('yarn --version', {silent: true}).stdout.trim();
if (!semver.satisfies(currentYarnVersion, expectedYarnVersion)) {
  reportOrFail('Invalid yarn version (' + currentYarnVersion + '). ' +
               'Please use a version that satisfies ' + expectedYarnVersion);
}

// Grunt CLI version checks
var expectedGruntVersion = pkg.engines['grunt-cli'];
var currentGruntVersions = exec('grunt --version', {silent: true}).stdout;
var match = /^grunt-cli v(.+)$/m.exec(currentGruntVersions);
if (!match) {
  reportOrFail('Unable to compute the current grunt-cli version. We found:\n' +
               currentGruntVersions);
} else {
  if (!semver.satisfies(match[1], expectedGruntVersion)) {
  reportOrFail('Invalid grunt-cli version (' + match[1] + '). ' +
               'Please use a version that satisfies ' + expectedGruntVersion);
  }
}

// Ensure Node.js dependencies have been installed
if (!process.env.CI) {
  var yarnOutput = exec('yarn install');
  if (yarnOutput.code !== 0) {
    throw new Error('Yarn install failed: ' + yarnOutput.stderr);
  }
}

module.exports = function(grunt) {

  // this loads all the node_modules that start with `grunt-` as plugins
  require('load-grunt-tasks')(grunt);

  // load additional grunt tasks
  grunt.loadTasks('lib/grunt');
  grunt.loadNpmTasks('angular-benchpress');

  // compute version related info for this build
  var NG_VERSION = versionInfo.currentVersion;
  NG_VERSION.cdn = versionInfo.cdnVersion;
  var dist = 'angular-' + NG_VERSION.full;

  var deployVersion = NG_VERSION.full;

  if (NG_VERSION.isSnapshot) {
    deployVersion = NG_VERSION.distTag === 'latest' ? 'snapshot-stable' : 'snapshot';
  }

  if (versionInfo.cdnVersion == null) {
    throw new Error('Unable to read CDN version, are you offline or has the CDN not been properly pushed?\n' +
                    'Perhaps you want to set the NG1_BUILD_NO_REMOTE_VERSION_REQUESTS environment variable?');
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
          // We start the webserver as a separate process from the E2E tests
          port: 8000,
          hostname: '0.0.0.0',
          middleware: function(connect, options) {
            var base = Array.isArray(options.base) ? options.base[options.base.length - 1] : options.base;
            return [
              function(req, resp, next) {
                // cache GET requests to speed up tests
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
      modules: 'karma-modules.conf.js',
      'modules-ngAnimate': 'karma-modules-ngAnimate.conf.js',
      'modules-ngMock': 'karma-modules-ngMock.conf.js'
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
      circleci: 'protractor-circleci-conf.js'
    },


    clean: {
      build: ['build'],
      tmp: ['tmp'],
      deploy: [
        'deploy/docs',
        'deploy/code',
        docsScriptFolder + '/functions/html'
      ]
    },

    eslint: {
      all: {
        src: [
          '*.js',
          'benchmarks/**/*.js',
          'docs/**/*.js',
          'lib/**/*.js',
          'scripts/**/*.js',
          '!scripts/*/*/node_modules/**',
          'src/**/*.js',
          'test/**/*.js',
          'i18n/**/*.js',
          '!docs/app/assets/js/angular-bootstrap/**',
          '!docs/config/templates/**',
          '!src/angular.bind.js',
          '!i18n/closure/**',
          '!src/ngParseExt/ucd.js'
        ]
      }
    },

    build: {
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
      touchModuleTestBundle: {
        dest: 'build/test-bundles/angular-touch.js',
        prefix: 'src/module.prefix',
        src: mergeFilesFor('karmaModules-ngTouch'),
        suffix: 'src/module.suffix'
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
      sanitizeModuleTestBundle: {
        dest: 'build/test-bundles/angular-sanitize.js',
        prefix: 'src/module.prefix',
        src: mergeFilesFor('karmaModules-ngSanitize'),
        suffix: 'src/module.suffix'
      },
      resource: {
        dest: 'build/angular-resource.js',
        src: util.wrap(files['angularModules']['ngResource'], 'module')
      },
      resourceModuleTestBundle: {
        dest: 'build/test-bundles/angular-resource.js',
        prefix: 'src/module.prefix',
        src: mergeFilesFor('karmaModules-ngResource'),
        suffix: 'src/module.suffix'
      },
      messageformat: {
        dest: 'build/angular-message-format.js',
        src: util.wrap(files['angularModules']['ngMessageFormat'], 'module')
      },
      messageformatModuleTestBundle: {
        dest: 'build/test-bundles/angular-message-format.js',
        prefix: 'src/module.prefix',
        src: mergeFilesFor('karmaModules-ngMessageFormat'),
        suffix: 'src/module.suffix'
      },
      messages: {
        dest: 'build/angular-messages.js',
        src: util.wrap(files['angularModules']['ngMessages'], 'module')
      },
      messagesModuleTestBundle: {
        dest: 'build/test-bundles/angular-messages.js',
        prefix: 'src/module.prefix',
        src: mergeFilesFor('karmaModules-ngMessages'),
        suffix: 'src/module.suffix'
      },
      animate: {
        dest: 'build/angular-animate.js',
        src: util.wrap(files['angularModules']['ngAnimate'], 'module')
      },
      route: {
        dest: 'build/angular-route.js',
        src: util.wrap(files['angularModules']['ngRoute'], 'module')
      },
      routeModuleTestBundle: {
        dest: 'build/test-bundles/angular-route.js',
        prefix: 'src/module.prefix',
        src: mergeFilesFor('karmaModules-ngRoute'),
        suffix: 'src/module.suffix'
      },
      cookies: {
        dest: 'build/angular-cookies.js',
        src: util.wrap(files['angularModules']['ngCookies'], 'module')
      },
      cookiesModuleTestBundle: {
        dest: 'build/test-bundles/angular-cookies.js',
        prefix: 'src/module.prefix',
        src: mergeFilesFor('karmaModules-ngCookies'),
        suffix: 'src/module.suffix'
      },
      aria: {
        dest: 'build/angular-aria.js',
        src: util.wrap(files['angularModules']['ngAria'], 'module')
      },
      ariaModuleTestBundle: {
        dest: 'build/test-bundles/angular-aria.js',
        prefix: 'src/module.prefix',
        src: mergeFilesFor('karmaModules-ngAria'),
        suffix: 'src/module.suffix'
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
        '!src/ng/directive/attrs.js', // legitimate xit here
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
          {
            src: 'src/ngLocale/**',
            dest: 'build/i18n/',
            expand: true,
            flatten: true
          }
        ]
      },
      deployFirebaseCode: {
        files: [
          {
            cwd: 'build',
            src: '**',
            dest: 'deploy/code/' + deployVersion + '/',
            expand: true
          }
        ]
      },
      deployFirebaseDocs: {
        files: [
          // The source files are needed by the embedded examples in the docs app.
          {
            src: ['build/angular*.{js,js.map,min.js}', 'build/sitemap.xml'],
            dest: 'deploy/docs/',
            expand: true,
            flatten: true
          },
          {
            cwd: 'build/docs',
            src: ['**', '!ptore2e/**', '!index*.html'],
            dest: 'deploy/docs/',
            expand: true
          },
          {
            src: 'build/docs/index-production.html',
            dest: 'deploy/docs/index.html'
          },
          {
            src: 'build/docs/index-production.html',
            dest: docsScriptFolder + '/functions/content/index.html'
          },
          {
            cwd: 'build/docs',
            src: 'partials/**',
            dest: docsScriptFolder + '/functions/content',
            expand: true
          }
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
      'install-node-dependencies': {
        command: 'yarn'
      },
      'promises-aplus-tests': {
        options: {
          stdout: false,
          stderr: true,
          failOnError: true
        },
        command: path.normalize('./node_modules/.bin/promises-aplus-tests tmp/promises-aplus-adapter++.js --timeout 2000')
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

  //alias tasks
  grunt.registerTask('test', 'Run unit, docs and e2e tests with Karma', [
    'eslint',
    'package',
    'test:unit',
    'test:promises-aplus',
    'tests:docs',
    'test:protractor'
  ]);
  grunt.registerTask('test:jqlite', 'Run the unit tests with Karma' , ['tests:jqlite']);
  grunt.registerTask('test:jquery', 'Run the jQuery (latest) unit tests with Karma', ['tests:jquery']);
  grunt.registerTask('test:jquery-2.2', 'Run the jQuery 2.2 unit tests with Karma', ['tests:jquery-2.2']);
  grunt.registerTask('test:jquery-2.1', 'Run the jQuery 2.1 unit tests with Karma', ['tests:jquery-2.1']);
  grunt.registerTask('test:modules', 'Run the Karma module tests with Karma', [
    'build',
    'tests:modules',
    'tests:modules-ngAnimate',
    'tests:modules-ngMock'
  ]);
  grunt.registerTask('test:docs', 'Run the doc-page tests with Karma', ['package', 'tests:docs']);
  grunt.registerTask('test:unit', 'Run unit, jQuery and Karma module tests with Karma', [
    'test:jqlite',
    'test:jquery',
    'test:jquery-2.2',
    'test:jquery-2.1',
    'test:modules'
  ]);
  grunt.registerTask('test:protractor', 'Run the end to end tests with Protractor and keep a test server running in the background', [
    'webdriver',
    'connect:testserver',
    'protractor:normal'
  ]);
  grunt.registerTask('test:circleci-protractor', 'Run the end to end tests with Protractor for CircleCI builds', [
    'connect:testserver',
    'protractor:circleci'
  ]);
  grunt.registerTask('test:e2e', 'Alias for test:protractor', ['test:protractor']);
  grunt.registerTask('test:promises-aplus',[
    'build:promises-aplus-adapter',
    'shell:promises-aplus-tests'
  ]);
  grunt.registerTask('minify', [
    'clean',
    'build',
    'minall'
  ]);
  grunt.registerTask('webserver', ['connect:devserver']);
  grunt.registerTask('package', [
    'validate-angular-files',
    'clean',
    'buildall',
    'minall',
    'collect-errors',
    'write',
    'docs',
    'copy:i18n',
    'compress:build'
  ]);
  grunt.registerTask('ci-checks', [
    'ddescribe-iit',
    'merge-conflict',
    'eslint'
  ]);
  grunt.registerTask('prepareDeploy', [
    'copy:deployFirebaseCode',
    'firebaseDocsJsonForCI',
    'copy:deployFirebaseDocs'
  ]);
  grunt.registerTask('default', ['package']);
};


function reportOrFail(message) {
  if (process.env.CI) {
    throw new Error(message);
  } else {
    console.log('===============================================================================');
    console.log(message);
    console.log('===============================================================================');
  }
}
