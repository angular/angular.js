angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "دن",
      "1": "رات"
    },
    "DAY": {
      "0": "اتوار",
      "1": "پير",
      "2": "منگل",
      "3": "بده",
      "4": "جمعرات",
      "5": "جمعہ",
      "6": "ہفتہ"
    },
    "MONTH": {
      "0": "جنوری",
      "1": "فروری",
      "2": "مارچ",
      "3": "اپريل",
      "4": "مئ",
      "5": "جون",
      "6": "جولائ",
      "7": "اگست",
      "8": "ستمبر",
      "9": "اکتوبر",
      "10": "نومبر",
      "11": "دسمبر"
    },
    "SHORTDAY": {
      "0": "اتوار",
      "1": "پير",
      "2": "منگل",
      "3": "بده",
      "4": "جمعرات",
      "5": "جمعہ",
      "6": "ہفتہ"
    },
    "SHORTMONTH": {
      "0": "جنوری",
      "1": "فروری",
      "2": "مارچ",
      "3": "اپريل",
      "4": "مئ",
      "5": "جون",
      "6": "جولائ",
      "7": "اگست",
      "8": "ستمبر",
      "9": "اکتوبر",
      "10": "نومبر",
      "11": "دسمبر"
    },
    "fullDate": "EEEE؍ d؍ MMMM y",
    "longDate": "d؍ MMMM y",
    "medium": "d؍ MMM y h:mm:ss a",
    "mediumDate": "d؍ MMM y",
    "mediumTime": "h:mm:ss a",
    "short": "d/M/yy h:mm a",
    "shortDate": "d/M/yy",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "Rs",
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
        "negPre": "\u00A4-",
        "negSuf": "",
        "posPre": "\u00A4",
        "posSuf": ""
      }
    }
  },
  "id": "ur-pk",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);