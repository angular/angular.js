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
      "ki\u025bm\u025b\u0301\u025bm",
      "kis\u025b\u0301nd\u025b"
    ],
    "DAY": [
      "s\u0254\u0301ndi\u025b",
      "m\u00f3ndie",
      "mu\u00e1ny\u00e1\u014bm\u00f3ndie",
      "met\u00fakp\u00ed\u00e1p\u025b",
      "k\u00fap\u00e9limet\u00fakpiap\u025b",
      "fel\u00e9te",
      "s\u00e9sel\u00e9"
    ],
    "ERANAMES": [
      "katikup\u00eden Y\u00e9suse",
      "\u00e9k\u00e9l\u00e9mk\u00fanup\u00ed\u00e9n n"
    ],
    "ERAS": [
      "k.Y.",
      "+J.C."
    ],
    "MONTH": [
      "pik\u00edt\u00edk\u00edtie, o\u00f3l\u00ed \u00fa kut\u00faan",
      "si\u025by\u025b\u0301, o\u00f3li \u00fa k\u00e1nd\u00ed\u025b",
      "\u0254ns\u00famb\u0254l, o\u00f3li \u00fa k\u00e1t\u00e1t\u00fa\u025b",
      "mesi\u014b, o\u00f3li \u00fa k\u00e9nie",
      "ensil, o\u00f3li \u00fa k\u00e1t\u00e1nu\u025b",
      "\u0254s\u0254n",
      "efute",
      "pisuy\u00fa",
      "im\u025b\u014b i pu\u0254s",
      "im\u025b\u014b i put\u00fak,o\u00f3li \u00fa k\u00e1t\u00ed\u025b",
      "makandik\u025b",
      "pil\u0254nd\u0254\u0301"
    ],
    "SHORTDAY": [
      "sd",
      "md",
      "mw",
      "et",
      "kl",
      "fl",
      "ss"
    ],
    "SHORTMONTH": [
      "o.1",
      "o.2",
      "o.3",
      "o.4",
      "o.5",
      "o.6",
      "o.7",
      "o.8",
      "o.9",
      "o.10",
      "o.11",
      "o.12"
    ],
    "fullDate": "EEEE d MMMM y",
    "longDate": "d MMMM y",
    "medium": "d MMM y HH:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "HH:mm:ss",
    "short": "d/M/y HH:mm",
    "shortDate": "d/M/y",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "FCFA",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": "\u00a0",
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
        "negPre": "-",
        "negSuf": "\u00a0\u00a4",
        "posPre": "",
        "posSuf": "\u00a0\u00a4"
      }
    ]
  },
  "id": "yav-cm",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
