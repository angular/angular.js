var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;
var fs = require('fs');

exports.Compressor = Compressor;

function main(argv) {
  var cmd_line_arguments = argv.splice(2);
  //Ensure there is a file name passed in and it exists
  if (cmd_line_arguments.length == 3) {
    var compressor = new Compressor();
    var file_contents = compressor.readAndGetFileContents(cmd_line_arguments[0]);
    var ast = compressor.parseJsFileAndGetAst(file_contents);
    compressor.extractErrorsTable(ast);
    compressor.overwriteFile(cmd_line_arguments[1], ast);
    compressor.writeErrorFile(cmd_line_arguments[2]);
  } else {
    console.warn('Please specify the JS file to read, the output JS file name and the output error file name as command line arguments');
  }
}

function Compressor() {
  this.errors_table = [];
  this.errors_seen = 0;
}

Compressor.prototype.overwriteFile = function(file_name, ast) {
  fs.writeFile(file_name, pro.gen_code(ast, {beautify: true, indent_start: 0, indent_level: 2}), function(err) {
    if (err) console.log(err);
  });
};

Compressor.prototype.writeErrorFile = function(file_name) {
  fs.writeFile(file_name, this.getErrorNgDoc(), function(err) {
    if (err) console.log(err);
  });
};

Compressor.prototype.getErrorNgDoc = function() {
  var content = '@ngdoc overview\n' +
      '@name Angular Errors List\n' +
      '@description \n\n' +
      '# Angular Error Table \n\n' +
      'Angular minifies even the error messages that are thrown by Angular in an effort to manage and control the\n' +
      'size of the angular.min.js file. As a result, all error messages are converted to error numbers, which can\n' +
      'be traced to the original source through the use of the table below. The table lists all the error codes, the\n' +
      'original error message, and the arguments which are provided with the error.\n\n' +
      '<table class="error-table">\n' +
      '  <tr class="header-row">\n' +
      '    <th>Error Code</th>\n' +
      '    <th>Original Message</th>\n' +
      '    <th>Minified Message</th>\n' +
      '  </tr>\n';
  
  var compareFunc = function(error1, error2) {
    return error1.err_code - error2.err_code;
  };
  
  this.errors_table.sort(compareFunc);
  for (var i = 0; i < this.errors_table.length; i++) {
    var obj = this.errors_table[i];
    content += '  <tr class="content-row">\n';
    content += '    <td>Err' + obj.err_code.toString(16).toUpperCase() + '</td>\n';
    content += '    <td>' + obj.message + '</td>\n';
    content += '    <td>' + obj.min_message + '</td>\n';
    content += '  </tr>\n';
  }
  content += '</table>\n';
  return content;
};

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
            self.errors_table.push(error_obj);
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
    for (var i = 2; i < error_arr[1][2].length; i++) {
      if (error_arr[1][2][i]) {
        arg_names.push('{' + error_arr[1][2][i][1] + '}');
        arg_nums.push('{' + (i-2) + '}');
      }
    }
    var error_code_num = error_arr[1][2][0][1];
    var min_message = 'Err' + error_code_num.toString(16).toUpperCase();
    if (arg_names.length > 0) {
      min_message +=  ': ';
    }
    var error_obj = {
        err_code: error_code_num,
        message: error_arr[1][2][1][1],
        min_message: min_message + arg_names.join(' '),
        prod_message: min_message + arg_nums.join(' ')
    };
    var s = error_obj.message;
    for (var i = 0; i < arg_names.length; i++) {       
      var reg = new RegExp("\\{" + i + "\\}", "gm");             
      s = s.replace(reg, arg_names[i]);
    }
    error_obj.message = s;
    error_arr[1][2][1][1] = error_obj.prod_message;
    return error_obj;
  } else {
    return;
  }
};


main(process.argv);