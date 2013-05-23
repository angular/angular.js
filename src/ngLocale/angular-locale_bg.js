angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "\u043f\u0440. \u043e\u0431.",
      "1": "\u0441\u043b. \u043e\u0431."
    },
    "DAY": {
      "0": "\u043d\u0435\u0434\u0435\u043b\u044f",
      "1": "\u043f\u043e\u043d\u0435\u0434\u0435\u043b\u043d\u0438\u043a",
      "2": "\u0432\u0442\u043e\u0440\u043d\u0438\u043a",
      "3": "\u0441\u0440\u044f\u0434\u0430",
      "4": "\u0447\u0435\u0442\u0432\u044a\u0440\u0442\u044a\u043a",
      "5": "\u043f\u0435\u0442\u044a\u043a",
      "6": "\u0441\u044a\u0431\u043e\u0442\u0430"
    },
    "MONTH": {
      "0": "\u044f\u043d\u0443\u0430\u0440\u0438",
      "1": "\u0444\u0435\u0432\u0440\u0443\u0430\u0440\u0438",
      "2": "\u043c\u0430\u0440\u0442",
      "3": "\u0430\u043f\u0440\u0438\u043b",
      "4": "\u043c\u0430\u0439",
      "5": "\u044e\u043d\u0438",
      "6": "\u044e\u043b\u0438",
      "7": "\u0430\u0432\u0433\u0443\u0441\u0442",
      "8": "\u0441\u0435\u043f\u0442\u0435\u043c\u0432\u0440\u0438",
      "9": "\u043e\u043a\u0442\u043e\u043c\u0432\u0440\u0438",
      "10": "\u043d\u043e\u0435\u043c\u0432\u0440\u0438",
      "11": "\u0434\u0435\u043a\u0435\u043c\u0432\u0440\u0438"
    },
    "SHORTDAY": {
      "0": "\u043d\u0434",
      "1": "\u043f\u043d",
      "2": "\u0432\u0442",
      "3": "\u0441\u0440",
      "4": "\u0447\u0442",
      "5": "\u043f\u0442",
      "6": "\u0441\u0431"
    },
    "SHORTMONTH": {
      "0": "\u044f\u043d.",
      "1": "\u0444\u0435\u0432\u0440.",
      "2": "\u043c\u0430\u0440\u0442",
      "3": "\u0430\u043f\u0440.",
      "4": "\u043c\u0430\u0439",
      "5": "\u044e\u043d\u0438",
      "6": "\u044e\u043b\u0438",
      "7": "\u0430\u0432\u0433.",
      "8": "\u0441\u0435\u043f\u0442.",
      "9": "\u043e\u043a\u0442.",
      "10": "\u043d\u043e\u0435\u043c.",
      "11": "\u0434\u0435\u043a."
    },
    "fullDate": "dd MMMM y, EEEE",
    "longDate": "dd MMMM y",
    "medium": "dd.MM.yyyy HH:mm:ss",
    "mediumDate": "dd.MM.yyyy",
    "mediumTime": "HH:mm:ss",
    "short": "dd.MM.yy HH:mm",
    "shortDate": "dd.MM.yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "lev",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": "\u00a0",
    "PATTERNS": {
      "0": {
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
      "1": {
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
    }
  },
  "id": "bg",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);