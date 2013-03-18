angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "fm",
      "1": "em"
    },
    "DAY": {
      "0": "söndag",
      "1": "måndag",
      "2": "tisdag",
      "3": "onsdag",
      "4": "torsdag",
      "5": "fredag",
      "6": "lördag"
    },
    "MONTH": {
      "0": "januari",
      "1": "februari",
      "2": "mars",
      "3": "april",
      "4": "maj",
      "5": "juni",
      "6": "juli",
      "7": "augusti",
      "8": "september",
      "9": "oktober",
      "10": "november",
      "11": "december"
    },
    "SHORTDAY": {
      "0": "sön",
      "1": "mån",
      "2": "tis",
      "3": "ons",
      "4": "tors",
      "5": "fre",
      "6": "lör"
    },
    "SHORTMONTH": {
      "0": "jan",
      "1": "feb",
      "2": "mar",
      "3": "apr",
      "4": "maj",
      "5": "jun",
      "6": "jul",
      "7": "aug",
      "8": "sep",
      "9": "okt",
      "10": "nov",
      "11": "dec"
    },
    "fullDate": "EEEE'en' 'den' d:'e' MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y HH:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "yyyy-MM-dd HH:mm",
    "shortDate": "yyyy-MM-dd",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "kr",
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
  "id": "sv-se",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);