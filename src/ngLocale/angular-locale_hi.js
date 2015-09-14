'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "am",
      "pm"
    ],
    "DAY": [
      "\u0930\u0935\u093f\u0935\u093e\u0930",
      "\u0938\u094b\u092e\u0935\u093e\u0930",
      "\u092e\u0902\u0917\u0932\u0935\u093e\u0930",
      "\u092c\u0941\u0927\u0935\u093e\u0930",
      "\u0917\u0941\u0930\u0941\u0935\u093e\u0930",
      "\u0936\u0941\u0915\u094d\u0930\u0935\u093e\u0930",
      "\u0936\u0928\u093f\u0935\u093e\u0930"
    ],
    "ERANAMES": [
      "\u0908\u0938\u093e-\u092a\u0942\u0930\u094d\u0935",
      "\u0908\u0938\u0935\u0940 \u0938\u0928"
    ],
    "ERAS": [
      "\u0908\u0938\u093e-\u092a\u0942\u0930\u094d\u0935",
      "\u0908\u0938\u094d\u0935\u0940"
    ],
    "FIRSTDAYOFWEEK": 6,
    "MONTH": [
      "\u091c\u0928\u0935\u0930\u0940",
      "\u092b\u093c\u0930\u0935\u0930\u0940",
      "\u092e\u093e\u0930\u094d\u091a",
      "\u0905\u092a\u094d\u0930\u0948\u0932",
      "\u092e\u0908",
      "\u091c\u0942\u0928",
      "\u091c\u0941\u0932\u093e\u0908",
      "\u0905\u0917\u0938\u094d\u0924",
      "\u0938\u093f\u0924\u0902\u092c\u0930",
      "\u0905\u0915\u094d\u0924\u0942\u092c\u0930",
      "\u0928\u0935\u0902\u092c\u0930",
      "\u0926\u093f\u0938\u0902\u092c\u0930"
    ],
    "SHORTDAY": [
      "\u0930\u0935\u093f",
      "\u0938\u094b\u092e",
      "\u092e\u0902\u0917\u0932",
      "\u092c\u0941\u0927",
      "\u0917\u0941\u0930\u0941",
      "\u0936\u0941\u0915\u094d\u0930",
      "\u0936\u0928\u093f"
    ],
    "SHORTMONTH": [
      "\u091c\u0928\u0970",
      "\u092b\u093c\u0930\u0970",
      "\u092e\u093e\u0930\u094d\u091a",
      "\u0905\u092a\u094d\u0930\u0948\u0932",
      "\u092e\u0908",
      "\u091c\u0942\u0928",
      "\u091c\u0941\u0932\u0970",
      "\u0905\u0917\u0970",
      "\u0938\u093f\u0924\u0970",
      "\u0905\u0915\u094d\u0924\u0942\u0970",
      "\u0928\u0935\u0970",
      "\u0926\u093f\u0938\u0970"
    ],
    "STANDALONEMONTH": [
      "\u091c\u0928\u0935\u0930\u0940",
      "\u092b\u093c\u0930\u0935\u0930\u0940",
      "\u092e\u093e\u0930\u094d\u091a",
      "\u0905\u092a\u094d\u0930\u0948\u0932",
      "\u092e\u0908",
      "\u091c\u0942\u0928",
      "\u091c\u0941\u0932\u093e\u0908",
      "\u0905\u0917\u0938\u094d\u0924",
      "\u0938\u093f\u0924\u0902\u092c\u0930",
      "\u0905\u0915\u094d\u0924\u0942\u092c\u0930",
      "\u0928\u0935\u0902\u092c\u0930",
      "\u0926\u093f\u0938\u0902\u092c\u0930"
    ],
    "WEEKENDRANGE": [
      6,
      6
    ],
    "fullDate": "EEEE, d MMMM y",
    "longDate": "d MMMM y",
    "medium": "dd/MM/y h:mm:ss a",
    "mediumDate": "dd/MM/y",
    "mediumTime": "h:mm:ss a",
    "short": "d/M/yy h:mm a",
    "shortDate": "d/M/yy",
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
        "maxFrac": 2,
        "minFrac": 2,
        "minInt": 1,
        "negPre": "-\u00a4",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "hi",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  if (i == 0 || n == 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
