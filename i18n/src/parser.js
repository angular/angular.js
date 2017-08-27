'use strict';

/**
* A simple parser to parse a number format into a pattern object
*/

exports.ensureDecimalSep = ensureDecimalSep;
exports.parsePattern = parsePattern;

var PATTERN_SEP  = ';',
    DECIMAL_SEP  = '.',
    GROUP_SEP    = ',',
    DIGIT        = '#',
    ZERO         = '0',
    LAST_ZERO_RE = /^(.*0)(?!0)(.*)$/;

/**
 * Helper function for parser.
 * Ensures that `pattern` (e.g #,##0.###) contains a DECIMAL_SEP, which is necessary for further
 * parsing. If a pattern does not include one, it is added after the last ZERO (which is the last
 * thing before the `posSuf` - if any).
 */
function ensureDecimalSep(pattern) {
  return (pattern.indexOf(DECIMAL_SEP) !== -1)
      ? pattern : pattern.replace(LAST_ZERO_RE, '$1' + DECIMAL_SEP + '$2');
}

/**
 * main function for parser
 * @param str {string} pattern to be parsed (e.g. #,##0.###).
 */
function parsePattern(pattern) {
  var p = {
            minInt: 1,
            minFrac: 0,
            maxFrac: 0,
            posPre: '',
            posSuf: '',
            negPre: '',
            negSuf: '',
            gSize: 0,
            lgSize: 0
          };

  var patternParts = pattern.split(PATTERN_SEP),
      positive = patternParts[0],
      negative = patternParts[1];

  // The parsing logic further below assumes that there will always be a DECIMAL_SEP in the pattern.
  // However, some locales (e.g. agq_CM) do not have one, thus we add one after the last ZERO
  // (which is the last thing before the `posSuf` - if any). Since there will be no ZEROs or DIGITs
  // after DECIMAL_SEP, `min/maxFrac` will remain 0 (which is accurate - no fraction digits) and
  // `posSuf` will be processed correctly.
  // For example `#,##0$` would be converted to `#,##0.$`, which would (correctly) result in:
  // `minFrac: 0`, `maxFrac: 0`, `posSuf: '$'`
  // Note: We shouldn't modify `positive` directly, because it is used to parse the negative part.)
  var positiveWithDecimalSep = ensureDecimalSep(positive),
      positiveParts = positiveWithDecimalSep.split(DECIMAL_SEP),
      integer = positiveParts[0],
      fraction = positiveParts[1];

  p.posPre = integer.substr(0, integer.indexOf(DIGIT));

  for (var i = 0; i < fraction.length; i++) {
    var ch = fraction.charAt(i);
    if (ch === ZERO) p.minFrac = p.maxFrac = i + 1;
    else if (ch === DIGIT) p.maxFrac = i + 1;
    else p.posSuf += ch;
  }

  var groups = integer.split(GROUP_SEP);
  p.gSize = groups[1] ? groups[1].length : 0;
  p.lgSize = (groups[2] || groups[1]) ? (groups[2] || groups[1]).length : 0;

  if (negative) {
    var trunkLen = positive.length - p.posPre.length - p.posSuf.length,
        pos = negative.indexOf(DIGIT);

    p.negPre = negative.substr(0, pos).replace(/'/g, '');
    p.negSuf = negative.substr(pos + trunkLen).replace(/'/g, '');
  } else {
    // hardcoded '-' sign is fine as all locale use '-' as MINUS_SIGN. (\u2212 is the same as '-')
    p.negPre = '-' + p.posPre;
    p.negSuf = p.posSuf;
  }

  return p;
}
