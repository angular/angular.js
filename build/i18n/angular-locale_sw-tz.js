angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "asubuhi",
      "1": "alasiri"
    },
    "DAY": {
      "0": "Jumapili",
      "1": "Jumatatu",
      "2": "Jumanne",
      "3": "Jumatano",
      "4": "Alhamisi",
      "5": "Ijumaa",
      "6": "Jumamosi"
    },
    "MONTH": {
      "0": "Januari",
      "1": "Februari",
      "2": "Machi",
      "3": "Aprili",
      "4": "Mei",
      "5": "Juni",
      "6": "Julai",
      "7": "Agosti",
      "8": "Septemba",
      "9": "Oktoba",
      "10": "Novemba",
      "11": "Desemba"
    },
    "SHORTDAY": {
      "0": "J2",
      "1": "J3",
      "2": "J4",
      "3": "J5",
      "4": "Alh",
      "5": "Ij",
      "6": "J1"
    },
    "SHORTMONTH": {
      "0": "Jan",
      "1": "Feb",
      "2": "Mac",
      "3": "Apr",
      "4": "Mei",
      "5": "Jun",
      "6": "Jul",
      "7": "Ago",
      "8": "Sep",
      "9": "Okt",
      "10": "Nov",
      "11": "Des"
    },
    "fullDate": "EEEE, d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y h:mm:ss a",
    "mediumDate": "d MMM y",
    "mediumTime": "h:mm:ss a",
    "short": "dd/MM/yyyy h:mm a",
    "shortDate": "dd/MM/yyyy",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "TSh",
    "DECIMAL_SEP": ".",
    "GROUP_SEP": ",",
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
  "id": "sw-tz",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);