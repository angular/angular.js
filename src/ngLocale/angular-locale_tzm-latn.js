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
      "Zdat azal",
      "\u1e0ceffir aza"
    ],
    "DAY": [
      "Asamas",
      "Aynas",
      "Asinas",
      "Akras",
      "Akwas",
      "Asimwas",
      "Asi\u1e0dyas"
    ],
    "ERANAMES": [
      "Zdat \u0190isa (TA\u0194)",
      "\u1e0ceffir \u0190isa (TA\u0194)"
    ],
    "ERAS": [
      "Z\u0190",
      "\u1e0c\u0190"
    ],
    "FIRSTDAYOFWEEK": 5,
    "MONTH": [
      "Yennayer",
      "Yebrayer",
      "Mars",
      "Ibrir",
      "Mayyu",
      "Yunyu",
      "Yulyuz",
      "\u0194uct",
      "Cutanbir",
      "K\u1e6duber",
      "Nwanbir",
      "Dujanbir"
    ],
    "SHORTDAY": [
      "Asa",
      "Ayn",
      "Asn",
      "Akr",
      "Akw",
      "Asm",
      "As\u1e0d"
    ],
    "SHORTMONTH": [
      "Yen",
      "Yeb",
      "Mar",
      "Ibr",
      "May",
      "Yun",
      "Yul",
      "\u0194uc",
      "Cut",
      "K\u1e6du",
      "Nwa",
      "Duj"
    ],
    "STANDALONEMONTH": [
      "Yennayer",
      "Yebrayer",
      "Mars",
      "Ibrir",
      "Mayyu",
      "Yunyu",
      "Yulyuz",
      "\u0194uct",
      "Cutanbir",
      "K\u1e6duber",
      "Nwanbir",
      "Dujanbir"
    ],
    "WEEKENDRANGE": [
      4,
      5
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
    "CURRENCY_SYM": "dh",
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
        "negSuf": "\u00a0\u00a4",
        "posPre": "",
        "posSuf": "\u00a0\u00a4"
      }
    ]
  },
  "id": "tzm-latn",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
