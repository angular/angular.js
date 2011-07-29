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
 * This module implement a new currency format representation model. It
 * provides 3 currency representation forms: global, portable and local. Local
 * format is the most popular format people use to represent currency in its
 * circulating country without worrying about how it should be distinguished
 * from other currencies.  Global format is a formal representation in context
 * of multiple currencies in same page, it is ISO 4217 currency code. Portable
 * format is a compromise between global and local. It looks similar to how
 * people would like to see how their currencies is being represented in other
 * media. While at the same time, it should be distinguishable to world's
 * popular currencies (like USD, EUR) and currencies somewhat relevant in the
 * area (like CNY in HK, though native currency is HKD). There is no guarantee
 * of uniqueness.
 *
 */


goog.provide('goog.i18n.currency');


/**
 * The mask of precision field.
 * @private
 */
goog.i18n.currency.PRECISION_MASK_ = 0x07;


/**
 * If this flag is set, it means the currency sign should position before
 * number.
 * @private
 */
goog.i18n.currency.POSITION_FLAG_ = 0x08;


/**
 * Should a space to inserted between number and currency sign.
 * @private
 */
goog.i18n.currency.SPACE_FLAG_ = 0x20;


/**
 * This function will add tier2 currency support. Be default, only tier1
 * (most popular currencies) are supportted. If an application really need
 * to support some of the rarely used currency, it should call this function
 * before any other functions in this namespace.
 */
goog.i18n.currency.addTier2Support = function() {
  for (var key in goog.i18n.currency.CurrencyInfoTier2) {
    goog.i18n.currency.CurrencyInfo[key] =
        goog.i18n.currency.CurrencyInfoTier2[key];
  }
};


/**
 * Global currency pattern always uses ISO-4217 currency code as prefix. Local
 * currency sign is added if it is different from currency code. Each currency
 * is unique in this form. The negative side is that ISO code looks weird in
 * some countries as poeple normally do not use it. Local currency sign
 * alleviate the problem, but also make it a little verbose.
 *
 * @param {string} currencyCode ISO-4217 3-letter currency code.
 * @return {string} Global currency pattern string for given currency.
 */
goog.i18n.currency.getGlobalCurrencyPattern = function(currencyCode) {
  var info = goog.i18n.currency.CurrencyInfo[currencyCode];
  var patternNum = info[0];
  if (currencyCode == info[1]) {
    if ((patternNum & goog.i18n.currency.POSITION_FLAG_) == 0) {
      patternNum |= goog.i18n.currency.SPACE_FLAG_;
    }
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
  if (currencyCode == info[1]) {
      return currencyCode;
  }
  return currencyCode + ' ' + info[1];
};


/**
 * Local currency pattern is the most frequently used pattern in currency's
 * native region. It does not care about how it is distinguished from other
 * currencies.
 *
 * @param {string} currencyCode ISO-4217 3-letter currency code.
 * @return {string} Local currency pattern string for given currency.
 */
goog.i18n.currency.getLocalCurrencyPattern = function(currencyCode) {
  var info = goog.i18n.currency.CurrencyInfo[currencyCode];
  return goog.i18n.currency.getCurrencyPattern_(info[0], info[1]);
};


/**
 * Returns local currency sign string for those applications that need to
 * handle currency sign separately.
 * @param {string} currencyCode ISO-4217 3-letter currency code.
 * @return {string} Local currency sign for given currency.
 */
goog.i18n.currency.getLocalCurrencySign = function(currencyCode) {
  return goog.i18n.currency.CurrencyInfo[currencyCode][1];
};


/**
 * Portable currency pattern is a compromise between local and global. It is
 * not a mere blend or mid-way between the two. Currency sign is chosen so that
 * it looks familiar to native users. It also has enough information to
 * distinguish itself from other popular currencies in its native region.
 * In this pattern, currency sign symbols that has availability problem in
 * popular fonts are also avoided.
 *
 * @param {string} currencyCode ISO-4217 3-letter currency code.
 * @return {string} Portable currency pattern string for given currency.
 */
goog.i18n.currency.getPortableCurrencyPattern = function(currencyCode) {
  var info = goog.i18n.currency.CurrencyInfo[currencyCode];
  return goog.i18n.currency.getCurrencyPattern_(info[0], info[2]);
};


/**
 * Return portable currency sign string for those applications that need to
 * handle currency sign themselves.
 * @param {string} currencyCode ISO-4217 3-letter currency code.
 * @return {string} Portable currency sign for given currency.
 */
goog.i18n.currency.getPortableCurrencySign = function(currencyCode) {
  return goog.i18n.currency.CurrencyInfo[currencyCode][2];
};


/**
 * This function returns the default currency sign position. Some application
 * may want to handle currency sign and currency amount separately. This
 * function can be used in such situation to position the currency sign
 * relative to amount field correctly.
 * @param {string} currencyCode ISO-4217 3-letter currency code.
 * @return {boolean} true if currency should be positioned before amount field.
 */
goog.i18n.currency.isPrefixSignPosition = function(currencyCode) {
  return (goog.i18n.currency.CurrencyInfo[currencyCode][0] &
          goog.i18n.currency.POSITION_FLAG_) == 0;
};


/**
 * This function construct the currency pattern. Currency sign is provided. The
 * pattern information is encoded in patternNum.
 *
 * @param {number} patternNum Encoded pattern number that has
 *     currency pattern information.
 * @param {string} sign the currency sign that will be used in pattern.
 *
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
    strParts.unshift((patternNum & goog.i18n.currency.SPACE_FLAG_) ?
                     "' " : "'");
    strParts.unshift(sign);
    strParts.unshift("'");
  } else {
    strParts.push((patternNum & goog.i18n.currency.SPACE_FLAG_) ? " '" : "'",
                  sign, "'");
  }
  return strParts.join('');
};


/**
 * Tier 1 currency information.
 * @type {!Object.<!Array>}
 */
goog.i18n.currency.CurrencyInfo = {
  'AED': [2, '\u062F\u002e\u0625', 'DH'],
  'ARS': [2, '$', 'AR$'],
  'AUD': [2, '$', 'AU$'],
  'BDT': [2, '\u09F3', 'Tk'],
  'BRL': [2, 'R$', 'R$'],
  'CAD': [2, '$', 'C$'],
  'CHF': [2, 'Fr.', 'CHF'],
  'CLP': [0, '$', 'CL$'],
  'CNY': [2, '¥', 'RMB¥'],
  'COP': [2, '$', 'COL$'],
  'CRC': [2, '\u20a1', 'CR₡'],
  'CUP': [2, '$', '$MN'],
  'CZK': [10, 'Kč', 'Kč'],
  'DKK': [26, 'kr', 'kr'],
  'DOP': [2, '$', 'RD$'],
  'EGP': [2, '£', 'LE'],
  'EUR': [26, '€', '€'],
  'GBP': [2, '£', 'GB£'],
  'HKD': [2, '$', 'HK$'],
  'ILS': [10, '\u20AA', 'IL₪'],
  'INR': [2, 'Rs', 'Rs'],
  'ISK': [10, 'kr', 'kr'],
  'JMD': [2, '$', 'JA$'],
  'JPY': [0, '¥', 'JP¥'],
  'KRW': [0, '\u20A9', 'KR₩'],
  'LKR': [2, 'Rs', 'SLRs'],
  'MNT': [2, '\u20AE', 'MN₮'],
  'MXN': [2, '$', 'Mex$'],
  'MYR': [2, 'RM', 'RM'],
  'NOK': [26, 'kr', 'NOkr'],
  'PAB': [2, 'B/.', 'B/.'],
  'PEN': [2, 'S/.', 'S/.'],
  'PHP': [2, 'P', 'PHP'],
  'PKR': [2, 'Rs.', 'PKRs.'],
  'RUB': [10, 'руб', 'руб'],
  'SAR': [2, '\u0633\u002E\u0631', 'SR'],
  'SEK': [10, 'kr', 'kr'],
  'SGD': [2, '$', 'S$'],
  'THB': [2, '\u0e3f', 'THB'],
  'TRY': [2, 'YTL', 'YTL'],
  'TWD': [2, 'NT$', 'NT$'],
  'USD': [2, '$', 'US$'],
  'UYU': [2, '$', 'UY$'],
  'VND': [10, '\u20AB', 'VN₫'],
  'YER': [2, 'YER', 'YER'],
  'ZAR': [2, 'R', 'ZAR']
};


/**
 * Tier 2 currency information.
 * @type {!Object.<!Array>}
 */
goog.i18n.currency.CurrencyInfoTier2 = {
  'AFN': [18, '\u060b', 'AFN'],
  'ALL': [2, 'Lek', 'Lek'],
  'AMD': [10, '\u0564\u0580\u002e', 'dram'],
  'ANG': [2, '\u0083', 'NAƒ'],
  'AOA': [2, 'Kz', 'Kz'],
  'AWG': [2, 'ƒ', 'Afl.'],
  'AZN': [2, 'm', 'man'],
  'BAM': [18, 'КМ', 'KM'],
  'BBD': [2, '$', 'Bds$'],
  'BGN': [10, '\u043b\u0432', 'лв'],
  'BHD': [3, '\u0628\u002e\u062f\u002e', 'BD'],
  'BIF': [0, 'FBu', 'FBu'],
  'BMD': [2, '$', 'BD$'],
  'BND': [2, '$', 'B$'],
  'BOB': [2, 'B$', 'B$'],
  'BSD': [2, '$', 'B$'],
  'BTN': [2, 'Nu.', 'Nu.'],
  'BWP': [2, 'P', 'pula'],
  'BYR': [0, 'Br', 'Br'],
  'BZD': [2, '$', 'BZ$'],
  'CDF': [2, 'F', 'CDF'],
  'CVE': [2, '$', 'Esc'],
  'DJF': [0, 'Fdj', 'Fdj'],
  'DZD': [2, '\u062f\u062C', 'DA'],
  'EEK': [10, 'EEK', 'EEK'],
  'ERN': [2, 'Nfk', 'Nfk'],
  'ETB': [2, 'Br', 'Br'],
  'FJD': [2, '$', 'FJ$'],
  'FKP': [2, '£', 'FK£'],
  'GEL': [2, 'GEL', 'GEL'],
  'GHS': [2, '\u20B5', 'GHS¢'],
  'GIP': [2, '£', 'GI£'],
  'GMD': [2, 'D', 'GMD'],
  'GNF': [0, 'FG', 'FG'],
  'GTQ': [2, 'Q', 'GTQ'],
  'GYD': [2, '$', 'GY$'],
  'HNL': [2, 'L', 'HNL'],
  'HRK': [2, 'kn', 'kn'],
  'HTG': [2, 'G', 'HTG'],
  'HUF': [10, 'Ft', 'Ft'],
  'IDR': [2, 'Rp', 'Rp'],
  'IQD': [3, '\u0639\u062F', 'IQD'],
  'IRR': [2, '\ufdfc', 'IRR'],
  'JOD': [3, 'JOD', 'JOD'],
  'KES': [2, 'KSh', 'KSh'],
  'KGS': [2, 'som', 'som'],
  'KHR': [10, '\u17DB', 'KHR'],
  'KMF': [0, 'KMF', 'KMF'],
  'KPW': [2, '\u20A9', 'KPW'],
  'KWD': [3, '\u062F\u002e\u0643', 'KWD'],
  'KYD': [2, '$', 'CI$'],
  'KZT': [10, 'KZT', 'KZT'],
  'LAK': [2, '\u20AD', 'LA₭'],
  'LBP': [2, '\u0644\u002e\u0644', 'LBP'],
  'LRD': [2, '$', 'L$'],
  'LSL': [2, 'L', 'LSL'],
  'LTL': [10, 'Lt', 'Lt'],
  'LVL': [10, 'Ls', 'Ls'],
  'LYD': [3, '\u0644\u002e\u062F', 'LD'],
  'MAD': [2, '\u0645\u002E\u062F\u002E', 'MAD'],
  'MDL': [2, 'MDL', 'MDL'],
  'MGA': [1, 'MGA', 'MGA'],
  'MKD': [2, 'MKD', 'MKD'],
  'MMK': [2, 'K', 'MMK'],
  'MOP': [2, 'MOP$', 'MOP$'],
  'MRO': [1, 'UM', 'UM'],
  'MUR': [2, 'Rs', 'MURs'],
  'MVR': [2, 'Rf', 'MRF'],
  'MWK': [2, 'MK', 'MK'],
  'MZN': [2, 'MTn', 'MTn'],
  'NAD': [2, '$', 'N$'],
  'NGN': [2, '\u20A6', 'NG₦'],
  'NIO': [2, 'C$', 'C$'],
  'NPR': [2, 'Rs', 'NPRs'],
  'NZD': [2, '$', 'NZ$'],
  'OMR': [3, '\u0639\u002E\u062F\u002E', 'OMR'],
  'PGK': [2, 'K', 'PGK'],
  'PLN': [10, 'zł', 'zł'],
  'PYG': [0, '\u20b2', 'PYG'],
  'QAR': [2, '\u0642\u002E\u0631', 'QR'],
  'RON': [2, 'L', 'RON'],
  'RSD': [2, 'РС\u0414', 'RSD'],
  'RWF': [0, 'RF', 'RF'],
  'SBD': [2, '$', 'SI$'],
  'SCR': [2, 'SR', 'SCR'],
  'SDG': [2, 'SDG', 'SDG'],
  'SHP': [2, '£', 'SH£'],
  'SKK': [10, 'Sk', 'Sk'],
  'SLL': [2, 'Le', 'Le'],
  'SOS': [2, 'So. Sh.', 'So. Sh.'],
  'SRD': [2, '$', 'SR$'],
  'STD': [2, 'Db', 'Db'],
  'SYP': [18, 'SYP', 'SYP'],
  'SZL': [2, 'L', 'SZL'],
  'TJS': [2, 'TJS', 'TJS'],
  'TMM': [2, 'm', 'TMM'],
  'TND': [3, '\u062F\u002e\u062A ', 'DT'],
  'TOP': [2, 'T$', 'T$'],
  'TTD': [2, '$', 'TT$'],
  'TZS': [10, 'TZS', 'TZS'],
  'UAH': [10, '\u20B4', 'грн'],
  'UGX': [2, 'USh', 'USh'],
  'UZS': [2, 'UZS', 'UZS'],
  'VEF': [2, 'Bs.F', 'Bs.F'],
  'VUV': [0, 'Vt', 'Vt'],
  'WST': [2, 'WS$', 'WS$'],
  'XAF': [0, 'FCFA', 'FCFA'],
  'XCD': [2, '$', 'EC$'],
  'XOF': [0, 'CFA', 'CFA'],
  'XPF': [0, 'F', 'XPF'],
  'ZMK': [2, 'ZK', 'ZK'],
  'ZWL': [2, '$', 'ZW$']
};
