angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "am",
      "1": "pm"
    },
    "DAY": {
      "0": "ರವಿವಾರ",
      "1": "ಸೋಮವಾರ",
      "2": "ಮಂಗಳವಾರ",
      "3": "ಬುಧವಾರ",
      "4": "ಗುರುವಾರ",
      "5": "ಶುಕ್ರವಾರ",
      "6": "ಶನಿವಾರ"
    },
    "MONTH": {
      "0": "ಜನವರೀ",
      "1": "ಫೆಬ್ರವರೀ",
      "2": "ಮಾರ್ಚ್",
      "3": "ಎಪ್ರಿಲ್",
      "4": "ಮೆ",
      "5": "ಜೂನ್",
      "6": "ಜುಲೈ",
      "7": "ಆಗಸ್ಟ್",
      "8": "ಸಪ್ಟೆಂಬರ್",
      "9": "ಅಕ್ಟೋಬರ್",
      "10": "ನವೆಂಬರ್",
      "11": "ಡಿಸೆಂಬರ್"
    },
    "SHORTDAY": {
      "0": "ರ.",
      "1": "ಸೋ.",
      "2": "ಮಂ.",
      "3": "ಬು.",
      "4": "ಗು.",
      "5": "ಶು.",
      "6": "ಶನಿ."
    },
    "SHORTMONTH": {
      "0": "ಜನವರೀ",
      "1": "ಫೆಬ್ರವರೀ",
      "2": "ಮಾರ್ಚ್",
      "3": "ಎಪ್ರಿಲ್",
      "4": "ಮೆ",
      "5": "ಜೂನ್",
      "6": "ಜುಲೈ",
      "7": "ಆಗಸ್ಟ್",
      "8": "ಸಪ್ಟೆಂಬರ್",
      "9": "ಅಕ್ಟೋಬರ್",
      "10": "ನವೆಂಬರ್",
      "11": "ಡಿಸೆಂಬರ್"
    },
    "fullDate": "EEEE d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y hh:mm:ss a",
    "mediumDate": "d MMM y",
    "mediumTime": "hh:mm:ss a",
    "short": "d-M-yy hh:mm a",
    "shortDate": "d-M-yy",
    "shortTime": "hh:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "₹",
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
        "negPre": "(\u00A4",
        "negSuf": ")",
        "posPre": "\u00A4",
        "posSuf": ""
      }
    }
  },
  "id": "kn-in",
  "pluralCat": function (n) {  return PLURAL_CATEGORY.OTHER;}
});
}]);