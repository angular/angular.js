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
      "a.m.",
      "p.m."
    ],
    "DAY": [
      "duminic\u0103",
      "luni",
      "mar\u021bi",
      "miercuri",
      "joi",
      "vineri",
      "s\u00e2mb\u0103t\u0103"
    ],
    "ERANAMES": [
      "\u00eenainte de Hristos",
      "dup\u0103 Hristos"
    ],
    "ERAS": [
      "\u00ee.Hr.",
      "d.Hr."
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "ianuarie",
      "februarie",
      "martie",
      "aprilie",
      "mai",
      "iunie",
      "iulie",
      "august",
      "septembrie",
      "octombrie",
      "noiembrie",
      "decembrie"
    ],
    "SHORTDAY": [
      "Dum",
      "Lun",
      "Mar",
      "Mie",
      "Joi",
      "Vin",
      "S\u00e2m"
    ],
    "SHORTMONTH": [
      "ian.",
      "feb.",
      "mar.",
      "apr.",
      "mai",
      "iun.",
      "iul.",
      "aug.",
      "sept.",
      "oct.",
      "nov.",
      "dec."
    ],
    "STANDALONEMONTH": [
      "Ianuarie",
      "Februarie",
      "Martie",
      "Aprilie",
      "Mai",
      "Iunie",
      "Iulie",
      "August",
      "Septembrie",
      "Octombrie",
      "Noiembrie",
      "Decembrie"
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
    "short": "dd.MM.y HH:mm",
    "shortDate": "dd.MM.y",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "RON",
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
  "id": "ro-ro",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  if (vf.v != 0 || n == 0 || n != 1 && n % 100 >= 1 && n % 100 <= 19) {    return PLURAL_CATEGORY.FEW;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
