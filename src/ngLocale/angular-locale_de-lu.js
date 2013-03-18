angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "vorm.",
      "1": "nachm."
    },
    "DAY": {
      "0": "Sonntag",
      "1": "Montag",
      "2": "Dienstag",
      "3": "Mittwoch",
      "4": "Donnerstag",
      "5": "Freitag",
      "6": "Samstag"
    },
    "MONTH": {
      "0": "Januar",
      "1": "Februar",
      "2": "März",
      "3": "April",
      "4": "Mai",
      "5": "Juni",
      "6": "Juli",
      "7": "August",
      "8": "September",
      "9": "Oktober",
      "10": "November",
      "11": "Dezember"
    },
    "SHORTDAY": {
      "0": "So.",
      "1": "Mo.",
      "2": "Di.",
      "3": "Mi.",
      "4": "Do.",
      "5": "Fr.",
      "6": "Sa."
    },
    "SHORTMONTH": {
      "0": "Jan",
      "1": "Feb",
      "2": "Mär",
      "3": "Apr",
      "4": "Mai",
      "5": "Jun",
      "6": "Jul",
      "7": "Aug",
      "8": "Sep",
      "9": "Okt",
      "10": "Nov",
      "11": "Dez"
    },
    "fullDate": "EEEE, d. MMMM y",
    "longDate": "d. MMMM y",
    "medium": "dd.MM.yyyy HH:mm:ss",
    "mediumDate": "dd.MM.yyyy",
    "mediumTime": "HH:mm:ss",
    "short": "dd.MM.yy HH:mm",
    "shortDate": "dd.MM.yy",
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
        "negPre": "-",
        "negSuf": " \u00A4",
        "posPre": "",
        "posSuf": " \u00A4"
      }
    }
  },
  "id": "de-lu",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);