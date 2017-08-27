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
      "\u043d\u044f\u0434\u0437\u0435\u043b\u044f",
      "\u043f\u0430\u043d\u044f\u0434\u0437\u0435\u043b\u0430\u043a",
      "\u0430\u045e\u0442\u043e\u0440\u0430\u043a",
      "\u0441\u0435\u0440\u0430\u0434\u0430",
      "\u0447\u0430\u0446\u0432\u0435\u0440",
      "\u043f\u044f\u0442\u043d\u0456\u0446\u0430",
      "\u0441\u0443\u0431\u043e\u0442\u0430"
    ],
    "ERANAMES": [
      "\u0434\u0430 \u043d\u0430\u0440\u0430\u0434\u0436\u044d\u043d\u043d\u044f \u0425\u0440\u044b\u0441\u0442\u043e\u0432\u0430",
      "\u0430\u0434 \u043d\u0430\u0440\u0430\u0434\u0436\u044d\u043d\u043d\u044f \u0425\u0440\u044b\u0441\u0442\u043e\u0432\u0430"
    ],
    "ERAS": [
      "\u0434\u0430 \u043d.\u044d.",
      "\u043d.\u044d."
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "\u0441\u0442\u0443\u0434\u0437\u0435\u043d\u044f",
      "\u043b\u044e\u0442\u0430\u0433\u0430",
      "\u0441\u0430\u043a\u0430\u0432\u0456\u043a\u0430",
      "\u043a\u0440\u0430\u0441\u0430\u0432\u0456\u043a\u0430",
      "\u043c\u0430\u044f",
      "\u0447\u044d\u0440\u0432\u0435\u043d\u044f",
      "\u043b\u0456\u043f\u0435\u043d\u044f",
      "\u0436\u043d\u0456\u045e\u043d\u044f",
      "\u0432\u0435\u0440\u0430\u0441\u043d\u044f",
      "\u043a\u0430\u0441\u0442\u0440\u044b\u0447\u043d\u0456\u043a\u0430",
      "\u043b\u0456\u0441\u0442\u0430\u043f\u0430\u0434\u0430",
      "\u0441\u043d\u0435\u0436\u043d\u044f"
    ],
    "SHORTDAY": [
      "\u043d\u0434",
      "\u043f\u043d",
      "\u0430\u045e",
      "\u0441\u0440",
      "\u0447\u0446",
      "\u043f\u0442",
      "\u0441\u0431"
    ],
    "SHORTMONTH": [
      "\u0441\u0442\u0443",
      "\u043b\u044e\u0442",
      "\u0441\u0430\u043a",
      "\u043a\u0440\u0430",
      "\u043c\u0430\u044f",
      "\u0447\u044d\u0440",
      "\u043b\u0456\u043f",
      "\u0436\u043d\u0456",
      "\u0432\u0435\u0440",
      "\u043a\u0430\u0441",
      "\u043b\u0456\u0441",
      "\u0441\u043d\u0435"
    ],
    "STANDALONEMONTH": [
      "\u0441\u0442\u0443\u0434\u0437\u0435\u043d\u044c",
      "\u043b\u044e\u0442\u044b",
      "\u0441\u0430\u043a\u0430\u0432\u0456\u043a",
      "\u043a\u0440\u0430\u0441\u0430\u0432\u0456\u043a",
      "\u043c\u0430\u0439",
      "\u0447\u044d\u0440\u0432\u0435\u043d\u044c",
      "\u043b\u0456\u043f\u0435\u043d\u044c",
      "\u0436\u043d\u0456\u0432\u0435\u043d\u044c",
      "\u0432\u0435\u0440\u0430\u0441\u0435\u043d\u044c",
      "\u043a\u0430\u0441\u0442\u0440\u044b\u0447\u043d\u0456\u043a",
      "\u043b\u0456\u0441\u0442\u0430\u043f\u0430\u0434",
      "\u0441\u043d\u0435\u0436\u0430\u043d\u044c"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, d MMMM y '\u0433'.",
    "longDate": "d MMMM y '\u0433'.",
    "medium": "d.MM.y HH:mm:ss",
    "mediumDate": "d.MM.y",
    "mediumTime": "HH:mm:ss",
    "short": "d.MM.yy HH:mm",
    "shortDate": "d.MM.yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "BYN",
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
  "id": "be",
  "localeID": "be",
  "pluralCat": function(n, opt_precision) {  if (n % 10 == 1 && n % 100 != 11) {    return PLURAL_CATEGORY.ONE;  }  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) {    return PLURAL_CATEGORY.FEW;  }  if (n % 10 == 0 || n % 10 >= 5 && n % 10 <= 9 || n % 100 >= 11 && n % 100 <= 14) {    return PLURAL_CATEGORY.MANY;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
