angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "AM",
      "1": "PM"
    },
    "DAY": {
      "0": "nedjelja",
      "1": "ponedjeljak",
      "2": "utorak",
      "3": "srijeda",
      "4": "\u010detvrtak",
      "5": "petak",
      "6": "subota"
    },
    "MONTH": {
      "0": "sije\u010dnja",
      "1": "velja\u010de",
      "2": "o\u017eujka",
      "3": "travnja",
      "4": "svibnja",
      "5": "lipnja",
      "6": "srpnja",
      "7": "kolovoza",
      "8": "rujna",
      "9": "listopada",
      "10": "studenoga",
      "11": "prosinca"
    },
    "SHORTDAY": {
      "0": "ned",
      "1": "pon",
      "2": "uto",
      "3": "sri",
      "4": "\u010det",
      "5": "pet",
      "6": "sub"
    },
    "SHORTMONTH": {
      "0": "sij",
      "1": "velj",
      "2": "o\u017eu",
      "3": "tra",
      "4": "svi",
      "5": "lip",
      "6": "srp",
      "7": "kol",
      "8": "ruj",
      "9": "lis",
      "10": "stu",
      "11": "pro"
    },
    "fullDate": "EEEE, d. MMMM y.",
    "longDate": "d. MMMM y.",
    "medium": "d. M. y. HH:mm:ss",
    "mediumDate": "d. M. y.",
    "mediumTime": "HH:mm:ss",
    "short": "d.M.y. HH:mm",
    "shortDate": "d.M.y.",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "kn",
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
  "id": "hr",
  "pluralCat": function (n) {  if (n % 10 == 1 && n % 100 != 11) {   return PLURAL_CATEGORY.ONE;  }  if (n == (n | 0) && n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) {   return PLURAL_CATEGORY.FEW;  }  if (n % 10 == 0 || n == (n | 0) && n % 10 >= 5 && n % 10 <= 9 || n == (n | 0) && n % 100 >= 11 && n % 100 <= 14) {   return PLURAL_CATEGORY.MANY;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);