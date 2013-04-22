angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "am",
      "1": "pm"
    },
    "DAY": {
      "0": "ஞாயிறு",
      "1": "திங்கள்",
      "2": "செவ்வாய்",
      "3": "புதன்",
      "4": "வியாழன்",
      "5": "வெள்ளி",
      "6": "சனி"
    },
    "MONTH": {
      "0": "ஜனவரி",
      "1": "பிப்ரவரி",
      "2": "மார்ச்",
      "3": "ஏப்ரல்",
      "4": "மே",
      "5": "ஜூன்",
      "6": "ஜூலை",
      "7": "ஆகஸ்ட்",
      "8": "செப்டம்பர்",
      "9": "அக்டோபர்",
      "10": "நவம்பர்",
      "11": "டிசம்பர்"
    },
    "SHORTDAY": {
      "0": "ஞா",
      "1": "தி",
      "2": "செ",
      "3": "பு",
      "4": "வி",
      "5": "வெ",
      "6": "ச"
    },
    "SHORTMONTH": {
      "0": "ஜன.",
      "1": "பிப்.",
      "2": "மார்.",
      "3": "ஏப்.",
      "4": "மே",
      "5": "ஜூன்",
      "6": "ஜூலை",
      "7": "ஆக.",
      "8": "செப்.",
      "9": "அக்.",
      "10": "நவ.",
      "11": "டிச."
    },
    "fullDate": "EEEE, d MMMM, y",
    "longDate": "d MMMM, y",
    "medium": "d MMM, y h:mm:ss a",
    "mediumDate": "d MMM, y",
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
  "id": "ta-lk",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);