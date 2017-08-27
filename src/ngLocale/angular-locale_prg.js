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
      "ankst\u0101inan",
      "pa pussideinan"
    ],
    "DAY": [
      "nad\u012bli",
      "panad\u012bli",
      "wisas\u012bdis",
      "pussisawaiti",
      "ketwirtiks",
      "p\u0113ntniks",
      "sabattika"
    ],
    "ERANAMES": [
      "BC",
      "AD"
    ],
    "ERAS": [
      "BC",
      "AD"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "rags",
      "wassarins",
      "p\u016blis",
      "sakkis",
      "zallaws",
      "s\u012bmenis",
      "l\u012bpa",
      "daggis",
      "sillins",
      "spallins",
      "lapkr\u016btis",
      "sallaws"
    ],
    "SHORTDAY": [
      "nad",
      "pan",
      "wis",
      "pus",
      "ket",
      "p\u0113n",
      "sab"
    ],
    "SHORTMONTH": [
      "rag",
      "was",
      "p\u016bl",
      "sak",
      "zal",
      "s\u012bm",
      "l\u012bp",
      "dag",
      "sil",
      "spa",
      "lap",
      "sal"
    ],
    "STANDALONEMONTH": [
      "rags",
      "wassarins",
      "p\u016blis",
      "sakkis",
      "zallaws",
      "s\u012bmenis",
      "l\u012bpa",
      "daggis",
      "sillins",
      "spallins",
      "lapkr\u016btis",
      "sallaws"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, y 'mettas' d. MMMM",
    "longDate": "y 'mettas' d. MMMM",
    "medium": "dd.MM 'st'. y HH:mm:ss",
    "mediumDate": "dd.MM 'st'. y",
    "mediumTime": "HH:mm:ss",
    "short": "dd.MM.yy HH:mm",
    "shortDate": "dd.MM.yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "$",
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
  "id": "prg",
  "localeID": "prg",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
