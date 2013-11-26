var files = require('./angularFiles').files;
var util = require('./lib/grunt/utils.js');
var path = require('path');

module.exports = function(grunt) {
  //grunt plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-ddescribe-iit');
  grunt.loadNpmTasks('grunt-merge-conflict');
  grunt.loadNpmTasks('grunt-parallel');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadTasks('lib/grunt');

  var NG_VERSION = util.getVersion();
  var dist = 'angular-'+ NG_VERSION.full;


  //global beforeEach
  util.init();


  //config
  grunt.initConfig({
    NG_VERSION: NG_VERSION,

    parallel: {
      travis: {
        tasks: [
          util.parallelTask(['test:unit', 'test:docgen', 'test:promises-aplus', 'tests:docs'], {stream: true}),
          util.parallelTask(['test:e2e'])
        ]
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
            return [
              //uncomment to enable CSP
              // util.csp(),
              util.rewrite(),
              connect.favicon('images/favicon.ico'),
              connect.static(options.base),
              connect.directory(options.base)
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
            return [
              function(req, resp, next) {
                // cache get requests to speed up tests on travis
                if (req.method === 'GET') {
                  resp.setHeader('Cache-control', 'public, max-age=3600');
                }

                next();
              },
              connect.favicon('images/favicon.ico'),
              connect.static(options.base)
            ];
          }
        }
      }
    },


    tests: {
      jqlite: 'karma-jqlite.conf.js',
      jquery: 'karma-jquery.conf.js',
      docs: 'karma-docs.conf.js',
      modules: 'karma-modules.conf.js',
      //NOTE run grunt test:e2e instead and it will start a webserver for you
      end2end: 'karma-e2e.conf.js'
    },


    autotest: {
      jqlite: 'karma-jqlite.conf.js',
      jquery: 'karma-jquery.conf.js',
      modules: 'karma-modules.conf.js',
      docs: 'karma-docs.conf.js'
    },


    clean: {
      build: ['build'],
      tmp: ['tmp']
    },

    jshint: {
      ng: {
        files: { src: files['angularSrc'] },
        options: { jshintrc: 'src/.jshintrc' }
      },
      ngAnimate: {
        files: { src: 'src/ngAnimate/**/*.js' },
        options: { jshintrc: 'src/ngAnimate/.jshintrc' }
      },
      ngCookies: {
        files: { src: 'src/ngCookies/**/*.js' },
        options: { jshintrc: 'src/ngCookies/.jshintrc' }
      },
      ngLocale: {
        files: { src: 'src/ngLocale/**/*.js' },
        options: { jshintrc: 'src/ngLocale/.jshintrc' }
      },
      ngMock: {
        files: { src: 'src/ngMock/**/*.js' },
        options: { jshintrc: 'src/ngMock/.jshintrc' }
      },
      ngResource: {
        files: { src: 'src/ngResource/**/*.js' },
        options: { jshintrc: 'src/ngResource/.jshintrc' }
      },
      ngRoute: {
        files: { src: 'src/ngRoute/**/*.js' },
        options: { jshintrc: 'src/ngRoute/.jshintrc' }
      },
      ngSanitize: {
        files: { src: 'src/ngSanitize/**/*.js' },
        options: { jshintrc: 'src/ngSanitize/.jshintrc' }
      },
      ngScenario: {
        files: { src: 'src/ngScenario/**/*.js' },
        options: { jshintrc: 'src/ngScenario/.jshintrc' }
      },
      ngTouch: {
        files: { src: 'src/ngTouch/**/*.js' },
        options: { jshintrc: 'src/ngTouch/.jshintrc' }
      }
    },

    build: {
      scenario: {
        dest: 'build/angular-scenario.js',
        src: [
          'bower_components/jquery/jquery.js',
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
      "promises-aplus-adapter": {
        dest:'tmp/promises-aplus-adapter++.js',
        src:['src/ng/q.js','lib/promises-aplus/promises-aplus-test-adapter.js']
      }
    },


    min: {
      angular: 'build/angular.js',
      animate: 'build/angular-animate.js',
      cookies: 'build/angular-cookies.js',
      loader: 'build/angular-loader.js',
      touch: 'build/angular-touch.js',
      resource: 'build/angular-resource.js',
      route: 'build/angular-route.js',
      sanitize: 'build/angular-sanitize.js'
    },


    docs: {
      process: ['build/docs/*.html', 'build/docs/.htaccess']
    },

    "jasmine_node": {
      projectRoot: 'docs/spec'
    },

    "ddescribe-iit": {
      files: [
        'test/**/*.js',
        '!test/ngScenario/DescribeSpec.js'
      ]
    },

    "merge-conflict": {
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
        src: ['**'], cwd: 'build', expand: true, dot: true, dest: dist + '/'
      }
    },

    shell:{
      "promises-aplus-tests":{
        options:{
          //stdout:true,
          stderr:true,
          failOnError:true
        },
        command:path.normalize('./node_modules/.bin/promises-aplus-tests tmp/promises-aplus-adapter++.js')
      }
    },


    write: {
      versionTXT: {file: 'build/version.txt', val: NG_VERSION.full},
      versionJSON: {file: 'build/version.json', val: JSON.stringify(NG_VERSION)}
    }
  });


  //alias tasks
  grunt.registerTask('test', 'Run unit, docs and e2e tests with Karma', ['jshint', 'package','test:unit','test:promises-aplus', 'tests:docs', 'test:e2e']);
  grunt.registerTask('test:jqlite', 'Run the unit tests with Karma' , ['tests:jqlite']);
  grunt.registerTask('test:jquery', 'Run the jQuery unit tests with Karma', ['tests:jquery']);
  grunt.registerTask('test:modules', 'Run the Karma module tests with Karma', ['tests:modules']);
  grunt.registerTask('test:docs', 'Run the doc-page tests with Karma', ['package', 'tests:docs']);
  grunt.registerTask('test:unit', 'Run unit, jQuery and Karma module tests with Karma', ['tests:jqlite', 'tests:jquery', 'tests:modules']);
  grunt.registerTask('test:e2e', 'Run the end to end tests with Karma and keep a test server running in the background', ['connect:testserver', 'tests:end2end']);
  grunt.registerTask('test:docgen', ['jasmine_node']);
  grunt.registerTask('test:promises-aplus',['build:promises-aplus-adapter','shell:promises-aplus-tests']);

  grunt.registerTask('minify', ['bower','clean', 'build', 'minall']);
  grunt.registerTask('webserver', ['connect:devserver']);
  grunt.registerTask('package', ['bower','clean', 'buildall', 'minall', 'collect-errors', 'docs', 'copy', 'write', 'compress']);
  grunt.registerTask('package-without-bower', ['clean', 'buildall', 'minall', 'collect-errors', 'docs', 'copy', 'write', 'compress']);
  grunt.registerTask('ci-checks', ['ddescribe-iit', 'merge-conflict', 'jshint', 'test:docgen']);
  grunt.registerTask('default', ['package']);
};
