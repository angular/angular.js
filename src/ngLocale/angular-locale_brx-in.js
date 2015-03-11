'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
function getDecimals(n) {
  n = n + '';
  var i = n.indexOf('.');
  return (i == -1) ? 0 : n.length - i - 1;
}

function getVF(n, opt_precision) {
  var v = opt_precision;

  if (undefined === v) {
    v = Math.min(getDecimals(n), 3);
  }

  var base = Math.pow(10, v);
  var f = ((n * base) | 0) % base;
  return {v: v, f: f};
}

$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "\u092b\u0941\u0902",
      "\u092c\u0947\u0932\u093e\u0938\u0947"
    ],
    "DAY": [
      "\u0930\u092c\u093f\u092c\u093e\u0930",
      "\u0938\u092e\u092c\u093e\u0930",
      "\u092e\u0902\u0917\u0932\u092c\u093e\u0930",
      "\u092c\u0941\u0926\u092c\u093e\u0930",
      "\u092c\u093f\u0938\u0925\u093f\u092c\u093e\u0930",
      "\u0938\u0941\u0916\u0941\u0930\u092c\u093e\u0930",
      "\u0938\u0941\u0928\u093f\u092c\u093e\u0930"
    ],
    "ERANAMES": [
      "\u0908\u0938\u093e.\u092a\u0942\u0930\u094d\u0935",
      "\u0938\u0928"
    ],
    "ERAS": [
      "\u0908\u0938\u093e.\u092a\u0942\u0930\u094d\u0935",
      "\u0938\u0928"
    ],
    "MONTH": [
      "\u091c\u093e\u0928\u0941\u0935\u093e\u0930\u0940",
      "\u092b\u0947\u092c\u094d\u0930\u0941\u0935\u093e\u0930\u0940",
      "\u092e\u093e\u0930\u094d\u0938",
      "\u090f\u092b\u094d\u0930\u093f\u0932",
      "\u092e\u0947",
      "\u091c\u0941\u0928",
      "\u091c\u0941\u0932\u093e\u0907",
      "\u0906\u0917\u0938\u094d\u0925",
      "\u0938\u0947\u092c\u0925\u0947\u091c\u094d\u092c\u093c\u0930",
      "\u0905\u0916\u0925\u092c\u0930",
      "\u0928\u092c\u0947\u091c\u094d\u092c\u093c\u0930",
      "\u0926\u093f\u0938\u0947\u091c\u094d\u092c\u093c\u0930"
    ],
    "SHORTDAY": [
      "\u0930\u092c\u093f",
      "\u0938\u092e",
      "\u092e\u0902\u0917\u0932",
      "\u092c\u0941\u0926",
      "\u092c\u093f\u0938\u0925\u093f",
      "\u0938\u0941\u0916\u0941\u0930",
      "\u0938\u0941\u0928\u093f"
    ],
    "SHORTMONTH": [
      "\u091c\u093e\u0928\u0941\u0935\u093e\u0930\u0940",
      "\u092b\u0947\u092c\u094d\u0930\u0941\u0935\u093e\u0930\u0940",
      "\u092e\u093e\u0930\u094d\u0938",
      "\u090f\u092b\u094d\u0930\u093f\u0932",
      "\u092e\u0947",
      "\u091c\u0941\u0928",
      "\u091c\u0941\u0932\u093e\u0907",
      "\u0906\u0917\u0938\u094d\u0925",
      "\u0938\u0947\u092c\u0925\u0947\u091c\u094d\u092c\u093c\u0930",
      "\u0905\u0916\u0925\u092c\u0930",
      "\u0928\u092c\u0947\u091c\u094d\u092c\u093c\u0930",
      "\u0926\u093f\u0938\u0947\u091c\u094d\u092c\u093c\u0930"
    ],
    "fullDate": "EEEE, MMMM d, y",
    "longDate": "MMMM d, y",
    "medium": "MMM d, y h:mm:ss a",
    "mediumDate": "MMM d, y",
    "mediumTime": "h:mm:ss a",
    "short": "M/d/yy h:mm a",
    "shortDate": "M/d/yy",
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
        "negPre": "\u00a4\u00a0-",
        "negSuf": "",
        "posPre": "\u00a4\u00a0",
        "posSuf": ""
      }
    ]
  },
  "id": "brx-in",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
