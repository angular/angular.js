'use strict';

var url = require('url');
var util = require('./util');
var fixture = require('./fixture');

module.exports = middlewareFactory;

function middlewareFactory(base) {
  base = base || '/e2e';
  while (base.length && base[base.length - 1] === '/') base = base.slice(0, base.length - 1);
  var fixture_regexp = new RegExp('^' + base + '/fixtures/([a-zA-Z0-9_-]+)(/(index.html)?)?$');
  var static_regexp = new RegExp('^' + base + '/fixtures/([a-zA-Z0-9_-]+)(/.*)$');

  return function(req, res, next) {
    var match;
    var basicUrl = req.url;
    var idx = basicUrl.indexOf('?');
    if (idx >= 0) {
      basicUrl = basicUrl.slice(0, idx);
    }
    if ((match = fixture_regexp.exec(basicUrl))) {
      if (util.testExists(match[1])) {
        try {
          var query = url.parse(req.url, true).query;
          res.write(fixture.generate(match[1], query));
          res.end();
        } catch (e) {
          return next(e);
        }
      } else {
        return next('Fixture ' + match[1] + ' not found.');
      }
    } else if ((match = static_regexp.exec(basicUrl))) {
      var rewritten = util.rewriteTestFile(match[1], match[2]);
      if (rewritten !== false) {
        req.url = rewritten;
      }
      next();
    } else {
      return next();
    }
  };
}
