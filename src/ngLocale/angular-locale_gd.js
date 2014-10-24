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
      "m",
      "f"
    ],
    "DAY": [
      "DiD\u00f2mhnaich",
      "DiLuain",
      "DiM\u00e0irt",
      "DiCiadain",
      "Diardaoin",
      "DihAoine",
      "DiSathairne"
    ],
    "MONTH": [
      "Am Faoilleach",
      "An Gearran",
      "Am M\u00e0rt",
      "An Giblean",
      "An C\u00e8itean",
      "An t-\u00d2gmhios",
      "An t-Iuchar",
      "An L\u00f9nastal",
      "An t-Sultain",
      "An D\u00e0mhair",
      "An t-Samhain",
      "An D\u00f9bhlachd"
    ],
    "SHORTDAY": [
      "DiD",
      "DiL",
      "DiM",
      "DiC",
      "Dia",
      "Dih",
      "DiS"
    ],
    "SHORTMONTH": [
      "Faoi",
      "Gearr",
      "M\u00e0rt",
      "Gibl",
      "C\u00e8it",
      "\u00d2gmh",
      "Iuch",
      "L\u00f9na",
      "Sult",
      "D\u00e0mh",
      "Samh",
      "D\u00f9bh"
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
    "CURRENCY_SYM": "\u00a3",
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
        "negPre": "\u00a4-",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "gd",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
