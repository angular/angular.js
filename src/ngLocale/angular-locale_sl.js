angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "dop.",
      "pop."
    ],
    "DAY": [
      "nedelja",
      "ponedeljek",
      "torek",
      "sreda",
      "\u010detrtek",
      "petek",
      "sobota"
    ],
    "MONTH": [
      "januar",
      "februar",
      "marec",
      "april",
      "maj",
      "junij",
      "julij",
      "avgust",
      "september",
      "oktober",
      "november",
      "december"
    ],
    "SHORTDAY": [
      "ned.",
      "pon.",
      "tor.",
      "sre.",
      "\u010det.",
      "pet.",
      "sob."
    ],
    "SHORTMONTH": [
      "jan.",
      "feb.",
      "mar.",
      "apr.",
      "maj",
      "jun.",
      "jul.",
      "avg.",
      "sep.",
      "okt.",
      "nov.",
      "dec."
    ],
    "fullDate": "EEEE, dd. MMMM y",
    "longDate": "dd. MMMM y",
    "medium": "d. MMM yyyy HH:mm:ss",
    "mediumDate": "d. MMM yyyy",
    "mediumTime": "HH:mm:ss",
    "short": "d. MM. yy HH:mm",
    "shortDate": "d. MM. yy",
    "shortTime": "HH:mm"
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
  "id": "sl",
  "pluralCat": function (n) {  if (n % 100 == 1) {   return PLURAL_CATEGORY.ONE;  }  if (n % 100 == 2) {   return PLURAL_CATEGORY.TWO;  }  if (n % 100 == 3 || n % 100 == 4) {   return PLURAL_CATEGORY.FEW;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);