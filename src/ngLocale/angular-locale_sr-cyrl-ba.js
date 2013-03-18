angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "пре подне",
      "1": "поподне"
    },
    "DAY": {
      "0": "недеља",
      "1": "понедељак",
      "2": "уторак",
      "3": "сриједа",
      "4": "четвртак",
      "5": "петак",
      "6": "субота"
    },
    "MONTH": {
      "0": "јануар",
      "1": "фебруар",
      "2": "март",
      "3": "април",
      "4": "мај",
      "5": "јуни",
      "6": "јули",
      "7": "август",
      "8": "септембар",
      "9": "октобар",
      "10": "новембар",
      "11": "децембар"
    },
    "SHORTDAY": {
      "0": "нед",
      "1": "пон",
      "2": "уто",
      "3": "сри",
      "4": "чет",
      "5": "пет",
      "6": "суб"
    },
    "SHORTMONTH": {
      "0": "јан",
      "1": "феб",
      "2": "мар",
      "3": "апр",
      "4": "мај",
      "5": "јун",
      "6": "јул",
      "7": "авг",
      "8": "сеп",
      "9": "окт",
      "10": "нов",
      "11": "дец"
    },
    "fullDate": "EEEE, dd. MMMM y.",
    "longDate": "dd. MMMM y.",
    "medium": "yyyy-MM-dd HH:mm:ss",
    "mediumDate": "yyyy-MM-dd",
    "mediumTime": "HH:mm:ss",
    "short": "yy-MM-dd HH:mm",
    "shortDate": "yy-MM-dd",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "din",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": ".",
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
  "id": "sr-cyrl-ba",
  "pluralCat": function (n) {  if (n % 10 == 1 && n % 100 != 11) {   return PLURAL_CATEGORY.ONE;  }  if (n == (n | 0) && n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) {   return PLURAL_CATEGORY.FEW;  }  if (n % 10 == 0 || n == (n | 0) && n % 10 >= 5 && n % 10 <= 9 || n == (n | 0) && n % 100 >= 11 && n % 100 <= 14) {   return PLURAL_CATEGORY.MANY;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);