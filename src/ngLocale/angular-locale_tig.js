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
      "\u1240\u12f0\u121d \u1230\u122d\u121d\u12d5\u120d",
      "\u1213\u1246 \u1235\u122d\u121d\u12d5\u120d"
    ],
    "DAY": [
      "\u1230\u1295\u1260\u1275 \u12d3\u1263\u12ed",
      "\u1230\u1296",
      "\u1273\u120b\u1238\u1296",
      "\u12a3\u1228\u122d\u1263\u12d3",
      "\u12a8\u121a\u123d",
      "\u1305\u121d\u12d3\u1275",
      "\u1230\u1295\u1260\u1275 \u1295\u12a2\u123d"
    ],
    "MONTH": [
      "\u1303\u1295\u12e9\u12c8\u122a",
      "\u134c\u1265\u1229\u12c8\u122a",
      "\u121b\u122d\u127d",
      "\u12a4\u1355\u1228\u120d",
      "\u121c\u12ed",
      "\u1301\u1295",
      "\u1301\u120b\u12ed",
      "\u12a6\u1308\u1235\u1275",
      "\u1234\u1355\u1274\u121d\u1260\u122d",
      "\u12a6\u12ad\u1270\u12cd\u1260\u122d",
      "\u1296\u126c\u121d\u1260\u122d",
      "\u12f2\u1234\u121d\u1260\u122d"
    ],
    "SHORTDAY": [
      "\u1230/\u12d3",
      "\u1230\u1296",
      "\u1273\u120b\u1238",
      "\u12a3\u1228\u122d",
      "\u12a8\u121a\u123d",
      "\u1305\u121d\u12d3",
      "\u1230/\u1295"
    ],
    "SHORTMONTH": [
      "\u1303\u1295\u12e9",
      "\u134c\u1265\u1229",
      "\u121b\u122d\u127d",
      "\u12a4\u1355\u1228",
      "\u121c\u12ed",
      "\u1301\u1295",
      "\u1301\u120b\u12ed",
      "\u12a6\u1308\u1235",
      "\u1234\u1355\u1274",
      "\u12a6\u12ad\u1270",
      "\u1296\u126c\u121d",
      "\u12f2\u1234\u121d"
    ],
    "fullDate": "EEEE\u1361 dd MMMM \u12ee\u121d y G",
    "longDate": "dd MMMM y",
    "medium": "dd-MMM-y h:mm:ss a",
    "mediumDate": "dd-MMM-y",
    "mediumTime": "h:mm:ss a",
    "short": "dd/MM/yy h:mm a",
    "shortDate": "dd/MM/yy",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "Nfk",
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
        "negPre": "\u00a4-",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "tig",
  "pluralCat": function (n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);