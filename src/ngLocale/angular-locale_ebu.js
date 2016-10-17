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
      "KI",
      "UT"
    ],
    "DAY": [
      "Kiumia",
      "Njumatatu",
      "Njumaine",
      "Njumatano",
      "Aramithi",
      "Njumaa",
      "NJumamothii"
    ],
    "ERANAMES": [
      "Mbere ya Kristo",
      "Thutha wa Kristo"
    ],
    "ERAS": [
      "MK",
      "TK"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "Mweri wa mbere",
      "Mweri wa ka\u0129ri",
      "Mweri wa kathat\u0169",
      "Mweri wa kana",
      "Mweri wa gatano",
      "Mweri wa gatantat\u0169",
      "Mweri wa m\u0169gwanja",
      "Mweri wa kanana",
      "Mweri wa kenda",
      "Mweri wa ik\u0169mi",
      "Mweri wa ik\u0169mi na \u0169mwe",
      "Mweri wa ik\u0169mi na Ka\u0129r\u0129"
    ],
    "SHORTDAY": [
      "Kma",
      "Tat",
      "Ine",
      "Tan",
      "Arm",
      "Maa",
      "NMM"
    ],
    "SHORTMONTH": [
      "Mbe",
      "Kai",
      "Kat",
      "Kan",
      "Gat",
      "Gan",
      "Mug",
      "Knn",
      "Ken",
      "Iku",
      "Imw",
      "Igi"
    ],
    "STANDALONEMONTH": [
      "Mweri wa mbere",
      "Mweri wa ka\u0129ri",
      "Mweri wa kathat\u0169",
      "Mweri wa kana",
      "Mweri wa gatano",
      "Mweri wa gatantat\u0169",
      "Mweri wa m\u0169gwanja",
      "Mweri wa kanana",
      "Mweri wa kenda",
      "Mweri wa ik\u0169mi",
      "Mweri wa ik\u0169mi na \u0169mwe",
      "Mweri wa ik\u0169mi na Ka\u0129r\u0129"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y HH:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "dd/MM/y HH:mm",
    "shortDate": "dd/MM/y",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "Ksh",
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
  "id": "ebu",
  "localeID": "ebu",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
