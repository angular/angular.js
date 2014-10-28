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
      "Z.MU.",
      "Z.MW."
    ],
    "DAY": [
      "Ku w'indwi",
      "Ku wa mbere",
      "Ku wa kabiri",
      "Ku wa gatatu",
      "Ku wa kane",
      "Ku wa gatanu",
      "Ku wa gatandatu"
    ],
    "MONTH": [
      "Nzero",
      "Ruhuhuma",
      "Ntwarante",
      "Ndamukiza",
      "Rusama",
      "Ruheshi",
      "Mukakaro",
      "Nyandagaro",
      "Nyakanga",
      "Gitugutu",
      "Munyonyo",
      "Kigarama"
    ],
    "SHORTDAY": [
      "cu.",
      "mbe.",
      "kab.",
      "gtu.",
      "kan.",
      "gnu.",
      "gnd."
    ],
    "SHORTMONTH": [
      "Mut.",
      "Gas.",
      "Wer.",
      "Mat.",
      "Gic.",
      "Kam.",
      "Nya.",
      "Kan.",
      "Nze.",
      "Ukw.",
      "Ugu.",
      "Uku."
    ],
    "fullDate": "EEEE d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y HH:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "d/M/y HH:mm",
    "shortDate": "d/M/y",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "FBu",
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
        "negSuf": "\u00a4",
        "posPre": "",
        "posSuf": "\u00a4"
      }
    ]
  },
  "id": "rn-bi",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);