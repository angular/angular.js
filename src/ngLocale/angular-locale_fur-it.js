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
      "a.",
      "p."
    ],
    "DAY": [
      "domenie",
      "lunis",
      "martars",
      "miercus",
      "joibe",
      "vinars",
      "sabide"
    ],
    "ERANAMES": [
      "pdC",
      "ddC"
    ],
    "ERAS": [
      "pdC",
      "ddC"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "Zen\u00e2r",
      "Fevr\u00e2r",
      "Mar\u00e7",
      "Avr\u00eel",
      "Mai",
      "Jugn",
      "Lui",
      "Avost",
      "Setembar",
      "Otubar",
      "Novembar",
      "Dicembar"
    ],
    "SHORTDAY": [
      "dom",
      "lun",
      "mar",
      "mie",
      "joi",
      "vin",
      "sab"
    ],
    "SHORTMONTH": [
      "Zen",
      "Fev",
      "Mar",
      "Avr",
      "Mai",
      "Jug",
      "Lui",
      "Avo",
      "Set",
      "Otu",
      "Nov",
      "Dic"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE d 'di' MMMM 'dal' y",
    "longDate": "d 'di' MMMM 'dal' y",
    "medium": "dd/MM/y HH:mm:ss",
    "mediumDate": "dd/MM/y",
    "mediumTime": "HH:mm:ss",
    "short": "dd/MM/yy HH:mm",
    "shortDate": "dd/MM/yy",
    "shortTime": "HH:mm"
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
        "negPre": "-\u00a4\u00a0",
        "negSuf": "",
        "posPre": "\u00a4\u00a0",
        "posSuf": ""
      }
    ]
  },
  "id": "fur-it",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
