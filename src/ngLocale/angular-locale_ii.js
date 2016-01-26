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
      "\ua3b8\ua111",
      "\ua06f\ua2d2"
    ],
    "DAY": [
      "\ua46d\ua18f\ua44d",
      "\ua18f\ua282\ua2cd",
      "\ua18f\ua282\ua44d",
      "\ua18f\ua282\ua315",
      "\ua18f\ua282\ua1d6",
      "\ua18f\ua282\ua26c",
      "\ua18f\ua282\ua0d8"
    ],
    "ERANAMES": [
      "\ua0c5\ua2ca\ua0bf",
      "\ua0c5\ua2ca\ua282"
    ],
    "ERAS": [
      "\ua0c5\ua2ca\ua0bf",
      "\ua0c5\ua2ca\ua282"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "\ua2cd\ua1aa",
      "\ua44d\ua1aa",
      "\ua315\ua1aa",
      "\ua1d6\ua1aa",
      "\ua26c\ua1aa",
      "\ua0d8\ua1aa",
      "\ua3c3\ua1aa",
      "\ua246\ua1aa",
      "\ua22c\ua1aa",
      "\ua2b0\ua1aa",
      "\ua2b0\ua2aa\ua1aa",
      "\ua2b0\ua44b\ua1aa"
    ],
    "SHORTDAY": [
      "\ua46d\ua18f",
      "\ua18f\ua2cd",
      "\ua18f\ua44d",
      "\ua18f\ua315",
      "\ua18f\ua1d6",
      "\ua18f\ua26c",
      "\ua18f\ua0d8"
    ],
    "SHORTMONTH": [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12"
    ],
    "STANDALONEMONTH": [
      "\ua2cd\ua1aa",
      "\ua44d\ua1aa",
      "\ua315\ua1aa",
      "\ua1d6\ua1aa",
      "\ua26c\ua1aa",
      "\ua0d8\ua1aa",
      "\ua3c3\ua1aa",
      "\ua246\ua1aa",
      "\ua22c\ua1aa",
      "\ua2b0\ua1aa",
      "\ua2b0\ua2aa\ua1aa",
      "\ua2b0\ua44b\ua1aa"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "y MMMM d, EEEE",
    "longDate": "y MMMM d",
    "medium": "y MMM d HH:mm:ss",
    "mediumDate": "y MMM d",
    "mediumTime": "HH:mm:ss",
    "short": "y-MM-dd HH:mm",
    "shortDate": "y-MM-dd",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u00a5",
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
        "negPre": "-\u00a4\u00a0",
        "negSuf": "",
        "posPre": "\u00a4\u00a0",
        "posSuf": ""
      }
    ]
  },
  "id": "ii",
  "localeID": "ii",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
