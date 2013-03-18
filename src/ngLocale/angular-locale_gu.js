angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "am",
      "1": "pm"
    },
    "DAY": {
      "0": "રવિવાર",
      "1": "સોમવાર",
      "2": "મંગળવાર",
      "3": "બુધવાર",
      "4": "ગુરુવાર",
      "5": "શુક્રવાર",
      "6": "શનિવાર"
    },
    "MONTH": {
      "0": "જાન્યુઆરી",
      "1": "ફેબ્રુઆરી",
      "2": "માર્ચ",
      "3": "એપ્રિલ",
      "4": "મે",
      "5": "જૂન",
      "6": "જુલાઈ",
      "7": "ઑગસ્ટ",
      "8": "સપ્ટેમ્બર",
      "9": "ઑક્ટોબર",
      "10": "નવેમ્બર",
      "11": "ડિસેમ્બર"
    },
    "SHORTDAY": {
      "0": "રવિ",
      "1": "સોમ",
      "2": "મંગળ",
      "3": "બુધ",
      "4": "ગુરુ",
      "5": "શુક્ર",
      "6": "શનિ"
    },
    "SHORTMONTH": {
      "0": "જાન્યુ",
      "1": "ફેબ્રુ",
      "2": "માર્ચ",
      "3": "એપ્રિલ",
      "4": "મે",
      "5": "જૂન",
      "6": "જુલાઈ",
      "7": "ઑગસ્ટ",
      "8": "સપ્ટે",
      "9": "ઑક્ટો",
      "10": "નવે",
      "11": "ડિસે"
    },
    "fullDate": "EEEE, d MMMM, y",
    "longDate": "d MMMM, y",
    "medium": "d MMM, y hh:mm:ss a",
    "mediumDate": "d MMM, y",
    "mediumTime": "hh:mm:ss a",
    "short": "d-MM-yy hh:mm a",
    "shortDate": "d-MM-yy",
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
  "id": "gu",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);