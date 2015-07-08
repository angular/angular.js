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
      "dopo\u0142dnja",
      "w\u00f3tpo\u0142dnja"
    ],
    "DAY": [
      "nje\u017aela",
      "p\u00f3nje\u017aele",
      "wa\u0142tora",
      "srjoda",
      "stw\u00f3rtk",
      "p\u011btk",
      "sobota"
    ],
    "ERANAMES": [
      "p\u015bed Kristusowym naro\u017aenim",
      "p\u00f3 Kristusowem naro\u017aenju"
    ],
    "ERAS": [
      "p\u015b.Chr.n.",
      "p\u00f3 Chr.n."
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "januara",
      "februara",
      "m\u011brca",
      "apryla",
      "maja",
      "junija",
      "julija",
      "awgusta",
      "septembra",
      "oktobra",
      "nowembra",
      "decembra"
    ],
    "SHORTDAY": [
      "nje",
      "p\u00f3n",
      "wa\u0142",
      "srj",
      "stw",
      "p\u011bt",
      "sob"
    ],
    "SHORTMONTH": [
      "jan.",
      "feb.",
      "m\u011br.",
      "apr.",
      "maj.",
      "jun.",
      "jul.",
      "awg.",
      "sep.",
      "okt.",
      "now.",
      "dec."
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, d. MMMM y",
    "longDate": "d. MMMM y",
    "medium": "d.M.y H:mm:ss",
    "mediumDate": "d.M.y",
    "mediumTime": "H:mm:ss",
    "short": "d.M.yy H:mm",
    "shortDate": "d.M.yy",
    "shortTime": "H:mm"
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
  "id": "dsb",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
