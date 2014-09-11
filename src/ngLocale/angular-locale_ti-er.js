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
      "\u1295\u1309\u1206 \u1230\u12d3\u1270",
      "\u12f5\u1215\u122d \u1230\u12d3\u1275"
    ],
    "DAY": [
      "\u1230\u1295\u1260\u1275",
      "\u1230\u1291\u12ed",
      "\u1230\u1209\u1235",
      "\u1228\u1261\u12d5",
      "\u1213\u1219\u1235",
      "\u12d3\u122d\u1262",
      "\u1240\u12f3\u121d"
    ],
    "MONTH": [
      "\u1325\u122a",
      "\u1208\u12ab\u1272\u1275",
      "\u1218\u130b\u1262\u1275",
      "\u121a\u12eb\u12dd\u12eb",
      "\u130d\u1295\u1266\u1275",
      "\u1230\u1290",
      "\u1213\u121d\u1208",
      "\u1290\u1213\u1230",
      "\u1218\u1235\u12a8\u1228\u121d",
      "\u1325\u1245\u121d\u1272",
      "\u1215\u12f3\u122d",
      "\u1273\u1215\u1233\u1235"
    ],
    "SHORTDAY": [
      "\u1230\u1295\u1260\u1275",
      "\u1230\u1291\u12ed",
      "\u1230\u1209\u1235",
      "\u1228\u1261\u12d5",
      "\u1213\u1219\u1235",
      "\u12d3\u122d\u1262",
      "\u1240\u12f3\u121d"
    ],
    "SHORTMONTH": [
      "\u1325\u122a",
      "\u1208\u12ab\u1272",
      "\u1218\u130b\u1262",
      "\u121a\u12eb\u12dd",
      "\u130d\u1295\u1266",
      "\u1230\u1290",
      "\u1213\u121d\u1208",
      "\u1290\u1213\u1230",
      "\u1218\u1235\u12a8",
      "\u1325\u1245\u121d",
      "\u1215\u12f3\u122d",
      "\u1273\u1215\u1233"
    ],
    "fullDate": "EEEE\u1361 dd MMMM \u1218\u12d3\u120d\u1272 y G",
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
  "id": "ti-er",
  "pluralCat": function (n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);