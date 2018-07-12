'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": [
      "\u061c\u202eAM\u202c\u061c",
      "\u061c\u202ePM\u202c\u061c"
    ],
    "DAY": [
      "\u061c\u202eSunday\u202c\u061c",
      "\u061c\u202eMonday\u202c\u061c",
      "\u061c\u202eTuesday\u202c\u061c",
      "\u061c\u202eWednesday\u202c\u061c",
      "\u061c\u202eThursday\u202c\u061c",
      "\u061c\u202eFriday\u202c\u061c",
      "\u061c\u202eSaturday\u202c\u061c"
    ],
    "ERANAMES": [
      "\u061c\u202eBefore\u202c\u061c \u061c\u202eChrist\u202c\u061c",
      "\u061c\u202eAnno\u202c\u061c \u061c\u202eDomini\u202c\u061c"
    ],
    "ERAS": [
      "\u061c\u202eBC\u202c\u061c",
      "\u061c\u202eAD\u202c\u061c"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "\u061c\u202eJanuary\u202c\u061c",
      "\u061c\u202eFebruary\u202c\u061c",
      "\u061c\u202eMarch\u202c\u061c",
      "\u061c\u202eApril\u202c\u061c",
      "\u061c\u202eMay\u202c\u061c",
      "\u061c\u202eJune\u202c\u061c",
      "\u061c\u202eJuly\u202c\u061c",
      "\u061c\u202eAugust\u202c\u061c",
      "\u061c\u202eSeptember\u202c\u061c",
      "\u061c\u202eOctober\u202c\u061c",
      "\u061c\u202eNovember\u202c\u061c",
      "\u061c\u202eDecember\u202c\u061c"
    ],
    "SHORTDAY": [
      "\u061c\u202eSun\u202c\u061c",
      "\u061c\u202eMon\u202c\u061c",
      "\u061c\u202eTue\u202c\u061c",
      "\u061c\u202eWed\u202c\u061c",
      "\u061c\u202eThu\u202c\u061c",
      "\u061c\u202eFri\u202c\u061c",
      "\u061c\u202eSat\u202c\u061c"
    ],
    "SHORTMONTH": [
      "\u061c\u202eJan\u202c\u061c",
      "\u061c\u202eFeb\u202c\u061c",
      "\u061c\u202eMar\u202c\u061c",
      "\u061c\u202eApr\u202c\u061c",
      "\u061c\u202eMay\u202c\u061c",
      "\u061c\u202eJun\u202c\u061c",
      "\u061c\u202eJul\u202c\u061c",
      "\u061c\u202eAug\u202c\u061c",
      "\u061c\u202eSep\u202c\u061c",
      "\u061c\u202eOct\u202c\u061c",
      "\u061c\u202eNov\u202c\u061c",
      "\u061c\u202eDec\u202c\u061c"
    ],
    "STANDALONEMONTH": [
      "\u064a\u0646\u0627\u064a\u0631",
      "\u0641\u0628\u0631\u0627\u064a\u0631",
      "\u0645\u0627\u0631\u0633",
      "\u0623\u0628\u0631\u064a\u0644",
      "\u0645\u0627\u064a\u0648",
      "\u064a\u0648\u0646\u064a\u0648",
      "\u064a\u0648\u0644\u064a\u0648",
      "\u0623\u063a\u0633\u0637\u0633",
      "\u0633\u0628\u062a\u0645\u0628\u0631",
      "\u0623\u0643\u062a\u0648\u0628\u0631",
      "\u0646\u0648\u0641\u0645\u0628\u0631",
      "\u062f\u064a\u0633\u0645\u0628\u0631"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE\u060c d MMMM\u060c y",
    "longDate": "d MMMM\u060c y",
    "medium": "dd\u200f/MM\u200f/y h:mm:ss a",
    "mediumDate": "dd\u200f/MM\u200f/y",
    "mediumTime": "h:mm:ss a",
    "short": "d\u200f/M\u200f/y h:mm a",
    "shortDate": "d\u200f/M\u200f/y",
    "shortTime": "h:mm a"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "\u00a3",
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
  "id": "ar-xb",
  "localeID": "ar_XB",
  "pluralCat": function(n, opt_precision) {  if (n == 0) {    return PLURAL_CATEGORY.ZERO;  }  if (n == 1) {    return PLURAL_CATEGORY.ONE;  }  if (n == 2) {    return PLURAL_CATEGORY.TWO;  }  if (n % 100 >= 3 && n % 100 <= 10) {    return PLURAL_CATEGORY.FEW;  }  if (n % 100 >= 11 && n % 100 <= 99) {    return PLURAL_CATEGORY.MANY;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
