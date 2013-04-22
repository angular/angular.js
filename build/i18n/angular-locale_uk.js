angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "\u0434\u043f",
      "1": "\u043f\u043f"
    },
    "DAY": {
      "0": "\u041d\u0435\u0434\u0456\u043b\u044f",
      "1": "\u041f\u043e\u043d\u0435\u0434\u0456\u043b\u043e\u043a",
      "2": "\u0412\u0456\u0432\u0442\u043e\u0440\u043e\u043a",
      "3": "\u0421\u0435\u0440\u0435\u0434\u0430",
      "4": "\u0427\u0435\u0442\u0432\u0435\u0440",
      "5": "\u041f\u02bc\u044f\u0442\u043d\u0438\u0446\u044f",
      "6": "\u0421\u0443\u0431\u043e\u0442\u0430"
    },
    "MONTH": {
      "0": "\u0441\u0456\u0447\u043d\u044f",
      "1": "\u043b\u044e\u0442\u043e\u0433\u043e",
      "2": "\u0431\u0435\u0440\u0435\u0437\u043d\u044f",
      "3": "\u043a\u0432\u0456\u0442\u043d\u044f",
      "4": "\u0442\u0440\u0430\u0432\u043d\u044f",
      "5": "\u0447\u0435\u0440\u0432\u043d\u044f",
      "6": "\u043b\u0438\u043f\u043d\u044f",
      "7": "\u0441\u0435\u0440\u043f\u043d\u044f",
      "8": "\u0432\u0435\u0440\u0435\u0441\u043d\u044f",
      "9": "\u0436\u043e\u0432\u0442\u043d\u044f",
      "10": "\u043b\u0438\u0441\u0442\u043e\u043f\u0430\u0434\u0430",
      "11": "\u0433\u0440\u0443\u0434\u043d\u044f"
    },
    "SHORTDAY": {
      "0": "\u041d\u0434",
      "1": "\u041f\u043d",
      "2": "\u0412\u0442",
      "3": "\u0421\u0440",
      "4": "\u0427\u0442",
      "5": "\u041f\u0442",
      "6": "\u0421\u0431"
    },
    "SHORTMONTH": {
      "0": "\u0441\u0456\u0447.",
      "1": "\u043b\u044e\u0442.",
      "2": "\u0431\u0435\u0440.",
      "3": "\u043a\u0432\u0456\u0442.",
      "4": "\u0442\u0440\u0430\u0432.",
      "5": "\u0447\u0435\u0440\u0432.",
      "6": "\u043b\u0438\u043f.",
      "7": "\u0441\u0435\u0440\u043f.",
      "8": "\u0432\u0435\u0440.",
      "9": "\u0436\u043e\u0432\u0442.",
      "10": "\u043b\u0438\u0441\u0442.",
      "11": "\u0433\u0440\u0443\u0434."
    },
    "fullDate": "EEEE, d MMMM y '\u0440'.",
    "longDate": "d MMMM y '\u0440'.",
    "medium": "d MMM y HH:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "dd.MM.yy HH:mm",
    "shortDate": "dd.MM.yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20b4",
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
  "id": "uk",
  "pluralCat": function (n) {  if (n % 10 == 1 && n % 100 != 11) {   return PLURAL_CATEGORY.ONE;  }  if (n == (n | 0) && n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) {   return PLURAL_CATEGORY.FEW;  }  if (n % 10 == 0 || n == (n | 0) && n % 10 >= 5 && n % 10 <= 9 || n == (n | 0) && n % 100 >= 11 && n % 100 <= 14) {   return PLURAL_CATEGORY.MANY;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);