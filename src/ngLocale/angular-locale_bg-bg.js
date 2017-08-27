'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "\u043f\u0440.\u043e\u0431.",
      "\u0441\u043b.\u043e\u0431."
    ],
    "DAY": [
      "\u043d\u0435\u0434\u0435\u043b\u044f",
      "\u043f\u043e\u043d\u0435\u0434\u0435\u043b\u043d\u0438\u043a",
      "\u0432\u0442\u043e\u0440\u043d\u0438\u043a",
      "\u0441\u0440\u044f\u0434\u0430",
      "\u0447\u0435\u0442\u0432\u044a\u0440\u0442\u044a\u043a",
      "\u043f\u0435\u0442\u044a\u043a",
      "\u0441\u044a\u0431\u043e\u0442\u0430"
    ],
    "ERANAMES": [
      "\u043f\u0440\u0435\u0434\u0438 \u0425\u0440\u0438\u0441\u0442\u0430",
      "\u0441\u043b\u0435\u0434 \u0425\u0440\u0438\u0441\u0442\u0430"
    ],
    "ERAS": [
      "\u043f\u0440.\u0425\u0440.",
      "\u0441\u043b.\u0425\u0440."
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "\u044f\u043d\u0443\u0430\u0440\u0438",
      "\u0444\u0435\u0432\u0440\u0443\u0430\u0440\u0438",
      "\u043c\u0430\u0440\u0442",
      "\u0430\u043f\u0440\u0438\u043b",
      "\u043c\u0430\u0439",
      "\u044e\u043d\u0438",
      "\u044e\u043b\u0438",
      "\u0430\u0432\u0433\u0443\u0441\u0442",
      "\u0441\u0435\u043f\u0442\u0435\u043c\u0432\u0440\u0438",
      "\u043e\u043a\u0442\u043e\u043c\u0432\u0440\u0438",
      "\u043d\u043e\u0435\u043c\u0432\u0440\u0438",
      "\u0434\u0435\u043a\u0435\u043c\u0432\u0440\u0438"
    ],
    "SHORTDAY": [
      "\u043d\u0434",
      "\u043f\u043d",
      "\u0432\u0442",
      "\u0441\u0440",
      "\u0447\u0442",
      "\u043f\u0442",
      "\u0441\u0431"
    ],
    "SHORTMONTH": [
      "\u044f\u043d\u0443",
      "\u0444\u0435\u0432",
      "\u043c\u0430\u0440\u0442",
      "\u0430\u043f\u0440",
      "\u043c\u0430\u0439",
      "\u044e\u043d\u0438",
      "\u044e\u043b\u0438",
      "\u0430\u0432\u0433",
      "\u0441\u0435\u043f",
      "\u043e\u043a\u0442",
      "\u043d\u043e\u0435",
      "\u0434\u0435\u043a"
    ],
    "STANDALONEMONTH": [
      "\u044f\u043d\u0443\u0430\u0440\u0438",
      "\u0444\u0435\u0432\u0440\u0443\u0430\u0440\u0438",
      "\u043c\u0430\u0440\u0442",
      "\u0430\u043f\u0440\u0438\u043b",
      "\u043c\u0430\u0439",
      "\u044e\u043d\u0438",
      "\u044e\u043b\u0438",
      "\u0430\u0432\u0433\u0443\u0441\u0442",
      "\u0441\u0435\u043f\u0442\u0435\u043c\u0432\u0440\u0438",
      "\u043e\u043a\u0442\u043e\u043c\u0432\u0440\u0438",
      "\u043d\u043e\u0435\u043c\u0432\u0440\u0438",
      "\u0434\u0435\u043a\u0435\u043c\u0432\u0440\u0438"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, d MMMM y '\u0433'.",
    "longDate": "d MMMM y '\u0433'.",
    "medium": "d.MM.y '\u0433'. H:mm:ss",
    "mediumDate": "d.MM.y '\u0433'.",
    "mediumTime": "H:mm:ss",
    "short": "d.MM.yy '\u0433'. H:mm",
    "shortDate": "d.MM.yy '\u0433'.",
    "shortTime": "H:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "lev",
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
        "gSize": 0,
        "lgSize": 0,
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
  "id": "bg-bg",
  "localeID": "bg_BG",
  "pluralCat": function(n, opt_precision) {  if (n == 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
