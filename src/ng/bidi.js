'use strict';

/**
 * @ngdoc service
 * @name $bidi
 * @requires $locale
 *
 * @description
 * Provides a way to estimate the text direction of a string or html fragment or a locale.
 * Uses by {@link ng.directive:dir dir} directive to provide bidirectional text support in templates.
 *
 * The implementation uses the
 * [bidi support of the Google Closure Library](https://github.com/google/closure-library/blob/master/closure/goog/i18n/bidi.js).
 *
 * This service is needed as not all browsers support the html5 standard
 * (see [W3C dir=auto tests](http://www.w3.org/International/tests/html5/the-dir-attribute/results-dir-auto))
 * and the html5 standard only looks for the first character with a strong directionality to the determine the
 * directionality of the whole element (see
 * [HTML5 dir attribute](http://www.whatwg.org/specs/web-apps/current-work/multipage/elements.html#the-dir-attribute)),
 * which is a bit simplistic.
 */
function $BidiProvider() {
  var googI18nBidi = googI18nBidiFactory();

  this.$get = ['$locale', function($locale) {
    return {
      Dir: googI18nBidi.Dir,
      Format: googI18nBidi.Format,
      estimateDirection: googI18nBidi.estimateDirection,
      localeDir: localeDir
    };

    function localeDir() {
      if (googI18nBidi.isRtlLanguage($locale.id)) {
        return googI18nBidi.Dir.RTL;
      } else {
        return googI18nBidi.Dir.LTR;
      }
    }
  }];
}

/**
 * The content of this function was copied from the Google Closure Library
 * (https://closure-library.googlecode.com/git/closure/goog/i18n/bidi.js)
 * and reduced to the needed functions.
 */
function googI18nBidiFactory() {
  /**
   * Unicode formatting characters and directionality string constants.
   */
   var Format = {
    /** Unicode "Left-To-Right Embedding" (LRE) character. */
    LRE: '\u202A',
    /** Unicode "Right-To-Left Embedding" (RLE) character. */
    RLE: '\u202B',
    /** Unicode "Pop Directional Formatting" (PDF) character. */
    PDF: '\u202C'
  };


  /**
   * Directionality enum.
   */
   var Dir = {
    /**
     * Left-to-right.
     */
    LTR: 1,

    /**
     * Right-to-left.
     */
    RTL: -1,

    /**
     * Neither left-to-right nor right-to-left.
     */
    NEUTRAL: 0

  };


  /**
   * A practical pattern to identify strong LTR characters. This pattern is not
   * theoretically correct according to the Unicode standard. It is simplified for
   * performance and small code size.
   * @private
   */
   var ltrChars_ =
    'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF' +
      '\u200E\u2C00-\uFB1C\uFE00-\uFE6F\uFEFD-\uFFFF';


  /**
   * A practical pattern to identify strong RTL character. This pattern is not
   * theoretically correct according to the Unicode standard. It is simplified
   * for performance and small code size.
   * @private
   */
   var rtlChars_ = '\u0591-\u07FF\u200F\uFB1D-\uFDFF\uFE70-\uFEFC';


  /**
   * Simplified regular expression for an HTML tag (opening or closing) or an HTML
   * escape. We might want to skip over such expressions when estimating the text
   * directionality.
   * @private
   */
   var htmlSkipReg_ = /<[^>]*>|&[^;]+;/g;


  /**
   * Returns the input text with spaces instead of HTML tags or HTML escapes, if
   * opt_isStripNeeded is true. Else returns the input as is.
   * Useful for text directionality estimation.
   * Note: the function should not be used in other contexts; it is not 100%
   * correct, but rather a good-enough implementation for directionality
   * estimation purposes.
   * @param {string} str The given string.
   * @param {boolean=} opt_isStripNeeded Whether to perform the stripping.
   *     Default: false (to retain consistency with calling functions).
   * @return {string} The given string cleaned of HTML tags / escapes.
   * @private
   */
   var stripHtmlIfNeeded_ = function(str, opt_isStripNeeded) {
    return opt_isStripNeeded ? str.replace(htmlSkipReg_, '') :
      str;
  };


  /**
   * Regular expression to check for LTR characters.
   * @private
   */
   var ltrCharReg_ = new RegExp('[' + ltrChars_ + ']');


  /**
   * Test whether the given string has any LTR characters in it.
   * @param {string} str The given string that need to be tested.
   * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
   *     Default: false.
   * @return {boolean} Whether the string contains LTR characters.
   */
   var hasAnyLtr = function(str, opt_isHtml) {
    return ltrCharReg_.test(stripHtmlIfNeeded_(
      str, opt_isHtml));
  };


  /**
   * Regular expressions to check if a piece of text is of RTL directionality
   * on first character with strong directionality.
   * @private
   */
   var rtlDirCheckRe_ = new RegExp(
    '^[^' + ltrChars_ + ']*[' + rtlChars_ + ']');


  /**
   * Check whether the first strongly directional character (if any) is RTL.
   * @param {string} str String being checked.
   * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
   *     Default: false.
   * @return {boolean} Whether RTL directionality is detected using the first
   *     strongly-directional character method.
   */
   var startsWithRtl = function(str, opt_isHtml) {
    return rtlDirCheckRe_.test(stripHtmlIfNeeded_(
      str, opt_isHtml));
  };


  /**
   * Regular expression to check if a string looks like something that must
   * always be LTR even in RTL text, e.g. a URL. When estimating the
   * directionality of text containing these, we treat these as weakly LTR,
   * like numbers.
   * @private
   */
   var isRequiredLtrRe_ = /^http:\/\/.*/;


  /**
   * A regular expression for matching right-to-left language codes.
   * See {@link #isRtlLanguage} for the design.
   * @private
   */
   var rtlLocalesRe_ = new RegExp(
    '^(ar|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Arab|Hebr|Thaa|Nkoo|Tfng))' +
      '(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)',
    'i');


  /**
   * Check if a BCP 47 / III language code indicates an RTL language, i.e. either:
   * - a language code explicitly specifying one of the right-to-left scripts,
   *   e.g. "az-Arab", or<p>
   * - a language code specifying one of the languages normally written in a
   *   right-to-left script, e.g. "fa" (Farsi), except ones explicitly specifying
   *   Latin or Cyrillic script (which are the usual LTR alternatives).<p>
   * The list of right-to-left scripts appears in the 100-199 range in
   * http://www.unicode.org/iso15924/iso15924-num.html, of which Arabic and
   * Hebrew are by far the most widely used. We also recognize Thaana, N'Ko, and
   * Tifinagh, which also have significant modern usage. The rest (Syriac,
   * Samaritan, Mandaic, etc.) seem to have extremely limited or no modern usage
   * and are not recognized to save on code size.
   * The languages usually written in a right-to-left script are taken as those
   * with Suppress-Script: Hebr|Arab|Thaa|Nkoo|Tfng  in
   * http://www.iana.org/assignments/language-subtag-registry,
   * as well as Sindhi (sd) and Uyghur (ug).
   * Other subtags of the language code, e.g. regions like EG (Egypt), are
   * ignored.
   * @param {string} lang BCP 47 (a.k.a III) language code.
   * @return {boolean} Whether the language code is an RTL language.
   */
   var isRtlLanguage = function(lang) {
    return rtlLocalesRe_.test(lang);
  };

  /**
   * Regular expression to split a string into "words" for directionality
   * estimation based on relative word counts.
   * @private
   */
   var wordSeparatorRe_ = /\s+/;


  /**
   * Regular expression to check if a string contains any numerals. Used to
   * differentiate between completely neutral strings and those containing
   * numbers, which are weakly LTR.
   * @private
   */
   var hasNumeralsRe_ = /\d/;


  /**
   * This constant controls threshold of RTL directionality.
   * @private
   */
   var rtlDetectionThreshold_ = 0.40;


  /**
   * Estimates the directionality of a string based on relative word counts.
   * If the number of RTL words is above a certain percentage of the total number
   * of strongly directional words, returns RTL.
   * Otherwise, if any words are strongly or weakly LTR, returns LTR.
   * Otherwise, returns UNKNOWN, which is used to mean "neutral".
   * Numbers are counted as weakly LTR.
   *
   * Returns an object with the functions:
   * - add:
   * @param {string} str The string to be checked.
   * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
   *     Default: false.
   * - remove:
   * @param {string} str The string to be checked.
   * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
   *     Default: false.
   * - get:
   * @return {Dir} Estimated overall directionality of {@code str}.
   */
  var estimateDirection = function(str, opt_isHtml) {
    var rtlCount = 0;
    var totalCount = 0;
    var hasWeaklyLtr = false;
    var tokens = stripHtmlIfNeeded_(str, opt_isHtml).
        split(wordSeparatorRe_);
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (startsWithRtl(token)) {
        rtlCount++;
        totalCount++;
      } else if (isRequiredLtrRe_.test(token)) {
        hasWeaklyLtr = true;
      } else if (hasAnyLtr(token)) {
        totalCount++;
      } else if (hasNumeralsRe_.test(token)) {
        hasWeaklyLtr = true;
      }
    }

    return totalCount === 0 ?
        (hasWeaklyLtr ? Dir.LTR : Dir.NEUTRAL) :
        (rtlCount / totalCount > rtlDetectionThreshold_ ?
            Dir.RTL : Dir.LTR);
  };

  return {
    Dir: Dir,
    Format: Format,
    estimateDirection: estimateDirection,
    isRtlLanguage: isRtlLanguage
  };

}

