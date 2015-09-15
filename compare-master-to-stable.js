#!/usr/bin/env node

'use strict';

var util = require('util');
var cp = require('child_process');

var Q = require('q');
var _ = require('lodash');
var semver = require('semver');

var exec = function (cmd) {
  return function () {
    var args = Array.prototype.slice.call(arguments, 0);
    args.unshift(cmd);
    var fullCmd = util.format.apply(util, args);
    return Q.nfcall(cp.exec, fullCmd).then(function (out) {
      return out[0].split('\n');
    });
  };
};

var andThen = function (fn, after) {
  return function () {
    return fn.apply(this, arguments).then(after);
  };
};

var oneArg = function (fn) {
  return function (arg) {
    return fn(arg);
  };
};

var oneLine = function (lines) {
  return lines[0].trim();
};

var noArgs = function (fn) {
  return function () {
    return fn();
  };
};

var identity = function (i) { return i; };

// like Q.all, but runs the commands in series
// useful for ensuring env state (like which branch is checked out)
var allInSeries = function (fn) {
  return function (args) {
    var results = [];
    var def;
    while (args.length > 0) {
      (function (arg) {
        if (def) {
          def = def.then(function () {
            return fn(arg);
          });
        } else {
          def = fn(arg);
        }
        def = def.then(function (res) {
          results.push(res);
        });
      }(args.pop()));
    }
    return def.then(function () {
      return results;
    });
  };
};

var compareBranches = function (left, right) {
  console.log('# These commits are in ' + left.name + ' but not in ' + right.name + '\n');
  console.log(_(left.log).
    difference(right.log).
    map(function (line) {
      return left.full[left.log.indexOf(line)]; // lol O(n^2)
    }).
    value().
    join('\n'));
};

var checkout = oneArg(exec('git checkout %s'));

var getCurrentBranch = andThen(noArgs(exec('git rev-parse --abbrev-ref HEAD')), oneLine);
var getTags = noArgs(exec('git tag'));
var getShaOfTag = oneArg(exec('git rev-list %s | head -n 1'));
var getTheLog = oneArg(exec('git log --pretty=oneline %s..HEAD | cat'));

// remember this so we can restore state
var currentBranch;

getCurrentBranch().
then(function (branch) {
  currentBranch = branch;
}).
then(getTags).
then(function (tags) {
  return tags.
    filter(semver.valid).
    map(semver.clean).
    sort(semver.rcompare);
}).
then(function (tags) {
  var major = tags[0].split('.')[0];
  return tags.
    filter(function (ver) {
      return semver(ver).major == major;
    });
}).
then(function (tags) {
  return _(tags).
    groupBy(function (tag) {
      return tag.split('.')[1];
    }).
    map(function (group) {
      return _.first(group);
    }).
    map(function (tag) {
      return 'v' + tag;
    }).
    value();
}).
then(function (tags) {
  var master = tags.pop();
  var stable = tags.pop();

  return [
    { name: stable.replace(/\d+$/, 'x'), tag: stable },
    { name: 'master', tag: master}
  ];
}).
then(allInSeries(function (branch) {
  return checkout(branch.name).
    then(function () {
      return getTheLog(branch.tag);
    }).
    then(function (log) {
      return log.
        filter(identity);
    }).
    then(function (log) {
      branch.full = log.map(function (line) {
        line = line.split(' ');
        var sha = line.shift();
        var msg = line.join(' ');
        return sha + ((/fix\([^\)]+\):/i.test(msg))  ? ' * ' : '   ') + msg;
      });
      branch.log = log.map(function (line) {
        return line.substr(41);
      });
      return branch;
    });
})).
then(function (pairs) {
  compareBranches(pairs[0], pairs[1]);
  console.log('\n');
  compareBranches(pairs[1], pairs[0]);
  return pairs;
}).
then(function () {
  return checkout(currentBranch);
}).
catch(function (e) {
  console.log(e.stack);
});

