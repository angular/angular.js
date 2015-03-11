'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "\u092e.\u092a\u0942.",
      "\u092e.\u0909."
    ],
    "DAY": [
      "\u0930\u0935\u093f\u0935\u093e\u0930",
      "\u0938\u094b\u092e\u0935\u093e\u0930",
      "\u092e\u0902\u0917\u0933\u0935\u093e\u0930",
      "\u092c\u0941\u0927\u0935\u093e\u0930",
      "\u0917\u0941\u0930\u0941\u0935\u093e\u0930",
      "\u0936\u0941\u0915\u094d\u0930\u0935\u093e\u0930",
      "\u0936\u0928\u093f\u0935\u093e\u0930"
    ],
    "ERANAMES": [
      "\u0908\u0938\u0935\u0940\u0938\u0928\u092a\u0942\u0930\u094d\u0935",
      "\u0908\u0938\u0935\u0940\u0938\u0928"
    ],
    "ERAS": [
      "\u0907. \u0938. \u092a\u0942.",
      "\u0907. \u0938."
    ],
    "MONTH": [
      "\u091c\u093e\u0928\u0947\u0935\u093e\u0930\u0940",
      "\u092b\u0947\u092c\u094d\u0930\u0941\u0935\u093e\u0930\u0940",
      "\u092e\u093e\u0930\u094d\u091a",
      "\u090f\u092a\u094d\u0930\u093f\u0932",
      "\u092e\u0947",
      "\u091c\u0942\u0928",
      "\u091c\u0941\u0932\u0948",
      "\u0911\u0917\u0938\u094d\u091f",
      "\u0938\u092a\u094d\u091f\u0947\u0902\u092c\u0930",
      "\u0911\u0915\u094d\u091f\u094b\u092c\u0930",
      "\u0928\u094b\u0935\u094d\u0939\u0947\u0902\u092c\u0930",
      "\u0921\u093f\u0938\u0947\u0902\u092c\u0930"
    ],
    "SHORTDAY": [
      "\u0930\u0935\u093f",
      "\u0938\u094b\u092e",
      "\u092e\u0902\u0917\u0933",
      "\u092c\u0941\u0927",
      "\u0917\u0941\u0930\u0941",
      "\u0936\u0941\u0915\u094d\u0930",
      "\u0936\u0928\u093f"
    ],
    "SHORTMONTH": [
      "\u091c\u093e\u0928\u0947",
      "\u092b\u0947\u092c\u094d\u0930\u0941",
      "\u092e\u093e\u0930\u094d\u091a",
      "\u090f\u092a\u094d\u0930\u093f",
      "\u092e\u0947",
      "\u091c\u0942\u0928",
      "\u091c\u0941\u0932\u0948",
      "\u0911\u0917",
      "\u0938\u092a\u094d\u091f\u0947\u0902",
      "\u0911\u0915\u094d\u091f\u094b",
      "\u0928\u094b\u0935\u094d\u0939\u0947\u0902",
      "\u0921\u093f\u0938\u0947\u0902"
    ],
    "fullDate": "EEEE, d MMMM, y",
    "longDate": "d MMMM, y",
    "medium": "d MMM, y h:mm:ss a",
    "mediumDate": "d MMM, y",
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
  "id": "mr",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  if (i == 0 || n == 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
