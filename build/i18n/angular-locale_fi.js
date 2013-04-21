angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "ap.",
      "1": "ip."
    },
    "DAY": {
      "0": "sunnuntaina",
      "1": "maanantaina",
      "2": "tiistaina",
      "3": "keskiviikkona",
      "4": "torstaina",
      "5": "perjantaina",
      "6": "lauantaina"
    },
    "MONTH": {
      "0": "tammikuuta",
      "1": "helmikuuta",
      "2": "maaliskuuta",
      "3": "huhtikuuta",
      "4": "toukokuuta",
      "5": "kesäkuuta",
      "6": "heinäkuuta",
      "7": "elokuuta",
      "8": "syyskuuta",
      "9": "lokakuuta",
      "10": "marraskuuta",
      "11": "joulukuuta"
    },
    "SHORTDAY": {
      "0": "su",
      "1": "ma",
      "2": "ti",
      "3": "ke",
      "4": "to",
      "5": "pe",
      "6": "la"
    },
    "SHORTMONTH": {
      "0": "tammikuuta",
      "1": "helmikuuta",
      "2": "maaliskuuta",
      "3": "huhtikuuta",
      "4": "toukokuuta",
      "5": "kesäkuuta",
      "6": "heinäkuuta",
      "7": "elokuuta",
      "8": "syyskuuta",
      "9": "lokakuuta",
      "10": "marraskuuta",
      "11": "joulukuuta"
    },
    "fullDate": "cccc, d. MMMM y",
    "longDate": "d. MMMM y",
    "medium": "d.M.yyyy H.mm.ss",
    "mediumDate": "d.M.yyyy",
    "mediumTime": "H.mm.ss",
    "short": "d.M.yyyy H.mm",
    "shortDate": "d.M.yyyy",
    "shortTime": "H.mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "€",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": " ",
    "PATTERNS": {
      "0": {
        "gSize": 3,
        "lgSize": 3,
        "macFrac": 0,
        "maxFrac": 3,
        "minFrac": 0,
        "minInt": 1,
        "negPre": "-",
        "negSuf": "",
        "posPre": "",
        "posSuf": ""
      },
      "1": {
        "gSize": 3,
        "lgSize": 3,
        "macFrac": 0,
        "maxFrac": 2,
        "minFrac": 2,
        "minInt": 1,
        "negPre": "-",
        "negSuf": " \u00A4",
        "posPre": "",
        "posSuf": " \u00A4"
      }
    }
  },
  "id": "fi",
  "pluralCat": function (n) {  if (n == 1) {   return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
});
}]);