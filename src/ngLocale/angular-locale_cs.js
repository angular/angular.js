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
      "dopoledne",
      "odpoledne"
    ],
    "DAY": [
      "ned\u011ble",
      "pond\u011bl\u00ed",
      "\u00fater\u00fd",
      "st\u0159eda",
      "\u010dtvrtek",
      "p\u00e1tek",
      "sobota"
    ],
    "ERANAMES": [
      "p\u0159. n. l.",
      "n. l."
    ],
    "ERAS": [
      "p\u0159. n. l.",
      "n. l."
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "ledna",
      "\u00fanora",
      "b\u0159ezna",
      "dubna",
      "kv\u011btna",
      "\u010dervna",
      "\u010dervence",
      "srpna",
      "z\u00e1\u0159\u00ed",
      "\u0159\u00edjna",
      "listopadu",
      "prosince"
    ],
    "SHORTDAY": [
      "ne",
      "po",
      "\u00fat",
      "st",
      "\u010dt",
      "p\u00e1",
      "so"
    ],
    "SHORTMONTH": [
      "led",
      "\u00fano",
      "b\u0159e",
      "dub",
      "kv\u011b",
      "\u010dvn",
      "\u010dvc",
      "srp",
      "z\u00e1\u0159",
      "\u0159\u00edj",
      "lis",
      "pro"
    ],
    "STANDALONEMONTH": [
      "leden",
      "\u00fanor",
      "b\u0159ezen",
      "duben",
      "kv\u011bten",
      "\u010derven",
      "\u010dervenec",
      "srpen",
      "z\u00e1\u0159\u00ed",
      "\u0159\u00edjen",
      "listopad",
      "prosinec"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE d. MMMM y",
    "longDate": "d. MMMM y",
    "medium": "d. M. y H:mm:ss",
    "mediumDate": "d. M. y",
    "mediumTime": "H:mm:ss",
    "short": "dd.MM.yy H:mm",
    "shortDate": "dd.MM.yy",
    "shortTime": "H:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "K\u010d",
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
  "id": "cs",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  if (i >= 2 && i <= 4 && vf.v == 0) {    return PLURAL_CATEGORY.FEW;  }  if (vf.v != 0) {    return PLURAL_CATEGORY.MANY;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
