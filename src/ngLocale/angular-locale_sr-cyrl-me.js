'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "\u043f\u0440\u0435 \u043f\u043e\u0434\u043d\u0435",
      "\u043f\u043e\u043f\u043e\u0434\u043d\u0435"
    ],
    "DAY": [
      "\u043d\u0435\u0434\u0435\u0459\u0430",
      "\u043f\u043e\u043d\u0435\u0434\u0435\u0459\u0430\u043a",
      "\u0443\u0442\u043e\u0440\u0430\u043a",
      "\u0441\u0440\u0435\u0434\u0430",
      "\u0447\u0435\u0442\u0432\u0440\u0442\u0430\u043a",
      "\u043f\u0435\u0442\u0430\u043a",
      "\u0441\u0443\u0431\u043e\u0442\u0430"
    ],
    "MONTH": [
      "\u0458\u0430\u043d\u0443\u0430\u0440",
      "\u0444\u0435\u0431\u0440\u0443\u0430\u0440",
      "\u043c\u0430\u0440\u0442",
      "\u0430\u043f\u0440\u0438\u043b",
      "\u043c\u0430\u0458",
      "\u0458\u0443\u043d",
      "\u0458\u0443\u043b",
      "\u0430\u0432\u0433\u0443\u0441\u0442",
      "\u0441\u0435\u043f\u0442\u0435\u043c\u0431\u0430\u0440",
      "\u043e\u043a\u0442\u043e\u0431\u0430\u0440",
      "\u043d\u043e\u0432\u0435\u043c\u0431\u0430\u0440",
      "\u0434\u0435\u0446\u0435\u043c\u0431\u0430\u0440"
    ],
    "SHORTDAY": [
      "\u043d\u0435\u0434",
      "\u043f\u043e\u043d",
      "\u0443\u0442\u043e",
      "\u0441\u0440\u0435",
      "\u0447\u0435\u0442",
      "\u043f\u0435\u0442",
      "\u0441\u0443\u0431"
    ],
    "SHORTMONTH": [
      "\u0458\u0430\u043d",
      "\u0444\u0435\u0431",
      "\u043c\u0430\u0440",
      "\u0430\u043f\u0440",
      "\u043c\u0430\u0458",
      "\u0458\u0443\u043d",
      "\u0458\u0443\u043b",
      "\u0430\u0432\u0433",
      "\u0441\u0435\u043f",
      "\u043e\u043a\u0442",
      "\u043d\u043e\u0432",
      "\u0434\u0435\u0446"
    ],
    "fullDate": "EEEE, dd. MMMM y.",
    "longDate": "dd. MMMM y.",
    "medium": "dd.MM.y. HH.mm.ss",
    "mediumDate": "dd.MM.y.",
    "mediumTime": "HH.mm.ss",
    "short": "d.M.yy. HH.mm",
    "shortDate": "d.M.yy.",
    "shortTime": "HH.mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "din",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": ".",
    "PATTERNS": [
      {
        "gSize": 3,
        "lgSize": 3,
        "macFrac": 0,
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
        "macFrac": 0,
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
  "id": "sr-cyrl-me",
  "pluralCat": function (n) {  if (n % 10 == 1 && n % 100 != 11) {   return PLURAL_CATEGORY.ONE;  }  if (n == (n | 0) && n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) {   return PLURAL_CATEGORY.FEW;  }  if (n % 10 == 0 || n == (n | 0) && n % 10 >= 5 && n % 10 <= 9 || n == (n | 0) && n % 100 >= 11 && n % 100 <= 14) {   return PLURAL_CATEGORY.MANY;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);