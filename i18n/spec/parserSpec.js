'use strict';

var parser = require('../src/parser');
var ensureDecimalSep = parser.ensureDecimalSep;
var parsePattern = parser.parsePattern;

describe('ensureDecimalSep', function() {
  it('should leave patterns with DECIMAL_SEP untouched', function() {
    [
      '#,##0.00',
      '$#,##0.00',
      '#,##0.00$',
      '$0.00',
      '0.00$',
      '0.0',
      '#,##0.',
      '0.'
    ].forEach(function(pattern) {
      expect(ensureDecimalSep(pattern)).toBe(pattern);
    });
  });

  it('should add a DECIMAL_SEP in patterns that don\'t have one (after the last ZERO)', function() {
    var patterns = {
      '#,##000': '#,##000.',
      '$#,#0#00': '$#,#0#00.',
      '#,##000$': '#,##000.$',
      '$000': '$000.',
      '000$': '000.$',
      '00': '00.',
      '#,##0': '#,##0.',
      '0': '0.'
    };

    Object.keys(patterns).forEach(function(input) {
      var output = patterns[input];
      expect(ensureDecimalSep(input)).toBe(output);
    });
  });
});

describe('parsePattern', function() {
  function parseAndExpect(pattern, pp, np, ps, ns, mii, mif, maf, g, lg) {
    var p = parsePattern(pattern);

    expect(p.minInt).toEqual(mii);
    expect(p.minFrac).toEqual(mif);
    expect(p.maxFrac).toEqual(maf);

    expect(p.posPre).toEqual(pp);
    expect(p.posSuf).toEqual(ps);
    expect(p.negPre).toEqual(np);
    expect(p.negSuf).toEqual(ns);

    expect(p.gSize).toBe(g);
    expect(p.lgSize).toBe(lg);
  }

  it('should parse DECIMAL patterns', function() {
    // all DECIMAL patterns from closure
    parseAndExpect('#,##0.###', '', '-', '', '', 1, 0, 3, 3, 3);
    parseAndExpect('#,##0.###;#,##0.###-', '', '', '', '-', 1, 0, 3, 3, 3);
    parseAndExpect('#,##,##0.###', '', '-', '', '', 1, 0, 3, 2, 3);
    parseAndExpect('#,##0.###;\'\u202A\'-#,##0.###\'\u202C\'',
        '', '\u202A-', '', '\u202C', 1, 0, 3, 3, 3);
    parseAndExpect('#0.###;#0.###-', '', '', '', '-', 1, 0, 3, 0, 0);

    // Even patterns without a DECIMAL_SEP
    parseAndExpect('#,##0', '', '-', '', '', 1, 0, 0, 3, 3);
    parseAndExpect('+#,##0', '+', '-+', '', '', 1, 0, 0, 3, 3);
    parseAndExpect('#,#0;+#,#0', '', '+', '', '', 1, 0, 0, 2, 2);
    parseAndExpect('#,##,##0+;(#,##,##0)', '', '(', '+', ')', 1, 0, 0, 2, 3);
  });

  it('should parse CURRENCY patterns', function() {
    // all CURRENCY patterns from closure
    parseAndExpect('#,##0.00 \u00A4', '', '-', ' \u00A4', ' \u00A4', 1, 2, 2, 3, 3);
    parseAndExpect('#,##0.00\u00A0\u00A4;\'\u202A\'-#,##0.00\'\u202C\'\u00A0\u00A4',
                   '', '\u202A-', '\u00A0\u00A4', '\u202C\u00A0\u00A4', 1, 2, 2, 3, 3);
    parseAndExpect('#,##0.00 \u00A4;(#,##0.00 \u00A4)',
                   '', '(', ' \u00A4', ' \u00A4)', 1, 2, 2, 3, 3);
    parseAndExpect('#,##,##0.00\u00A4', '', '-', '\u00A4', '\u00A4', 1, 2, 2, 2, 3);
    parseAndExpect('#,##,##0.00\u00A4;(#,##,##0.00\u00A4)',
                   '', '(', '\u00A4', '\u00A4)', 1, 2, 2, 2, 3);
    parseAndExpect('\u00A4#,##0.00', '\u00A4', '-\u00A4', '', '', 1, 2, 2, 3, 3);
    parseAndExpect('\u00A4#,##0.00;(\u00A4#,##0.00)',
                   '\u00A4', '(\u00A4', '', ')', 1, 2, 2, 3, 3);
    parseAndExpect('\u00A4#,##0.00;\u00A4-#,##0.00',
                   '\u00A4', '\u00A4-', '', '', 1, 2, 2, 3, 3);
    parseAndExpect('\u00A4 #,##0.00', '\u00A4 ', '-\u00A4 ', '', '', 1, 2, 2, 3, 3);
    parseAndExpect('\u00A4 #,##0.00;\u00A4-#,##0.00',
                   '\u00A4 ', '\u00A4-', '', '', 1, 2, 2, 3, 3);
    parseAndExpect('\u00A4 #,##0.00;\u00A4 #,##0.00-',
                   '\u00A4 ', '\u00A4 ', '', '-', 1, 2, 2, 3, 3);
    parseAndExpect('\u00A4 #,##,##0.00', '\u00A4 ', '-\u00A4 ', '', '', 1, 2, 2, 2, 3);

    // Even patterns without a DECIMAL_SEP
    parseAndExpect('#,##0 \u00A4', '', '-', ' \u00A4', ' \u00A4', 1, 0, 0, 3, 3);
    parseAndExpect('\u00A4 #,##0', '\u00A4 ', '-\u00A4 ', '', '', 1, 0, 0, 3, 3);
    parseAndExpect('#,#0 \u00A4;+#,#0\u00A4', '', '+', ' \u00A4', '\u00A4', 1, 0, 0, 2, 2);
    parseAndExpect('\u00A4 #,##,##0;(\u00A4 #,##,##0)', '\u00A4 ', '(\u00A4 ', '', ')', 1, 0, 0, 2, 3);
  });
});
