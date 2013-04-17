angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "\u0642\u0628\u0644\u200c\u0627\u0632\u0638\u0647\u0631",
      "1": "\u0628\u0639\u062f\u0627\u0632\u0638\u0647\u0631"
    },
    "DAY": {
      "0": "\u06cc\u06a9\u0634\u0646\u0628\u0647",
      "1": "\u062f\u0648\u0634\u0646\u0628\u0647",
      "2": "\u0633\u0647\u200c\u0634\u0646\u0628\u0647",
      "3": "\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647",
      "4": "\u067e\u0646\u062c\u0634\u0646\u0628\u0647",
      "5": "\u062c\u0645\u0639\u0647",
      "6": "\u0634\u0646\u0628\u0647"
    },
    "MONTH": {
      "0": "\u062c\u0646\u0648\u0631\u06cc",
      "1": "\u0641\u0628\u0631\u0648\u0631\u06cc",
      "2": "\u0645\u0627\u0631\u0686",
      "3": "\u0627\u067e\u0631\u06cc\u0644",
      "4": "\u0645\u06cc",
      "5": "\u062c\u0648\u0646",
      "6": "\u062c\u0648\u0644\u0627\u06cc",
      "7": "\u0627\u06af\u0633\u062a",
      "8": "\u0633\u067e\u062a\u0645\u0628\u0631",
      "9": "\u0627\u06a9\u062a\u0648\u0628\u0631",
      "10": "\u0646\u0648\u0645\u0628\u0631",
      "11": "\u062f\u0633\u0645\u0628\u0631"
    },
    "SHORTDAY": {
      "0": "\u06cc\u06a9\u0634\u0646\u0628\u0647",
      "1": "\u062f\u0648\u0634\u0646\u0628\u0647",
      "2": "\u0633\u0647\u200c\u0634\u0646\u0628\u0647",
      "3": "\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647",
      "4": "\u067e\u0646\u062c\u0634\u0646\u0628\u0647",
      "5": "\u062c\u0645\u0639\u0647",
      "6": "\u0634\u0646\u0628\u0647"
    },
    "SHORTMONTH": {
      "0": "\u062c\u0646\u0648",
      "1": "\u0641\u0648\u0631\u06cc\u0647\u0654",
      "2": "\u0645\u0627\u0631\u0633",
      "3": "\u0622\u0648\u0631\u06cc\u0644",
      "4": "\u0645\u0640\u06cc",
      "5": "\u0698\u0648\u0626\u0646",
      "6": "\u062c\u0648\u0644",
      "7": "\u0627\u0648\u062a",
      "8": "\u0633\u067e\u062a\u0627\u0645\u0628\u0631",
      "9": "\u0627\u06a9\u062a\u0628\u0631",
      "10": "\u0646\u0648\u0627\u0645\u0628\u0631",
      "11": "\u062f\u0633\u0645"
    },
    "fullDate": "EEEE d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y H:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "H:mm:ss",
    "short": "yyyy/M/d H:mm",
    "shortDate": "yyyy/M/d",
    "shortTime": "H:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "Rial",
    "DECIMAL_SEP": "\u066b",
    "GROUP_SEP": "\u066c",
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
        "negPre": "\u200e(\u00a4",
        "negSuf": ")",
        "posPre": "\u200e\u00a4",
        "posSuf": ""
      }
    }
  },
  "id": "fa-af",
  "pluralCat": function (n) {  return PLURAL_CATEGORY.OTHER;}
});
}]);