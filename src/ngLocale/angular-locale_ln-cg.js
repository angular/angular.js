'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "nt\u0254\u0301ng\u0254\u0301",
      "mp\u00f3kwa"
    ],
    "DAY": [
      "eyenga",
      "mok\u0254l\u0254 mwa yambo",
      "mok\u0254l\u0254 mwa m\u00edbal\u00e9",
      "mok\u0254l\u0254 mwa m\u00eds\u00e1to",
      "mok\u0254l\u0254 ya m\u00edn\u00e9i",
      "mok\u0254l\u0254 ya m\u00edt\u00e1no",
      "mp\u0254\u0301s\u0254"
    ],
    "ERANAMES": [
      "Yambo ya Y\u00e9zu Kr\u00eds",
      "Nsima ya Y\u00e9zu Kr\u00eds"
    ],
    "ERAS": [
      "lib\u00f3so ya",
      "nsima ya Y"
    ],
    "MONTH": [
      "s\u00e1nz\u00e1 ya yambo",
      "s\u00e1nz\u00e1 ya m\u00edbal\u00e9",
      "s\u00e1nz\u00e1 ya m\u00eds\u00e1to",
      "s\u00e1nz\u00e1 ya m\u00ednei",
      "s\u00e1nz\u00e1 ya m\u00edt\u00e1no",
      "s\u00e1nz\u00e1 ya mot\u00f3b\u00e1",
      "s\u00e1nz\u00e1 ya nsambo",
      "s\u00e1nz\u00e1 ya mwambe",
      "s\u00e1nz\u00e1 ya libwa",
      "s\u00e1nz\u00e1 ya z\u00f3mi",
      "s\u00e1nz\u00e1 ya z\u00f3mi na m\u0254\u030ck\u0254\u0301",
      "s\u00e1nz\u00e1 ya z\u00f3mi na m\u00edbal\u00e9"
    ],
    "SHORTDAY": [
      "eye",
      "ybo",
      "mbl",
      "mst",
      "min",
      "mtn",
      "mps"
    ],
    "SHORTMONTH": [
      "yan",
      "fbl",
      "msi",
      "apl",
      "mai",
      "yun",
      "yul",
      "agt",
      "stb",
      "\u0254tb",
      "nvb",
      "dsb"
    ],
    "fullDate": "EEEE d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y HH:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "d/M/y HH:mm",
    "shortDate": "d/M/y",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "FCFA",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": ".",
    "PATTERNS": [
      {
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 3,
        "minFrac": 0,
        "minInt": 1,
        "negPre": "-",
        "negSuf": "",
        "posPre": "",
        "posSuf": ""
      },
      {
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 2,
        "minFrac": 2,
        "minInt": 1,
        "negPre": "-",
        "negSuf": "\u00a0\u00a4",
        "posPre": "",
        "posSuf": "\u00a0\u00a4"
      }
    ]
  },
  "id": "ln-cg",
  "pluralCat": function(n, opt_precision) {  if (n >= 0 && n <= 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
