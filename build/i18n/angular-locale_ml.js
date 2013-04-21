angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "am",
      "1": "pm"
    },
    "DAY": {
      "0": "ഞായറാഴ്ച",
      "1": "തിങ്കളാഴ്ച",
      "2": "ചൊവ്വാഴ്ച",
      "3": "ബുധനാഴ്ച",
      "4": "വ്യാഴാഴ്ച",
      "5": "വെള്ളിയാഴ്ച",
      "6": "ശനിയാഴ്ച"
    },
    "MONTH": {
      "0": "ജനുവരി",
      "1": "ഫെബ്രുവരി",
      "2": "മാര്‍ച്ച്",
      "3": "ഏപ്രില്‍",
      "4": "മേയ്",
      "5": "ജൂണ്‍",
      "6": "ജൂലൈ",
      "7": "ആഗസ്റ്റ്",
      "8": "സെപ്റ്റംബര്‍",
      "9": "ഒക്ടോബര്‍",
      "10": "നവംബര്‍",
      "11": "ഡിസംബര്‍"
    },
    "SHORTDAY": {
      "0": "ഞായര്‍",
      "1": "തിങ്കള്‍",
      "2": "ചൊവ്വ",
      "3": "ബുധന്‍",
      "4": "വ്യാഴം",
      "5": "വെള്ളി",
      "6": "ശനി"
    },
    "SHORTMONTH": {
      "0": "ജനു",
      "1": "ഫെബ്രു",
      "2": "മാര്‍",
      "3": "ഏപ്രി",
      "4": "മേയ്",
      "5": "ജൂണ്‍",
      "6": "ജൂലൈ",
      "7": "ഓഗ",
      "8": "സെപ്റ്റം",
      "9": "ഒക്ടോ",
      "10": "നവം",
      "11": "ഡിസം"
    },
    "fullDate": "y, MMMM d, EEEE",
    "longDate": "y, MMMM d",
    "medium": "y, MMM d h:mm:ss a",
    "mediumDate": "y, MMM d",
    "mediumTime": "h:mm:ss a",
    "short": "dd/MM/yy h:mm a",
    "shortDate": "dd/MM/yy",
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
        "negPre": "-",
        "negSuf": "\u00A4",
        "posPre": "",
        "posSuf": "\u00A4"
      }
    }
  },
  "id": "ml",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);