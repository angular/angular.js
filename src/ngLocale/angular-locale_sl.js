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
      "dop.",
      "pop."
    ],
    "DAY": [
      "nedelja",
      "ponedeljek",
      "torek",
      "sreda",
      "\u010detrtek",
      "petek",
      "sobota"
    ],
    "ERANAMES": [
      "pred na\u0161im \u0161tetjem",
      "na\u0161e \u0161tetje"
    ],
    "ERAS": [
      "pr. n. \u0161t.",
      "po Kr."
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "januar",
      "februar",
      "marec",
      "april",
      "maj",
      "junij",
      "julij",
      "avgust",
      "september",
      "oktober",
      "november",
      "december"
    ],
    "SHORTDAY": [
      "ned.",
      "pon.",
      "tor.",
      "sre.",
      "\u010det.",
      "pet.",
      "sob."
    ],
    "SHORTMONTH": [
      "jan.",
      "feb.",
      "mar.",
      "apr.",
      "maj",
      "jun.",
      "jul.",
      "avg.",
      "sep.",
      "okt.",
      "nov.",
      "dec."
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, dd. MMMM y",
    "longDate": "dd. MMMM y",
    "medium": "d. MMM y HH:mm:ss",
    "mediumDate": "d. MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "d. MM. yy HH:mm",
    "shortDate": "d. MM. yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20ac",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": ".",
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
  "id": "sl",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (vf.v == 0 && i % 100 == 1) {    return PLURAL_CATEGORY.ONE;  }  if (vf.v == 0 && i % 100 == 2) {    return PLURAL_CATEGORY.TWO;  }  if (vf.v == 0 && i % 100 >= 3 && i % 100 <= 4 || vf.v != 0) {    return PLURAL_CATEGORY.FEW;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
