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
      "am",
      "sm"
    ],
    "DAY": [
      "dumengia",
      "glindesdi",
      "mardi",
      "mesemna",
      "gievgia",
      "venderdi",
      "sonda"
    ],
    "ERANAMES": [
      "avant Cristus",
      "suenter Cristus"
    ],
    "ERAS": [
      "av. Cr.",
      "s. Cr."
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "schaner",
      "favrer",
      "mars",
      "avrigl",
      "matg",
      "zercladur",
      "fanadur",
      "avust",
      "settember",
      "october",
      "november",
      "december"
    ],
    "SHORTDAY": [
      "du",
      "gli",
      "ma",
      "me",
      "gie",
      "ve",
      "so"
    ],
    "SHORTMONTH": [
      "schan.",
      "favr.",
      "mars",
      "avr.",
      "matg",
      "zercl.",
      "fan.",
      "avust",
      "sett.",
      "oct.",
      "nov.",
      "dec."
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, 'ils' d 'da' MMMM y",
    "longDate": "d 'da' MMMM y",
    "medium": "dd-MM-y HH:mm:ss",
    "mediumDate": "dd-MM-y",
    "mediumTime": "HH:mm:ss",
    "short": "dd-MM-yy HH:mm",
    "shortDate": "dd-MM-yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "CHF",
    "DECIMAL_SEP": ".",
    "GROUP_SEP": "\u2019",
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
        "negPre": "-",
        "negSuf": "\u00a0\u00a4",
        "posPre": "",
        "posSuf": "\u00a0\u00a4"
      }
    ]
  },
  "id": "rm-ch",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
