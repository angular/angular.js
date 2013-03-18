angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "vm.",
      "1": "nm."
    },
    "DAY": {
      "0": "Sondag",
      "1": "Maandag",
      "2": "Dinsdag",
      "3": "Woensdag",
      "4": "Donderdag",
      "5": "Vrydag",
      "6": "Saterdag"
    },
    "MONTH": {
      "0": "Januarie",
      "1": "Februarie",
      "2": "Maart",
      "3": "April",
      "4": "Mei",
      "5": "Junie",
      "6": "Julie",
      "7": "Augustus",
      "8": "September",
      "9": "Oktober",
      "10": "November",
      "11": "Desember"
    },
    "SHORTDAY": {
      "0": "So",
      "1": "Ma",
      "2": "Di",
      "3": "Wo",
      "4": "Do",
      "5": "Vr",
      "6": "Sa"
    },
    "SHORTMONTH": {
      "0": "Jan",
      "1": "Feb",
      "2": "Mar",
      "3": "Apr",
      "4": "Mei",
      "5": "Jun",
      "6": "Jul",
      "7": "Aug",
      "8": "Sep",
      "9": "Okt",
      "10": "Nov",
      "11": "Des"
    },
    "fullDate": "EEEE dd MMMM y",
    "longDate": "dd MMMM y",
    "medium": "dd MMM y h:mm:ss a",
    "mediumDate": "dd MMM y",
    "mediumTime": "h:mm:ss a",
    "short": "yyyy-MM-dd h:mm a",
    "shortDate": "yyyy-MM-dd",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "R",
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
        "negPre": "(\u00A4",
        "negSuf": ")",
        "posPre": "\u00A4",
        "posSuf": ""
      }
    }
  },
  "id": "af",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);