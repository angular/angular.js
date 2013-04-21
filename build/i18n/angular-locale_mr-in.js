angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "am",
      "1": "pm"
    },
    "DAY": {
      "0": "रविवार",
      "1": "सोमवार",
      "2": "मंगळवार",
      "3": "बुधवार",
      "4": "गुरुवार",
      "5": "शुक्रवार",
      "6": "शनिवार"
    },
    "MONTH": {
      "0": "जानेवारी",
      "1": "फेब्रुवारी",
      "2": "मार्च",
      "3": "एप्रिल",
      "4": "मे",
      "5": "जून",
      "6": "जुलै",
      "7": "ऑगस्ट",
      "8": "सप्टेंबर",
      "9": "ऑक्टोबर",
      "10": "नोव्हेंबर",
      "11": "डिसेंबर"
    },
    "SHORTDAY": {
      "0": "रवि",
      "1": "सोम",
      "2": "मंगळ",
      "3": "बुध",
      "4": "गुरु",
      "5": "शुक्र",
      "6": "शनि"
    },
    "SHORTMONTH": {
      "0": "जाने",
      "1": "फेब्रु",
      "2": "मार्च",
      "3": "एप्रि",
      "4": "मे",
      "5": "जून",
      "6": "जुलै",
      "7": "ऑग",
      "8": "सेप्टें",
      "9": "ऑक्टोबर",
      "10": "नोव्हें",
      "11": "डिसें"
    },
    "fullDate": "EEEE d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y h-mm-ss a",
    "mediumDate": "d MMM y",
    "mediumTime": "h-mm-ss a",
    "short": "d-M-yy h-mm a",
    "shortDate": "d-M-yy",
    "shortTime": "h-mm a"
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
  "id": "mr-in",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);