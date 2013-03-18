angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "AM",
      "1": "PM"
    },
    "DAY": {
      "0": "Minggu",
      "1": "Senin",
      "2": "Selasa",
      "3": "Rabu",
      "4": "Kamis",
      "5": "Jumat",
      "6": "Sabtu"
    },
    "MONTH": {
      "0": "Januari",
      "1": "Februari",
      "2": "Maret",
      "3": "April",
      "4": "Mei",
      "5": "Juni",
      "6": "Juli",
      "7": "Agustus",
      "8": "September",
      "9": "Oktober",
      "10": "November",
      "11": "Desember"
    },
    "SHORTDAY": {
      "0": "Min",
      "1": "Sen",
      "2": "Sel",
      "3": "Rab",
      "4": "Kam",
      "5": "Jum",
      "6": "Sab"
    },
    "SHORTMONTH": {
      "0": "Jan",
      "1": "Feb",
      "2": "Mar",
      "3": "Apr",
      "4": "Mei",
      "5": "Jun",
      "6": "Jul",
      "7": "Agt",
      "8": "Sep",
      "9": "Okt",
      "10": "Nov",
      "11": "Des"
    },
    "fullDate": "EEEE, dd MMMM yyyy",
    "longDate": "d MMMM yyyy",
    "medium": "d MMM yyyy HH:mm:ss",
    "mediumDate": "d MMM yyyy",
    "mediumTime": "HH:mm:ss",
    "short": "dd/MM/yy HH:mm",
    "shortDate": "dd/MM/yy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "Rp",
    "DECIMAL_SEP": ",",
    "GROUP_SEP": ".",
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
        "negPre": "\u00A4-",
        "negSuf": "",
        "posPre": "\u00A4",
        "posSuf": ""
      }
    }
  },
  "id": "id-id",
  "pluralCat": function (n) {  return PLURAL_CATEGORY.OTHER;}
});
}]);