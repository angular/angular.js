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
      "dopoludnia",
      "odpoludnia"
    ],
    "DAY": [
      "nede\u013ea",
      "pondelok",
      "utorok",
      "streda",
      "\u0161tvrtok",
      "piatok",
      "sobota"
    ],
    "ERANAMES": [
      "pred Kristom",
      "po Kristovi"
    ],
    "ERAS": [
      "pred Kr.",
      "po Kr."
    ],
    "MONTH": [
      "janu\u00e1ra",
      "febru\u00e1ra",
      "marca",
      "apr\u00edla",
      "m\u00e1ja",
      "j\u00fana",
      "j\u00fala",
      "augusta",
      "septembra",
      "okt\u00f3bra",
      "novembra",
      "decembra"
    ],
    "SHORTDAY": [
      "ne",
      "po",
      "ut",
      "st",
      "\u0161t",
      "pi",
      "so"
    ],
    "SHORTMONTH": [
      "jan",
      "feb",
      "mar",
      "apr",
      "m\u00e1j",
      "j\u00fan",
      "j\u00fal",
      "aug",
      "sep",
      "okt",
      "nov",
      "dec"
    ],
    "fullDate": "EEEE, d. MMMM y",
    "longDate": "d. MMMM y",
    "medium": "d. M. y H:mm:ss",
    "mediumDate": "d. M. y",
    "mediumTime": "H:mm:ss",
    "short": "dd.MM.yy H:mm",
    "shortDate": "dd.MM.yy",
    "shortTime": "H:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20ac",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": "\u00a0",
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
  "id": "sk-sk",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  if (i >= 2 && i <= 4 && vf.v == 0) {    return PLURAL_CATEGORY.FEW;  }  if (vf.v != 0) {    return PLURAL_CATEGORY.MANY;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
