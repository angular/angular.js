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
      "s\u0254ndi",
      "lundi",
      "mardi",
      "m\u025brk\u025br\u025bdi",
      "yedi",
      "va\u014bd\u025br\u025bdi",
      "m\u0254n\u0254 s\u0254ndi"
    ],
    "ERANAMES": [
      "BCE",
      "CE"
    ],
    "ERAS": [
      "BCE",
      "CE"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "pamba",
      "wanja",
      "mbiy\u0254 m\u025bndo\u014bg\u0254",
      "Ny\u0254l\u0254mb\u0254\u014bg\u0254",
      "M\u0254n\u0254 \u014bgbanja",
      "Nya\u014bgw\u025b \u014bgbanja",
      "ku\u014bgw\u025b",
      "f\u025b",
      "njapi",
      "nyukul",
      "11",
      "\u0253ul\u0253us\u025b"
    ],
    "SHORTDAY": [
      "s\u0254ndi",
      "lundi",
      "mardi",
      "m\u025brk\u025br\u025bdi",
      "yedi",
      "va\u014bd\u025br\u025bdi",
      "m\u0254n\u0254 s\u0254ndi"
    ],
    "SHORTMONTH": [
      "pamba",
      "wanja",
      "mbiy\u0254 m\u025bndo\u014bg\u0254",
      "Ny\u0254l\u0254mb\u0254\u014bg\u0254",
      "M\u0254n\u0254 \u014bgbanja",
      "Nya\u014bgw\u025b \u014bgbanja",
      "ku\u014bgw\u025b",
      "f\u025b",
      "njapi",
      "nyukul",
      "11",
      "\u0253ul\u0253us\u025b"
    ],
    "STANDALONEMONTH": [
      "pamba",
      "wanja",
      "mbiy\u0254 m\u025bndo\u014bg\u0254",
      "Ny\u0254l\u0254mb\u0254\u014bg\u0254",
      "M\u0254n\u0254 \u014bgbanja",
      "Nya\u014bgw\u025b \u014bgbanja",
      "ku\u014bgw\u025b",
      "f\u025b",
      "njapi",
      "nyukul",
      "11",
      "\u0253ul\u0253us\u025b"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE dd MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y HH:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "dd/MM y HH:mm",
    "shortDate": "dd/MM y",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "FCFA",
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
  "id": "kkj",
  "localeID": "kkj",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
