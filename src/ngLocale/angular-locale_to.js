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
      "AM",
      "PM"
    ],
    "DAY": [
      "S\u0101pate",
      "M\u014dnite",
      "T\u016bsite",
      "Pulelulu",
      "Tu\u02bbapulelulu",
      "Falaite",
      "Tokonaki"
    ],
    "ERANAMES": [
      "ki mu\u02bba",
      "ta\u02bbu \u02bbo S\u012bs\u016b"
    ],
    "ERAS": [
      "KM",
      "TS"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "S\u0101nuali",
      "F\u0113pueli",
      "Ma\u02bbasi",
      "\u02bbEpeleli",
      "M\u0113",
      "Sune",
      "Siulai",
      "\u02bbAokosi",
      "Sepitema",
      "\u02bbOkatopa",
      "N\u014dvema",
      "T\u012bsema"
    ],
    "SHORTDAY": [
      "S\u0101p",
      "M\u014dn",
      "T\u016bs",
      "Pul",
      "Tu\u02bba",
      "Fal",
      "Tok"
    ],
    "SHORTMONTH": [
      "S\u0101n",
      "F\u0113p",
      "Ma\u02bba",
      "\u02bbEpe",
      "M\u0113",
      "Sun",
      "Siu",
      "\u02bbAok",
      "Sep",
      "\u02bbOka",
      "N\u014dv",
      "T\u012bs"
    ],
    "STANDALONEMONTH": [
      "S\u0101nuali",
      "F\u0113pueli",
      "Ma\u02bbasi",
      "\u02bbEpeleli",
      "M\u0113",
      "Sune",
      "Siulai",
      "\u02bbAokosi",
      "Sepitema",
      "\u02bbOkatopa",
      "N\u014dvema",
      "T\u012bsema"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y h:mm:ss a",
    "mediumDate": "d MMM y",
    "mediumTime": "h:mm:ss a",
    "short": "d/M/yy h:mm a",
    "shortDate": "d/M/yy",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "T$",
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
        "negPre": "-\u00a4\u00a0",
        "negSuf": "",
        "posPre": "\u00a4\u00a0",
        "posSuf": ""
      }
    ]
  },
  "id": "to",
  "localeID": "to",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
