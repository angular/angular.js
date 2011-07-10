/**
 * All writing related code here. This is so that we can separate the async code from sync code
 * for testability
 */
require.paths.push(__dirname);
var qfs = require('q-fs');
var Q = require('qq');
var OUTPUT_DIR = "build/docs/";
var fs = require('fs');

exports.output = function(file, content){
  console.log('writing ', file);
  var fullPath = OUTPUT_DIR + file;
  var dir = parent(fullPath);
  return Q.when(exports.makeDir(dir), function(error) {
    qfs.write(fullPath,exports.toString(content));
  });
}

//recursively create directory
exports.makeDir = function (path) {
  var parts = path.split(/\//);
  var path = ".";
  //Sequentially create directories
  var done = Q.defer();
  (function createPart() {

    if(!parts.length) {
      done.resolve();
    } else {
      path += "/" + parts.shift();
      qfs.isDirectory(path).then(function(isDir) {
        if(!isDir) {
          qfs.makeDirectory(path);
        }
        createPart();
      });
    }
  })();
  return done.promise;
};

exports.copyTpl = function(filename) {
  return exports.copy('docs/src/templates/' + filename, OUTPUT_DIR + filename);
};

exports.copy = function (from, to, replacementKey, replacement) {
  // Have to use rb (read binary), char 'r' is infered by library.
  return qfs.read(from,'b').then(function(content) {
    if(replacementKey && replacement) {
      content = content.toString().replace(replacementKey, replacement);
    }
    qfs.write(to, content);
  });
}

exports.copyDir = function copyDir(dir) {
  return qfs.listDirectoryTree('docs/' + dir).then(function(dirs) {
    var done;
    dirs.forEach(function(dirToMake) {
      done = Q.when(done, function() {
       return exports.makeDir("./build/" + dirToMake);
      });
    });
    return done;
  }).then(function() {
    return qfs.listTree('docs/' + dir);
  }).then(function(files) {
    files.forEach( function(file) {
      exports.copy(file,'./build/' + file);
    });
  });
};

exports.merge = function(srcs, to) {
  return merge(srcs.map(function(src) { return 'docs/src/templates/' + src; }), OUTPUT_DIR + to);
};

function merge(srcs, to) {
  var contents = [];
  //Sequentially read file
  var done;
  srcs.forEach(function (src) {
    done = Q.when(done, function(content) {
      if(content) contents.push(content);
      return qfs.read(src);
    });
  });

  // write to file
  return Q.when(done, function(content) {
    contents.push(content);
    qfs.write(to, contents.join('\n'));
  });
}

//----------------------- Synchronous Methods ----------------------------------

function parent(file) {
  var parts = file.split('/');
  parts.pop();
  return parts.join('/');
}


exports.toString = function toString(obj) {
  switch (typeof obj) {
  case 'string':
    return obj;
  case 'object':
    if (obj instanceof Array) {
      obj.forEach(function (value, key) {
        obj[key] = toString(value);
      });
      return obj.join('');
    } else {
      return JSON.stringify(obj);
    }
  }
  return obj;
};


function noop(){};
