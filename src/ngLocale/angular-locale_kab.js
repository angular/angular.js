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
      "n tufat",
      "n tmeddit"
    ],
    "DAY": [
      "Yanass",
      "Sanass",
      "Kra\u1e0dass",
      "Ku\u1e93ass",
      "Samass",
      "S\u1e0disass",
      "Sayass"
    ],
    "ERANAMES": [
      "send talalit n \u0190isa",
      "seld talalit n \u0190isa"
    ],
    "ERAS": [
      "snd. T.\u0190",
      "sld. T.\u0190"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "Yennayer",
      "Fu\u1e5bar",
      "Me\u0263res",
      "Yebrir",
      "Mayyu",
      "Yunyu",
      "Yulyu",
      "\u0194uct",
      "Ctembe\u1e5b",
      "Tube\u1e5b",
      "Nunembe\u1e5b",
      "Du\u01e7embe\u1e5b"
    ],
    "SHORTDAY": [
      "Yan",
      "San",
      "Kra\u1e0d",
      "Ku\u1e93",
      "Sam",
      "S\u1e0dis",
      "Say"
    ],
    "SHORTMONTH": [
      "Yen",
      "Fur",
      "Me\u0263",
      "Yeb",
      "May",
      "Yun",
      "Yul",
      "\u0194uc",
      "Cte",
      "Tub",
      "Nun",
      "Du\u01e7"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM, y HH:mm:ss",
    "mediumDate": "d MMM, y",
    "mediumTime": "HH:mm:ss",
    "short": "d/M/y HH:mm",
    "shortDate": "d/M/y",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "din",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": "\u00a0",
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
  "id": "kab",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
