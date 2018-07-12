'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
function getDecimals(n) {
  n = n + '';
  var i = n.indexOf('.');
  return (i == -1) ? 0 : n.length - i - 1;
}

function getVF(n, opt_precision) {
  var v = opt_precision;

  if (undefined === v) {
    v = Math.min(getDecimals(n), 3);
  }

  var base = Math.pow(10, v);
  var f = ((n * base) | 0) % base;
  return {v: v, f: f};
}

$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "[\u00c5\u1e40 one]",
      "[\u00de\u1e40 one]"
    ],
    "DAY": [
      "[\u0160\u00fb\u00f1\u00f0\u00e5\u00fd one]",
      "[\u1e40\u00f6\u00f1\u00f0\u00e5\u00fd one]",
      "[\u0162\u00fb\u00e9\u0161\u00f0\u00e5\u00fd one]",
      "[\u0174\u00e9\u00f0\u00f1\u00e9\u0161\u00f0\u00e5\u00fd one two]",
      "[\u0162\u0125\u00fb\u0155\u0161\u00f0\u00e5\u00fd one]",
      "[\u0191\u0155\u00ee\u00f0\u00e5\u00fd one]",
      "[\u0160\u00e5\u0163\u00fb\u0155\u00f0\u00e5\u00fd one]"
    ],
    "ERANAMES": [
      "[\u0181\u00e9\u0192\u00f6\u0155\u00e9\u2003\u00c7\u0125\u0155\u00ee\u0161\u0163 one two]",
      "[\u00c5\u00f1\u00f1\u00f6\u2003\u00d0\u00f6\u0271\u00ee\u00f1\u00ee one two]"
    ],
    "ERAS": [
      "[\u0181\u00c7 one]",
      "[\u00c5\u00d0 one]"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "[\u0134\u00e5\u00f1\u00fb\u00e5\u0155\u00fd one]",
      "[\u0191\u00e9\u0180\u0155\u00fb\u00e5\u0155\u00fd one]",
      "[\u1e40\u00e5\u0155\u00e7\u0125 one]",
      "[\u00c5\u00fe\u0155\u00ee\u013c one]",
      "[\u1e40\u00e5\u00fd one]",
      "[\u0134\u00fb\u00f1\u00e9 one]",
      "[\u0134\u00fb\u013c\u00fd one]",
      "[\u00c5\u00fb\u011d\u00fb\u0161\u0163 one]",
      "[\u0160\u00e9\u00fe\u0163\u00e9\u0271\u0180\u00e9\u0155 one two]",
      "[\u00d6\u00e7\u0163\u00f6\u0180\u00e9\u0155 one]",
      "[\u00d1\u00f6\u1e7d\u00e9\u0271\u0180\u00e9\u0155 one]",
      "[\u00d0\u00e9\u00e7\u00e9\u0271\u0180\u00e9\u0155 one]"
    ],
    "SHORTDAY": [
      "[\u0160\u00fb\u00f1 one]",
      "[\u1e40\u00f6\u00f1 one]",
      "[\u0162\u00fb\u00e9 one]",
      "[\u0174\u00e9\u00f0 one]",
      "[\u0162\u0125\u00fb one]",
      "[\u0191\u0155\u00ee one]",
      "[\u0160\u00e5\u0163 one]"
    ],
    "SHORTMONTH": [
      "[\u0134\u00e5\u00f1 one]",
      "[\u0191\u00e9\u0180 one]",
      "[\u1e40\u00e5\u0155 one]",
      "[\u00c5\u00fe\u0155 one]",
      "[\u1e40\u00e5\u00fd one]",
      "[\u0134\u00fb\u00f1 one]",
      "[\u0134\u00fb\u013c one]",
      "[\u00c5\u00fb\u011d one]",
      "[\u0160\u00e9\u00fe one]",
      "[\u00d6\u00e7\u0163 one]",
      "[\u00d1\u00f6\u1e7d one]",
      "[\u00d0\u00e9\u00e7 one]"
    ],
    "STANDALONEMONTH": [
      "[\u0134\u00e5\u00f1\u00fb\u00e5\u0155\u00fd one]",
      "[\u0191\u00e9\u0180\u0155\u00fb\u00e5\u0155\u00fd one]",
      "[\u1e40\u00e5\u0155\u00e7\u0125 one]",
      "[\u00c5\u00fe\u0155\u00ee\u013c one]",
      "[\u1e40\u00e5\u00fd one]",
      "[\u0134\u00fb\u00f1\u00e9 one]",
      "[\u0134\u00fb\u013c\u00fd one]",
      "[\u00c5\u00fb\u011d\u00fb\u0161\u0163 one]",
      "[\u0160\u00e9\u00fe\u0163\u00e9\u0271\u0180\u00e9\u0155 one two]",
      "[\u00d6\u00e7\u0163\u00f6\u0180\u00e9\u0155 one]",
      "[\u00d1\u00f6\u1e7d\u00e9\u0271\u0180\u00e9\u0155 one]",
      "[\u00d0\u00e9\u00e7\u00e9\u0271\u0180\u00e9\u0155 one]"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "[EEEE, MMMM d, y]",
    "longDate": "[MMMM d, y]",
    "medium": "[MMM d, y] [h:mm:ss a]",
    "mediumDate": "[MMM d, y]",
    "mediumTime": "[h:mm:ss a]",
    "short": "[M/d/yy] [h:mm a]",
    "shortDate": "[M/d/yy]",
    "shortTime": "[h:mm a]"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "$",
    "DECIMAL_SEP": ".",
    "GROUP_SEP": ",",
    "PATTERNS": [
      {
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 3,
        "minFrac": 0,
        "minInt": 1,
        "negPre": "-",
        "negSuf": "",
        "posPre": "",
        "posSuf": ""
      },
      {
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 2,
        "minFrac": 2,
        "minInt": 1,
        "negPre": "-\u00a4",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "en-xa",
  "localeID": "en_XA",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
