// Copyright 2011 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Number formatting symbols.
 *
 * File generated from CLDR ver. 31.0.1
 *
 * To reduce the file size (which may cause issues in some JS
 * developing environments), this file will only contain locales
 * that are frequently used by web applications. This is defined as
 * proto/closure_locales_data.txt and will change (most likely addition)
 * over time.  Rest of the data can be found in another file named
 * "numberformatsymbolsext.js", which will be generated at
 * the same time together with this file.
 *
 * @suppress {const}
 */

// clang-format off

goog.provide('goog.i18n.NumberFormatSymbols');
goog.provide('goog.i18n.NumberFormatSymbols_af');
goog.provide('goog.i18n.NumberFormatSymbols_am');
goog.provide('goog.i18n.NumberFormatSymbols_ar');
goog.provide('goog.i18n.NumberFormatSymbols_ar_DZ');
goog.provide('goog.i18n.NumberFormatSymbols_az');
goog.provide('goog.i18n.NumberFormatSymbols_be');
goog.provide('goog.i18n.NumberFormatSymbols_bg');
goog.provide('goog.i18n.NumberFormatSymbols_bn');
goog.provide('goog.i18n.NumberFormatSymbols_br');
goog.provide('goog.i18n.NumberFormatSymbols_bs');
goog.provide('goog.i18n.NumberFormatSymbols_ca');
goog.provide('goog.i18n.NumberFormatSymbols_chr');
goog.provide('goog.i18n.NumberFormatSymbols_cs');
goog.provide('goog.i18n.NumberFormatSymbols_cy');
goog.provide('goog.i18n.NumberFormatSymbols_da');
goog.provide('goog.i18n.NumberFormatSymbols_de');
goog.provide('goog.i18n.NumberFormatSymbols_de_AT');
goog.provide('goog.i18n.NumberFormatSymbols_de_CH');
goog.provide('goog.i18n.NumberFormatSymbols_el');
goog.provide('goog.i18n.NumberFormatSymbols_en');
goog.provide('goog.i18n.NumberFormatSymbols_en_AU');
goog.provide('goog.i18n.NumberFormatSymbols_en_CA');
goog.provide('goog.i18n.NumberFormatSymbols_en_GB');
goog.provide('goog.i18n.NumberFormatSymbols_en_IE');
goog.provide('goog.i18n.NumberFormatSymbols_en_IN');
goog.provide('goog.i18n.NumberFormatSymbols_en_SG');
goog.provide('goog.i18n.NumberFormatSymbols_en_US');
goog.provide('goog.i18n.NumberFormatSymbols_en_ZA');
goog.provide('goog.i18n.NumberFormatSymbols_es');
goog.provide('goog.i18n.NumberFormatSymbols_es_419');
goog.provide('goog.i18n.NumberFormatSymbols_es_ES');
goog.provide('goog.i18n.NumberFormatSymbols_es_MX');
goog.provide('goog.i18n.NumberFormatSymbols_es_US');
goog.provide('goog.i18n.NumberFormatSymbols_et');
goog.provide('goog.i18n.NumberFormatSymbols_eu');
goog.provide('goog.i18n.NumberFormatSymbols_fa');
goog.provide('goog.i18n.NumberFormatSymbols_fi');
goog.provide('goog.i18n.NumberFormatSymbols_fil');
goog.provide('goog.i18n.NumberFormatSymbols_fr');
goog.provide('goog.i18n.NumberFormatSymbols_fr_CA');
goog.provide('goog.i18n.NumberFormatSymbols_ga');
goog.provide('goog.i18n.NumberFormatSymbols_gl');
goog.provide('goog.i18n.NumberFormatSymbols_gsw');
goog.provide('goog.i18n.NumberFormatSymbols_gu');
goog.provide('goog.i18n.NumberFormatSymbols_haw');
goog.provide('goog.i18n.NumberFormatSymbols_he');
goog.provide('goog.i18n.NumberFormatSymbols_hi');
goog.provide('goog.i18n.NumberFormatSymbols_hr');
goog.provide('goog.i18n.NumberFormatSymbols_hu');
goog.provide('goog.i18n.NumberFormatSymbols_hy');
goog.provide('goog.i18n.NumberFormatSymbols_id');
goog.provide('goog.i18n.NumberFormatSymbols_in');
goog.provide('goog.i18n.NumberFormatSymbols_is');
goog.provide('goog.i18n.NumberFormatSymbols_it');
goog.provide('goog.i18n.NumberFormatSymbols_iw');
goog.provide('goog.i18n.NumberFormatSymbols_ja');
goog.provide('goog.i18n.NumberFormatSymbols_ka');
goog.provide('goog.i18n.NumberFormatSymbols_kk');
goog.provide('goog.i18n.NumberFormatSymbols_km');
goog.provide('goog.i18n.NumberFormatSymbols_kn');
goog.provide('goog.i18n.NumberFormatSymbols_ko');
goog.provide('goog.i18n.NumberFormatSymbols_ky');
goog.provide('goog.i18n.NumberFormatSymbols_ln');
goog.provide('goog.i18n.NumberFormatSymbols_lo');
goog.provide('goog.i18n.NumberFormatSymbols_lt');
goog.provide('goog.i18n.NumberFormatSymbols_lv');
goog.provide('goog.i18n.NumberFormatSymbols_mk');
goog.provide('goog.i18n.NumberFormatSymbols_ml');
goog.provide('goog.i18n.NumberFormatSymbols_mn');
goog.provide('goog.i18n.NumberFormatSymbols_mo');
goog.provide('goog.i18n.NumberFormatSymbols_mr');
goog.provide('goog.i18n.NumberFormatSymbols_ms');
goog.provide('goog.i18n.NumberFormatSymbols_mt');
goog.provide('goog.i18n.NumberFormatSymbols_my');
goog.provide('goog.i18n.NumberFormatSymbols_nb');
goog.provide('goog.i18n.NumberFormatSymbols_ne');
goog.provide('goog.i18n.NumberFormatSymbols_nl');
goog.provide('goog.i18n.NumberFormatSymbols_no');
goog.provide('goog.i18n.NumberFormatSymbols_no_NO');
goog.provide('goog.i18n.NumberFormatSymbols_or');
goog.provide('goog.i18n.NumberFormatSymbols_pa');
goog.provide('goog.i18n.NumberFormatSymbols_pl');
goog.provide('goog.i18n.NumberFormatSymbols_pt');
goog.provide('goog.i18n.NumberFormatSymbols_pt_BR');
goog.provide('goog.i18n.NumberFormatSymbols_pt_PT');
goog.provide('goog.i18n.NumberFormatSymbols_ro');
goog.provide('goog.i18n.NumberFormatSymbols_ru');
goog.provide('goog.i18n.NumberFormatSymbols_sh');
goog.provide('goog.i18n.NumberFormatSymbols_si');
goog.provide('goog.i18n.NumberFormatSymbols_sk');
goog.provide('goog.i18n.NumberFormatSymbols_sl');
goog.provide('goog.i18n.NumberFormatSymbols_sq');
goog.provide('goog.i18n.NumberFormatSymbols_sr');
goog.provide('goog.i18n.NumberFormatSymbols_sr_Latn');
goog.provide('goog.i18n.NumberFormatSymbols_sv');
goog.provide('goog.i18n.NumberFormatSymbols_sw');
goog.provide('goog.i18n.NumberFormatSymbols_ta');
goog.provide('goog.i18n.NumberFormatSymbols_te');
goog.provide('goog.i18n.NumberFormatSymbols_th');
goog.provide('goog.i18n.NumberFormatSymbols_tl');
goog.provide('goog.i18n.NumberFormatSymbols_tr');
goog.provide('goog.i18n.NumberFormatSymbols_uk');
goog.provide('goog.i18n.NumberFormatSymbols_ur');
goog.provide('goog.i18n.NumberFormatSymbols_uz');
goog.provide('goog.i18n.NumberFormatSymbols_vi');
goog.provide('goog.i18n.NumberFormatSymbols_zh');
goog.provide('goog.i18n.NumberFormatSymbols_zh_CN');
goog.provide('goog.i18n.NumberFormatSymbols_zh_HK');
goog.provide('goog.i18n.NumberFormatSymbols_zh_TW');
goog.provide('goog.i18n.NumberFormatSymbols_zu');


/**
 * Number formatting symbols for locale af.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_af = {
  DECIMAL_SEP: ',',
  GROUP_SEP: ' ',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'ZAR'
};


/**
 * Number formatting symbols for locale am.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_am = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'ETB'
};


/**
 * Number formatting symbols for locale ar.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_ar = {
  DECIMAL_SEP: '٫',
  GROUP_SEP: '٬',
  PERCENT: '٪؜',
  ZERO_DIGIT: '٠',
  PLUS_SIGN: '؜+',
  MINUS_SIGN: '؜-',
  EXP_SYMBOL: 'اس',
  PERMILL: '؉',
  INFINITY: '∞',
  NAN: 'ليس رقم',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0 %',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'EGP'
};


/**
 * Number formatting symbols for locale ar_DZ.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_ar_DZ = {
  DECIMAL_SEP: ',',
  GROUP_SEP: '.',
  PERCENT: '‎%‎',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '‎+',
  MINUS_SIGN: '‎-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'ليس رقمًا',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤ #,##0.00',
  DEF_CURRENCY_CODE: 'DZD'
};


/**
 * Number formatting symbols for locale az.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_az = {
  DECIMAL_SEP: ',',
  GROUP_SEP: '.',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤ #,##0.00',
  DEF_CURRENCY_CODE: 'AZN'
};


/**
 * Number formatting symbols for locale be.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_be = {
  DECIMAL_SEP: ',',
  GROUP_SEP: ' ',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0 %',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'BYN'
};


/**
 * Number formatting symbols for locale bg.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_bg = {
  DECIMAL_SEP: ',',
  GROUP_SEP: ' ',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '0.00 ¤',
  DEF_CURRENCY_CODE: 'BGN'
};


/**
 * Number formatting symbols for locale bn.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_bn = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '০',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '#,##,##0.00¤',
  DEF_CURRENCY_CODE: 'BDT'
};


/**
 * Number formatting symbols for locale br.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_br = {
  DECIMAL_SEP: ',',
  GROUP_SEP: ' ',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0 %',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'EUR'
};


/**
 * Number formatting symbols for locale bs.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_bs = {
  DECIMAL_SEP: ',',
  GROUP_SEP: '.',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0 %',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'BAM'
};


/**
 * Number formatting symbols for locale ca.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_ca = {
  DECIMAL_SEP: ',',
  GROUP_SEP: '.',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'EUR'
};


/**
 * Number formatting symbols for locale chr.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_chr = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'USD'
};


/**
 * Number formatting symbols for locale cs.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_cs = {
  DECIMAL_SEP: ',',
  GROUP_SEP: ' ',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0 %',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'CZK'
};


/**
 * Number formatting symbols for locale cy.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_cy = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'GBP'
};


/**
 * Number formatting symbols for locale da.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_da = {
  DECIMAL_SEP: ',',
  GROUP_SEP: '.',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0 %',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'DKK'
};


/**
 * Number formatting symbols for locale de.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_de = {
  DECIMAL_SEP: ',',
  GROUP_SEP: '.',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0 %',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'EUR'
};


/**
 * Number formatting symbols for locale de_AT.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_de_AT = {
  DECIMAL_SEP: ',',
  GROUP_SEP: ' ',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0 %',
  CURRENCY_PATTERN: '¤ #,##0.00',
  DEF_CURRENCY_CODE: 'EUR'
};


/**
 * Number formatting symbols for locale de_CH.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_de_CH = {
  DECIMAL_SEP: '.',
  GROUP_SEP: '’',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤ #,##0.00;¤-#,##0.00',
  DEF_CURRENCY_CODE: 'CHF'
};


/**
 * Number formatting symbols for locale el.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_el = {
  DECIMAL_SEP: ',',
  GROUP_SEP: '.',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'e',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'EUR'
};


/**
 * Number formatting symbols for locale en.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_en = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'USD'
};


/**
 * Number formatting symbols for locale en_AU.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_en_AU = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'e',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'AUD'
};


/**
 * Number formatting symbols for locale en_CA.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_en_CA = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'CAD'
};


/**
 * Number formatting symbols for locale en_GB.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_en_GB = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'GBP'
};


/**
 * Number formatting symbols for locale en_IE.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_en_IE = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'EUR'
};


/**
 * Number formatting symbols for locale en_IN.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_en_IN = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##,##0%',
  CURRENCY_PATTERN: '¤ #,##,##0.00',
  DEF_CURRENCY_CODE: 'INR'
};


/**
 * Number formatting symbols for locale en_SG.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_en_SG = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'SGD'
};


/**
 * Number formatting symbols for locale en_US.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_en_US = goog.i18n.NumberFormatSymbols_en;


/**
 * Number formatting symbols for locale en_ZA.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_en_ZA = {
  DECIMAL_SEP: ',',
  GROUP_SEP: ' ',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'ZAR'
};


/**
 * Number formatting symbols for locale es.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_es = {
  DECIMAL_SEP: ',',
  GROUP_SEP: '.',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0 %',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'EUR'
};


/**
 * Number formatting symbols for locale es_419.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_es_419 = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0 %',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'MXN'
};


/**
 * Number formatting symbols for locale es_ES.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_es_ES = goog.i18n.NumberFormatSymbols_es;


/**
 * Number formatting symbols for locale es_MX.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_es_MX = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'MXN'
};


/**
 * Number formatting symbols for locale es_US.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_es_US = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0 %',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'USD'
};


/**
 * Number formatting symbols for locale et.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_et = {
  DECIMAL_SEP: ',',
  GROUP_SEP: ' ',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '−',
  EXP_SYMBOL: '×10^',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'EUR'
};


/**
 * Number formatting symbols for locale eu.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_eu = {
  DECIMAL_SEP: ',',
  GROUP_SEP: '.',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '% #,##0',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'EUR'
};


/**
 * Number formatting symbols for locale fa.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_fa = {
  DECIMAL_SEP: '٫',
  GROUP_SEP: '٬',
  PERCENT: '‎٪',
  ZERO_DIGIT: '۰',
  PLUS_SIGN: '‎+',
  MINUS_SIGN: '‎−',
  EXP_SYMBOL: '×۱۰^',
  PERMILL: '؉',
  INFINITY: '∞',
  NAN: 'ناعدد',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '% #,##0;% -#,##0',
  CURRENCY_PATTERN: '#,##0.00 ؜¤;؜-#,##0.00 ؜¤',
  DEF_CURRENCY_CODE: 'IRR'
};


/**
 * Number formatting symbols for locale fi.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_fi = {
  DECIMAL_SEP: ',',
  GROUP_SEP: ' ',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '−',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'epäluku',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0 %',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'EUR'
};


/**
 * Number formatting symbols for locale fil.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_fil = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'PHP'
};


/**
 * Number formatting symbols for locale fr.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_fr = {
  DECIMAL_SEP: ',',
  GROUP_SEP: ' ',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0 %',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'EUR'
};


/**
 * Number formatting symbols for locale fr_CA.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_fr_CA = {
  DECIMAL_SEP: ',',
  GROUP_SEP: ' ',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0 %',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'CAD'
};


/**
 * Number formatting symbols for locale ga.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_ga = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'EUR'
};


/**
 * Number formatting symbols for locale gl.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_gl = {
  DECIMAL_SEP: ',',
  GROUP_SEP: '.',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0 %',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'EUR'
};


/**
 * Number formatting symbols for locale gsw.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_gsw = {
  DECIMAL_SEP: '.',
  GROUP_SEP: '’',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '−',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0 %',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'CHF'
};


/**
 * Number formatting symbols for locale gu.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_gu = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##,##0.###',
  SCIENTIFIC_PATTERN: '[#E0]',
  PERCENT_PATTERN: '#,##,##0%',
  CURRENCY_PATTERN: '¤#,##,##0.00',
  DEF_CURRENCY_CODE: 'INR'
};


/**
 * Number formatting symbols for locale haw.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_haw = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'USD'
};


/**
 * Number formatting symbols for locale he.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_he = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '‎+',
  MINUS_SIGN: '‎-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '‏#,##0.00 ¤;‏-#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'ILS'
};


/**
 * Number formatting symbols for locale hi.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_hi = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##,##0.###',
  SCIENTIFIC_PATTERN: '[#E0]',
  PERCENT_PATTERN: '#,##,##0%',
  CURRENCY_PATTERN: '¤#,##,##0.00',
  DEF_CURRENCY_CODE: 'INR'
};


/**
 * Number formatting symbols for locale hr.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_hr = {
  DECIMAL_SEP: ',',
  GROUP_SEP: '.',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'HRK'
};


/**
 * Number formatting symbols for locale hu.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_hu = {
  DECIMAL_SEP: ',',
  GROUP_SEP: ' ',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'HUF'
};


/**
 * Number formatting symbols for locale hy.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_hy = {
  DECIMAL_SEP: ',',
  GROUP_SEP: ' ',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'ՈչԹ',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤ #,##0.00',
  DEF_CURRENCY_CODE: 'AMD'
};


/**
 * Number formatting symbols for locale id.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_id = {
  DECIMAL_SEP: ',',
  GROUP_SEP: '.',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'IDR'
};


/**
 * Number formatting symbols for locale in.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_in = {
  DECIMAL_SEP: ',',
  GROUP_SEP: '.',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'IDR'
};


/**
 * Number formatting symbols for locale is.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_is = {
  DECIMAL_SEP: ',',
  GROUP_SEP: '.',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'ISK'
};


/**
 * Number formatting symbols for locale it.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_it = {
  DECIMAL_SEP: ',',
  GROUP_SEP: '.',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'EUR'
};


/**
 * Number formatting symbols for locale iw.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_iw = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '‎+',
  MINUS_SIGN: '‎-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '‏#,##0.00 ¤;‏-#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'ILS'
};


/**
 * Number formatting symbols for locale ja.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_ja = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'JPY'
};


/**
 * Number formatting symbols for locale ka.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_ka = {
  DECIMAL_SEP: ',',
  GROUP_SEP: ' ',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'არ არის რიცხვი',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0 %',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'GEL'
};


/**
 * Number formatting symbols for locale kk.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_kk = {
  DECIMAL_SEP: ',',
  GROUP_SEP: ' ',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'сан емес',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'KZT'
};


/**
 * Number formatting symbols for locale km.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_km = {
  DECIMAL_SEP: ',',
  GROUP_SEP: '.',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '#,##0.00¤',
  DEF_CURRENCY_CODE: 'KHR'
};


/**
 * Number formatting symbols for locale kn.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_kn = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'INR'
};


/**
 * Number formatting symbols for locale ko.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_ko = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'KRW'
};


/**
 * Number formatting symbols for locale ky.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_ky = {
  DECIMAL_SEP: ',',
  GROUP_SEP: ' ',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'сан эмес',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'KGS'
};


/**
 * Number formatting symbols for locale ln.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_ln = {
  DECIMAL_SEP: ',',
  GROUP_SEP: '.',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'CDF'
};


/**
 * Number formatting symbols for locale lo.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_lo = {
  DECIMAL_SEP: ',',
  GROUP_SEP: '.',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'ບໍ່​ແມ່ນ​ໂຕ​ເລກ',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00;¤-#,##0.00',
  DEF_CURRENCY_CODE: 'LAK'
};


/**
 * Number formatting symbols for locale lt.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_lt = {
  DECIMAL_SEP: ',',
  GROUP_SEP: ' ',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '−',
  EXP_SYMBOL: '×10^',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0 %',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'EUR'
};


/**
 * Number formatting symbols for locale lv.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_lv = {
  DECIMAL_SEP: ',',
  GROUP_SEP: ' ',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NS',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'EUR'
};


/**
 * Number formatting symbols for locale mk.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_mk = {
  DECIMAL_SEP: ',',
  GROUP_SEP: '.',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'MKD'
};


/**
 * Number formatting symbols for locale ml.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_ml = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'INR'
};


/**
 * Number formatting symbols for locale mn.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_mn = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤ #,##0.00',
  DEF_CURRENCY_CODE: 'MNT'
};


/**
 * Number formatting symbols for locale mo.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_mo = {
  DECIMAL_SEP: ',',
  GROUP_SEP: '.',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0 %',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'MDL'
};


/**
 * Number formatting symbols for locale mr.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_mr = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '०',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##,##0.###',
  SCIENTIFIC_PATTERN: '[#E0]',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'INR'
};


/**
 * Number formatting symbols for locale ms.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_ms = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'MYR'
};


/**
 * Number formatting symbols for locale mt.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_mt = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'EUR'
};


/**
 * Number formatting symbols for locale my.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_my = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '၀',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'ဂဏန်းမဟုတ်သော',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'MMK'
};


/**
 * Number formatting symbols for locale nb.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_nb = {
  DECIMAL_SEP: ',',
  GROUP_SEP: ' ',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '−',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0 %',
  CURRENCY_PATTERN: '¤ #,##0.00',
  DEF_CURRENCY_CODE: 'NOK'
};


/**
 * Number formatting symbols for locale ne.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_ne = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '०',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤ #,##0.00',
  DEF_CURRENCY_CODE: 'NPR'
};


/**
 * Number formatting symbols for locale nl.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_nl = {
  DECIMAL_SEP: ',',
  GROUP_SEP: '.',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤ #,##0.00;¤ -#,##0.00',
  DEF_CURRENCY_CODE: 'EUR'
};


/**
 * Number formatting symbols for locale no.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_no = {
  DECIMAL_SEP: ',',
  GROUP_SEP: ' ',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '−',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0 %',
  CURRENCY_PATTERN: '¤ #,##0.00',
  DEF_CURRENCY_CODE: 'NOK'
};


/**
 * Number formatting symbols for locale no_NO.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_no_NO = goog.i18n.NumberFormatSymbols_no;


/**
 * Number formatting symbols for locale or.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_or = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##,##0%',
  CURRENCY_PATTERN: '¤ #,##,##0.00',
  DEF_CURRENCY_CODE: 'INR'
};


/**
 * Number formatting symbols for locale pa.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_pa = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##,##0.###',
  SCIENTIFIC_PATTERN: '[#E0]',
  PERCENT_PATTERN: '#,##,##0%',
  CURRENCY_PATTERN: '¤ #,##,##0.00',
  DEF_CURRENCY_CODE: 'INR'
};


/**
 * Number formatting symbols for locale pl.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_pl = {
  DECIMAL_SEP: ',',
  GROUP_SEP: ' ',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'PLN'
};


/**
 * Number formatting symbols for locale pt.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_pt = {
  DECIMAL_SEP: ',',
  GROUP_SEP: '.',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'BRL'
};


/**
 * Number formatting symbols for locale pt_BR.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_pt_BR = goog.i18n.NumberFormatSymbols_pt;


/**
 * Number formatting symbols for locale pt_PT.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_pt_PT = {
  DECIMAL_SEP: ',',
  GROUP_SEP: ' ',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'EUR'
};


/**
 * Number formatting symbols for locale ro.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_ro = {
  DECIMAL_SEP: ',',
  GROUP_SEP: '.',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0 %',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'RON'
};


/**
 * Number formatting symbols for locale ru.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_ru = {
  DECIMAL_SEP: ',',
  GROUP_SEP: ' ',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'не число',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0 %',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'RUB'
};


/**
 * Number formatting symbols for locale sh.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_sh = {
  DECIMAL_SEP: ',',
  GROUP_SEP: '.',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'RSD'
};


/**
 * Number formatting symbols for locale si.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_si = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'LKR'
};


/**
 * Number formatting symbols for locale sk.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_sk = {
  DECIMAL_SEP: ',',
  GROUP_SEP: ' ',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'e',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0 %',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'EUR'
};


/**
 * Number formatting symbols for locale sl.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_sl = {
  DECIMAL_SEP: ',',
  GROUP_SEP: '.',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '−',
  EXP_SYMBOL: 'e',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0 %',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'EUR'
};


/**
 * Number formatting symbols for locale sq.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_sq = {
  DECIMAL_SEP: ',',
  GROUP_SEP: ' ',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'ALL'
};


/**
 * Number formatting symbols for locale sr.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_sr = {
  DECIMAL_SEP: ',',
  GROUP_SEP: '.',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'RSD'
};


/**
 * Number formatting symbols for locale sr_Latn.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_sr_Latn = goog.i18n.NumberFormatSymbols_sr;


/**
 * Number formatting symbols for locale sv.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_sv = {
  DECIMAL_SEP: ',',
  GROUP_SEP: ' ',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '−',
  EXP_SYMBOL: '×10^',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: '¤¤¤',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0 %',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'SEK'
};


/**
 * Number formatting symbols for locale sw.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_sw = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'TZS'
};


/**
 * Number formatting symbols for locale ta.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_ta = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##,##0%',
  CURRENCY_PATTERN: '¤ #,##,##0.00',
  DEF_CURRENCY_CODE: 'INR'
};


/**
 * Number formatting symbols for locale te.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_te = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##,##0.00',
  DEF_CURRENCY_CODE: 'INR'
};


/**
 * Number formatting symbols for locale th.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_th = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'THB'
};


/**
 * Number formatting symbols for locale tl.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_tl = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'PHP'
};


/**
 * Number formatting symbols for locale tr.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_tr = {
  DECIMAL_SEP: ',',
  GROUP_SEP: '.',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '%#,##0',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'TRY'
};


/**
 * Number formatting symbols for locale uk.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_uk = {
  DECIMAL_SEP: ',',
  GROUP_SEP: ' ',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'Е',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'UAH'
};


/**
 * Number formatting symbols for locale ur.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_ur = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '‎+',
  MINUS_SIGN: '‎-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##,##0%',
  CURRENCY_PATTERN: '¤ #,##,##0.00',
  DEF_CURRENCY_CODE: 'PKR'
};


/**
 * Number formatting symbols for locale uz.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_uz = {
  DECIMAL_SEP: ',',
  GROUP_SEP: ' ',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'haqiqiy son emas',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '#,##0.00 ¤',
  DEF_CURRENCY_CODE: 'UZS'
};


/**
 * Number formatting symbols for locale vi.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_vi = {
  DECIMAL_SEP: ',',
  GROUP_SEP: '.',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤ #,##0.00',
  DEF_CURRENCY_CODE: 'VND'
};


/**
 * Number formatting symbols for locale zh.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_zh = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'CNY'
};


/**
 * Number formatting symbols for locale zh_CN.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_zh_CN = goog.i18n.NumberFormatSymbols_zh;


/**
 * Number formatting symbols for locale zh_HK.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_zh_HK = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: '非數值',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'HKD'
};


/**
 * Number formatting symbols for locale zh_TW.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_zh_TW = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: '非數值',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'TWD'
};


/**
 * Number formatting symbols for locale zu.
 * @enum {string}
 */
goog.i18n.NumberFormatSymbols_zu = {
  DECIMAL_SEP: '.',
  GROUP_SEP: ',',
  PERCENT: '%',
  ZERO_DIGIT: '0',
  PLUS_SIGN: '+',
  MINUS_SIGN: '-',
  EXP_SYMBOL: 'E',
  PERMILL: '‰',
  INFINITY: '∞',
  NAN: 'NaN',
  DECIMAL_PATTERN: '#,##0.###',
  SCIENTIFIC_PATTERN: '#E0',
  PERCENT_PATTERN: '#,##0%',
  CURRENCY_PATTERN: '¤#,##0.00',
  DEF_CURRENCY_CODE: 'ZAR'
};


/**
 * Selected number formatting symbols by locale.
 */
goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en;

if (goog.LOCALE == 'af') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_af;
}

if (goog.LOCALE == 'am') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_am;
}

if (goog.LOCALE == 'ar') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ar;
}

if (goog.LOCALE == 'ar_DZ' || goog.LOCALE == 'ar-DZ') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ar_DZ;
}

if (goog.LOCALE == 'az') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_az;
}

if (goog.LOCALE == 'be') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_be;
}

if (goog.LOCALE == 'bg') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_bg;
}

if (goog.LOCALE == 'bn') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_bn;
}

if (goog.LOCALE == 'br') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_br;
}

if (goog.LOCALE == 'bs') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_bs;
}

if (goog.LOCALE == 'ca') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ca;
}

if (goog.LOCALE == 'chr') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_chr;
}

if (goog.LOCALE == 'cs') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_cs;
}

if (goog.LOCALE == 'cy') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_cy;
}

if (goog.LOCALE == 'da') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_da;
}

if (goog.LOCALE == 'de') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_de;
}

if (goog.LOCALE == 'de_AT' || goog.LOCALE == 'de-AT') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_de_AT;
}

if (goog.LOCALE == 'de_CH' || goog.LOCALE == 'de-CH') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_de_CH;
}

if (goog.LOCALE == 'el') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_el;
}

if (goog.LOCALE == 'en') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en;
}

if (goog.LOCALE == 'en_AU' || goog.LOCALE == 'en-AU') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en_AU;
}

if (goog.LOCALE == 'en_CA' || goog.LOCALE == 'en-CA') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en_CA;
}

if (goog.LOCALE == 'en_GB' || goog.LOCALE == 'en-GB') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en_GB;
}

if (goog.LOCALE == 'en_IE' || goog.LOCALE == 'en-IE') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en_IE;
}

if (goog.LOCALE == 'en_IN' || goog.LOCALE == 'en-IN') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en_IN;
}

if (goog.LOCALE == 'en_SG' || goog.LOCALE == 'en-SG') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en_SG;
}

if (goog.LOCALE == 'en_US' || goog.LOCALE == 'en-US') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en_US;
}

if (goog.LOCALE == 'en_ZA' || goog.LOCALE == 'en-ZA') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_en_ZA;
}

if (goog.LOCALE == 'es') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_es;
}

if (goog.LOCALE == 'es_419' || goog.LOCALE == 'es-419') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_es_419;
}

if (goog.LOCALE == 'es_ES' || goog.LOCALE == 'es-ES') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_es_ES;
}

if (goog.LOCALE == 'es_MX' || goog.LOCALE == 'es-MX') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_es_MX;
}

if (goog.LOCALE == 'es_US' || goog.LOCALE == 'es-US') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_es_US;
}

if (goog.LOCALE == 'et') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_et;
}

if (goog.LOCALE == 'eu') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_eu;
}

if (goog.LOCALE == 'fa') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_fa;
}

if (goog.LOCALE == 'fi') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_fi;
}

if (goog.LOCALE == 'fil') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_fil;
}

if (goog.LOCALE == 'fr') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_fr;
}

if (goog.LOCALE == 'fr_CA' || goog.LOCALE == 'fr-CA') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_fr_CA;
}

if (goog.LOCALE == 'ga') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ga;
}

if (goog.LOCALE == 'gl') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_gl;
}

if (goog.LOCALE == 'gsw') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_gsw;
}

if (goog.LOCALE == 'gu') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_gu;
}

if (goog.LOCALE == 'haw') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_haw;
}

if (goog.LOCALE == 'he') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_he;
}

if (goog.LOCALE == 'hi') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_hi;
}

if (goog.LOCALE == 'hr') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_hr;
}

if (goog.LOCALE == 'hu') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_hu;
}

if (goog.LOCALE == 'hy') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_hy;
}

if (goog.LOCALE == 'id') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_id;
}

if (goog.LOCALE == 'in') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_in;
}

if (goog.LOCALE == 'is') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_is;
}

if (goog.LOCALE == 'it') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_it;
}

if (goog.LOCALE == 'iw') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_iw;
}

if (goog.LOCALE == 'ja') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ja;
}

if (goog.LOCALE == 'ka') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ka;
}

if (goog.LOCALE == 'kk') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_kk;
}

if (goog.LOCALE == 'km') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_km;
}

if (goog.LOCALE == 'kn') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_kn;
}

if (goog.LOCALE == 'ko') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ko;
}

if (goog.LOCALE == 'ky') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ky;
}

if (goog.LOCALE == 'ln') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ln;
}

if (goog.LOCALE == 'lo') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_lo;
}

if (goog.LOCALE == 'lt') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_lt;
}

if (goog.LOCALE == 'lv') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_lv;
}

if (goog.LOCALE == 'mk') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_mk;
}

if (goog.LOCALE == 'ml') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ml;
}

if (goog.LOCALE == 'mn') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_mn;
}

if (goog.LOCALE == 'mo') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_mo;
}

if (goog.LOCALE == 'mr') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_mr;
}

if (goog.LOCALE == 'ms') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ms;
}

if (goog.LOCALE == 'mt') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_mt;
}

if (goog.LOCALE == 'my') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_my;
}

if (goog.LOCALE == 'nb') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_nb;
}

if (goog.LOCALE == 'ne') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ne;
}

if (goog.LOCALE == 'nl') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_nl;
}

if (goog.LOCALE == 'no') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_no;
}

if (goog.LOCALE == 'no_NO' || goog.LOCALE == 'no-NO') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_no_NO;
}

if (goog.LOCALE == 'or') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_or;
}

if (goog.LOCALE == 'pa') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_pa;
}

if (goog.LOCALE == 'pl') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_pl;
}

if (goog.LOCALE == 'pt') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_pt;
}

if (goog.LOCALE == 'pt_BR' || goog.LOCALE == 'pt-BR') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_pt_BR;
}

if (goog.LOCALE == 'pt_PT' || goog.LOCALE == 'pt-PT') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_pt_PT;
}

if (goog.LOCALE == 'ro') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ro;
}

if (goog.LOCALE == 'ru') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ru;
}

if (goog.LOCALE == 'sh') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_sh;
}

if (goog.LOCALE == 'si') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_si;
}

if (goog.LOCALE == 'sk') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_sk;
}

if (goog.LOCALE == 'sl') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_sl;
}

if (goog.LOCALE == 'sq') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_sq;
}

if (goog.LOCALE == 'sr') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_sr;
}

if (goog.LOCALE == 'sr_Latn' || goog.LOCALE == 'sr-Latn') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_sr_Latn;
}

if (goog.LOCALE == 'sv') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_sv;
}

if (goog.LOCALE == 'sw') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_sw;
}

if (goog.LOCALE == 'ta') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ta;
}

if (goog.LOCALE == 'te') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_te;
}

if (goog.LOCALE == 'th') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_th;
}

if (goog.LOCALE == 'tl') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_tl;
}

if (goog.LOCALE == 'tr') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_tr;
}

if (goog.LOCALE == 'uk') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_uk;
}

if (goog.LOCALE == 'ur') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_ur;
}

if (goog.LOCALE == 'uz') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_uz;
}

if (goog.LOCALE == 'vi') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_vi;
}

if (goog.LOCALE == 'zh') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_zh;
}

if (goog.LOCALE == 'zh_CN' || goog.LOCALE == 'zh-CN') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_zh_CN;
}

if (goog.LOCALE == 'zh_HK' || goog.LOCALE == 'zh-HK') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_zh_HK;
}

if (goog.LOCALE == 'zh_TW' || goog.LOCALE == 'zh-TW') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_zh_TW;
}

if (goog.LOCALE == 'zu') {
  goog.i18n.NumberFormatSymbols = goog.i18n.NumberFormatSymbols_zu;
}
