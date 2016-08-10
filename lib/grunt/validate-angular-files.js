'use strict';

var path = require('path');
var fs = require('fs');
var glob = require('glob');
var _ = require('lodash');
var files = require('../../angularFiles').files;

module.exports = function(grunt) {

  grunt.registerTask('validate-angular-files', function() {
    var combinedFiles = _.clone(files.angularModules);
    combinedFiles.ng = files.angularSrc;
    combinedFiles.angularLoader = files.angularLoader;

    var errorsDetected = false;
    var directories = [];
    var detectedFiles = {};

    for (var section in combinedFiles) {
      var sectionFiles = combinedFiles[section];

      if (section !== 'angularLoader') {
        directories.push('src/' + section);
      }

      grunt.log.debug('Validating ' + sectionFiles.length + ' files from the "' + section + '" module.');

      sectionFiles.forEach(function(file) {
        detectedFiles[file] = true;

        if (!fs.existsSync(file)) {
          grunt.log.error(file + ' does not exist in the local file structure.');
          errorsDetected = true;
        }
      });
    }

    directories.forEach(function(directory) {
      glob.sync(directory + '/**/*').forEach(function(filePath) {
        if (!fs.lstatSync(filePath).isDirectory()) {
          var fileName = path.basename(filePath);
          var isHiddenFile = fileName[0] === '.';
          if (!isHiddenFile && !detectedFiles[filePath]) {
            grunt.log.error(filePath + ' exists in the local file structure but isn\'t used by any module.');
            errorsDetected = true;
          }
        }
      });
    });

    if (errorsDetected) {
      throw new Error('Not all files were properly detected in the local file structure.');
    } else {
      grunt.log.ok('All files were detected successfully!');
    }
  });
};
