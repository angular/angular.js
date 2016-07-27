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
      "\u134b\u12f1\u1235 \u1303\u1265",
      "\u134b\u12f1\u1235 \u12f0\u121d\u1262"
    ],
    "DAY": [
      "\u1230\u1295\u1260\u122d \u1245\u12f3\u12c5",
      "\u1230\u1291",
      "\u1230\u120a\u131d",
      "\u1208\u1313 \u12c8\u122a \u1208\u1265\u12cb",
      "\u12a3\u121d\u12f5",
      "\u12a3\u122d\u1265",
      "\u1230\u1295\u1260\u122d \u123d\u1313\u12c5"
    ],
    "MONTH": [
      "\u120d\u12f0\u1275\u122a",
      "\u12ab\u1265\u12bd\u1265\u1272",
      "\u12ad\u1265\u120b",
      "\u134b\u1305\u12ba\u122a",
      "\u12ad\u1262\u1245\u122a",
      "\u121d\u12aa\u12a4\u120d \u1275\u131f\u1292\u122a",
      "\u12b0\u122d\u12a9",
      "\u121b\u122d\u12eb\u121d \u1275\u122a",
      "\u12eb\u12b8\u1292 \u1218\u1233\u1245\u1208\u122a",
      "\u1218\u1270\u1209",
      "\u121d\u12aa\u12a4\u120d \u1218\u123d\u12c8\u122a",
      "\u1270\u1215\u1233\u1235\u122a"
    ],
    "SHORTDAY": [
      "\u1230/\u1245",
      "\u1230\u1291",
      "\u1230\u120a\u131d",
      "\u1208\u1313",
      "\u12a3\u121d\u12f5",
      "\u12a3\u122d\u1265",
      "\u1230/\u123d"
    ],
    "SHORTMONTH": [
      "\u120d\u12f0\u1275",
      "\u12ab\u1265\u12bd",
      "\u12ad\u1265\u120b",
      "\u134b\u1305\u12ba",
      "\u12ad\u1262\u1245",
      "\u121d/\u1275",
      "\u12b0\u122d",
      "\u121b\u122d\u12eb",
      "\u12eb\u12b8\u1292",
      "\u1218\u1270\u1209",
      "\u121d/\u121d",
      "\u1270\u1215\u1233"
    ],
    "fullDate": "EEEE\u1361 dd MMMM \u130d\u122d\u130b y G",
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
  "id": "byn-er",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
