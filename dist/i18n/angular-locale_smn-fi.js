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
      "pasepeeivi",
      "vuossaarg\u00e2",
      "majebaarg\u00e2",
      "koskoho",
      "tuor\u00e2stuv",
      "v\u00e1stuppeeivi",
      "l\u00e1vurduv"
    ],
    "ERANAMES": [
      "BCE",
      "CE"
    ],
    "ERAS": [
      "BCE",
      "CE"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "M01",
      "M02",
      "M03",
      "M04",
      "M05",
      "M06",
      "M07",
      "M08",
      "M09",
      "M10",
      "M11",
      "M12"
    ],
    "SHORTDAY": [
      "pa",
      "vu",
      "ma",
      "ko",
      "tu",
      "v\u00e1",
      "l\u00e1"
    ],
    "SHORTMONTH": [
      "M01",
      "M02",
      "M03",
      "M04",
      "M05",
      "M06",
      "M07",
      "M08",
      "M09",
      "M10",
      "M11",
      "M12"
    ],
    "STANDALONEMONTH": [
      "u\u0111\u0111\u00e2ivem\u00e1\u00e1nu",
      "kuov\u00e2m\u00e1\u00e1nu",
      "njuh\u010d\u00e2m\u00e1\u00e1nu",
      "cu\u00e1\u014buim\u00e1\u00e1nu",
      "vyesim\u00e1\u00e1nu",
      "kesim\u00e1\u00e1nu",
      "syeinim\u00e1\u00e1nu",
      "porgem\u00e1\u00e1nu",
      "\u010doh\u010d\u00e2m\u00e1\u00e1nu",
      "roovv\u00e2dm\u00e1\u00e1nu",
      "skamm\u00e2m\u00e1\u00e1nu",
      "juovl\u00e2m\u00e1\u00e1nu"
    ],
    "WEEKENDRANGE": [
      5,
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
    "CURRENCY_SYM": "\u20ac",
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
        "negPre": "-\u00a4\u00a0",
        "negSuf": "",
        "posPre": "\u00a4\u00a0",
        "posSuf": ""
      }
    ]
  },
  "id": "smn-fi",
  "localeID": "smn_FI",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
