#!/usr/bin/env node

var FILE = 'version.yaml';
var fs = require('fs');
var optimist = require('optimist');

optimist
  .usage('Manage ' + FILE + '.\nUsage: $0 [options]')
  .describe('remove-snapshot', 'Remove -snapshot suffix.')
  .describe('minor-bump', 'Bump minor version one step.')
  .describe('minor-next', 'Return next minor version.')
  .describe('current', 'Return current verion')
  .describe('help', 'Show usage');


var bumpMinor = function(version) {
  var parts = version.split('.');
  var last = parts.pop();

  var rc = last.match(/(\d*)rc(\d*)/);
  if (rc) {
    parts.push(rc[1] + 'rc' + (parseInt(rc[2], 10) + 1));
  } else {
    parts.push('' + (parseInt(last, 10) + 1));
  }

  return parts.join('.');
};

fs.readFile(FILE, 'utf8', function(err, content) {
  var version = content.match(/version\:\s([^\-\n]*)/)[1];

  var args = optimist.argv;
  if (args['remove-snapshot']) {
    fs.writeFile(FILE, content.replace('-snapshot', ''), function(err) {
      if (!err) {
        console.log('Version updated (removed -snapshot).');
        process.exit(0);
      } else {
        console.error('Version update failed.');
        process.exit(1);
      }
    });
  } else if (args['minor-next']) {
    process.stdout.write(bumpMinor(version) + '\n');
    process.exit(0);
  } else if (args['current']) {
    process.stdout.write(version + '\n');
    process.exit(0);
  } else if (args['minor-bump']) {
    var bumped = bumpMinor(version);

    if (!content.match(/\-snapshot/)) bumped += '-snapshot';
    fs.writeFile(FILE, content.replace(version, bumped), function(err) {
      if (!err) {
        console.log('Version updated (bumped to ' + bumped + ').');
        process.exit(0);
      } else {
        console.error('Version update failed.');
        process.exit(1);
      }
    });
  } else {
    console.log(optimist.help());
    process.exit(args['help'] ? 0 : 1);
  }
});
