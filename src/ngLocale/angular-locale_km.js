'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "\u1796\u17d2\u179a\u17b9\u1780",
      "\u179b\u17d2\u1784\u17b6\u1785"
    ],
    "DAY": [
      "\u17a2\u17b6\u1791\u17b7\u178f\u17d2\u1799",
      "\u1785\u17d0\u1793\u17d2\u1791",
      "\u17a2\u1784\u17d2\u1782\u17b6\u179a",
      "\u1796\u17bb\u1792",
      "\u1796\u17d2\u179a\u17a0\u179f\u17d2\u1794\u178f\u17b7\u17cd",
      "\u179f\u17bb\u1780\u17d2\u179a",
      "\u179f\u17c5\u179a\u17cd"
    ],
    "ERANAMES": [
      "\u1798\u17bb\u1793\u200b\u1782\u17d2\u179a\u17b7\u179f\u17d2\u178f\u179f\u1780\u179a\u17b6\u1787",
      "\u1782\u17d2\u179a\u17b7\u179f\u17d2\u178f\u179f\u1780\u179a\u17b6\u1787"
    ],
    "ERAS": [
      "\u1798\u17bb\u1793 \u1782.\u179f.",
      "\u1782.\u179f."
    ],
    "FIRSTDAYOFWEEK": 6,
    "MONTH": [
      "\u1798\u1780\u179a\u17b6",
      "\u1780\u17bb\u1798\u17d2\u1797\u17c8",
      "\u1798\u17b8\u1793\u17b6",
      "\u1798\u17c1\u179f\u17b6",
      "\u17a7\u179f\u1797\u17b6",
      "\u1798\u17b7\u1790\u17bb\u1793\u17b6",
      "\u1780\u1780\u17d2\u1780\u178a\u17b6",
      "\u179f\u17b8\u17a0\u17b6",
      "\u1780\u1789\u17d2\u1789\u17b6",
      "\u178f\u17bb\u179b\u17b6",
      "\u179c\u17b7\u1785\u17d2\u1786\u17b7\u1780\u17b6",
      "\u1792\u17d2\u1793\u17bc"
    ],
    "SHORTDAY": [
      "\u17a2\u17b6\u1791\u17b7\u178f\u17d2\u1799",
      "\u1785\u17d0\u1793\u17d2\u1791",
      "\u17a2\u1784\u17d2\u1782\u17b6\u179a",
      "\u1796\u17bb\u1792",
      "\u1796\u17d2\u179a\u17a0\u179f\u17d2\u1794\u178f\u17b7\u17cd",
      "\u179f\u17bb\u1780\u17d2\u179a",
      "\u179f\u17c5\u179a\u17cd"
    ],
    "SHORTMONTH": [
      "\u1798\u1780\u179a\u17b6",
      "\u1780\u17bb\u1798\u17d2\u1797\u17c8",
      "\u1798\u17b8\u1793\u17b6",
      "\u1798\u17c1\u179f\u17b6",
      "\u17a7\u179f\u1797\u17b6",
      "\u1798\u17b7\u1790\u17bb\u1793\u17b6",
      "\u1780\u1780\u17d2\u1780\u178a\u17b6",
      "\u179f\u17b8\u17a0\u17b6",
      "\u1780\u1789\u17d2\u1789\u17b6",
      "\u178f\u17bb\u179b\u17b6",
      "\u179c\u17b7\u1785\u17d2\u1786\u17b7\u1780\u17b6",
      "\u1792\u17d2\u1793\u17bc"
    ],
    "STANDALONEMONTH": [
      "\u1798\u1780\u179a\u17b6",
      "\u1780\u17bb\u1798\u17d2\u1797\u17c8",
      "\u1798\u17b8\u1793\u17b6",
      "\u1798\u17c1\u179f\u17b6",
      "\u17a7\u179f\u1797\u17b6",
      "\u1798\u17b7\u1790\u17bb\u1793\u17b6",
      "\u1780\u1780\u17d2\u1780\u178a\u17b6",
      "\u179f\u17b8\u17a0\u17b6",
      "\u1780\u1789\u17d2\u1789\u17b6",
      "\u178f\u17bb\u179b\u17b6",
      "\u179c\u17b7\u1785\u17d2\u1786\u17b7\u1780\u17b6",
      "\u1792\u17d2\u1793\u17bc"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y h:mm:ss a",
    "mediumDate": "d MMM y",
    "mediumTime": "h:mm:ss a",
    "short": "d/M/yy h:mm a",
    "shortDate": "d/M/yy",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "Riel",
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
        "negPre": "-\u00a4",
        "negSuf": "",
        "posPre": "\u00a4",
        "posSuf": ""
      }
    ]
  },
  "id": "km",
  "localeID": "km",
  "pluralCat": function(n, opt_precision) {  return PLURAL_CATEGORY.OTHER;}
});
}]);
