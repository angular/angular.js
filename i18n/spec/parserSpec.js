'use strict';

var parsePattern = require('../src/parser.js').parsePattern;

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
  });
});
