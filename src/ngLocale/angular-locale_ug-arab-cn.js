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
      "\u0686\u06c8\u0634\u062a\u0649\u0646 \u0628\u06c7\u0631\u06c7\u0646",
      "\u0686\u06c8\u0634\u062a\u0649\u0646 \u0643\u06d0\u064a\u0649\u0646"
    ],
    "DAY": [
      "\u064a\u06d5\u0643\u0634\u06d5\u0646\u0628\u06d5",
      "\u062f\u06c8\u0634\u06d5\u0646\u0628\u06d5",
      "\u0633\u06d5\u064a\u0634\u06d5\u0646\u0628\u06d5",
      "\u0686\u0627\u0631\u0634\u06d5\u0646\u0628\u06d5",
      "\u067e\u06d5\u064a\u0634\u06d5\u0646\u0628\u06d5",
      "\u062c\u06c8\u0645\u06d5",
      "\u0634\u06d5\u0646\u0628\u06d5"
    ],
    "ERANAMES": [
      "\u0645\u0649\u0644\u0627\u062f\u0649\u064a\u06d5\u062f\u0649\u0646 \u0628\u06c7\u0631\u06c7\u0646",
      "\u0645\u0649\u0644\u0627\u062f\u0649\u064a\u06d5"
    ],
    "ERAS": [
      "\u0645\u0649\u0644\u0627\u062f\u0649\u064a\u06d5\u062f\u0649\u0646 \u0628\u06c7\u0631\u06c7\u0646",
      "\u0645\u0649\u0644\u0627\u062f\u0649\u064a\u06d5"
    ],
    "FIRSTDAYOFWEEK": 6,
    "MONTH": [
      "\u064a\u0627\u0646\u06cb\u0627\u0631",
      "\u0641\u06d0\u06cb\u0631\u0627\u0644",
      "\u0645\u0627\u0631\u062a",
      "\u0626\u0627\u067e\u0631\u06d0\u0644",
      "\u0645\u0627\u064a",
      "\u0626\u0649\u064a\u06c7\u0646",
      "\u0626\u0649\u064a\u06c7\u0644",
      "\u0626\u0627\u06cb\u063a\u06c7\u0633\u062a",
      "\u0633\u06d0\u0646\u062a\u06d5\u0628\u0649\u0631",
      "\u0626\u06c6\u0643\u062a\u06d5\u0628\u0649\u0631",
      "\u0628\u0648\u064a\u0627\u0628\u0649\u0631",
      "\u062f\u06d0\u0643\u0627\u0628\u0649\u0631"
    ],
    "SHORTDAY": [
      "\u064a\u06d5",
      "\u062f\u06c8",
      "\u0633\u06d5",
      "\u0686\u0627",
      "\u067e\u06d5",
      "\u0686\u06c8",
      "\u0634\u06d5"
    ],
    "SHORTMONTH": [
      "\u064a\u0627\u0646\u06cb\u0627\u0631",
      "\u0641\u06d0\u06cb\u0631\u0627\u0644",
      "\u0645\u0627\u0631\u062a",
      "\u0626\u0627\u067e\u0631\u06d0\u0644",
      "\u0645\u0627\u064a",
      "\u0626\u0649\u064a\u06c7\u0646",
      "\u0626\u0649\u064a\u06c7\u0644",
      "\u0626\u0627\u06cb\u063a\u06c7\u0633\u062a",
      "\u0633\u06d0\u0646\u062a\u06d5\u0628\u0649\u0631",
      "\u0626\u06c6\u0643\u062a\u06d5\u0628\u0649\u0631",
      "\u0646\u0648\u064a\u0627\u0628\u0649\u0631",
      "\u062f\u06d0\u0643\u0627\u0628\u0649\u0631"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE\u060c MMMM d\u060c y",
    "longDate": "MMMM d\u060c y",
    "medium": "MMM d\u060c y h:mm:ss a",
    "mediumDate": "MMM d\u060c y",
    "mediumTime": "h:mm:ss a",
    "short": "M/d/yy h:mm a",
    "shortDate": "M/d/yy",
    "shortTime": "h:mm a"
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
        "negPre": "-\u00a4",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "ug-arab-cn",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
