angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "a.m.",
      "p.m."
    ],
    "DAY": [
      "diumenge",
      "dilluns",
      "dimarts",
      "dimecres",
      "dijous",
      "divendres",
      "dissabte"
    ],
    "MONTH": [
      "de gener",
      "de febrer",
      "de mar\u00e7",
      "d\u2019abril",
      "de maig",
      "de juny",
      "de juliol",
      "d\u2019agost",
      "de setembre",
      "d\u2019octubre",
      "de novembre",
      "de desembre"
    ],
    "SHORTDAY": [
      "dg.",
      "dl.",
      "dt.",
      "dc.",
      "dj.",
      "dv.",
      "ds."
    ],
    "SHORTMONTH": [
      "de gen.",
      "de febr.",
      "de mar\u00e7",
      "d\u2019abr.",
      "de maig",
      "de juny",
      "de jul.",
      "d\u2019ag.",
      "de set.",
      "d\u2019oct.",
      "de nov.",
      "de des."
    ],
    "fullDate": "EEEE d MMMM 'de' y",
    "longDate": "d MMMM 'de' y",
    "medium": "dd/MM/yyyy H:mm:ss",
    "mediumDate": "dd/MM/yyyy",
    "mediumTime": "H:mm:ss",
    "short": "dd/MM/yy H:mm",
    "shortDate": "dd/MM/yy",
    "shortTime": "H:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u20ac",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": ".",
    "PATTERNS": [
      {
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
      {
        "gSize": 3,
        "lgSize": 3,
        "macFrac": 0,
        "maxFrac": 2,
        "minFrac": 2,
        "minInt": 1,
        "negPre": "(\u00a4",
        "negSuf": ")",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "ca-ad",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);