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
      "ya asubuyi",
      "ya muchana"
    ],
    "DAY": [
      "siku ya yenga",
      "siku ya kwanza",
      "siku ya pili",
      "siku ya tatu",
      "siku ya ine",
      "siku ya tanu",
      "siku ya sita"
    ],
    "ERANAMES": [
      "mbele ya Yezu Kristo",
      "kisha ya Yezu Kristo"
    ],
    "ERAS": [
      "mbele ya Y",
      "kisha ya Y"
    ],
    "MONTH": [
      "mwezi ya kwanja",
      "mwezi ya pili",
      "mwezi ya tatu",
      "mwezi ya ine",
      "mwezi ya tanu",
      "mwezi ya sita",
      "mwezi ya saba",
      "mwezi ya munane",
      "mwezi ya tisa",
      "mwezi ya kumi",
      "mwezi ya kumi na moya",
      "mwezi ya kumi ya mbili"
    ],
    "SHORTDAY": [
      "yen",
      "kwa",
      "pil",
      "tat",
      "ine",
      "tan",
      "sit"
    ],
    "SHORTMONTH": [
      "mkw",
      "mpi",
      "mtu",
      "min",
      "mtn",
      "mst",
      "msb",
      "mun",
      "mts",
      "mku",
      "mkm",
      "mkb"
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
    "CURRENCY_SYM": "FrCD",
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
        "negPre": "\u00a4-",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "swc-cd",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
