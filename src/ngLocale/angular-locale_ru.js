angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "\u0434\u043e \u043f\u043e\u043b\u0443\u0434\u043d\u044f",
      "1": "\u043f\u043e\u0441\u043b\u0435 \u043f\u043e\u043b\u0443\u0434\u043d\u044f"
    },
    "DAY": {
      "0": "\u0432\u043e\u0441\u043a\u0440\u0435\u0441\u0435\u043d\u044c\u0435",
      "1": "\u043f\u043e\u043d\u0435\u0434\u0435\u043b\u044c\u043d\u0438\u043a",
      "2": "\u0432\u0442\u043e\u0440\u043d\u0438\u043a",
      "3": "\u0441\u0440\u0435\u0434\u0430",
      "4": "\u0447\u0435\u0442\u0432\u0435\u0440\u0433",
      "5": "\u043f\u044f\u0442\u043d\u0438\u0446\u0430",
      "6": "\u0441\u0443\u0431\u0431\u043e\u0442\u0430"
    },
    "MONTH": {
      "0": "\u044f\u043d\u0432\u0430\u0440\u044f",
      "1": "\u0444\u0435\u0432\u0440\u0430\u043b\u044f",
      "2": "\u043c\u0430\u0440\u0442\u0430",
      "3": "\u0430\u043f\u0440\u0435\u043b\u044f",
      "4": "\u043c\u0430\u044f",
      "5": "\u0438\u044e\u043d\u044f",
      "6": "\u0438\u044e\u043b\u044f",
      "7": "\u0430\u0432\u0433\u0443\u0441\u0442\u0430",
      "8": "\u0441\u0435\u043d\u0442\u044f\u0431\u0440\u044f",
      "9": "\u043e\u043a\u0442\u044f\u0431\u0440\u044f",
      "10": "\u043d\u043e\u044f\u0431\u0440\u044f",
      "11": "\u0434\u0435\u043a\u0430\u0431\u0440\u044f"
    },
    "SHORTDAY": {
      "0": "\u0432\u0441",
      "1": "\u043f\u043d",
      "2": "\u0432\u0442",
      "3": "\u0441\u0440",
      "4": "\u0447\u0442",
      "5": "\u043f\u0442",
      "6": "\u0441\u0431"
    },
    "SHORTMONTH": {
      "0": "\u044f\u043d\u0432.",
      "1": "\u0444\u0435\u0432\u0440.",
      "2": "\u043c\u0430\u0440\u0442\u0430",
      "3": "\u0430\u043f\u0440.",
      "4": "\u043c\u0430\u044f",
      "5": "\u0438\u044e\u043d\u044f",
      "6": "\u0438\u044e\u043b\u044f",
      "7": "\u0430\u0432\u0433.",
      "8": "\u0441\u0435\u043d\u0442.",
      "9": "\u043e\u043a\u0442.",
      "10": "\u043d\u043e\u044f\u0431.",
      "11": "\u0434\u0435\u043a."
    },
    "fullDate": "EEEE, d MMMM y\u00a0'\u0433'.",
    "longDate": "d MMMM y\u00a0'\u0433'.",
    "medium": "dd.MM.yyyy H:mm:ss",
    "mediumDate": "dd.MM.yyyy",
    "mediumTime": "H:mm:ss",
    "short": "dd.MM.yy H:mm",
    "shortDate": "dd.MM.yy",
    "shortTime": "H:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u0440\u0443\u0431.",
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
  "id": "ru",
  "pluralCat": function (n) {  if (n % 10 == 1 && n % 100 != 11) {   return PLURAL_CATEGORY.ONE;  }  if (n == (n | 0) && n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) {   return PLURAL_CATEGORY.FEW;  }  if (n % 10 == 0 || n == (n | 0) && n % 10 >= 5 && n % 10 <= 9 || n == (n | 0) && n % 100 >= 11 && n % 100 <= 14) {   return PLURAL_CATEGORY.MANY;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);