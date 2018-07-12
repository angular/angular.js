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
      "\u092e.\u092a\u0942.",
      "\u092e.\u0928\u0902."
    ],
    "DAY": [
      "\u0906\u0926\u093f\u0924\u094d\u092f\u0935\u093e\u0930",
      "\u0938\u094b\u092e\u0935\u093e\u0930",
      "\u092e\u0902\u0917\u0933\u093e\u0930",
      "\u092c\u0941\u0927\u0935\u093e\u0930",
      "\u0917\u0941\u0930\u0941\u0935\u093e\u0930",
      "\u0936\u0941\u0915\u094d\u0930\u0935\u093e\u0930",
      "\u0936\u0928\u093f\u0935\u093e\u0930"
    ],
    "ERANAMES": [
      "\u0915\u094d\u0930\u093f\u0938\u094d\u0924\u092a\u0942\u0930\u094d\u0935",
      "\u0915\u094d\u0930\u093f\u0938\u094d\u0924\u0936\u0916\u093e"
    ],
    "ERAS": [
      "\u0915\u094d\u0930\u093f\u0938\u094d\u0924\u092a\u0942\u0930\u094d\u0935",
      "\u0915\u094d\u0930\u093f\u0938\u094d\u0924\u0936\u0916\u093e"
    ],
    "FIRSTDAYOFWEEK": 6,
    "MONTH": [
      "\u091c\u093e\u0928\u0947\u0935\u093e\u0930\u0940",
      "\u092b\u0947\u092c\u094d\u0930\u0941\u0935\u093e\u0930\u0940",
      "\u092e\u093e\u0930\u094d\u091a",
      "\u090f\u092a\u094d\u0930\u093f\u0932",
      "\u092e\u0947",
      "\u091c\u0942\u0928",
      "\u091c\u0941\u0932\u0948",
      "\u0913\u0917\u0938\u094d\u091f",
      "\u0938\u0947\u092a\u094d\u091f\u0947\u0902\u092c\u0930",
      "\u0913\u0915\u094d\u091f\u094b\u092c\u0930",
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
      "\u091c\u093e\u0928\u0947\u0935\u093e\u0930\u0940",
      "\u092b\u0947\u092c\u094d\u0930\u0941\u0935\u093e\u0930\u0940",
      "\u092e\u093e\u0930\u094d\u091a",
      "\u090f\u092a\u094d\u0930\u093f\u0932",
      "\u092e\u0947",
      "\u091c\u0942\u0928",
      "\u091c\u0941\u0932\u0948",
      "\u0913\u0917\u0938\u094d\u091f",
      "\u0938\u0947\u092a\u094d\u091f\u0947\u0902\u092c\u0930",
      "\u0913\u0915\u094d\u091f\u094b\u092c\u0930",
      "\u0928\u094b\u0935\u094d\u0939\u0947\u0902\u092c\u0930",
      "\u0921\u093f\u0938\u0947\u0902\u092c\u0930"
    ],
    "STANDALONEMONTH": [
      "\u091c\u093e\u0928\u0947\u0935\u093e\u0930\u0940",
      "\u092b\u0947\u092c\u094d\u0930\u0941\u0935\u093e\u0930\u0940",
      "\u092e\u093e\u0930\u094d\u091a",
      "\u090f\u092a\u094d\u0930\u093f\u0932",
      "\u092e\u0947",
      "\u091c\u0942\u0928",
      "\u091c\u0941\u0932\u0948",
      "\u0913\u0917\u0938\u094d\u091f",
      "\u0938\u0947\u092a\u094d\u091f\u0947\u0902\u092c\u0930",
      "\u0913\u0915\u094d\u091f\u094b\u092c\u0930",
      "\u0928\u094b\u0935\u094d\u0939\u0947\u0902\u092c\u0930",
      "\u0921\u093f\u0938\u0947\u0902\u092c\u0930"
    ],
    "WEEKENDRANGE": [
      6,
      6
    ],
    "fullDate": "y MMMM d, EEEE",
    "longDate": "y MMMM d",
    "medium": "y MMM d HH:mm:ss",
    "mediumDate": "y MMM d",
    "mediumTime": "HH:mm:ss",
    "short": "y-MM-dd HH:mm",
    "shortDate": "y-MM-dd",
    "shortTime": "HH:mm"
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
        "negPre": "-\u00a4\u00a0",
        "negSuf": "",
        "posPre": "\u00a4\u00a0",
        "posSuf": ""
      }
    ]
  },
  "id": "kok-in",
  "localeID": "kok_IN",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
