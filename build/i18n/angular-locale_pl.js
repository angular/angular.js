angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "AM",
      "1": "PM"
    },
    "DAY": {
      "0": "niedziela",
      "1": "poniedzia\u0142ek",
      "2": "wtorek",
      "3": "\u015broda",
      "4": "czwartek",
      "5": "pi\u0105tek",
      "6": "sobota"
    },
    "MONTH": {
      "0": "stycznia",
      "1": "lutego",
      "2": "marca",
      "3": "kwietnia",
      "4": "maja",
      "5": "czerwca",
      "6": "lipca",
      "7": "sierpnia",
      "8": "wrze\u015bnia",
      "9": "pa\u017adziernika",
      "10": "listopada",
      "11": "grudnia"
    },
    "SHORTDAY": {
      "0": "niedz.",
      "1": "pon.",
      "2": "wt.",
      "3": "\u015br.",
      "4": "czw.",
      "5": "pt.",
      "6": "sob."
    },
    "SHORTMONTH": {
      "0": "sty",
      "1": "lut",
      "2": "mar",
      "3": "kwi",
      "4": "maj",
      "5": "cze",
      "6": "lip",
      "7": "sie",
      "8": "wrz",
      "9": "pa\u017a",
      "10": "lis",
      "11": "gru"
    },
    "fullDate": "EEEE, d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y HH:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "dd.MM.yyyy HH:mm",
    "shortDate": "dd.MM.yyyy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "z\u0142",
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
  "id": "pl",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  if (n == (n | 0) && n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) {   return PLURAL_CATEGORY.FEW;  }  if (n != 1 && (n % 10 == 0 || n % 10 == 1) || n == (n | 0) && n % 10 >= 5 && n % 10 <= 9 || n == (n | 0) && n % 100 >= 12 && n % 100 <= 14) {   return PLURAL_CATEGORY.MANY;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);