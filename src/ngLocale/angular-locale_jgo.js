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
      "mba\ua78cmba\ua78c",
      "\u014bka mb\u0254\u0301t nji"
    ],
    "DAY": [
      "S\u0254\u0301ndi",
      "M\u0254\u0301ndi",
      "\u00c1pta M\u0254\u0301ndi",
      "W\u025b\u0301n\u025bs\u025bd\u025b",
      "T\u0254\u0301s\u025bd\u025b",
      "F\u025bl\u00e2y\u025bd\u025b",
      "S\u00e1sid\u025b"
    ],
    "ERANAMES": [
      "ts\u025btts\u025bt m\u025b\u014bgu\ua78c mi \u025b\u0301 l\u025b\u025bn\u025b K\u025bl\u00eds\u025bt\u0254 g\u0254 \u0144\u0254\u0301",
      "ts\u025btts\u025bt m\u025b\u014bgu\ua78c mi \u025b\u0301 f\u00fan\u025b K\u025bl\u00eds\u025bt\u0254 t\u0254\u0301 m\u0254\u0301"
    ],
    "ERAS": [
      "ts\u025btts\u025bt m\u025b\u014bgu\ua78c mi \u025b\u0301 l\u025b\u025bn\u025b K\u025bl\u00eds\u025bt\u0254 g\u0254 \u0144\u0254\u0301",
      "ts\u025btts\u025bt m\u025b\u014bgu\ua78c mi \u025b\u0301 f\u00fan\u025b K\u025bl\u00eds\u025bt\u0254 t\u0254\u0301 m\u0254\u0301"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "Ndu\u014bmbi Sa\u014b",
      "P\u025bsa\u014b P\u025b\u0301p\u00e1",
      "P\u025bsa\u014b P\u025b\u0301t\u00e1t",
      "P\u025bsa\u014b P\u025b\u0301n\u025b\u0301kwa",
      "P\u025bsa\u014b Pataa",
      "P\u025bsa\u014b P\u025b\u0301n\u025b\u0301nt\u00fak\u00fa",
      "P\u025bsa\u014b Saamb\u00e1",
      "P\u025bsa\u014b P\u025b\u0301n\u025b\u0301f\u0254m",
      "P\u025bsa\u014b P\u025b\u0301n\u025b\u0301pf\u00fa\ua78b\u00fa",
      "P\u025bsa\u014b N\u025bg\u025b\u0301m",
      "P\u025bsa\u014b Nts\u0254\u030cpm\u0254\u0301",
      "P\u025bsa\u014b Nts\u0254\u030cpp\u00e1"
    ],
    "SHORTDAY": [
      "S\u0254\u0301ndi",
      "M\u0254\u0301ndi",
      "\u00c1pta M\u0254\u0301ndi",
      "W\u025b\u0301n\u025bs\u025bd\u025b",
      "T\u0254\u0301s\u025bd\u025b",
      "F\u025bl\u00e2y\u025bd\u025b",
      "S\u00e1sid\u025b"
    ],
    "SHORTMONTH": [
      "Ndu\u014bmbi Sa\u014b",
      "P\u025bsa\u014b P\u025b\u0301p\u00e1",
      "P\u025bsa\u014b P\u025b\u0301t\u00e1t",
      "P\u025bsa\u014b P\u025b\u0301n\u025b\u0301kwa",
      "P\u025bsa\u014b Pataa",
      "P\u025bsa\u014b P\u025b\u0301n\u025b\u0301nt\u00fak\u00fa",
      "P\u025bsa\u014b Saamb\u00e1",
      "P\u025bsa\u014b P\u025b\u0301n\u025b\u0301f\u0254m",
      "P\u025bsa\u014b P\u025b\u0301n\u025b\u0301pf\u00fa\ua78b\u00fa",
      "P\u025bsa\u014b N\u025bg\u025b\u0301m",
      "P\u025bsa\u014b Nts\u0254\u030cpm\u0254\u0301",
      "P\u025bsa\u014b Nts\u0254\u030cpp\u00e1"
    ],
    "STANDALONEMONTH": [
      "Ndu\u014bmbi Sa\u014b",
      "P\u025bsa\u014b P\u025b\u0301p\u00e1",
      "P\u025bsa\u014b P\u025b\u0301t\u00e1t",
      "P\u025bsa\u014b P\u025b\u0301n\u025b\u0301kwa",
      "P\u025bsa\u014b Pataa",
      "P\u025bsa\u014b P\u025b\u0301n\u025b\u0301nt\u00fak\u00fa",
      "P\u025bsa\u014b Saamb\u00e1",
      "P\u025bsa\u014b P\u025b\u0301n\u025b\u0301f\u0254m",
      "P\u025bsa\u014b P\u025b\u0301n\u025b\u0301pf\u00fa\ua78b\u00fa",
      "P\u025bsa\u014b N\u025bg\u025b\u0301m",
      "P\u025bsa\u014b Nts\u0254\u030cpm\u0254\u0301",
      "P\u025bsa\u014b Nts\u0254\u030cpp\u00e1"
    ],
    "WEEKENDRANGE": [
      5,
      6
    ],
    "fullDate": "EEEE, y MMMM dd",
    "longDate": "y MMMM d",
    "medium": "y MMM d HH:mm:ss",
    "mediumDate": "y MMM d",
    "mediumTime": "HH:mm:ss",
    "short": "y-MM-dd HH:mm",
    "shortDate": "y-MM-dd",
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
  "id": "jgo",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
