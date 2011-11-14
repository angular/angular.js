window.angular = window.angular || {};
angular.module = angular.module || {};
angular.module.ngLocale = ["$provide", function($provide) {
var PLURAL_CATEGORY = {ZERO: "zero", ONE: "one", TWO: "two", FEW: "few", MANY: "many", OTHER: "other"};
$provide.value("$locale", {"DATETIME_FORMATS":{"MONTH":["de gener","de febrer","de març","d’abril","de maig","de juny","de juliol","d’agost","de setembre","d’octubre","de novembre","de desembre"],"SHORTMONTH":["de gen.","de febr.","de març","d’abr.","de maig","de juny","de jul.","d’ag.","de set.","d’oct.","de nov.","de des."],"DAY":["diumenge","dilluns","dimarts","dimecres","dijous","divendres","dissabte"],"SHORTDAY":["dg.","dl.","dt.","dc.","dj.","dv.","ds."],"AMPMS":["a.m.","p.m."],"medium":"dd/MM/yyyy H:mm:ss","short":"dd/MM/yy H:mm","fullDate":"EEEE d MMMM 'de' y","longDate":"d MMMM 'de' y","mediumDate":"dd/MM/yyyy","shortDate":"dd/MM/yy","mediumTime":"H:mm:ss","shortTime":"H:mm"},"NUMBER_FORMATS":{"DECIMAL_SEP":",","GROUP_SEP":".","PATTERNS":[{"minInt":1,"minFrac":0,"macFrac":0,"posPre":"","posSuf":"","negPre":"-","negSuf":"","gSize":3,"lgSize":3,"maxFrac":3},{"minInt":1,"minFrac":2,"macFrac":0,"posPre":"","posSuf":" \u00A4","negPre":"-","negSuf":" \u00A4","gSize":3,"lgSize":3,"maxFrac":2}],"CURRENCY_SYM":"€"},"pluralCat":function (n) {  if (n == 1) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;},"id":"ca"});
}];
