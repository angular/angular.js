var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;
var fs = require('fs');

exports.Compressor = Compressor;

function main(argv) {
  var cmd_line_arguments = argv.splice(2);
  //Ensure there is a file name passed in and it exists
  var compressor = new Compressor();
  //var ast = compressor.parseJsFileAndGetAst(compressor.readAndGetFileContents(cmd_line_arguments[0]));
  //var gen_code = pro.gen_code(ast);
}

function ErrorMessageStructure(err_code, message, min_message) {
  this.err_code = err_code;
  this.message = message;
  this.min_message = min_message;
}

function Compressor() {
  this.errors_table = {};
  this.errors_seen = 0;
}

Compressor.prototype.readAndGetFileContents = function(file_name) {
  try {
    var file_contents = fs.readFileSync(file_name, 'ascii');
    return file_contents;
  } catch (err) {
    console.error('There was an error reading ' + file_name);
    console.log(err);
  }
};

Compressor.prototype.parseJsFileAndGetAst = function(file_contents) {
  return jsp.parse(file_contents);
};

Compressor.prototype.extractErrorsTable = function(ast) {
  var isArray = Array.isAray || function(obj) {
    return Object.prototype.toString.call(obj) == '[object Array]';
  };

  var self = this;
  var traverseArray = function(arr) {
    if (isArray(arr)) {
      for (var i = 0; i < arr.length; i++) {
        if(arr[i] == 'throw') {
          var error_obj = self.parseAndModifyErrorArray(arr);
          if (error_obj) {
            self.errors_table[error_obj.err_code] = error_obj;
          }
        }
        traverseArray(arr[i]);
      }
    }
  };
  traverseArray(ast);
};

Compressor.prototype.parseAndModifyErrorArray = function(error_arr) {

  var arg_names = [], arg_nums = [];
  if (error_arr[1][1] && error_arr[1][1][1] == 'NgError') {
    this.errors_seen++;
    for (var i = 1; i < error_arr[1][2].length; i++) {
      if (error_arr[1][2][i]) {
        arg_names.push('{' + error_arr[1][2][i][1] + '}');
        arg_nums.push('{' + (i-1) + '}');
      }
    }
    
    var min_message = 'NGErr ' + this.errors_seen + ': ';
    var error_obj = {
        err_code: this.errors_seen,
        message: error_arr[1][2][0][1],
        min_message: min_message + arg_names.join(' '),
        prod_message: min_message + arg_nums.join(' ')
    };
    var s = error_obj.message;
    for (var i = 0; i < arg_names.length; i++) {       
      var reg = new RegExp("\\{" + i + "\\}", "gm");             
      s = s.replace(reg, arg_names[i]);
    }
    error_obj.message = s;
    error_arr[1][2][0][1] = error_obj.prod_message;
    return error_obj;
  } else {
    return;
  }
};


main(process.argv);