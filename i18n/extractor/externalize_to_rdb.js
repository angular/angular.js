// Script used to extract i18n strings from a html file and tranform it into RDB formats.

var jsdom = require('jsdom'),
    fs = require('fs'),
    sys = require('sys'),
    extractor = require('./extractor.js'),
    args = process.argv.slice(2); // first is 'node', second is the current file name

if (args.length == 0) {
  console.error('ERROR: You need to specify the path to the source html file!');
  return;
}

var source = args[0],
    target;
if (!(target = args[1])) target = './resource.rdb';

fs.readFile(source, function(err, data) {
  if (err) throw err;
  
  var data = data.toString(),
      window = jsdom.jsdom(data).createWindow();
  jsdom.jQueryify(window, 'http://code.jquery.com/jquery-1.6.2.min.js', function (window, $) {
    // "msgid" should be in lowercase. jsdom seems to convert all attribute names to lowercase.
     var rdbObj = extractor.extract( $('*[msgid]'));
     fs.writeFile(target, JSON.stringify(rdbObj));
  });
});
