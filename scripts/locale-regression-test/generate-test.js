#!/usr/bin/env node

/**
 * At least one of the mismatched is caused by the fact that node-cldr is more up-to-date than our
 * copy of Closure's localizition library:
 * https://github.com/google/closure-library/commit/ccc3aeef487ad318eb4b0bdf1289a9035a6f037a#diff-ead1466534a1265f56c5192d73abf2a4L537
 */

var cldr = require('cldr');
var _ = require('lodash');
var fs = require('fs');

var localeIds = fs.readdirSync('../../build/i18n').filter(function(path) {
		return path.match('^angular-locale_');
}).map(function(path) {
		return path.match(/_([a-z0-9\-]+)/)[1];
});
var template = fs.readFileSync('test.html.template', {'encoding': 'utf-8'});
var html = _.template(
		template,
		{'localeIdsAndCldrPluralCatFuns': localeIds.map(function(id) {
				return [id, cldr.extractPluralRuleFunction(id.replace('-', '_')).toString()];
		})});
var testFilePath = '../../build/locale-regression-test.html';
fs.writeFileSync(testFilePath, html);
console.log('Test file written to "%s"', testFilePath);
