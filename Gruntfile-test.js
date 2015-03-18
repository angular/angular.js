'use strict';

var npmInstall = require('./scripts/npm/install-dependencies');

module.exports = function(grunt) {

  grunt.registerTask('npm-install', function() {
    npmInstall.installDependencies();
  });
};
