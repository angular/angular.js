var fs = require('fs');

var filename = __dirname + '/showdown-0.9.js';
var src = fs.readFileSync(filename);
var Showdown = process.compile(src + '\nShowdown;', filename);
exports.Showdown = Showdown;
