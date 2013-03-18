angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "vorm.",
      "1": "nam."
    },
    "DAY": {
      "0": "Sunntig",
      "1": "Määntig",
      "2": "Ziischtig",
      "3": "Mittwuch",
      "4": "Dunschtig",
      "5": "Friitig",
      "6": "Samschtig"
    },
    "MONTH": {
      "0": "Januar",
      "1": "Februar",
      "2": "März",
      "3": "April",
      "4": "Mai",
      "5": "Juni",
      "6": "Juli",
      "7": "Auguscht",
      "8": "Septämber",
      "9": "Oktoober",
      "10": "Novämber",
      "11": "Dezämber"
    },
    "SHORTDAY": {
      "0": "Su.",
      "1": "Mä.",
      "2": "Zi.",
      "3": "Mi.",
      "4": "Du.",
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
    "CURRENCY_SYM": "CHF",
    "DECIMAL_SEP": ".",
    "GROUP_SEP": "’",
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
  "id": "gsw",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);