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
      "mba\u02bc\u00e1mba\u02bc",
      "ncw\u00f2nz\u00e9m"
    ],
    "DAY": [
      "ly\u025b\u02bc\u025b\u0301 s\u1e85\u00ed\u014bt\u00e8",
      "mvf\u00f2 ly\u025b\u030c\u02bc",
      "mb\u0254\u0301\u0254nt\u00e8 mvf\u00f2 ly\u025b\u030c\u02bc",
      "ts\u00e8ts\u025b\u0300\u025b ly\u025b\u030c\u02bc",
      "mb\u0254\u0301\u0254nt\u00e8 tsets\u025b\u0300\u025b ly\u025b\u030c\u02bc",
      "mvf\u00f2 m\u00e0ga ly\u025b\u030c\u02bc",
      "m\u00e0ga ly\u025b\u030c\u02bc"
    ],
    "ERANAMES": [
      "m\u00e9 zy\u00e9 Y\u011bs\u00f4",
      "m\u00e9 g\u00ffo \u0144zy\u00e9 Y\u011bs\u00f4"
    ],
    "ERAS": [
      "m.z.Y.",
      "m.g.n.Y."
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "sa\u014b tsets\u025b\u0300\u025b l\u00f9m",
      "sa\u014b k\u00e0g ngw\u00f3\u014b",
      "sa\u014b lepy\u00e8 sh\u00fam",
      "sa\u014b c\u00ff\u00f3",
      "sa\u014b ts\u025b\u0300\u025b c\u00ff\u00f3",
      "sa\u014b nj\u00ffol\u00e1\u02bc",
      "sa\u014b ty\u025b\u0300b ty\u025b\u0300b mb\u0289\u0300",
      "sa\u014b mb\u0289\u0300\u014b",
      "sa\u014b ngw\u0254\u0300\u02bc mb\u00ff\u025b",
      "sa\u014b t\u00e0\u014ba tsets\u00e1\u02bc",
      "sa\u014b mejwo\u014b\u00f3",
      "sa\u014b l\u00f9m"
    ],
    "SHORTDAY": [
      "ly\u025b\u02bc\u025b\u0301 s\u1e85\u00ed\u014bt\u00e8",
      "mvf\u00f2 ly\u025b\u030c\u02bc",
      "mb\u0254\u0301\u0254nt\u00e8 mvf\u00f2 ly\u025b\u030c\u02bc",
      "ts\u00e8ts\u025b\u0300\u025b ly\u025b\u030c\u02bc",
      "mb\u0254\u0301\u0254nt\u00e8 tsets\u025b\u0300\u025b ly\u025b\u030c\u02bc",
      "mvf\u00f2 m\u00e0ga ly\u025b\u030c\u02bc",
      "m\u00e0ga ly\u025b\u030c\u02bc"
    ],
    "SHORTMONTH": [
      "sa\u014b tsets\u025b\u0300\u025b l\u00f9m",
      "sa\u014b k\u00e0g ngw\u00f3\u014b",
      "sa\u014b lepy\u00e8 sh\u00fam",
      "sa\u014b c\u00ff\u00f3",
      "sa\u014b ts\u025b\u0300\u025b c\u00ff\u00f3",
      "sa\u014b nj\u00ffol\u00e1\u02bc",
      "sa\u014b ty\u025b\u0300b ty\u025b\u0300b mb\u0289\u0300",
      "sa\u014b mb\u0289\u0300\u014b",
      "sa\u014b ngw\u0254\u0300\u02bc mb\u00ff\u025b",
      "sa\u014b t\u00e0\u014ba tsets\u00e1\u02bc",
      "sa\u014b mejwo\u014b\u00f3",
      "sa\u014b l\u00f9m"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE , 'ly\u025b'\u030c\u02bc d 'na' MMMM, y",
    "longDate": "'ly\u025b'\u030c\u02bc d 'na' MMMM, y",
    "medium": "d MMM, y HH:mm:ss",
    "mediumDate": "d MMM, y",
    "mediumTime": "HH:mm:ss",
    "short": "dd/MM/yy HH:mm",
    "shortDate": "dd/MM/yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "FCFA",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": ".",
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
        "negPre": "-\u00a4\u00a0",
        "negSuf": "",
        "posPre": "\u00a4\u00a0",
        "posSuf": ""
      }
    ]
  },
  "id": "nnh",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
