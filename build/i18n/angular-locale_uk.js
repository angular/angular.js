angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "дп",
      "1": "пп"
    },
    "DAY": {
      "0": "Неділя",
      "1": "Понеділок",
      "2": "Вівторок",
      "3": "Середа",
      "4": "Четвер",
      "5": "Пʼятниця",
      "6": "Субота"
    },
    "MONTH": {
      "0": "січня",
      "1": "лютого",
      "2": "березня",
      "3": "квітня",
      "4": "травня",
      "5": "червня",
      "6": "липня",
      "7": "серпня",
      "8": "вересня",
      "9": "жовтня",
      "10": "листопада",
      "11": "грудня"
    },
    "SHORTDAY": {
      "0": "Нд",
      "1": "Пн",
      "2": "Вт",
      "3": "Ср",
      "4": "Чт",
      "5": "Пт",
      "6": "Сб"
    },
    "SHORTMONTH": {
      "0": "січ.",
      "1": "лют.",
      "2": "бер.",
      "3": "квіт.",
      "4": "трав.",
      "5": "черв.",
      "6": "лип.",
      "7": "серп.",
      "8": "вер.",
      "9": "жовт.",
      "10": "лист.",
      "11": "груд."
    },
    "fullDate": "EEEE, d MMMM y 'р'.",
    "longDate": "d MMMM y 'р'.",
    "medium": "d MMM y HH:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "dd.MM.yy HH:mm",
    "shortDate": "dd.MM.yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "₴",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": " ",
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
        "negSuf": " \u00A4",
        "posPre": "",
        "posSuf": " \u00A4"
      }
    }
  },
  "id": "uk",
  "pluralCat": function (n) {  if (n % 10 == 1 && n % 100 != 11) {   return PLURAL_CATEGORY.ONE;  }  if (n == (n | 0) && n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) {   return PLURAL_CATEGORY.FEW;  }  if (n % 10 == 0 || n == (n | 0) && n % 10 >= 5 && n % 10 <= 9 || n == (n | 0) && n % 100 >= 11 && n % 100 <= 14) {   return PLURAL_CATEGORY.MANY;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);