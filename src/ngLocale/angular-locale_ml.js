angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "am",
      "pm"
    ],
    "DAY": [
      "\u0d1e\u0d3e\u0d2f\u0d31\u0d3e\u0d34\u0d4d\u0d1a",
      "\u0d24\u0d3f\u0d19\u0d4d\u0d15\u0d33\u0d3e\u0d34\u0d4d\u0d1a",
      "\u0d1a\u0d4a\u0d35\u0d4d\u0d35\u0d3e\u0d34\u0d4d\u0d1a",
      "\u0d2c\u0d41\u0d27\u0d28\u0d3e\u0d34\u0d4d\u0d1a",
      "\u0d35\u0d4d\u0d2f\u0d3e\u0d34\u0d3e\u0d34\u0d4d\u0d1a",
      "\u0d35\u0d46\u0d33\u0d4d\u0d33\u0d3f\u0d2f\u0d3e\u0d34\u0d4d\u0d1a",
      "\u0d36\u0d28\u0d3f\u0d2f\u0d3e\u0d34\u0d4d\u0d1a"
    ],
    "MONTH": [
      "\u0d1c\u0d28\u0d41\u0d35\u0d30\u0d3f",
      "\u0d2b\u0d46\u0d2c\u0d4d\u0d30\u0d41\u0d35\u0d30\u0d3f",
      "\u0d2e\u0d3e\u0d30\u0d4d\u200d\u0d1a\u0d4d\u0d1a\u0d4d",
      "\u0d0f\u0d2a\u0d4d\u0d30\u0d3f\u0d32\u0d4d\u200d",
      "\u0d2e\u0d47\u0d2f\u0d4d",
      "\u0d1c\u0d42\u0d23\u0d4d\u200d",
      "\u0d1c\u0d42\u0d32\u0d48",
      "\u0d06\u0d17\u0d38\u0d4d\u0d31\u0d4d\u0d31\u0d4d",
      "\u0d38\u0d46\u0d2a\u0d4d\u0d31\u0d4d\u0d31\u0d02\u0d2c\u0d30\u0d4d\u200d",
      "\u0d12\u0d15\u0d4d\u0d1f\u0d4b\u0d2c\u0d30\u0d4d\u200d",
      "\u0d28\u0d35\u0d02\u0d2c\u0d30\u0d4d\u200d",
      "\u0d21\u0d3f\u0d38\u0d02\u0d2c\u0d30\u0d4d\u200d"
    ],
    "SHORTDAY": [
      "\u0d1e\u0d3e\u0d2f\u0d30\u0d4d\u200d",
      "\u0d24\u0d3f\u0d19\u0d4d\u0d15\u0d33\u0d4d\u200d",
      "\u0d1a\u0d4a\u0d35\u0d4d\u0d35",
      "\u0d2c\u0d41\u0d27\u0d28\u0d4d\u200d",
      "\u0d35\u0d4d\u0d2f\u0d3e\u0d34\u0d02",
      "\u0d35\u0d46\u0d33\u0d4d\u0d33\u0d3f",
      "\u0d36\u0d28\u0d3f"
    ],
    "SHORTMONTH": [
      "\u0d1c\u0d28\u0d41",
      "\u0d2b\u0d46\u0d2c\u0d4d\u0d30\u0d41",
      "\u0d2e\u0d3e\u0d30\u0d4d\u200d",
      "\u0d0f\u0d2a\u0d4d\u0d30\u0d3f",
      "\u0d2e\u0d47\u0d2f\u0d4d",
      "\u0d1c\u0d42\u0d23\u0d4d\u200d",
      "\u0d1c\u0d42\u0d32\u0d48",
      "\u0d13\u0d17",
      "\u0d38\u0d46\u0d2a\u0d4d\u0d31\u0d4d\u0d31\u0d02",
      "\u0d12\u0d15\u0d4d\u0d1f\u0d4b",
      "\u0d28\u0d35\u0d02",
      "\u0d21\u0d3f\u0d38\u0d02"
    ],
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
    "CURRENCY_SYM": "\u20b9",
    "DECIMAL_SEP": ".",
    "GROUP_SEP": ",",
    "PATTERNS": [
      {
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
      {
        "gSize": 2,
        "lgSize": 3,
        "macFrac": 0,
        "maxFrac": 2,
        "minFrac": 2,
        "minInt": 1,
        "negPre": "-",
        "negSuf": "\u00a4",
        "posPre": "",
        "posSuf": "\u00a4"
      }
    ]
  },
  "id": "ml",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);