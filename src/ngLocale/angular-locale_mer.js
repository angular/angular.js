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
      "R\u0168",
      "\u0168G"
    ],
    "DAY": [
      "Kiumia",
      "Muramuko",
      "Wairi",
      "Wethatu",
      "Wena",
      "Wetano",
      "Jumamosi"
    ],
    "ERANAMES": [
      "Mbere ya Krist\u0169",
      "Nyuma ya Krist\u0169"
    ],
    "ERAS": [
      "MK",
      "NK"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "Januar\u0129",
      "Feburuar\u0129",
      "Machi",
      "\u0128pur\u0169",
      "M\u0129\u0129",
      "Njuni",
      "Njura\u0129",
      "Agasti",
      "Septemba",
      "Okt\u0169ba",
      "Novemba",
      "Dicemba"
    ],
    "SHORTDAY": [
      "KIU",
      "MRA",
      "WAI",
      "WET",
      "WEN",
      "WTN",
      "JUM"
    ],
    "SHORTMONTH": [
      "JAN",
      "FEB",
      "MAC",
      "\u0128PU",
      "M\u0128\u0128",
      "NJU",
      "NJR",
      "AGA",
      "SPT",
      "OKT",
      "NOV",
      "DEC"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y h:mm:ss a",
    "mediumDate": "d MMM y",
    "mediumTime": "h:mm:ss a",
    "short": "dd/MM/y h:mm a",
    "shortDate": "dd/MM/y",
    "shortTime": "h:mm a"
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
  "id": "mer",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
