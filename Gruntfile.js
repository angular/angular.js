var files = require('./angularFiles').files;
var util = require('./lib/grunt/utils.js');

module.exports = function(grunt) {
  //grunt plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadTasks('lib/grunt');

  var NG_VERSION = util.getVersion();
  //config
  grunt.initConfig({
    NG_VERSION: NG_VERSION,

    test: {
      jqlite: 'testacular-jqlite.conf.js',
      jquery: 'testacular-jquery.conf.js',
      modules: 'testacular-modules.conf.js',
      //NOTE run grunt test:e2e instead and it will start a webserver for you
      end2end: 'testacular-e2e.conf.js'
    },

    autotest: {
      jqlite: 'testacular-jqlite.conf.js',
      jquery: 'testacular-jquery.conf.js'
    },

    clean: {build: ['build']},

    build: {
      scenario: {
        dest: 'build/angular-scenario.js',
        src: [
          'lib/jquery/jquery.js',
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
          'src/ngSanitize/filter/linky.js',
        ], 'module')
      },
      resource: {
        dest: 'build/angular-resource.js',
        src: util.wrap(['src/ngResource/resource.js'], 'module')
      },
      cookies: {
        dest: 'build/angular-cookies.js',
        src: util.wrap(['src/ngCookies/cookies.js'], 'module')
      },
      bootstrap: {
        dest: 'build/angular-bootstrap.js',
        src: util.wrap(['src/bootstrap/bootstrap.js'], 'module')
      },
      bootstrapPrettify: {
        dest: 'build/angular-bootstrap-prettify.js',
        src: util.wrap(['src/bootstrap/bootstrap-prettify.js', 'src/bootstrap/google-prettify/prettify.js'], 'module'),
        styles: {
          css: ['src/bootstrap/google-prettify/prettify.css'],
          minify: true
        }           
      }
    },

    min: {
      angular: 'build/angular.js',
      cookies: 'build/angular-cookies.js',
      loader: 'build/angular-loader.js',
      resource: 'build/angular-resource.js',
      sanitize: 'build/angular-sanitize.js',
      bootstrap: 'build/angular-bootstrap.js',
      bootstrapPrettify: 'build/angular-bootstrap-prettify.js'
    },

    docs: {
      process: ['build/docs/*.html', 'build/docs/.htaccess']
    },
    
    copy: {
      i18n: {
        files: {'build/i18n/': 'src/ngLocale/**'}
      }
    },

    write: {
      version: {file: 'build/version.txt', val: NG_VERSION.full}
    }
  });
  
  //alias tasks
  grunt.registerTask('test:unit', ['test:jqlite', 'test:jquery', 'test:modules']);
  grunt.registerTask('minify', ['clean', 'build', 'min']);
  grunt.registerTask('test:e2e', ['connect', 'test:end2end']);
  grunt.registerTask('webserver', ['connect:keepalive']);
  grunt.registerTask('package', ['clean', 'build', 'min', 'docs', 'copy', 'write', 'zip']);
  grunt.registerTask('default', ['package']);
};