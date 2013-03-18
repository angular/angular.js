angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "am",
      "1": "pm"
    },
    "DAY": {
      "0": "ରବିବାର",
      "1": "ସୋମବାର",
      "2": "ମଙ୍ଗଳବାର",
      "3": "ବୁଧବାର",
      "4": "ଗୁରୁବାର",
      "5": "ଶୁକ୍ରବାର",
      "6": "ଶନିବାର"
    },
    "MONTH": {
      "0": "ଜାନୁଆରୀ",
      "1": "ଫେବ୍ରୁୟାରୀ",
      "2": "ମାର୍ଚ୍ଚ",
      "3": "ଅପ୍ରେଲ",
      "4": "ମେ",
      "5": "ଜୁନ",
      "6": "ଜୁଲାଇ",
      "7": "ଅଗଷ୍ଟ",
      "8": "ସେପ୍ଟେମ୍ବର",
      "9": "ଅକ୍ଟୋବର",
      "10": "ନଭେମ୍ବର",
      "11": "ଡିସେମ୍ବର"
    },
    "SHORTDAY": {
      "0": "ରବି",
      "1": "ସୋମ",
      "2": "ମଙ୍ଗଳ",
      "3": "ବୁଧ",
      "4": "ଗୁରୁ",
      "5": "ଶୁକ୍ର",
      "6": "ଶନି"
    },
    "SHORTMONTH": {
      "0": "ଜାନୁଆରୀ",
      "1": "ଫେବ୍ରୁୟାରୀ",
      "2": "ମାର୍ଚ୍ଚ",
      "3": "ଅପ୍ରେଲ",
      "4": "ମେ",
      "5": "ଜୁନ",
      "6": "ଜୁଲାଇ",
      "7": "ଅଗଷ୍ଟ",
      "8": "ସେପ୍ଟେମ୍ବର",
      "9": "ଅକ୍ଟୋବର",
      "10": "ନଭେମ୍ବର",
      "11": "ଡିସେମ୍ବର"
    },
    "fullDate": "EEEE, d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y h:mm:ss a",
    "mediumDate": "d MMM y",
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
  "id": "or",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);