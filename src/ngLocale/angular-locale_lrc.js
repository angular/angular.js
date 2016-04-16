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
      "AM",
      "PM"
    ],
    "DAY": [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat"
    ],
    "ERANAMES": [
      "BCE",
      "CE"
    ],
    "ERAS": [
      "BCE",
      "CE"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "\u062c\u0627\u0646\u06a4\u06cc\u06d5",
      "\u0641\u0626\u06a4\u0631\u06cc\u06d5",
      "\u0645\u0627\u0631\u0633",
      "\u0622\u06a4\u0631\u06cc\u0644",
      "\u0645\u0626\u06cc",
      "\u062c\u0648\u0659\u0623\u0646",
      "\u062c\u0648\u0659\u0644\u0627",
      "\u0622\u06af\u0648\u0633\u062a",
      "\u0633\u0626\u067e\u062a\u0627\u0645\u0631",
      "\u0626\u0648\u06a9\u062a\u0648\u06a4\u0631",
      "\u0646\u0648\u06a4\u0627\u0645\u0631",
      "\u062f\u0626\u0633\u0627\u0645\u0631"
    ],
    "SHORTDAY": [
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat"
    ],
    "SHORTMONTH": [
      "\u062c\u0627\u0646\u06a4\u06cc\u06d5",
      "\u0641\u0626\u06a4\u0631\u06cc\u06d5",
      "\u0645\u0627\u0631\u0633",
      "\u0622\u06a4\u0631\u06cc\u0644",
      "\u0645\u0626\u06cc",
      "\u062c\u0648\u0659\u0623\u0646",
      "\u062c\u0648\u0659\u0644\u0627",
      "\u0622\u06af\u0648\u0633\u062a",
      "\u0633\u0626\u067e\u062a\u0627\u0645\u0631",
      "\u0626\u0648\u06a9\u062a\u0648\u06a4\u0631",
      "\u0646\u0648\u06a4\u0627\u0645\u0631",
      "\u062f\u0626\u0633\u0627\u0645\u0631"
    ],
    "STANDALONEMONTH": [
      "\u062c\u0627\u0646\u06a4\u06cc\u06d5",
      "\u0641\u0626\u06a4\u0631\u06cc\u06d5",
      "\u0645\u0627\u0631\u0633",
      "\u0622\u06a4\u0631\u06cc\u0644",
      "\u0645\u0626\u06cc",
      "\u062c\u0648\u0659\u0623\u0646",
      "\u062c\u0648\u0659\u0644\u0627",
      "\u0622\u06af\u0648\u0633\u062a",
      "\u0633\u0626\u067e\u062a\u0627\u0645\u0631",
      "\u0626\u0648\u06a9\u062a\u0648\u06a4\u0631",
      "\u0646\u0648\u06a4\u0627\u0645\u0631",
      "\u062f\u0626\u0633\u0627\u0645\u0631"
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
    "CURRENCY_SYM": "Rial",
    "DECIMAL_SEP": "\u066b",
    "GROUP_SEP": "\u066c",
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
  "id": "lrc",
  "localeID": "lrc",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
