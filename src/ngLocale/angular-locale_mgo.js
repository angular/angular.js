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
      "AM",
      "PM"
    ],
    "DAY": [
      "Aneg 1",
      "Aneg 2",
      "Aneg 3",
      "Aneg 4",
      "Aneg 5",
      "Aneg 6",
      "Aneg 7"
    ],
    "MONTH": [
      "im\u0259g mbegtug",
      "imeg \u00e0b\u00f9b\u00ec",
      "imeg mb\u0259\u014bchubi",
      "im\u0259g ngw\u0259\u0300t",
      "im\u0259g fog",
      "im\u0259g ichiib\u0254d",
      "im\u0259g \u00e0d\u00f9mb\u0259\u0300\u014b",
      "im\u0259g ichika",
      "im\u0259g kud",
      "im\u0259g t\u00e8si\u02bce",
      "im\u0259g z\u00f2",
      "im\u0259g krizmed"
    ],
    "SHORTDAY": [
      "Aneg 1",
      "Aneg 2",
      "Aneg 3",
      "Aneg 4",
      "Aneg 5",
      "Aneg 6",
      "Aneg 7"
    ],
    "SHORTMONTH": [
      "mbegtug",
      "imeg \u00e0b\u00f9b\u00ec",
      "imeg mb\u0259\u014bchubi",
      "im\u0259g ngw\u0259\u0300t",
      "im\u0259g fog",
      "im\u0259g ichiib\u0254d",
      "im\u0259g \u00e0d\u00f9mb\u0259\u0300\u014b",
      "im\u0259g ichika",
      "im\u0259g kud",
      "im\u0259g t\u00e8si\u02bce",
      "im\u0259g z\u00f2",
      "im\u0259g krizmed"
    ],
    "fullDate": "EEEE, y MMMM dd",
    "longDate": "y MMMM d",
    "medium": "y MMM d HH:mm:ss",
    "mediumDate": "y MMM d",
    "mediumTime": "HH:mm:ss",
    "short": "y-MM-dd HH:mm",
    "shortDate": "y-MM-dd",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "FCFA",
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
        "negPre": "\u00a4\u00a0-",
        "negSuf": "",
        "posPre": "\u00a4\u00a0",
        "posSuf": ""
      }
    ]
  },
  "id": "mgo",
  "pluralCat": function (n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);