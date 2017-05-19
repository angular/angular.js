// Copyright 2009 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * @fileoverview A utility to get better currency format pattern.
 *
 * This module implements a new currency format representation model. It
 * provides 3 currency representation forms: global, portable and local. Local
 * format is the most popular format people use to represent currency in its
 * circulating country without worrying about how it should be distinguished
 * from other currencies.  Global format is a formal representation in context
 * of multiple currencies in same page, it is ISO 4217 currency code. Portable
 * format is a compromise between global and local. It looks similar to how
 * people would like to see how their currency is being represented in other
 * media. While at the same time, it should be distinguishable to world's
 * popular currencies (like USD, EUR) and currencies somewhat relevant in the
 * area (like CNY in HK, though native currency is HKD). There is no guarantee
 * of uniqueness.
 *
 */


goog.provide('goog.i18n.currency');
goog.provide('goog.i18n.currency.CurrencyInfo');
goog.provide('goog.i18n.currency.CurrencyInfoTier2');


/**
 * The mask of precision field.
 * @private
 */
goog.i18n.currency.PRECISION_MASK_ = 0x07;


/**
 * Whether the currency sign should be positioned after the number.
 * @private
 */
goog.i18n.currency.POSITION_FLAG_ = 0x10;


/**
 * Whether a space should be inserted between the number and currency sign.
 * @private
 */
goog.i18n.currency.SPACE_FLAG_ = 0x20;


/**
 * Whether tier2 was enabled already by calling addTier2Support().
 * @private
 */
goog.i18n.currency.tier2Enabled_ = false;


/**
 * Tests if currency is available.
 *
 * Note: If the currency is not available it might be in the tier2 currency set:
 * {@link goog.i18n.currency.CurrencyInfoTier2}. If that is the case call
 * {@link goog.i18n.currency.addTier2Support} before calling any other function
 * in this namespace.
 *
 * @param {string} currencyCode Currency code to tested.
 * @return {boolean} If the currency is available.
 */
goog.i18n.currency.isAvailable = function(currencyCode) {
  return currencyCode in goog.i18n.currency.CurrencyInfo;
};

/**
 * This function will add tier2 currency support. Be default, only tier1
 * (most popular currencies) are supported. If an application really needs
 * to support some of the rarely used currencies, it should call this function
 * before any other functions in this namespace.
 */
goog.i18n.currency.addTier2Support = function() {
  // Protection from executing this these again and again.
  if (!goog.i18n.currency.tier2Enabled_) {
    for (var key in goog.i18n.currency.CurrencyInfoTier2) {
      goog.i18n.currency.CurrencyInfo[key] =
          goog.i18n.currency.CurrencyInfoTier2[key];
    }
    goog.i18n.currency.tier2Enabled_ = true;
  }
};


/**
 * Deprecated.
 * Global currency pattern always uses ISO-4217 currency code as prefix. Local
 * currency sign is added if it is different from currency code. Each currency
 * is unique in this form. The negative side is that ISO code looks weird in
 * some countries as people normally do not use it. Local currency sign
 * alleviates the problem, but also makes it a little verbose.
 *
 * @param {string} currencyCode ISO-4217 3-letter currency code.
 * @return {string} Global currency pattern string for given currency.
 * @deprecated Format numbers using {@link goog.i18n.NumberFormat} with
 *   {@link goog.i18n.NumberFormat.Format.CURRENCY} and
 *   {@link goog.i18n.NumberFormat.CurrencyStyle.GLOBAL}
 */
goog.i18n.currency.getGlobalCurrencyPattern = function(currencyCode) {
  var info = goog.i18n.currency.CurrencyInfo[currencyCode];
  var patternNum = info[0];
  if (currencyCode == info[1]) {
    return goog.i18n.currency.getCurrencyPattern_(patternNum, info[1]);
  }
  return currencyCode + ' ' +
      goog.i18n.currency.getCurrencyPattern_(patternNum, info[1]);
};


/**
 * Return global currency sign string for those applications
 * that want to handle currency sign themselves.
 *
 * @param {string} currencyCode ISO-4217 3-letter currency code.
 * @return {string} Global currency sign for given currency.
 */
goog.i18n.currency.getGlobalCurrencySign = function(currencyCode) {
  var info = goog.i18n.currency.CurrencyInfo[currencyCode];
  return (currencyCode == info[1]) ? currencyCode :
                                     currencyCode + ' ' + info[1];
};


/**
 * Deprecated.
 * Local currency pattern is the most frequently used pattern in currency's
 * native region. It does not care about how it is distinguished from other
 * currencies.
 *
 * @param {string} currencyCode ISO-4217 3-letter currency code.
 * @return {string} Local currency pattern string for given currency.
 * @deprecated Format numbers using {@link goog.i18n.NumberFormat} with
 *   {@link goog.i18n.NumberFormat.Format.CURRENCY} and
 *   {@link goog.i18n.NumberFormat.CurrencyStyle.LOCAL}
 */
goog.i18n.currency.getLocalCurrencyPattern = function(currencyCode) {
  var info = goog.i18n.currency.CurrencyInfo[currencyCode];
  return goog.i18n.currency.getCurrencyPattern_(info[0], info[1]);
};


/**
 * Returns local currency sign string for those applications that need to
 * handle currency sign separately.
 *
 * @param {string} currencyCode ISO-4217 3-letter currency code.
 * @return {string} Local currency sign for given currency.
 */
goog.i18n.currency.getLocalCurrencySign = function(currencyCode) {
  return goog.i18n.currency.CurrencyInfo[currencyCode][1];
};


/**
 * Deprecated.
 * Portable currency pattern is a compromise between local and global. It is
 * not a mere blend or mid-way between the two. Currency sign is chosen so that
 * it looks familiar to native users. It also has enough information to
 * distinguish itself from other popular currencies in its native region.
 * In this pattern, currency sign symbols that has availability problem in
 * popular fonts are also avoided.
 *
 * @param {string} currencyCode ISO-4217 3-letter currency code.
 * @return {string} Portable currency pattern string for given currency.
 * @deprecated Format numbers using {@link goog.i18n.NumberFormat} with
 *   {@link goog.i18n.NumberFormat.Format.CURRENCY} and
 *   {@link goog.i18n.NumberFormat.CurrencyStyle.PORTABLE}
 */
goog.i18n.currency.getPortableCurrencyPattern = function(currencyCode) {
  var info = goog.i18n.currency.CurrencyInfo[currencyCode];
  return goog.i18n.currency.getCurrencyPattern_(info[0], info[2]);
};


/**
 * Return portable currency sign string for those applications that need to
 * handle currency sign themselves.
 *
 * @param {string} currencyCode ISO-4217 3-letter currency code.
 * @return {string} Portable currency sign for given currency.
 */
goog.i18n.currency.getPortableCurrencySign = function(currencyCode) {
  return goog.i18n.currency.CurrencyInfo[currencyCode][2];
};


/**
 * This function returns the default currency sign's position. Some applications
 * may want to handle currency sign and currency amount separately. This
 * function can be used in such situations to correctly position the currency
 * sign relative to the amount.
 *
 * Use {@link goog.i18n.NumberFormat#isCurrencyCodeBeforeValue} for a locale
 * aware version of this API (recommended). isPrefixSignPosition() returns the
 * default currency sign's position in the currency's default locale (e.g. 'en'
 * for 'USD'), but most commonly the position is needed for the locale in which
 * the number is going to be displayed. For example, in 'fr' 10.10 USD would be
 * displayed as '10,10 $'.
 *
 * @param {string} currencyCode ISO-4217 3-letter currency code.
 * @return {boolean} true if currency should be positioned before amount field.
 */
goog.i18n.currency.isPrefixSignPosition = function(currencyCode) {
  return (goog.i18n.currency.CurrencyInfo[currencyCode][0] &
          goog.i18n.currency.POSITION_FLAG_) == 0;
};


/**
 * This function constructs the currency pattern. Currency sign is provided. The
 * pattern information is encoded in patternNum.
 *
 * @param {number} patternNum Encoded pattern number that has
 *     currency pattern information.
 * @param {string} sign The currency sign that will be used in pattern.
 * @return {string} currency pattern string.
 * @private
 */
goog.i18n.currency.getCurrencyPattern_ = function(patternNum, sign) {
  var strParts = ['#,##0'];
  var precision = patternNum & goog.i18n.currency.PRECISION_MASK_;
  if (precision > 0) {
    strParts.push('.');
    for (var i = 0; i < precision; i++) {
      strParts.push('0');
    }
  }
  if ((patternNum & goog.i18n.currency.POSITION_FLAG_) == 0) {
    strParts.unshift(
        (patternNum & goog.i18n.currency.SPACE_FLAG_) ? "' " : "'");
    strParts.unshift(sign);
    strParts.unshift("'");
  } else {
    strParts.push(
        (patternNum & goog.i18n.currency.SPACE_FLAG_) ? " '" : "'", sign, "'");
  }
  return strParts.join('');
};


/**
 * Modify currency pattern string by adjusting precision for given currency.
 * Standard currency pattern will have 2 digit after decimal point.
 * Examples:
 *   $#,##0.00 ->  $#,##0    (precision == 0)
 *   $#,##0.00 ->  $#,##0.0  (precision == 1)
 *   $#,##0.00 ->  $#,##0.000  (precision == 3)
 *
 * @param {string} pattern currency pattern string.
 * @param {string} currencyCode 3-letter currency code.
 * @return {string} modified currency pattern string.
 */
goog.i18n.currency.adjustPrecision = function(pattern, currencyCode) {
  var strParts = ['0'];
  var info = goog.i18n.currency.CurrencyInfo[currencyCode];
  var precision = info[0] & goog.i18n.currency.PRECISION_MASK_;
  if (precision > 0) {
    strParts.push('.');
    for (var i = 0; i < precision; i++) {
      strParts.push('0');
    }
  }
  return pattern.replace(/0.00/g, strParts.join(''));
};


/**
 * Tier 1 currency information.
 *
 * The first number in the array is a combination of the precision mask and
 * other flags. The precision mask indicates how many decimal places to show for
 * the currency. Valid values are [0..7]. The position flag indicates whether
 * the currency sign should be positioned after the number. Valid values are 0
 * (before the number) or 16 (after the number). The space flag indicates
 * whether a space should be inserted between the currency sign and number.
 * Valid values are 0 (no space) and 32 (space).
 *
 * The number in the array is calculated by adding together the mask and flag
 * values. For example:
 *
 * 0: no precision (0), currency sign first (0), no space (0)
 * 2: two decimals precision (2), currency sign first (0), no space (0)
 * 18: two decimals precision (2), currency sign last (16), no space (0)
 * 50: two decimals precision (2), currency sign last (16), space (32)
 *
 * It's not recommended to read this data directly. Format numbers using
 * {@link goog.i18n.NumberFormat} with
 * {@link goog.i18n.NumberFormat.Format.CURRENCY} instead.
 *
 * @const {!Object<!Array<?>>}
 */
goog.i18n.currency.CurrencyInfo = {
  'AED': [2, 'dh', '\u062f.\u0625.', 'DH'],
  'ALL': [0, 'Lek', 'Lek'],
  'AUD': [2, '$', 'AU$'],
  'BDT': [2, '\u09F3', 'Tk'],
  'BGN': [2, 'lev', 'lev'],
  'BRL': [2, 'R$', 'R$'],
  'CAD': [2, '$', 'C$'],
  'CDF': [2, 'FrCD', 'CDF'],
  'CHF': [2, 'CHF', 'CHF'],
  'CLP': [0, '$', 'CL$'],
  'CNY': [2, '¥', 'RMB¥'],
  'COP': [32, '$', 'COL$'],
  'CRC': [0, '\u20a1', 'CR\u20a1'],
  'CZK': [50, 'K\u010d', 'K\u010d'],
  'DKK': [50, 'kr.', 'kr.'],
  'DOP': [2, 'RD$', 'RD$'],
  'EGP': [2, '£', 'LE'],
  'ETB': [2, 'Birr', 'Birr'],
  'EUR': [2, '€', '€'],
  'GBP': [2, '£', 'GB£'],
  'HKD': [2, '$', 'HK$'],
  'HRK': [2, 'kn', 'kn'],
  'HUF': [34, 'Ft', 'Ft'],
  'IDR': [0, 'Rp', 'Rp'],
  'ILS': [34, '\u20AA', 'IL\u20AA'],
  'INR': [2, '\u20B9', 'Rs'],
  'IRR': [0, 'Rial', 'IRR'],
  'ISK': [0, 'kr', 'kr'],
  'JMD': [2, '$', 'JA$'],
  'JPY': [0, '¥', 'JP¥'],
  'KRW': [0, '\u20A9', 'KR₩'],
  'LKR': [2, 'Rs', 'SLRs'],
  'LTL': [2, 'Lt', 'Lt'],
  'MNT': [0, '\u20AE', 'MN₮'],
  'MVR': [2, 'Rf', 'MVR'],
  'MXN': [2, '$', 'Mex$'],
  'MYR': [2, 'RM', 'RM'],
  'NOK': [50, 'kr', 'NOkr'],
  'PAB': [2, 'B/.', 'B/.'],
  'PEN': [2, 'S/.', 'S/.'],
  'PHP': [2, '\u20B1', 'PHP'],
  'PKR': [0, 'Rs', 'PKRs.'],
  'PLN': [50, 'z\u0142', 'z\u0142'],
  'RON': [2, 'RON', 'RON'],
  'RSD': [0, 'din', 'RSD'],
  'RUB': [50, '\u20bd', 'RUB'],
  'SAR': [2, 'Rial', 'Rial'],
  'SEK': [50, 'kr', 'kr'],
  'SGD': [2, '$', 'S$'],
  'THB': [2, '\u0e3f', 'THB'],
  'TRY': [2, 'TL', 'YTL'],
  'TWD': [2, 'NT$', 'NT$'],
  'TZS': [0, 'TSh', 'TSh'],
  'UAH': [2, 'грн.', 'UAH'],
  'USD': [2, '$', 'US$'],
  'UYU': [2, '$', '$U'],
  'VND': [48, '\u20AB', 'VN\u20AB'],
  'YER': [0, 'Rial', 'Rial'],
  'ZAR': [2, 'R', 'ZAR']
};


/**
 * Tier 2 currency information.
 *
 * It's not recommended to read this data directly. Format numbers using
 * {@link goog.i18n.NumberFormat} with
 * {@link goog.i18n.NumberFormat.Format.CURRENCY} instead.
 *
 * @const {!Object<!Array<?>>}
 */
goog.i18n.currency.CurrencyInfoTier2 = {
  'AFN': [48, 'Af.', 'AFN'],
  'AMD': [32, 'Dram', 'dram'],
  'ANG': [2, 'NAf.', 'ANG'],
  'AOA': [2, 'Kz', 'Kz'],
  'ARS': [34, '$', 'AR$'],
  'AWG': [2, 'Afl.', 'Afl.'],
  'AZN': [34, '\u20bc', 'AZN'],
  'BAM': [2, 'KM', 'KM'],
  'BBD': [2, '$', 'Bds$'],
  'BHD': [3, 'din', 'din'],
  'BIF': [0, 'FBu', 'FBu'],
  'BMD': [2, '$', 'BD$'],
  'BND': [2, '$', 'B$'],
  'BOB': [2, 'Bs', 'Bs'],
  'BSD': [2, '$', 'BS$'],
  'BTN': [2, 'Nu.', 'Nu.'],
  'BWP': [2, 'P', 'pula'],
  'BYR': [48, 'p.', 'BYR'],
  'BZD': [2, '$', 'BZ$'],
  'CUC': [1, '$', 'CUC$'],
  'CUP': [2, '$', 'CU$'],
  'CVE': [2, 'CVE', 'Esc'],
  'DJF': [0, 'Fdj', 'Fdj'],
  'DZD': [2, 'din', 'din'],
  'ERN': [2, 'Nfk', 'Nfk'],
  'FJD': [2, '$', 'FJ$'],
  'FKP': [2, '£', 'FK£'],
  'GEL': [2, 'GEL', 'GEL'],
  'GHS': [2, 'GHS', 'GHS'],
  'GIP': [2, '£', 'GI£'],
  'GMD': [2, 'GMD', 'GMD'],
  'GNF': [0, 'FG', 'FG'],
  'GTQ': [2, 'Q', 'GTQ'],
  'GYD': [0, '$', 'GY$'],
  'HNL': [2, 'L', 'HNL'],
  'HTG': [2, 'HTG', 'HTG'],
  'IQD': [0, 'din', 'IQD'],
  'JOD': [3, 'din', 'JOD'],
  'KES': [2, 'Ksh', 'Ksh'],
  'KGS': [2, 'KGS', 'KGS'],
  'KHR': [2, 'Riel', 'KHR'],
  'KMF': [0, 'CF', 'KMF'],
  'KPW': [0, '\u20A9KP', 'KPW'],
  'KWD': [3, 'din', 'KWD'],
  'KYD': [2, '$', 'KY$'],
  'KZT': [2, '\u20B8', 'KZT'],
  'LAK': [0, '\u20AD', '\u20AD'],
  'LBP': [0, 'L£', 'LBP'],
  'LRD': [2, '$', 'L$'],
  'LSL': [2, 'LSL', 'LSL'],
  'LYD': [3, 'din', 'LD'],
  'MAD': [2, 'dh', 'MAD'],
  'MDL': [2, 'MDL', 'MDL'],
  'MGA': [0, 'Ar', 'MGA'],
  'MKD': [2, 'din', 'MKD'],
  'MMK': [0, 'K', 'MMK'],
  'MOP': [2, 'MOP', 'MOP$'],
  'MRO': [0, 'MRO', 'MRO'],
  'MUR': [0, 'MURs', 'MURs'],
  'MWK': [2, 'MWK', 'MWK'],
  'MZN': [2, 'MTn', 'MTn'],
  'NAD': [2, '$', 'N$'],
  'NGN': [2, '\u20A6', 'NG\u20A6'],
  'NIO': [2, 'C$', 'C$'],
  'NPR': [2, 'Rs', 'NPRs'],
  'NZD': [2, '$', 'NZ$'],
  'OMR': [3, 'Rial', 'OMR'],
  'PGK': [2, 'PGK', 'PGK'],
  'PYG': [16, 'Gs.', 'PYG'],
  'QAR': [2, 'Rial', 'QR'],
  'RWF': [0, 'RF', 'RF'],
  'SBD': [2, '$', 'SI$'],
  'SCR': [2, 'SCR', 'SCR'],
  'SDG': [2, 'SDG', 'SDG'],
  'SHP': [2, '£', 'SH£'],
  'SLL': [0, 'SLL', 'SLL'],
  'SOS': [0, 'SOS', 'SOS'],
  'SRD': [2, '$', 'SR$'],
  'SSP': [2, '£', 'SSP'],
  'STD': [0, 'Db', 'Db'],
  'SYP': [0, '£', 'SY£'],
  'SZL': [2, 'SZL', 'SZL'],
  'TJS': [2, 'Som', 'TJS'],
  'TND': [3, 'din', 'DT'],
  'TOP': [2, 'T$', 'T$'],
  'TTD': [2, '$', 'TT$'],
  'UGX': [0, 'UGX', 'UGX'],
  'UZS': [0, 'so\u02bcm', 'UZS'],
  'VEF': [2, 'Bs', 'Bs'],
  'VUV': [0, 'VUV', 'VUV'],
  'WST': [2, 'WST', 'WST'],
  'XAF': [0, 'FCFA', 'FCFA'],
  'XCD': [2, '$', 'EC$'],
  'XOF': [0, 'CFA', 'CFA'],
  'XPF': [48, 'FCFP', 'FCFP'],
  'ZMW': [0, 'ZMW', 'ZMW'],
  'ZWD': [0, '$', 'Z$']
};
