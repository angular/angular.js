angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "f.h.",
      "e.h."
    ],
    "DAY": [
      "sunnudagur",
      "m\u00e1nudagur",
      "\u00feri\u00f0judagur",
      "mi\u00f0vikudagur",
      "fimmtudagur",
      "f\u00f6studagur",
      "laugardagur"
    ],
    "MONTH": [
      "jan\u00faar",
      "febr\u00faar",
      "mars",
      "apr\u00edl",
      "ma\u00ed",
      "j\u00fan\u00ed",
      "j\u00fal\u00ed",
      "\u00e1g\u00fast",
      "september",
      "okt\u00f3ber",
      "n\u00f3vember",
      "desember"
    ],
    "SHORTDAY": [
      "sun",
      "m\u00e1n",
      "\u00feri",
      "mi\u00f0",
      "fim",
      "f\u00f6s",
      "lau"
    ],
    "SHORTMONTH": [
      "jan",
      "feb",
      "mar",
      "apr",
      "ma\u00ed",
      "j\u00fan",
      "j\u00fal",
      "\u00e1g\u00fa",
      "sep",
      "okt",
      "n\u00f3v",
      "des"
    ],
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
    "PATTERNS": [
      {
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
      {
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
    ]
  },
  "id": "is",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);