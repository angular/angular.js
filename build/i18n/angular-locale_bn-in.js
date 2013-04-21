angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "am",
      "1": "pm"
    },
    "DAY": {
      "0": "রবিবার",
      "1": "সোমবার",
      "2": "মঙ্গলবার",
      "3": "বুধবার",
      "4": "বৃহষ্পতিবার",
      "5": "শুক্রবার",
      "6": "শনিবার"
    },
    "MONTH": {
      "0": "জানুয়ারী",
      "1": "ফেব্রুয়ারী",
      "2": "মার্চ",
      "3": "এপ্রিল",
      "4": "মে",
      "5": "জুন",
      "6": "জুলাই",
      "7": "আগস্ট",
      "8": "সেপ্টেম্বর",
      "9": "অক্টোবর",
      "10": "নভেম্বর",
      "11": "ডিসেম্বর"
    },
    "SHORTDAY": {
      "0": "রবি",
      "1": "সোম",
      "2": "মঙ্গল",
      "3": "বুধ",
      "4": "বৃহস্পতি",
      "5": "শুক্র",
      "6": "শনি"
    },
    "SHORTMONTH": {
      "0": "জানুয়ারী",
      "1": "ফেব্রুয়ারী",
      "2": "মার্চ",
      "3": "এপ্রিল",
      "4": "মে",
      "5": "জুন",
      "6": "জুলাই",
      "7": "আগস্ট",
      "8": "সেপ্টেম্বর",
      "9": "অক্টোবর",
      "10": "নভেম্বর",
      "11": "ডিসেম্বর"
    },
    "fullDate": "EEEE, d MMMM, y",
    "longDate": "d MMMM, y",
    "medium": "d MMM, y h:mm:ss a",
    "mediumDate": "d MMM, y",
    "mediumTime": "h:mm:ss a",
    "short": "d/M/yy h:mm a",
    "shortDate": "d/M/yy",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "৳",
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
        "negPre": "(",
        "negSuf": "\u00A4)",
        "posPre": "",
        "posSuf": "\u00A4"
      }
    }
  },
  "id": "bn-in",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);