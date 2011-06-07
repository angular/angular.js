var fs = require('fs');
var vm = require('vm');

var filename = __dirname + '/showdown-0.9.js';
var src = fs.readFileSync(filename);
var Showdown = vm.runInThisContext(src + '\nShowdown;', filename);
exports.Showdown = Showdown;
