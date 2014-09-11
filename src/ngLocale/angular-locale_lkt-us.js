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
      "A\u014bp\u00e9tuwak\u021fa\u014b",
      "A\u014bp\u00e9tuwa\u014b\u017ei",
      "A\u014bp\u00e9tunu\u014bpa",
      "A\u014bp\u00e9tuyamni",
      "A\u014bp\u00e9tutopa",
      "A\u014bp\u00e9tuzapta\u014b",
      "Ow\u00e1\u014bgyu\u017ea\u017eapi"
    ],
    "MONTH": [
      "Wi\u00f3the\u021fika W\u00ed",
      "Thiy\u00f3\u021feyu\u014bka W\u00ed",
      "I\u0161t\u00e1wi\u010dhayaza\u014b W\u00ed",
      "P\u021fe\u017e\u00edt\u021fo W\u00ed",
      "\u010cha\u014bw\u00e1pet\u021fo W\u00ed",
      "W\u00edpazuk\u021fa-wa\u0161t\u00e9 W\u00ed",
      "\u010cha\u014bp\u021f\u00e1sapa W\u00ed",
      "Was\u00fat\u021fu\u014b W\u00ed",
      "\u010cha\u014bw\u00e1pe\u01e7i W\u00ed",
      "\u010cha\u014bw\u00e1pe-kasn\u00e1 W\u00ed",
      "Wan\u00edyetu W\u00ed",
      "T\u021fah\u00e9kap\u0161u\u014b W\u00ed"
    ],
    "SHORTDAY": [
      "A\u014bp\u00e9tuwak\u021fa\u014b",
      "A\u014bp\u00e9tuwa\u014b\u017ei",
      "A\u014bp\u00e9tunu\u014bpa",
      "A\u014bp\u00e9tuyamni",
      "A\u014bp\u00e9tutopa",
      "A\u014bp\u00e9tuzapta\u014b",
      "Ow\u00e1\u014bgyu\u017ea\u017eapi"
    ],
    "SHORTMONTH": [
      "Wi\u00f3the\u021fika W\u00ed",
      "Thiy\u00f3\u021feyu\u014bka W\u00ed",
      "I\u0161t\u00e1wi\u010dhayaza\u014b W\u00ed",
      "P\u021fe\u017e\u00edt\u021fo W\u00ed",
      "\u010cha\u014bw\u00e1pet\u021fo W\u00ed",
      "W\u00edpazuk\u021fa-wa\u0161t\u00e9 W\u00ed",
      "\u010cha\u014bp\u021f\u00e1sapa W\u00ed",
      "Was\u00fat\u021fu\u014b W\u00ed",
      "\u010cha\u014bw\u00e1pe\u01e7i W\u00ed",
      "\u010cha\u014bw\u00e1pe-kasn\u00e1 W\u00ed",
      "Wan\u00edyetu W\u00ed",
      "T\u021fah\u00e9kap\u0161u\u014b W\u00ed"
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
    "CURRENCY_SYM": "$",
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
  "id": "lkt-us",
  "pluralCat": function (n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);