angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "π.μ.",
      "1": "μ.μ."
    },
    "DAY": {
      "0": "Κυριακή",
      "1": "Δευτέρα",
      "2": "Τρίτη",
      "3": "Τετάρτη",
      "4": "Πέμπτη",
      "5": "Παρασκευή",
      "6": "Σάββατο"
    },
    "MONTH": {
      "0": "Ιανουαρίου",
      "1": "Φεβρουαρίου",
      "2": "Μαρτίου",
      "3": "Απριλίου",
      "4": "Μαΐου",
      "5": "Ιουνίου",
      "6": "Ιουλίου",
      "7": "Αυγούστου",
      "8": "Σεπτεμβρίου",
      "9": "Οκτωβρίου",
      "10": "Νοεμβρίου",
      "11": "Δεκεμβρίου"
    },
    "SHORTDAY": {
      "0": "Κυρ",
      "1": "Δευ",
      "2": "Τρι",
      "3": "Τετ",
      "4": "Πεμ",
      "5": "Παρ",
      "6": "Σαβ"
    },
    "SHORTMONTH": {
      "0": "Ιαν",
      "1": "Φεβ",
      "2": "Μαρ",
      "3": "Απρ",
      "4": "Μαϊ",
      "5": "Ιουν",
      "6": "Ιουλ",
      "7": "Αυγ",
      "8": "Σεπ",
      "9": "Οκτ",
      "10": "Νοε",
      "11": "Δεκ"
    },
    "fullDate": "EEEE, d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y h:mm:ss a",
    "mediumDate": "d MMM y",
    "mediumTime": "h:mm:ss a",
    "short": "d/M/yy h:mm a",
    "shortDate": "d/M/yy",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "€",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": ".",
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
        "negPre": "-",
        "negSuf": " \u00A4",
        "posPre": "",
        "posSuf": " \u00A4"
      }
    }
  },
  "id": "el-cy",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);