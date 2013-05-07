angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "nt\u0254\u0301ng\u0254\u0301",
      "1": "mp\u00f3kwa"
    },
    "DAY": {
      "0": "eyenga",
      "1": "mok\u0254l\u0254 mwa yambo",
      "2": "mok\u0254l\u0254 mwa m\u00edbal\u00e9",
      "3": "mok\u0254l\u0254 mwa m\u00eds\u00e1to",
      "4": "mok\u0254l\u0254 ya m\u00edn\u00e9i",
      "5": "mok\u0254l\u0254 ya m\u00edt\u00e1no",
      "6": "mp\u0254\u0301s\u0254"
    },
    "MONTH": {
      "0": "s\u00e1nz\u00e1 ya yambo",
      "1": "s\u00e1nz\u00e1 ya m\u00edbal\u00e9",
      "2": "s\u00e1nz\u00e1 ya m\u00eds\u00e1to",
      "3": "s\u00e1nz\u00e1 ya m\u00ednei",
      "4": "s\u00e1nz\u00e1 ya m\u00edt\u00e1no",
      "5": "s\u00e1nz\u00e1 ya mot\u00f3b\u00e1",
      "6": "s\u00e1nz\u00e1 ya nsambo",
      "7": "s\u00e1nz\u00e1 ya mwambe",
      "8": "s\u00e1nz\u00e1 ya libwa",
      "9": "s\u00e1nz\u00e1 ya z\u00f3mi",
      "10": "s\u00e1nz\u00e1 ya z\u00f3mi na m\u0254\u030ck\u0254\u0301",
      "11": "s\u00e1nz\u00e1 ya z\u00f3mi na m\u00edbal\u00e9"
    },
    "SHORTDAY": {
      "0": "eye",
      "1": "ybo",
      "2": "mbl",
      "3": "mst",
      "4": "min",
      "5": "mtn",
      "6": "mps"
    },
    "SHORTMONTH": {
      "0": "yan",
      "1": "fbl",
      "2": "msi",
      "3": "apl",
      "4": "mai",
      "5": "yun",
      "6": "yul",
      "7": "agt",
      "8": "stb",
      "9": "\u0254tb",
      "10": "nvb",
      "11": "dsb"
    },
    "fullDate": "EEEE d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y HH:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "d/M/yyyy HH:mm",
    "shortDate": "d/M/yyyy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "FrCD",
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
        "negSuf": "\u00a0\u00a4",
        "posPre": "",
        "posSuf": "\u00a0\u00a4"
      }
    }
  },
  "id": "ln-cd",
  "pluralCat": function (n) {  if (n == 0 || n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);