'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "AM",
      "PM"
    ],
    "DAY": [
      "\u0431\u0430\u0437\u0430\u0440",
      "\u0431\u0430\u0437\u0430\u0440 \u0435\u0440\u0442\u04d9\u0441\u0438",
      "\u0447\u04d9\u0440\u0448\u04d9\u043d\u0431\u04d9 \u0430\u0445\u0448\u0430\u043c\u044b",
      "\u0447\u04d9\u0440\u0448\u04d9\u043d\u0431\u04d9",
      "\u04b9\u04af\u043c\u04d9 \u0430\u0445\u0448\u0430\u043c\u044b",
      "\u04b9\u04af\u043c\u04d9",
      "\u0448\u04d9\u043d\u0431\u04d9"
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
      "\u0458\u0430\u043d\u0432\u0430\u0440",
      "\u0444\u0435\u0432\u0440\u0430\u043b",
      "\u043c\u0430\u0440\u0442",
      "\u0430\u043f\u0440\u0435\u043b",
      "\u043c\u0430\u0439",
      "\u0438\u0458\u0443\u043d",
      "\u0438\u0458\u0443\u043b",
      "\u0430\u0432\u0433\u0443\u0441\u0442",
      "\u0441\u0435\u043d\u0442\u0458\u0430\u0431\u0440",
      "\u043e\u043a\u0442\u0458\u0430\u0431\u0440",
      "\u043d\u043e\u0458\u0430\u0431\u0440",
      "\u0434\u0435\u043a\u0430\u0431\u0440"
    ],
    "SHORTDAY": [
      "\u0431\u0430\u0437\u0430\u0440",
      "\u0431\u0430\u0437\u0430\u0440 \u0435\u0440\u0442\u04d9\u0441\u0438",
      "\u0447\u04d9\u0440\u0448\u04d9\u043d\u0431\u04d9 \u0430\u0445\u0448\u0430\u043c\u044b",
      "\u0447\u04d9\u0440\u0448\u04d9\u043d\u0431\u04d9",
      "\u04b9\u04af\u043c\u04d9 \u0430\u0445\u0448\u0430\u043c\u044b",
      "\u04b9\u04af\u043c\u04d9",
      "\u0448\u04d9\u043d\u0431\u04d9"
    ],
    "SHORTMONTH": [
      "\u0458\u0430\u043d\u0432\u0430\u0440",
      "\u0444\u0435\u0432\u0440\u0430\u043b",
      "\u043c\u0430\u0440\u0442",
      "\u0430\u043f\u0440\u0435\u043b",
      "\u043c\u0430\u0439",
      "\u0438\u0458\u0443\u043d",
      "\u0438\u0458\u0443\u043b",
      "\u0430\u0432\u0433\u0443\u0441\u0442",
      "\u0441\u0435\u043d\u0442\u0458\u0430\u0431\u0440",
      "\u043e\u043a\u0442\u0458\u0430\u0431\u0440",
      "\u043d\u043e\u0458\u0430\u0431\u0440",
      "\u0434\u0435\u043a\u0430\u0431\u0440"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, d, MMMM, y",
    "longDate": "d MMMM, y",
    "medium": "d MMM, y HH:mm:ss",
    "mediumDate": "d MMM, y",
    "mediumTime": "HH:mm:ss",
    "short": "dd.MM.yy HH:mm",
    "shortDate": "dd.MM.yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "man.",
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
        "negPre": "-\u00a4\u00a0",
        "negSuf": "",
        "posPre": "\u00a4\u00a0",
        "posSuf": ""
      }
    ]
  },
  "id": "az-cyrl-az",
  "pluralCat": function(n, opt_precision) {  if (n == 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
