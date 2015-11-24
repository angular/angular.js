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
      "\u0db4\u0dd9.\u0dc0.",
      "\u0db4.\u0dc0."
    ],
    "DAY": [
      "\u0d89\u0dbb\u0dd2\u0daf\u0dcf",
      "\u0dc3\u0db3\u0dd4\u0daf\u0dcf",
      "\u0d85\u0d9f\u0dc4\u0dbb\u0dd4\u0dc0\u0dcf\u0daf\u0dcf",
      "\u0db6\u0daf\u0dcf\u0daf\u0dcf",
      "\u0db6\u0dca\u200d\u0dbb\u0dc4\u0dc3\u0dca\u0db4\u0dad\u0dd2\u0db1\u0dca\u0daf\u0dcf",
      "\u0dc3\u0dd2\u0d9a\u0dd4\u0dbb\u0dcf\u0daf\u0dcf",
      "\u0dc3\u0dd9\u0db1\u0dc3\u0dd4\u0dbb\u0dcf\u0daf\u0dcf"
    ],
    "ERANAMES": [
      "\u0d9a\u0dca\u200d\u0dbb\u0dd2\u0dc3\u0dca\u0dad\u0dd4 \u0db4\u0dd6\u0dbb\u0dca\u200d\u0dc0",
      "\u0d9a\u0dca\u200d\u0dbb\u0dd2\u0dc3\u0dca\u0dad\u0dd4 \u0dc0\u0dbb\u0dca\u200d\u0dc2"
    ],
    "ERAS": [
      "\u0d9a\u0dca\u200d\u0dbb\u0dd2.\u0db4\u0dd6.",
      "\u0d9a\u0dca\u200d\u0dbb\u0dd2.\u0dc0."
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "\u0da2\u0db1\u0dc0\u0dcf\u0dbb\u0dd2",
      "\u0db4\u0dd9\u0db6\u0dbb\u0dc0\u0dcf\u0dbb\u0dd2",
      "\u0db8\u0dcf\u0dbb\u0dca\u0dad\u0dd4",
      "\u0d85\u0db4\u0dca\u200d\u0dbb\u0dda\u0dbd\u0dca",
      "\u0db8\u0dd0\u0dba\u0dd2",
      "\u0da2\u0dd6\u0db1\u0dd2",
      "\u0da2\u0dd6\u0dbd\u0dd2",
      "\u0d85\u0d9c\u0ddd\u0dc3\u0dca\u0dad\u0dd4",
      "\u0dc3\u0dd0\u0db4\u0dca\u0dad\u0dd0\u0db8\u0dca\u0db6\u0dbb\u0dca",
      "\u0d94\u0d9a\u0dca\u0dad\u0ddd\u0db6\u0dbb\u0dca",
      "\u0db1\u0ddc\u0dc0\u0dd0\u0db8\u0dca\u0db6\u0dbb\u0dca",
      "\u0daf\u0dd9\u0dc3\u0dd0\u0db8\u0dca\u0db6\u0dbb\u0dca"
    ],
    "SHORTDAY": [
      "\u0d89\u0dbb\u0dd2\u0daf\u0dcf",
      "\u0dc3\u0db3\u0dd4\u0daf\u0dcf",
      "\u0d85\u0d9f\u0dc4",
      "\u0db6\u0daf\u0dcf\u0daf\u0dcf",
      "\u0db6\u0dca\u200d\u0dbb\u0dc4\u0dc3\u0dca",
      "\u0dc3\u0dd2\u0d9a\u0dd4",
      "\u0dc3\u0dd9\u0db1"
    ],
    "SHORTMONTH": [
      "\u0da2\u0db1",
      "\u0db4\u0dd9\u0db6",
      "\u0db8\u0dcf\u0dbb\u0dca\u0dad\u0dd4",
      "\u0d85\u0db4\u0dca\u200d\u0dbb\u0dda\u0dbd\u0dca",
      "\u0db8\u0dd0\u0dba\u0dd2",
      "\u0da2\u0dd6\u0db1\u0dd2",
      "\u0da2\u0dd6\u0dbd\u0dd2",
      "\u0d85\u0d9c\u0ddd",
      "\u0dc3\u0dd0\u0db4\u0dca",
      "\u0d94\u0d9a\u0dca",
      "\u0db1\u0ddc\u0dc0\u0dd0",
      "\u0daf\u0dd9\u0dc3\u0dd0"
    ],
    "STANDALONEMONTH": [
      "\u0da2\u0db1\u0dc0\u0dcf\u0dbb\u0dd2",
      "\u0db4\u0dd9\u0db6\u0dbb\u0dc0\u0dcf\u0dbb\u0dd2",
      "\u0db8\u0dcf\u0dbb\u0dca\u0dad\u0dd4",
      "\u0d85\u0db4\u0dca\u200d\u0dbb\u0dda\u0dbd\u0dca",
      "\u0db8\u0dd0\u0dba\u0dd2",
      "\u0da2\u0dd6\u0db1\u0dd2",
      "\u0da2\u0dd6\u0dbd\u0dd2",
      "\u0d85\u0d9c\u0ddd\u0dc3\u0dca\u0dad\u0dd4",
      "\u0dc3\u0dd0\u0db4\u0dca\u0dad\u0dd0\u0db8\u0dca\u0db6\u0dbb\u0dca",
      "\u0d94\u0d9a\u0dca\u0dad\u0ddd\u0db6\u0dbb\u0dca",
      "\u0db1\u0ddc\u0dc0\u0dd0\u0db8\u0dca\u0db6\u0dbb\u0dca",
      "\u0daf\u0dd9\u0dc3\u0dd0\u0db8\u0dca\u0db6\u0dbb\u0dca"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "y MMMM d, EEEE",
    "longDate": "y MMMM d",
    "medium": "y MMM d a h.mm.ss",
    "mediumDate": "y MMM d",
    "mediumTime": "a h.mm.ss",
    "short": "y-MM-dd a h.mm",
    "shortDate": "y-MM-dd",
    "shortTime": "a h.mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "Rs",
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
        "negPre": "-\u00a4",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "si-lk",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if ((n == 0 || n == 1) || i == 0 && vf.f == 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
