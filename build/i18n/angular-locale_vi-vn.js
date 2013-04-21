angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "SA",
      "1": "CH"
    },
    "DAY": {
      "0": "Chủ nhật",
      "1": "Thứ hai",
      "2": "Thứ ba",
      "3": "Thứ tư",
      "4": "Thứ năm",
      "5": "Thứ sáu",
      "6": "Thứ bảy"
    },
    "MONTH": {
      "0": "tháng một",
      "1": "tháng hai",
      "2": "tháng ba",
      "3": "tháng tư",
      "4": "tháng năm",
      "5": "tháng sáu",
      "6": "tháng bảy",
      "7": "tháng tám",
      "8": "tháng chín",
      "9": "tháng mười",
      "10": "tháng mười một",
      "11": "tháng mười hai"
    },
    "SHORTDAY": {
      "0": "CN",
      "1": "Th 2",
      "2": "Th 3",
      "3": "Th 4",
      "4": "Th 5",
      "5": "Th 6",
      "6": "Th 7"
    },
    "SHORTMONTH": {
      "0": "thg 1",
      "1": "thg 2",
      "2": "thg 3",
      "3": "thg 4",
      "4": "thg 5",
      "5": "thg 6",
      "6": "thg 7",
      "7": "thg 8",
      "8": "thg 9",
      "9": "thg 10",
      "10": "thg 11",
      "11": "thg 12"
    },
    "fullDate": "EEEE, 'ngày' dd MMMM 'năm' y",
    "longDate": "'Ngày' dd 'tháng' M 'năm' y",
    "medium": "dd-MM-yyyy HH:mm:ss",
    "mediumDate": "dd-MM-yyyy",
    "mediumTime": "HH:mm:ss",
    "short": "dd/MM/yyyy HH:mm",
    "shortDate": "dd/MM/yyyy",
    "shortTime": "HH:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "₫",
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
        "negPre": "-",
        "negSuf": " \u00A4",
        "posPre": "",
        "posSuf": " \u00A4"
      }
    }
  },
  "id": "vi-vn",
  "pluralCat": function (n) {  return PLURAL_CATEGORY.OTHER;}
});
}]);