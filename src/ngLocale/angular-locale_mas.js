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
      "\u0190nkak\u025bny\u00e1",
      "\u0190nd\u00e1m\u00e2"
    ],
    "DAY": [
      "Jumap\u00edl\u00ed",
      "Jumat\u00e1tu",
      "Jumane",
      "Jumat\u00e1n\u0254",
      "Ala\u00e1misi",
      "Jum\u00e1a",
      "Jumam\u00f3si"
    ],
    "MONTH": [
      "Oladal\u0289\u0301",
      "Ar\u00e1t",
      "\u0186\u025bn\u0268\u0301\u0254\u0268\u014b\u0254k",
      "Olodoy\u00ed\u00f3r\u00ed\u00ea ink\u00f3k\u00fa\u00e2",
      "Oloil\u00e9p\u016bny\u012b\u0113 ink\u00f3k\u00fa\u00e2",
      "K\u00faj\u00fa\u0254r\u0254k",
      "M\u00f3rus\u00e1sin",
      "\u0186l\u0254\u0301\u0268\u0301b\u0254\u0301r\u00e1r\u025b",
      "K\u00fash\u00een",
      "Olg\u00edsan",
      "P\u0289sh\u0289\u0301ka",
      "Nt\u0289\u0301\u014b\u0289\u0301s"
    ],
    "SHORTDAY": [
      "Jpi",
      "Jtt",
      "Jnn",
      "Jtn",
      "Alh",
      "Iju",
      "Jmo"
    ],
    "SHORTMONTH": [
      "Dal",
      "Ar\u00e1",
      "\u0186\u025bn",
      "Doy",
      "L\u00e9p",
      "Rok",
      "S\u00e1s",
      "B\u0254\u0301r",
      "K\u00fas",
      "G\u00eds",
      "Sh\u0289\u0301",
      "Nt\u0289\u0301"
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
        "negPre": "\u00a4-",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "mas",
  "pluralCat": function (n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);