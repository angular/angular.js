angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "SA",
      "CH"
    ],
    "DAY": [
      "Ch\u1ee7 nh\u1eadt",
      "Th\u1ee9 hai",
      "Th\u1ee9 ba",
      "Th\u1ee9 t\u01b0",
      "Th\u1ee9 n\u0103m",
      "Th\u1ee9 s\u00e1u",
      "Th\u1ee9 b\u1ea3y"
    ],
    "MONTH": [
      "th\u00e1ng m\u1ed9t",
      "th\u00e1ng hai",
      "th\u00e1ng ba",
      "th\u00e1ng t\u01b0",
      "th\u00e1ng n\u0103m",
      "th\u00e1ng s\u00e1u",
      "th\u00e1ng b\u1ea3y",
      "th\u00e1ng t\u00e1m",
      "th\u00e1ng ch\u00edn",
      "th\u00e1ng m\u01b0\u1eddi",
      "th\u00e1ng m\u01b0\u1eddi m\u1ed9t",
      "th\u00e1ng m\u01b0\u1eddi hai"
    ],
    "SHORTDAY": [
      "CN",
      "Th 2",
      "Th 3",
      "Th 4",
      "Th 5",
      "Th 6",
      "Th 7"
    ],
    "SHORTMONTH": [
      "thg 1",
      "thg 2",
      "thg 3",
      "thg 4",
      "thg 5",
      "thg 6",
      "thg 7",
      "thg 8",
      "thg 9",
      "thg 10",
      "thg 11",
      "thg 12"
    ],
    "fullDate": "EEEE, 'ng\u00e0y' dd MMMM 'n\u0103m' y",
    "longDate": "'Ng\u00e0y' dd 'th\u00e1ng' M 'n\u0103m' y",
    "medium": "dd-MM-yyyy HH:mm:ss",
    "mediumDate": "dd-MM-yyyy",
    "mediumTime": "HH:mm:ss",
    "short": "dd/MM/yyyy HH:mm",
    "shortDate": "dd/MM/yyyy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20ab",
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
        "negPre": "-",
        "negSuf": "\u00a0\u00a4",
        "posPre": "",
        "posSuf": "\u00a0\u00a4"
      }
    ]
  },
  "id": "vi-vn",
  "pluralCat": function (n) {  return PLURAL_CATEGORY.OTHER;}
});
}]);