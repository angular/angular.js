'use strict';

var url = require('url');
var util = require('./util');
var fixture = require('./fixture');

module.exports = middlewareFactory;

function middlewareFactory(base) {
  base = base || '/e2e';
  while (base.length && base[base.length-1] === '/') base = base.slice(0, base.length-1);
  var fixture_regexp = new RegExp('^' + base + '/tests/([a-zA-Z0-9_-]+)(/(index.html)?)?$');

  return function(req, res, next) {
    var match;
    if ((match = fixture_regexp.exec(req.url))) {
      if (util.testExists(match[1])) {
        try {
          var query = url.parse(req.url, true).query;
          res.write(fixture.generate(match[1], query));
          res.end();
        } catch (e) {
          return next(e);
        }
      } else {
        return next(new Error('Test ' + match[1] + ' not found.'));
      }
    } else {
      return next();
    }
  };
}
