angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "f.h.",
      "1": "e.h."
    },
    "DAY": {
      "0": "sunnudagur",
      "1": "m\u00e1nudagur",
      "2": "\u00feri\u00f0judagur",
      "3": "mi\u00f0vikudagur",
      "4": "fimmtudagur",
      "5": "f\u00f6studagur",
      "6": "laugardagur"
    },
    "MONTH": {
      "0": "jan\u00faar",
      "1": "febr\u00faar",
      "2": "mars",
      "3": "apr\u00edl",
      "4": "ma\u00ed",
      "5": "j\u00fan\u00ed",
      "6": "j\u00fal\u00ed",
      "7": "\u00e1g\u00fast",
      "8": "september",
      "9": "okt\u00f3ber",
      "10": "n\u00f3vember",
      "11": "desember"
    },
    "SHORTDAY": {
      "0": "sun",
      "1": "m\u00e1n",
      "2": "\u00feri",
      "3": "mi\u00f0",
      "4": "fim",
      "5": "f\u00f6s",
      "6": "lau"
    },
    "SHORTMONTH": {
      "0": "jan",
      "1": "feb",
      "2": "mar",
      "3": "apr",
      "4": "ma\u00ed",
      "5": "j\u00fan",
      "6": "j\u00fal",
      "7": "\u00e1g\u00fa",
      "8": "sep",
      "9": "okt",
      "10": "n\u00f3v",
      "11": "des"
    },
    "fullDate": "EEEE, d. MMMM y",
    "longDate": "d. MMMM y",
    "medium": "d.M.yyyy HH:mm:ss",
    "mediumDate": "d.M.yyyy",
    "mediumTime": "HH:mm:ss",
    "short": "d.M.yyyy HH:mm",
    "shortDate": "d.M.yyyy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "kr",
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
        "negPre": "(\u00a4",
        "negSuf": ")",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    }
  },
  "id": "is-is",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);