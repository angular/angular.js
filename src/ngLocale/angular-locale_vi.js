angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "SA",
      "1": "CH"
    },
    "DAY": {
      "0": "Ch\u1ee7 nh\u1eadt",
      "1": "Th\u1ee9 hai",
      "2": "Th\u1ee9 ba",
      "3": "Th\u1ee9 t\u01b0",
      "4": "Th\u1ee9 n\u0103m",
      "5": "Th\u1ee9 s\u00e1u",
      "6": "Th\u1ee9 b\u1ea3y"
    },
    "MONTH": {
      "0": "th\u00e1ng m\u1ed9t",
      "1": "th\u00e1ng hai",
      "2": "th\u00e1ng ba",
      "3": "th\u00e1ng t\u01b0",
      "4": "th\u00e1ng n\u0103m",
      "5": "th\u00e1ng s\u00e1u",
      "6": "th\u00e1ng b\u1ea3y",
      "7": "th\u00e1ng t\u00e1m",
      "8": "th\u00e1ng ch\u00edn",
      "9": "th\u00e1ng m\u01b0\u1eddi",
      "10": "th\u00e1ng m\u01b0\u1eddi m\u1ed9t",
      "11": "th\u00e1ng m\u01b0\u1eddi hai"
    },
    "SHORTDAY": {
      "0": "CN",
      "1": "Th 2",
      "2": "Th 3",
      "3": "Th 4",
      "4": "Th 5",
      "5": "Th 6",
      "6": "Th 7"
    },
    "SHORTMONTH": {
      "0": "thg 1",
      "1": "thg 2",
      "2": "thg 3",
      "3": "thg 4",
      "4": "thg 5",
      "5": "thg 6",
      "6": "thg 7",
      "7": "thg 8",
      "8": "thg 9",
      "9": "thg 10",
      "10": "thg 11",
      "11": "thg 12"
    },
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
  "id": "vi",
  "pluralCat": function (n) {  return PLURAL_CATEGORY.OTHER;}
});
}]);