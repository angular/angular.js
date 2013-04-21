angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "пр. об.",
      "1": "сл. об."
    },
    "DAY": {
      "0": "неделя",
      "1": "понеделник",
      "2": "вторник",
      "3": "сряда",
      "4": "четвъртък",
      "5": "петък",
      "6": "събота"
    },
    "MONTH": {
      "0": "януари",
      "1": "февруари",
      "2": "март",
      "3": "април",
      "4": "май",
      "5": "юни",
      "6": "юли",
      "7": "август",
      "8": "септември",
      "9": "октомври",
      "10": "ноември",
      "11": "декември"
    },
    "SHORTDAY": {
      "0": "нд",
      "1": "пн",
      "2": "вт",
      "3": "ср",
      "4": "чт",
      "5": "пт",
      "6": "сб"
    },
    "SHORTMONTH": {
      "0": "ян.",
      "1": "февр.",
      "2": "март",
      "3": "апр.",
      "4": "май",
      "5": "юни",
      "6": "юли",
      "7": "авг.",
      "8": "септ.",
      "9": "окт.",
      "10": "ноем.",
      "11": "дек."
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
  "id": "bg-bg",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);