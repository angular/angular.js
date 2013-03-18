angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "AM",
      "1": "PM"
    },
    "DAY": {
      "0": "zondag",
      "1": "maandag",
      "2": "dinsdag",
      "3": "woensdag",
      "4": "donderdag",
      "5": "vrijdag",
      "6": "zaterdag"
    },
    "MONTH": {
      "0": "januari",
      "1": "februari",
      "2": "maart",
      "3": "april",
      "4": "mei",
      "5": "juni",
      "6": "juli",
      "7": "augustus",
      "8": "september",
      "9": "oktober",
      "10": "november",
      "11": "december"
    },
    "SHORTDAY": {
      "0": "zo",
      "1": "ma",
      "2": "di",
      "3": "wo",
      "4": "do",
      "5": "vr",
      "6": "za"
    },
    "SHORTMONTH": {
      "0": "jan.",
      "1": "feb.",
      "2": "mrt.",
      "3": "apr.",
      "4": "mei",
      "5": "jun.",
      "6": "jul.",
      "7": "aug.",
      "8": "sep.",
      "9": "okt.",
      "10": "nov.",
      "11": "dec."
    },
    "fullDate": "EEEE d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y HH:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "dd-MM-yy HH:mm",
    "shortDate": "dd-MM-yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "€",
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
        "negPre": "\u00A4 ",
        "negSuf": "-",
        "posPre": "\u00A4 ",
        "posSuf": ""
      }
    }
  },
  "id": "nl-nl",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);