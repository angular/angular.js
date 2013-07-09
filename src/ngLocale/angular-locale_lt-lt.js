angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "prie\u0161piet",
      "popiet"
    ],
    "DAY": [
      "sekmadienis",
      "pirmadienis",
      "antradienis",
      "tre\u010diadienis",
      "ketvirtadienis",
      "penktadienis",
      "\u0161e\u0161tadienis"
    ],
    "MONTH": [
      "sausio",
      "vasaris",
      "kovas",
      "balandis",
      "gegu\u017e\u0117",
      "bir\u017eelis",
      "liepa",
      "rugpj\u016btis",
      "rugs\u0117jis",
      "spalis",
      "lapkritis",
      "gruodis"
    ],
    "SHORTDAY": [
      "Sk",
      "Pr",
      "An",
      "Tr",
      "Kt",
      "Pn",
      "\u0160t"
    ],
    "SHORTMONTH": [
      "Saus.",
      "Vas",
      "Kov.",
      "Bal.",
      "Geg.",
      "Bir.",
      "Liep.",
      "Rugp.",
      "Rugs.",
      "Spal.",
      "Lapkr.",
      "Gruod."
    ],
    "fullDate": "y 'm'. MMMM d 'd'., EEEE",
    "longDate": "y 'm'. MMMM d 'd'.",
    "medium": "y MMM d HH:mm:ss",
    "mediumDate": "y MMM d",
    "mediumTime": "HH:mm:ss",
    "short": "yyyy-MM-dd HH:mm",
    "shortDate": "yyyy-MM-dd",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "Lt",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": "\u00a0",
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
        "negPre": "-",
        "negSuf": "\u00a0\u00a4",
        "posPre": "",
        "posSuf": "\u00a0\u00a4"
      }
    ]
  },
  "id": "lt-lt",
  "pluralCat": function (n) {  if (n % 10 == 1 && (n % 100 < 11 || n % 100 > 19)) {   return PLURAL_CATEGORY.ONE;  }  if (n == (n | 0) && n % 10 >= 2 && n % 10 <= 9 && (n % 100 < 11 || n % 100 > 19)) {   return PLURAL_CATEGORY.FEW;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);