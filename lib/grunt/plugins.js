var bower = require('bower');
var util = require('./utils.js');
var shelljs = require('shelljs');

module.exports = function(grunt) {

  grunt.registerMultiTask('min', 'minify JS files', function(){
    util.min.call(util, this.data, this.async());
  });


  grunt.registerTask('minall', 'minify all the JS files in parallel', function(){
    var files = grunt.config('min');
    files = Object.keys(files).map(function(key){ return files[key]; });
    grunt.util.async.forEach(files, util.min.bind(util), this.async());
  });


  grunt.registerMultiTask('build', 'build JS files', function(){
    util.build.call(util, this.data, this.async());
  });


  grunt.registerTask('buildall', 'build all the JS files in parallel', function(){
    var builds = grunt.config('build');
    builds = Object.keys(builds).map(function(key){ return builds[key]; });
    grunt.util.async.forEach(builds, util.build.bind(util), this.async());
  });


  grunt.registerMultiTask('write', 'write content to a file', function(){
    grunt.file.write(this.data.file, this.data.val);
    grunt.log.ok('wrote to ' + this.data.file);
  });


  grunt.registerTask('docs', 'create angular docs', function(){
    var gruntProc = shelljs.exec('"node_modules/.bin/gulp" --gulpfile docs/gulpfile.js');
    if (gruntProc.code !== 0) {
      throw new Error('doc generation failed');
    }
  });


  grunt.registerMultiTask('tests', '**Use `grunt test` instead**', function(){
    util.startKarma.call(util, this.data, true, this.async());
  });


  grunt.registerMultiTask('autotest', 'Run and watch the unit tests with Karma', function(){
    util.startKarma.call(util, this.data, false, this.async());
  });

  grunt.registerTask('webdriver', 'Update webdriver', function() {
    util.updateWebdriver.call(util, this.async());
  });

  grunt.registerMultiTask('protractor', 'Run Protractor integration tests', function() {
    util.startProtractor.call(util, this.data, this.async());
  });

  grunt.registerTask('collect-errors', 'Combine stripped error files', function () {
    util.collectErrors();
  });

  grunt.registerTask('bower', 'Install Bower packages.', function () {
    var done = this.async();

    bower.commands.install()
      .on('log', function (result) {
        grunt.log.ok('bower: ' + result.id + ' ' + result.data.endpoint.name);
      })
      .on('error', grunt.fail.warn.bind(grunt.fail))
      .on('end', done);
  });
};
