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
      "2": "मंगलवार",
      "3": "बुधवार",
      "4": "बृहस्पतिवार",
      "5": "शुक्रवार",
      "6": "शनिवार"
    },
    "MONTH": {
      "0": "जनवरी",
      "1": "फरवरी",
      "2": "मार्च",
      "3": "अप्रैल",
      "4": "मई",
      "5": "जून",
      "6": "जुलाई",
      "7": "अगस्त",
      "8": "सितम्बर",
      "9": "अक्तूबर",
      "10": "नवम्बर",
      "11": "दिसम्बर"
    },
    "SHORTDAY": {
      "0": "रवि.",
      "1": "सोम.",
      "2": "मंगल.",
      "3": "बुध.",
      "4": "बृह.",
      "5": "शुक्र.",
      "6": "शनि."
    },
    "SHORTMONTH": {
      "0": "जनवरी",
      "1": "फरवरी",
      "2": "मार्च",
      "3": "अप्रैल",
      "4": "मई",
      "5": "जून",
      "6": "जुलाई",
      "7": "अगस्त",
      "8": "सितम्बर",
      "9": "अक्तूबर",
      "10": "नवम्बर",
      "11": "दिसम्बर"
    },
    "fullDate": "EEEE, d MMMM y",
    "longDate": "d MMMM y",
    "medium": "dd-MM-yyyy h:mm:ss a",
    "mediumDate": "dd-MM-yyyy",
    "mediumTime": "h:mm:ss a",
    "short": "d-M-yy h:mm a",
    "shortDate": "d-M-yy",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "₹",
    "DECIMAL_SEP": ".",
    "GROUP_SEP": ",",
    "PATTERNS": {
      "0": {
        "gSize": 2,
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
        "gSize": 2,
        "lgSize": 3,
        "macFrac": 0,
        "maxFrac": 2,
        "minFrac": 2,
        "minInt": 1,
        "negPre": "\u00A4 -",
        "negSuf": "",
        "posPre": "\u00A4 ",
        "posSuf": ""
      }
    }
  },
  "id": "hi",
  "pluralCat": function (n) {  if (n == 0 || n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);