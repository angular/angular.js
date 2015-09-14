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
      "Domingo",
      "Lunes",
      "Martes",
      "Mi\u00e9rcoles",
      "Jueves",
      "Viernes",
      "S\u00e1bado"
    ],
    "ERANAMES": [
      "BCE",
      "d.C."
    ],
    "ERAS": [
      "BCE",
      "d.C."
    ],
    "FIRSTDAYOFWEEK": 6,
    "MONTH": [
      "Qulla puquy",
      "Hatun puquy",
      "Pauqar waray",
      "Ayriwa",
      "Aymuray",
      "Inti raymi",
      "Anta Sitwa",
      "Qhapaq Sitwa",
      "Uma raymi",
      "Kantaray",
      "Ayamarq\u02bca",
      "Kapaq Raymi"
    ],
    "SHORTDAY": [
      "Dom",
      "Lun",
      "Mar",
      "Mi\u00e9",
      "Jue",
      "Vie",
      "Sab"
    ],
    "SHORTMONTH": [
      "Qul",
      "Hat",
      "Pau",
      "Ayr",
      "Aym",
      "Int",
      "Ant",
      "Qha",
      "Uma",
      "Kan",
      "Aya",
      "Kap"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, d MMMM, y",
    "longDate": "y MMMM d",
    "medium": "y MMM d hh:mm:ss a",
    "mediumDate": "y MMM d",
    "mediumTime": "hh:mm:ss a",
    "short": "dd/MM/y hh:mm a",
    "shortDate": "dd/MM/y",
    "shortTime": "hh:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "Bs",
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
        "negPre": "-\u00a4\u00a0",
        "negSuf": "",
        "posPre": "\u00a4\u00a0",
        "posSuf": ""
      }
    ]
  },
  "id": "qu-bo",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
