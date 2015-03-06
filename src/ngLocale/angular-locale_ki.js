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
      "Kiroko",
      "Hwa\u0129-in\u0129"
    ],
    "DAY": [
      "Kiumia",
      "Njumatat\u0169",
      "Njumaine",
      "Njumatana",
      "Aramithi",
      "Njumaa",
      "Njumamothi"
    ],
    "ERANAMES": [
      "Mbere ya Kristo",
      "Thutha wa Kristo"
    ],
    "ERAS": [
      "MK",
      "TK"
    ],
    "FIRSTDAYOFWEEK": 0,
    "MONTH": [
      "Njenuar\u0129",
      "Mwere wa ker\u0129",
      "Mwere wa gatat\u0169",
      "Mwere wa kana",
      "Mwere wa gatano",
      "Mwere wa gatandat\u0169",
      "Mwere wa m\u0169gwanja",
      "Mwere wa kanana",
      "Mwere wa kenda",
      "Mwere wa ik\u0169mi",
      "Mwere wa ik\u0169mi na \u0169mwe",
      "Ndithemba"
    ],
    "SHORTDAY": [
      "KMA",
      "NTT",
      "NMN",
      "NMT",
      "ART",
      "NMA",
      "NMM"
    ],
    "SHORTMONTH": [
      "JEN",
      "WKR",
      "WGT",
      "WKN",
      "WTN",
      "WTD",
      "WMJ",
      "WNN",
      "WKD",
      "WIK",
      "WMW",
      "DIT"
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
    "CURRENCY_SYM": "Ksh",
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
  "id": "ki",
  "pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);
