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
      "RW",
      "T\u014a"
    ],
    "DAY": [
      "C\u00e4\u014b ku\u0254th",
      "Jiec la\u0331t",
      "R\u025bw l\u00e4tni",
      "Di\u0254\u0331k l\u00e4tni",
      "\u014auaan l\u00e4tni",
      "Dhieec l\u00e4tni",
      "B\u00e4k\u025bl l\u00e4tni"
    ],
    "ERANAMES": [
      "A ka\u0331n Yecu ni dap",
      "\u0190 ca Yecu dap"
    ],
    "ERAS": [
      "AY",
      "\u0190Y"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "Tiop thar p\u025bt",
      "P\u025bt",
      "Du\u0254\u0331\u0254\u0331\u014b",
      "Guak",
      "Du\u00e4t",
      "Kornyoot",
      "Pay yie\u0331tni",
      "Tho\u0331o\u0331r",
      "T\u025b\u025br",
      "Laath",
      "Kur",
      "Tio\u0331p in di\u0331i\u0331t"
    ],
    "SHORTDAY": [
      "C\u00e4\u014b",
      "Jiec",
      "R\u025bw",
      "Di\u0254\u0331k",
      "\u014auaan",
      "Dhieec",
      "B\u00e4k\u025bl"
    ],
    "SHORTMONTH": [
      "Tiop",
      "P\u025bt",
      "Du\u0254\u0331\u0254\u0331",
      "Guak",
      "Du\u00e4",
      "Kor",
      "Pay",
      "Thoo",
      "T\u025b\u025b",
      "Laa",
      "Kur",
      "Tid"
    ],
    "STANDALONEMONTH": [
      "Tiop thar p\u025bt",
      "P\u025bt",
      "Du\u0254\u0331\u0254\u0331\u014b",
      "Guak",
      "Du\u00e4t",
      "Kornyoot",
      "Pay yie\u0331tni",
      "Tho\u0331o\u0331r",
      "T\u025b\u025br",
      "Laath",
      "Kur",
      "Tio\u0331p in di\u0331i\u0331t"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y h:mm:ss a",
    "mediumDate": "d MMM y",
    "mediumTime": "h:mm:ss a",
    "short": "d/MM/y h:mm a",
    "shortDate": "d/MM/y",
    "shortTime": "h:mm a"
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
        "negPre": "-\u00a4",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "nus",
  "localeID": "nus",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
