var files = require('./angularFiles').files;
var util = require('./lib/grunt/utils.js');

module.exports = function(grunt) {
  //grunt plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-jasmine-node');
  grunt.loadNpmTasks('grunt-ddescribe-iit');
  grunt.loadNpmTasks('grunt-merge-conflict');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-parallel');
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
        options: {
          stream: true
        },
        tasks: [
          util.parallelTask('test:docs'),
          util.parallelTask('test:modules'),
          util.parallelTask('test:jquery'),
          util.parallelTask('test:jqlite'),
          util.parallelTask('test:e2e')
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


    test: {
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
      docs: 'karma-docs.conf.js',
    },


    clean: {build: ['build']},


    shell: {
      bower: {
        command: 'node ./node_modules/bower/bin/bower install',
        options: {
            stdout: false
        }
      }
    },


    build: {
      scenario: {
        dest: 'build/angular-scenario.js',
        src: [
          'components/jquery/jquery.js',
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
          minify: true
        }
      },
      loader: {
        dest: 'build/angular-loader.js',
        src: util.wrap(['src/loader.js'], 'loader')
      },
      mobile: {
        dest: 'build/angular-mobile.js',
        src: util.wrap([
          'src/ngMobile/mobile.js',
          'src/ngMobile/swipe.js',
          'src/ngMobile/directive/ngClick.js',
          'src/ngMobile/directive/ngSwipe.js'
            ], 'module')
      },
      mocks: {
        dest: 'build/angular-mocks.js',
        src: ['src/ngMock/angular-mocks.js'],
        strict: false
      },
      sanitize: {
        dest: 'build/angular-sanitize.js',
        src: util.wrap([
          'src/ngSanitize/sanitize.js',
          'src/ngSanitize/directive/ngBindHtml.js',
          'src/ngSanitize/filter/linky.js'
        ], 'module')
      },
      resource: {
        dest: 'build/angular-resource.js',
        src: util.wrap(['src/ngResource/resource.js'], 'module')
      },
      route: {
        dest: 'build/angular-route.js',
        src: util.wrap([
          'src/ngRoute/routeUtils.js',
          'src/ngRoute/route.js',
          'src/ngRoute/routeParams.js',
          'src/ngRoute/directive/ngView.js'
        ], 'module')
      },
      cookies: {
        dest: 'build/angular-cookies.js',
        src: util.wrap(['src/ngCookies/cookies.js'], 'module')
      }
    },


    min: {
      angular: 'build/angular.js',
      cookies: 'build/angular-cookies.js',
      loader: 'build/angular-loader.js',
      mobile: 'build/angular-mobile.js',
      resource: 'build/angular-resource.js',
      route: 'build/angular-route.js',
      sanitize: 'build/angular-sanitize.js'
    },


    docs: {
      process: ['build/docs/*.html', 'build/docs/.htaccess']
    },

    "jasmine-node": {
      run: { spec: 'docs/spec' }
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
        options: {archive: 'build/' + dist +'.zip'},
        src: ['**'], cwd: 'build', expand: true, dot: true, dest: dist + '/'
      }
    },


    write: {
      versionTXT: {file: 'build/version.txt', val: NG_VERSION.full},
      versionJSON: {file: 'build/version.json', val: JSON.stringify(NG_VERSION)}
    }
  });


  //alias tasks
  grunt.registerTask('test:unit', ['test:jqlite', 'test:jquery', 'test:modules']);
  grunt.registerTask('test:docgen', ['jasmine-node']);
  grunt.registerTask('minify', ['shell:bower','clean', 'build', 'minall']);
  grunt.registerTask('test:e2e', ['connect:testserver', 'test:end2end']);
  grunt.registerTask('webserver', ['connect:devserver']);
  grunt.registerTask('package', ['shell:bower','clean', 'buildall', 'minall', 'collect-errors', 'docs', 'copy', 'write', 'compress']);
  grunt.registerTask('ci-checks', ['ddescribe-iit', 'merge-conflict']);
  grunt.registerTask('default', ['package']);
};
