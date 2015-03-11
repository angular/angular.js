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

function getWT(v, f) {
  if (f === 0) {
    return {w: 0, t: 0};
  }

  while ((f % 10) === 0) {
    f /= 10;
    v--;
  }

  return {w: v, t: f};
}

$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "AM",
      "PM"
    ],
    "DAY": [
      "s\u00f8ndag",
      "mandag",
      "tirsdag",
      "onsdag",
      "torsdag",
      "fredag",
      "l\u00f8rdag"
    ],
    "ERANAMES": [
      "f.Kr.",
      "e.Kr."
    ],
    "ERAS": [
      "f.Kr.",
      "e.Kr."
    ],
    "MONTH": [
      "januar",
      "februar",
      "marts",
      "april",
      "maj",
      "juni",
      "juli",
      "august",
      "september",
      "oktober",
      "november",
      "december"
    ],
    "SHORTDAY": [
      "s\u00f8n.",
      "man.",
      "tir.",
      "ons.",
      "tor.",
      "fre.",
      "l\u00f8r."
    ],
    "SHORTMONTH": [
      "jan.",
      "feb.",
      "mar.",
      "apr.",
      "maj",
      "jun.",
      "jul.",
      "aug.",
      "sep.",
      "okt.",
      "nov.",
      "dec."
    ],
    "fullDate": "EEEE 'den' d. MMMM y",
    "longDate": "d. MMMM y",
    "medium": "dd/MM/y HH.mm.ss",
    "mediumDate": "dd/MM/y",
    "mediumTime": "HH.mm.ss",
    "short": "dd/MM/yy HH.mm",
    "shortDate": "dd/MM/yy",
    "shortTime": "HH.mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "kr",
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
  "id": "da-dk",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  var wt = getWT(vf.v, vf.f);  if (n == 1 || wt.t != 0 && (i == 0 || i == 1)) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
