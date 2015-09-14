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
      "\ua55e\ua54c\ua535",
      "\ua5f3\ua5e1\ua609",
      "\ua55a\ua55e\ua55a",
      "\ua549\ua55e\ua552",
      "\ua549\ua524\ua546\ua562",
      "\ua549\ua524\ua540\ua56e",
      "\ua53b\ua52c\ua533"
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
      "\ua5a8\ua56a\ua583 \ua51e\ua56e",
      "\ua552\ua561\ua59d\ua595",
      "\ua57e\ua5ba",
      "\ua5a2\ua595",
      "\ua591\ua571",
      "6",
      "7",
      "\ua5db\ua515",
      "\ua562\ua54c",
      "\ua56d\ua583",
      "\ua51e\ua60b\ua554\ua57f \ua578\ua583\ua5cf",
      "\ua5a8\ua56a\ua571 \ua5cf\ua56e"
    ],
    "SHORTDAY": [
      "\ua55e\ua54c\ua535",
      "\ua5f3\ua5e1\ua609",
      "\ua55a\ua55e\ua55a",
      "\ua549\ua55e\ua552",
      "\ua549\ua524\ua546\ua562",
      "\ua549\ua524\ua540\ua56e",
      "\ua53b\ua52c\ua533"
    ],
    "SHORTMONTH": [
      "\ua5a8\ua56a\ua583 \ua51e\ua56e",
      "\ua552\ua561\ua59d\ua595",
      "\ua57e\ua5ba",
      "\ua5a2\ua595",
      "\ua591\ua571",
      "6",
      "7",
      "\ua5db\ua515",
      "\ua562\ua54c",
      "\ua56d\ua583",
      "\ua51e\ua60b\ua554\ua57f \ua578\ua583\ua5cf",
      "\ua5a8\ua56a\ua571 \ua5cf\ua56e"
    ],
    "STANDALONEMONTH": [
      "\ua5a8\ua56a\ua583 \ua51e\ua56e",
      "\ua552\ua561\ua59d\ua595",
      "\ua57e\ua5ba",
      "\ua5a2\ua595",
      "\ua591\ua571",
      "6",
      "7",
      "\ua5db\ua515",
      "\ua562\ua54c",
      "\ua56d\ua583",
      "\ua51e\ua60b\ua554\ua57f \ua578\ua583\ua5cf",
      "\ua5a8\ua56a\ua571 \ua5cf\ua56e"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y h:mm:ss a",
    "mediumDate": "d MMM y",
    "mediumTime": "h:mm:ss a",
    "short": "dd/MM/y h:mm a",
    "shortDate": "dd/MM/y",
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
        "negPre": "-\u00a4",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "vai-vaii",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
