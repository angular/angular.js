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
      "a. m.",
      "p. m."
    ],
    "DAY": [
      "diumenge",
      "dilluns",
      "dimarts",
      "dimecres",
      "dijous",
      "divendres",
      "dissabte"
    ],
    "ERANAMES": [
      "abans de Crist",
      "despr\u00e9s de Crist"
    ],
    "ERAS": [
      "aC",
      "dC"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "de gener",
      "de febrer",
      "de mar\u00e7",
      "d\u2019abril",
      "de maig",
      "de juny",
      "de juliol",
      "d\u2019agost",
      "de setembre",
      "d\u2019octubre",
      "de novembre",
      "de desembre"
    ],
    "SHORTDAY": [
      "dg.",
      "dl.",
      "dt.",
      "dc.",
      "dj.",
      "dv.",
      "ds."
    ],
    "SHORTMONTH": [
      "gen.",
      "febr.",
      "mar\u00e7",
      "abr.",
      "maig",
      "juny",
      "jul.",
      "ag.",
      "set.",
      "oct.",
      "nov.",
      "des."
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, d MMMM 'de' y",
    "longDate": "d MMMM 'de' y",
    "medium": "d MMM y H:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "H:mm:ss",
    "short": "d/M/yy H:mm",
    "shortDate": "d/M/yy",
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
  "id": "ca-es-valencia",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
