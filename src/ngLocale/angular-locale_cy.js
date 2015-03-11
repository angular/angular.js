'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "AM",
      "PM"
    ],
    "DAY": [
      "Dydd Sul",
      "Dydd Llun",
      "Dydd Mawrth",
      "Dydd Mercher",
      "Dydd Iau",
      "Dydd Gwener",
      "Dydd Sadwrn"
    ],
    "ERANAMES": [
      "Cyn Crist",
      "Oed Crist"
    ],
    "ERAS": [
      "CC",
      "OC"
    ],
    "MONTH": [
      "Ionawr",
      "Chwefror",
      "Mawrth",
      "Ebrill",
      "Mai",
      "Mehefin",
      "Gorffennaf",
      "Awst",
      "Medi",
      "Hydref",
      "Tachwedd",
      "Rhagfyr"
    ],
    "SHORTDAY": [
      "Sul",
      "Llun",
      "Maw",
      "Mer",
      "Iau",
      "Gwen",
      "Sad"
    ],
    "SHORTMONTH": [
      "Ion",
      "Chwef",
      "Mawrth",
      "Ebrill",
      "Mai",
      "Meh",
      "Gorff",
      "Awst",
      "Medi",
      "Hyd",
      "Tach",
      "Rhag"
    ],
    "fullDate": "EEEE, d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y HH:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "dd/MM/yy HH:mm",
    "shortDate": "dd/MM/yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u00a3",
    "DECIMAL_SEP": ".",
    "GROUP_SEP": ",",
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
        "negPre": "\u00a4-",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "cy",
  "pluralCat": function(n, opt_precision) {  if (n == 0) {    return PLURAL_CATEGORY.ZERO;  }  if (n == 1) {    return PLURAL_CATEGORY.ONE;  }  if (n == 2) {    return PLURAL_CATEGORY.TWO;  }  if (n == 3) {    return PLURAL_CATEGORY.FEW;  }  if (n == 6) {    return PLURAL_CATEGORY.MANY;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
