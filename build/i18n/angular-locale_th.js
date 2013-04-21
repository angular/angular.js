angular.module("ngLocale", [], ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {
  "DATETIME_FORMATS": {
    "AMPMS": {
      "0": "ก่อนเที่ยง",
      "1": "หลังเที่ยง"
    },
    "DAY": {
      "0": "วันอาทิตย์",
      "1": "วันจันทร์",
      "2": "วันอังคาร",
      "3": "วันพุธ",
      "4": "วันพฤหัสบดี",
      "5": "วันศุกร์",
      "6": "วันเสาร์"
    },
    "MONTH": {
      "0": "มกราคม",
      "1": "กุมภาพันธ์",
      "2": "มีนาคม",
      "3": "เมษายน",
      "4": "พฤษภาคม",
      "5": "มิถุนายน",
      "6": "กรกฎาคม",
      "7": "สิงหาคม",
      "8": "กันยายน",
      "9": "ตุลาคม",
      "10": "พฤศจิกายน",
      "11": "ธันวาคม"
    },
    "SHORTDAY": {
      "0": "อา.",
      "1": "จ.",
      "2": "อ.",
      "3": "พ.",
      "4": "พฤ.",
      "5": "ศ.",
      "6": "ส."
    },
    "SHORTMONTH": {
      "0": "ม.ค.",
      "1": "ก.พ.",
      "2": "มี.ค.",
      "3": "เม.ย.",
      "4": "พ.ค.",
      "5": "มิ.ย.",
      "6": "ก.ค.",
      "7": "ส.ค.",
      "8": "ก.ย.",
      "9": "ต.ค.",
      "10": "พ.ย.",
      "11": "ธ.ค."
    },
    "fullDate": "EEEEที่ d MMMM G y",
    "longDate": "d MMMM y",
    "medium": "d MMM y H:mm:ss",
    "mediumDate": "d MMM y",
    "mediumTime": "H:mm:ss",
    "short": "d/M/yyyy H:mm",
    "shortDate": "d/M/yyyy",
    "shortTime": "H:mm"
  },
  "NUMBER_FORMATS": {
    "CURRENCY_SYM": "฿",
    "DECIMAL_SEP": ".",
    "GROUP_SEP": ",",
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
        "negPre": "(\u00A4",
        "negSuf": ")",
        "posPre": "\u00A4",
        "posSuf": ""
      }
    }
  },
  "id": "th",
  "pluralCat": function (n) {  return PLURAL_CATEGORY.OTHER;}
});
}]);