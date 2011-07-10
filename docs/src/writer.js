/**
 * All writing related code here. This is so that we can separate the async code from sync code
 * for testability
 */
require.paths.push(__dirname);
var qfs         = require('q-fs');
var Q          = require('qq');
var OUTPUT_DIR = "build/docs/";
var fs      = require('fs');

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
  //Make Directory in Serial
  var done = Q.defer();
  (function createPart(){
    if(!parts.length) {
      done.resolve();
    } else {
      path += "/" + parts.shift();
      qfs.isDirectory(path).then(function(isDir){
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

exports.copy = function copy(from, to, replacementKey, replacement) {
  var readFuture = Q.defer();
  var writeFuture = Q.defer();
  // qfs.read cannot read image files correctly, why????
  fs.readFile(from, function(err, content) {
    if(err) readFuture.reject(err);
    if(replacementKey && replacement) {
      content = content.toString().replace(replacementKey, replacement);
    }
    readFuture.resolve(content);
  });

  readFuture.promise.then(function(content) {
    fs.writeFile(to, content, function (error) {
      if (error) {
          error.message = "Can't write to " + to + ": " + error.message;
          console.log(error.message);
          writeFuture.reject(error);
      } else {
          writeFuture.resolve();
      }
    });
  });
  return writeFuture.promise;
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
  //read files in serial
  var done;
  srcs.forEach(function (src) {
    done = Q.when(done, function(content) {
      if(content) contents.push(content);
      //console.log('reading: ' + src);
      return qfs.read(src);
    });
  });

  // write to file
  return Q.when(done,function(content) {
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
