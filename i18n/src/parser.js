/**
* A simple parser to parse a number format into a pattern object
*/

exports.parsePattern = parsePattern;

var PATTERN_SEP = ';',
    DECIMAL_SEP = '.',
    GROUP_SEP   = ',',
    ZERO        = '0',
    DIGIT       = '#';

/**
 * main funciton for parser
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

  var parts = pattern.split(PATTERN_SEP),
      positive = parts[0],
      negative = parts[1];

  var parts = positive.split(DECIMAL_SEP),
      integer = parts[0],
      fraction = parts[1];

  p.posPre = integer.substr(0, integer.indexOf(DIGIT));

  for (var i = 0; i < fraction.length; i++) {
    var ch = fraction.charAt(i);
    if (ch == ZERO) p.minFrac = p.maxFrac = i + 1;
    else if (ch == DIGIT) p.maxFrac = i + 1;
    else p.posSuf += ch;
  }

  var groups = integer.split(GROUP_SEP);
  p.gSize = groups[1] ? groups[1].length : 0;
  p.lgSize = (groups[2] || groups[1]) ? (groups[2] || groups[1]).length : 0;

  if (negative) {
    var trunkLen = positive.length - p.posPre.length - p.posSuf.length,
        pos = negative.indexOf(DIGIT);

    p.negPre = negative.substr(0, pos).replace(/\'/g, '');
    p.negSuf = negative.substr(pos + trunkLen).replace(/\'/g, '');
  } else {
    // hardcoded '-' sign is fine as all locale use '-' as MINUS_SIGN. (\u2212 is the same as '-')
    p.negPre = p.posPre + '-';
    p.negSuf = p.posSuf;
  }

  return p;
}
