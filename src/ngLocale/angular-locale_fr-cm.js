angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "AM",
      "1": "PM"
    },
    "DAY": {
      "0": "dimanche",
      "1": "lundi",
      "2": "mardi",
      "3": "mercredi",
      "4": "jeudi",
      "5": "vendredi",
      "6": "samedi"
    },
    "MONTH": {
      "0": "janvier",
      "1": "f\u00e9vrier",
      "2": "mars",
      "3": "avril",
      "4": "mai",
      "5": "juin",
      "6": "juillet",
      "7": "ao\u00fbt",
      "8": "septembre",
      "9": "octobre",
      "10": "novembre",
      "11": "d\u00e9cembre"
    },
    "SHORTDAY": {
      "0": "dim.",
      "1": "lun.",
      "2": "mar.",
      "3": "mer.",
      "4": "jeu.",
      "5": "ven.",
      "6": "sam."
    },
    "SHORTMONTH": {
      "0": "janv.",
      "1": "f\u00e9vr.",
      "2": "mars",
      "3": "avr.",
      "4": "mai",
      "5": "juin",
      "6": "juil.",
      "7": "ao\u00fbt",
      "8": "sept.",
      "9": "oct.",
      "10": "nov.",
      "11": "d\u00e9c."
    },
    "fullDate": "EEEE d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y HH:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "dd/MM/yy HH:mm",
    "shortDate": "dd/MM/yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20ac",
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
        "negPre": "(",
        "negSuf": "\u00a0\u00a4)",
        "posPre": "",
        "posSuf": "\u00a0\u00a4"
      }
    }
  },
  "id": "fr-cm",
  "pluralCat": function (n) {  if (n >= 0 && n <= 2 && n != 2) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);