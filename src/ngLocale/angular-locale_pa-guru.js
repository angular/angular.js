'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "\u0a2a\u0a42.\u0a26\u0a41.",
      "\u0a2c\u0a3e.\u0a26\u0a41."
    ],
    "DAY": [
      "\u0a10\u0a24\u0a35\u0a3e\u0a30",
      "\u0a38\u0a4b\u0a2e\u0a35\u0a3e\u0a30",
      "\u0a2e\u0a70\u0a17\u0a32\u0a35\u0a3e\u0a30",
      "\u0a2c\u0a41\u0a71\u0a27\u0a35\u0a3e\u0a30",
      "\u0a35\u0a40\u0a30\u0a35\u0a3e\u0a30",
      "\u0a38\u0a3c\u0a41\u0a71\u0a15\u0a30\u0a35\u0a3e\u0a30",
      "\u0a38\u0a3c\u0a28\u0a3f\u0a71\u0a1a\u0a30\u0a35\u0a3e\u0a30"
    ],
    "ERANAMES": [
      "\u0a08\u0a38\u0a35\u0a40 \u0a2a\u0a42\u0a30\u0a35",
      "\u0a08\u0a38\u0a35\u0a40 \u0a38\u0a70\u0a28"
    ],
    "ERAS": [
      "\u0a08. \u0a2a\u0a42.",
      "\u0a38\u0a70\u0a28"
    ],
    "FIRSTDAYOFWEEK": 6,
    "MONTH": [
      "\u0a1c\u0a28\u0a35\u0a30\u0a40",
      "\u0a2b\u0a3c\u0a30\u0a35\u0a30\u0a40",
      "\u0a2e\u0a3e\u0a30\u0a1a",
      "\u0a05\u0a2a\u0a4d\u0a30\u0a48\u0a32",
      "\u0a2e\u0a08",
      "\u0a1c\u0a42\u0a28",
      "\u0a1c\u0a41\u0a32\u0a3e\u0a08",
      "\u0a05\u0a17\u0a38\u0a24",
      "\u0a38\u0a24\u0a70\u0a2c\u0a30",
      "\u0a05\u0a15\u0a24\u0a42\u0a2c\u0a30",
      "\u0a28\u0a35\u0a70\u0a2c\u0a30",
      "\u0a26\u0a38\u0a70\u0a2c\u0a30"
    ],
    "SHORTDAY": [
      "\u0a10\u0a24",
      "\u0a38\u0a4b\u0a2e",
      "\u0a2e\u0a70\u0a17\u0a32",
      "\u0a2c\u0a41\u0a71\u0a27",
      "\u0a35\u0a40\u0a30",
      "\u0a38\u0a3c\u0a41\u0a71\u0a15\u0a30",
      "\u0a38\u0a3c\u0a28\u0a3f\u0a71\u0a1a\u0a30"
    ],
    "SHORTMONTH": [
      "\u0a1c\u0a28",
      "\u0a2b\u0a3c\u0a30",
      "\u0a2e\u0a3e\u0a30\u0a1a",
      "\u0a05\u0a2a\u0a4d\u0a30\u0a48",
      "\u0a2e\u0a08",
      "\u0a1c\u0a42\u0a28",
      "\u0a1c\u0a41\u0a32\u0a3e",
      "\u0a05\u0a17",
      "\u0a38\u0a24\u0a70",
      "\u0a05\u0a15\u0a24\u0a42",
      "\u0a28\u0a35\u0a70",
      "\u0a26\u0a38\u0a70"
    ],
    "STANDALONEMONTH": [
      "\u0a1c\u0a28\u0a35\u0a30\u0a40",
      "\u0a2b\u0a3c\u0a30\u0a35\u0a30\u0a40",
      "\u0a2e\u0a3e\u0a30\u0a1a",
      "\u0a05\u0a2a\u0a4d\u0a30\u0a48\u0a32",
      "\u0a2e\u0a08",
      "\u0a1c\u0a42\u0a28",
      "\u0a1c\u0a41\u0a32\u0a3e\u0a08",
      "\u0a05\u0a17\u0a38\u0a24",
      "\u0a38\u0a24\u0a70\u0a2c\u0a30",
      "\u0a05\u0a15\u0a24\u0a42\u0a2c\u0a30",
      "\u0a28\u0a35\u0a70\u0a2c\u0a30",
      "\u0a26\u0a38\u0a70\u0a2c\u0a30"
    ],
    "WEEKENDRANGE": [
      6,
      6
    ],
    "fullDate": "EEEE, d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y h:mm:ss a",
    "mediumDate": "d MMM y",
    "mediumTime": "h:mm:ss a",
    "short": "d/M/yy h:mm a",
    "shortDate": "d/M/yy",
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
        "negPre": "-\u00a4",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "pa-guru",
  "localeID": "pa_Guru",
  "pluralCat": function(n, opt_precision) {  if (n >= 0 && n <= 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
