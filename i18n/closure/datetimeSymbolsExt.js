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
 * @fileoverview Date/time formatting symbols for all locales.
 *
 * File generated from CLDR ver. 31.0.1
 *
 * This file covers those locales that are not covered in
 * "datetimesymbols.js".
 *
 * @suppress {const,missingRequire} Suppress "missing require" warnings for
 *     names like goog.i18n.DateTimeSymbols_af. They are included
 *     by requiring goog.i18n.DateTimeSymbols.
 */

// clang-format off

goog.provide('goog.i18n.DateTimeSymbolsExt');
goog.provide('goog.i18n.DateTimeSymbols_af_NA');
goog.provide('goog.i18n.DateTimeSymbols_af_ZA');
goog.provide('goog.i18n.DateTimeSymbols_agq');
goog.provide('goog.i18n.DateTimeSymbols_agq_CM');
goog.provide('goog.i18n.DateTimeSymbols_ak');
goog.provide('goog.i18n.DateTimeSymbols_ak_GH');
goog.provide('goog.i18n.DateTimeSymbols_am_ET');
goog.provide('goog.i18n.DateTimeSymbols_ar_001');
goog.provide('goog.i18n.DateTimeSymbols_ar_AE');
goog.provide('goog.i18n.DateTimeSymbols_ar_BH');
goog.provide('goog.i18n.DateTimeSymbols_ar_DJ');
goog.provide('goog.i18n.DateTimeSymbols_ar_EG');
goog.provide('goog.i18n.DateTimeSymbols_ar_EH');
goog.provide('goog.i18n.DateTimeSymbols_ar_ER');
goog.provide('goog.i18n.DateTimeSymbols_ar_IL');
goog.provide('goog.i18n.DateTimeSymbols_ar_IQ');
goog.provide('goog.i18n.DateTimeSymbols_ar_JO');
goog.provide('goog.i18n.DateTimeSymbols_ar_KM');
goog.provide('goog.i18n.DateTimeSymbols_ar_KW');
goog.provide('goog.i18n.DateTimeSymbols_ar_LB');
goog.provide('goog.i18n.DateTimeSymbols_ar_LY');
goog.provide('goog.i18n.DateTimeSymbols_ar_MA');
goog.provide('goog.i18n.DateTimeSymbols_ar_MR');
goog.provide('goog.i18n.DateTimeSymbols_ar_OM');
goog.provide('goog.i18n.DateTimeSymbols_ar_PS');
goog.provide('goog.i18n.DateTimeSymbols_ar_QA');
goog.provide('goog.i18n.DateTimeSymbols_ar_SA');
goog.provide('goog.i18n.DateTimeSymbols_ar_SD');
goog.provide('goog.i18n.DateTimeSymbols_ar_SO');
goog.provide('goog.i18n.DateTimeSymbols_ar_SS');
goog.provide('goog.i18n.DateTimeSymbols_ar_SY');
goog.provide('goog.i18n.DateTimeSymbols_ar_TD');
goog.provide('goog.i18n.DateTimeSymbols_ar_TN');
goog.provide('goog.i18n.DateTimeSymbols_ar_XB');
goog.provide('goog.i18n.DateTimeSymbols_ar_YE');
goog.provide('goog.i18n.DateTimeSymbols_as');
goog.provide('goog.i18n.DateTimeSymbols_as_IN');
goog.provide('goog.i18n.DateTimeSymbols_asa');
goog.provide('goog.i18n.DateTimeSymbols_asa_TZ');
goog.provide('goog.i18n.DateTimeSymbols_ast');
goog.provide('goog.i18n.DateTimeSymbols_ast_ES');
goog.provide('goog.i18n.DateTimeSymbols_az_Cyrl');
goog.provide('goog.i18n.DateTimeSymbols_az_Cyrl_AZ');
goog.provide('goog.i18n.DateTimeSymbols_az_Latn');
goog.provide('goog.i18n.DateTimeSymbols_az_Latn_AZ');
goog.provide('goog.i18n.DateTimeSymbols_bas');
goog.provide('goog.i18n.DateTimeSymbols_bas_CM');
goog.provide('goog.i18n.DateTimeSymbols_be_BY');
goog.provide('goog.i18n.DateTimeSymbols_bem');
goog.provide('goog.i18n.DateTimeSymbols_bem_ZM');
goog.provide('goog.i18n.DateTimeSymbols_bez');
goog.provide('goog.i18n.DateTimeSymbols_bez_TZ');
goog.provide('goog.i18n.DateTimeSymbols_bg_BG');
goog.provide('goog.i18n.DateTimeSymbols_bm');
goog.provide('goog.i18n.DateTimeSymbols_bm_ML');
goog.provide('goog.i18n.DateTimeSymbols_bn_BD');
goog.provide('goog.i18n.DateTimeSymbols_bn_IN');
goog.provide('goog.i18n.DateTimeSymbols_bo');
goog.provide('goog.i18n.DateTimeSymbols_bo_CN');
goog.provide('goog.i18n.DateTimeSymbols_bo_IN');
goog.provide('goog.i18n.DateTimeSymbols_br_FR');
goog.provide('goog.i18n.DateTimeSymbols_brx');
goog.provide('goog.i18n.DateTimeSymbols_brx_IN');
goog.provide('goog.i18n.DateTimeSymbols_bs_Cyrl');
goog.provide('goog.i18n.DateTimeSymbols_bs_Cyrl_BA');
goog.provide('goog.i18n.DateTimeSymbols_bs_Latn');
goog.provide('goog.i18n.DateTimeSymbols_bs_Latn_BA');
goog.provide('goog.i18n.DateTimeSymbols_ca_AD');
goog.provide('goog.i18n.DateTimeSymbols_ca_ES');
goog.provide('goog.i18n.DateTimeSymbols_ca_FR');
goog.provide('goog.i18n.DateTimeSymbols_ca_IT');
goog.provide('goog.i18n.DateTimeSymbols_ce');
goog.provide('goog.i18n.DateTimeSymbols_ce_RU');
goog.provide('goog.i18n.DateTimeSymbols_cgg');
goog.provide('goog.i18n.DateTimeSymbols_cgg_UG');
goog.provide('goog.i18n.DateTimeSymbols_chr_US');
goog.provide('goog.i18n.DateTimeSymbols_ckb');
goog.provide('goog.i18n.DateTimeSymbols_ckb_IQ');
goog.provide('goog.i18n.DateTimeSymbols_ckb_IR');
goog.provide('goog.i18n.DateTimeSymbols_cs_CZ');
goog.provide('goog.i18n.DateTimeSymbols_cy_GB');
goog.provide('goog.i18n.DateTimeSymbols_da_DK');
goog.provide('goog.i18n.DateTimeSymbols_da_GL');
goog.provide('goog.i18n.DateTimeSymbols_dav');
goog.provide('goog.i18n.DateTimeSymbols_dav_KE');
goog.provide('goog.i18n.DateTimeSymbols_de_BE');
goog.provide('goog.i18n.DateTimeSymbols_de_DE');
goog.provide('goog.i18n.DateTimeSymbols_de_IT');
goog.provide('goog.i18n.DateTimeSymbols_de_LI');
goog.provide('goog.i18n.DateTimeSymbols_de_LU');
goog.provide('goog.i18n.DateTimeSymbols_dje');
goog.provide('goog.i18n.DateTimeSymbols_dje_NE');
goog.provide('goog.i18n.DateTimeSymbols_dsb');
goog.provide('goog.i18n.DateTimeSymbols_dsb_DE');
goog.provide('goog.i18n.DateTimeSymbols_dua');
goog.provide('goog.i18n.DateTimeSymbols_dua_CM');
goog.provide('goog.i18n.DateTimeSymbols_dyo');
goog.provide('goog.i18n.DateTimeSymbols_dyo_SN');
goog.provide('goog.i18n.DateTimeSymbols_dz');
goog.provide('goog.i18n.DateTimeSymbols_dz_BT');
goog.provide('goog.i18n.DateTimeSymbols_ebu');
goog.provide('goog.i18n.DateTimeSymbols_ebu_KE');
goog.provide('goog.i18n.DateTimeSymbols_ee');
goog.provide('goog.i18n.DateTimeSymbols_ee_GH');
goog.provide('goog.i18n.DateTimeSymbols_ee_TG');
goog.provide('goog.i18n.DateTimeSymbols_el_CY');
goog.provide('goog.i18n.DateTimeSymbols_el_GR');
goog.provide('goog.i18n.DateTimeSymbols_en_001');
goog.provide('goog.i18n.DateTimeSymbols_en_150');
goog.provide('goog.i18n.DateTimeSymbols_en_AG');
goog.provide('goog.i18n.DateTimeSymbols_en_AI');
goog.provide('goog.i18n.DateTimeSymbols_en_AS');
goog.provide('goog.i18n.DateTimeSymbols_en_AT');
goog.provide('goog.i18n.DateTimeSymbols_en_BB');
goog.provide('goog.i18n.DateTimeSymbols_en_BE');
goog.provide('goog.i18n.DateTimeSymbols_en_BI');
goog.provide('goog.i18n.DateTimeSymbols_en_BM');
goog.provide('goog.i18n.DateTimeSymbols_en_BS');
goog.provide('goog.i18n.DateTimeSymbols_en_BW');
goog.provide('goog.i18n.DateTimeSymbols_en_BZ');
goog.provide('goog.i18n.DateTimeSymbols_en_CC');
goog.provide('goog.i18n.DateTimeSymbols_en_CH');
goog.provide('goog.i18n.DateTimeSymbols_en_CK');
goog.provide('goog.i18n.DateTimeSymbols_en_CM');
goog.provide('goog.i18n.DateTimeSymbols_en_CX');
goog.provide('goog.i18n.DateTimeSymbols_en_CY');
goog.provide('goog.i18n.DateTimeSymbols_en_DE');
goog.provide('goog.i18n.DateTimeSymbols_en_DG');
goog.provide('goog.i18n.DateTimeSymbols_en_DK');
goog.provide('goog.i18n.DateTimeSymbols_en_DM');
goog.provide('goog.i18n.DateTimeSymbols_en_ER');
goog.provide('goog.i18n.DateTimeSymbols_en_FI');
goog.provide('goog.i18n.DateTimeSymbols_en_FJ');
goog.provide('goog.i18n.DateTimeSymbols_en_FK');
goog.provide('goog.i18n.DateTimeSymbols_en_FM');
goog.provide('goog.i18n.DateTimeSymbols_en_GD');
goog.provide('goog.i18n.DateTimeSymbols_en_GG');
goog.provide('goog.i18n.DateTimeSymbols_en_GH');
goog.provide('goog.i18n.DateTimeSymbols_en_GI');
goog.provide('goog.i18n.DateTimeSymbols_en_GM');
goog.provide('goog.i18n.DateTimeSymbols_en_GU');
goog.provide('goog.i18n.DateTimeSymbols_en_GY');
goog.provide('goog.i18n.DateTimeSymbols_en_HK');
goog.provide('goog.i18n.DateTimeSymbols_en_IL');
goog.provide('goog.i18n.DateTimeSymbols_en_IM');
goog.provide('goog.i18n.DateTimeSymbols_en_IO');
goog.provide('goog.i18n.DateTimeSymbols_en_JE');
goog.provide('goog.i18n.DateTimeSymbols_en_JM');
goog.provide('goog.i18n.DateTimeSymbols_en_KE');
goog.provide('goog.i18n.DateTimeSymbols_en_KI');
goog.provide('goog.i18n.DateTimeSymbols_en_KN');
goog.provide('goog.i18n.DateTimeSymbols_en_KY');
goog.provide('goog.i18n.DateTimeSymbols_en_LC');
goog.provide('goog.i18n.DateTimeSymbols_en_LR');
goog.provide('goog.i18n.DateTimeSymbols_en_LS');
goog.provide('goog.i18n.DateTimeSymbols_en_MG');
goog.provide('goog.i18n.DateTimeSymbols_en_MH');
goog.provide('goog.i18n.DateTimeSymbols_en_MO');
goog.provide('goog.i18n.DateTimeSymbols_en_MP');
goog.provide('goog.i18n.DateTimeSymbols_en_MS');
goog.provide('goog.i18n.DateTimeSymbols_en_MT');
goog.provide('goog.i18n.DateTimeSymbols_en_MU');
goog.provide('goog.i18n.DateTimeSymbols_en_MW');
goog.provide('goog.i18n.DateTimeSymbols_en_MY');
goog.provide('goog.i18n.DateTimeSymbols_en_NA');
goog.provide('goog.i18n.DateTimeSymbols_en_NF');
goog.provide('goog.i18n.DateTimeSymbols_en_NG');
goog.provide('goog.i18n.DateTimeSymbols_en_NL');
goog.provide('goog.i18n.DateTimeSymbols_en_NR');
goog.provide('goog.i18n.DateTimeSymbols_en_NU');
goog.provide('goog.i18n.DateTimeSymbols_en_NZ');
goog.provide('goog.i18n.DateTimeSymbols_en_PG');
goog.provide('goog.i18n.DateTimeSymbols_en_PH');
goog.provide('goog.i18n.DateTimeSymbols_en_PK');
goog.provide('goog.i18n.DateTimeSymbols_en_PN');
goog.provide('goog.i18n.DateTimeSymbols_en_PR');
goog.provide('goog.i18n.DateTimeSymbols_en_PW');
goog.provide('goog.i18n.DateTimeSymbols_en_RW');
goog.provide('goog.i18n.DateTimeSymbols_en_SB');
goog.provide('goog.i18n.DateTimeSymbols_en_SC');
goog.provide('goog.i18n.DateTimeSymbols_en_SD');
goog.provide('goog.i18n.DateTimeSymbols_en_SE');
goog.provide('goog.i18n.DateTimeSymbols_en_SH');
goog.provide('goog.i18n.DateTimeSymbols_en_SI');
goog.provide('goog.i18n.DateTimeSymbols_en_SL');
goog.provide('goog.i18n.DateTimeSymbols_en_SS');
goog.provide('goog.i18n.DateTimeSymbols_en_SX');
goog.provide('goog.i18n.DateTimeSymbols_en_SZ');
goog.provide('goog.i18n.DateTimeSymbols_en_TC');
goog.provide('goog.i18n.DateTimeSymbols_en_TK');
goog.provide('goog.i18n.DateTimeSymbols_en_TO');
goog.provide('goog.i18n.DateTimeSymbols_en_TT');
goog.provide('goog.i18n.DateTimeSymbols_en_TV');
goog.provide('goog.i18n.DateTimeSymbols_en_TZ');
goog.provide('goog.i18n.DateTimeSymbols_en_UG');
goog.provide('goog.i18n.DateTimeSymbols_en_UM');
goog.provide('goog.i18n.DateTimeSymbols_en_US_POSIX');
goog.provide('goog.i18n.DateTimeSymbols_en_VC');
goog.provide('goog.i18n.DateTimeSymbols_en_VG');
goog.provide('goog.i18n.DateTimeSymbols_en_VI');
goog.provide('goog.i18n.DateTimeSymbols_en_VU');
goog.provide('goog.i18n.DateTimeSymbols_en_WS');
goog.provide('goog.i18n.DateTimeSymbols_en_XA');
goog.provide('goog.i18n.DateTimeSymbols_en_ZM');
goog.provide('goog.i18n.DateTimeSymbols_en_ZW');
goog.provide('goog.i18n.DateTimeSymbols_eo');
goog.provide('goog.i18n.DateTimeSymbols_es_AR');
goog.provide('goog.i18n.DateTimeSymbols_es_BO');
goog.provide('goog.i18n.DateTimeSymbols_es_BR');
goog.provide('goog.i18n.DateTimeSymbols_es_BZ');
goog.provide('goog.i18n.DateTimeSymbols_es_CL');
goog.provide('goog.i18n.DateTimeSymbols_es_CO');
goog.provide('goog.i18n.DateTimeSymbols_es_CR');
goog.provide('goog.i18n.DateTimeSymbols_es_CU');
goog.provide('goog.i18n.DateTimeSymbols_es_DO');
goog.provide('goog.i18n.DateTimeSymbols_es_EA');
goog.provide('goog.i18n.DateTimeSymbols_es_EC');
goog.provide('goog.i18n.DateTimeSymbols_es_GQ');
goog.provide('goog.i18n.DateTimeSymbols_es_GT');
goog.provide('goog.i18n.DateTimeSymbols_es_HN');
goog.provide('goog.i18n.DateTimeSymbols_es_IC');
goog.provide('goog.i18n.DateTimeSymbols_es_NI');
goog.provide('goog.i18n.DateTimeSymbols_es_PA');
goog.provide('goog.i18n.DateTimeSymbols_es_PE');
goog.provide('goog.i18n.DateTimeSymbols_es_PH');
goog.provide('goog.i18n.DateTimeSymbols_es_PR');
goog.provide('goog.i18n.DateTimeSymbols_es_PY');
goog.provide('goog.i18n.DateTimeSymbols_es_SV');
goog.provide('goog.i18n.DateTimeSymbols_es_UY');
goog.provide('goog.i18n.DateTimeSymbols_es_VE');
goog.provide('goog.i18n.DateTimeSymbols_et_EE');
goog.provide('goog.i18n.DateTimeSymbols_eu_ES');
goog.provide('goog.i18n.DateTimeSymbols_ewo');
goog.provide('goog.i18n.DateTimeSymbols_ewo_CM');
goog.provide('goog.i18n.DateTimeSymbols_fa_AF');
goog.provide('goog.i18n.DateTimeSymbols_fa_IR');
goog.provide('goog.i18n.DateTimeSymbols_ff');
goog.provide('goog.i18n.DateTimeSymbols_ff_CM');
goog.provide('goog.i18n.DateTimeSymbols_ff_GN');
goog.provide('goog.i18n.DateTimeSymbols_ff_MR');
goog.provide('goog.i18n.DateTimeSymbols_ff_SN');
goog.provide('goog.i18n.DateTimeSymbols_fi_FI');
goog.provide('goog.i18n.DateTimeSymbols_fil_PH');
goog.provide('goog.i18n.DateTimeSymbols_fo');
goog.provide('goog.i18n.DateTimeSymbols_fo_DK');
goog.provide('goog.i18n.DateTimeSymbols_fo_FO');
goog.provide('goog.i18n.DateTimeSymbols_fr_BE');
goog.provide('goog.i18n.DateTimeSymbols_fr_BF');
goog.provide('goog.i18n.DateTimeSymbols_fr_BI');
goog.provide('goog.i18n.DateTimeSymbols_fr_BJ');
goog.provide('goog.i18n.DateTimeSymbols_fr_BL');
goog.provide('goog.i18n.DateTimeSymbols_fr_CD');
goog.provide('goog.i18n.DateTimeSymbols_fr_CF');
goog.provide('goog.i18n.DateTimeSymbols_fr_CG');
goog.provide('goog.i18n.DateTimeSymbols_fr_CH');
goog.provide('goog.i18n.DateTimeSymbols_fr_CI');
goog.provide('goog.i18n.DateTimeSymbols_fr_CM');
goog.provide('goog.i18n.DateTimeSymbols_fr_DJ');
goog.provide('goog.i18n.DateTimeSymbols_fr_DZ');
goog.provide('goog.i18n.DateTimeSymbols_fr_FR');
goog.provide('goog.i18n.DateTimeSymbols_fr_GA');
goog.provide('goog.i18n.DateTimeSymbols_fr_GF');
goog.provide('goog.i18n.DateTimeSymbols_fr_GN');
goog.provide('goog.i18n.DateTimeSymbols_fr_GP');
goog.provide('goog.i18n.DateTimeSymbols_fr_GQ');
goog.provide('goog.i18n.DateTimeSymbols_fr_HT');
goog.provide('goog.i18n.DateTimeSymbols_fr_KM');
goog.provide('goog.i18n.DateTimeSymbols_fr_LU');
goog.provide('goog.i18n.DateTimeSymbols_fr_MA');
goog.provide('goog.i18n.DateTimeSymbols_fr_MC');
goog.provide('goog.i18n.DateTimeSymbols_fr_MF');
goog.provide('goog.i18n.DateTimeSymbols_fr_MG');
goog.provide('goog.i18n.DateTimeSymbols_fr_ML');
goog.provide('goog.i18n.DateTimeSymbols_fr_MQ');
goog.provide('goog.i18n.DateTimeSymbols_fr_MR');
goog.provide('goog.i18n.DateTimeSymbols_fr_MU');
goog.provide('goog.i18n.DateTimeSymbols_fr_NC');
goog.provide('goog.i18n.DateTimeSymbols_fr_NE');
goog.provide('goog.i18n.DateTimeSymbols_fr_PF');
goog.provide('goog.i18n.DateTimeSymbols_fr_PM');
goog.provide('goog.i18n.DateTimeSymbols_fr_RE');
goog.provide('goog.i18n.DateTimeSymbols_fr_RW');
goog.provide('goog.i18n.DateTimeSymbols_fr_SC');
goog.provide('goog.i18n.DateTimeSymbols_fr_SN');
goog.provide('goog.i18n.DateTimeSymbols_fr_SY');
goog.provide('goog.i18n.DateTimeSymbols_fr_TD');
goog.provide('goog.i18n.DateTimeSymbols_fr_TG');
goog.provide('goog.i18n.DateTimeSymbols_fr_TN');
goog.provide('goog.i18n.DateTimeSymbols_fr_VU');
goog.provide('goog.i18n.DateTimeSymbols_fr_WF');
goog.provide('goog.i18n.DateTimeSymbols_fr_YT');
goog.provide('goog.i18n.DateTimeSymbols_fur');
goog.provide('goog.i18n.DateTimeSymbols_fur_IT');
goog.provide('goog.i18n.DateTimeSymbols_fy');
goog.provide('goog.i18n.DateTimeSymbols_fy_NL');
goog.provide('goog.i18n.DateTimeSymbols_ga_IE');
goog.provide('goog.i18n.DateTimeSymbols_gd');
goog.provide('goog.i18n.DateTimeSymbols_gd_GB');
goog.provide('goog.i18n.DateTimeSymbols_gl_ES');
goog.provide('goog.i18n.DateTimeSymbols_gsw_CH');
goog.provide('goog.i18n.DateTimeSymbols_gsw_FR');
goog.provide('goog.i18n.DateTimeSymbols_gsw_LI');
goog.provide('goog.i18n.DateTimeSymbols_gu_IN');
goog.provide('goog.i18n.DateTimeSymbols_guz');
goog.provide('goog.i18n.DateTimeSymbols_guz_KE');
goog.provide('goog.i18n.DateTimeSymbols_gv');
goog.provide('goog.i18n.DateTimeSymbols_gv_IM');
goog.provide('goog.i18n.DateTimeSymbols_ha');
goog.provide('goog.i18n.DateTimeSymbols_ha_GH');
goog.provide('goog.i18n.DateTimeSymbols_ha_NE');
goog.provide('goog.i18n.DateTimeSymbols_ha_NG');
goog.provide('goog.i18n.DateTimeSymbols_haw_US');
goog.provide('goog.i18n.DateTimeSymbols_he_IL');
goog.provide('goog.i18n.DateTimeSymbols_hi_IN');
goog.provide('goog.i18n.DateTimeSymbols_hr_BA');
goog.provide('goog.i18n.DateTimeSymbols_hr_HR');
goog.provide('goog.i18n.DateTimeSymbols_hsb');
goog.provide('goog.i18n.DateTimeSymbols_hsb_DE');
goog.provide('goog.i18n.DateTimeSymbols_hu_HU');
goog.provide('goog.i18n.DateTimeSymbols_hy_AM');
goog.provide('goog.i18n.DateTimeSymbols_id_ID');
goog.provide('goog.i18n.DateTimeSymbols_ig');
goog.provide('goog.i18n.DateTimeSymbols_ig_NG');
goog.provide('goog.i18n.DateTimeSymbols_ii');
goog.provide('goog.i18n.DateTimeSymbols_ii_CN');
goog.provide('goog.i18n.DateTimeSymbols_is_IS');
goog.provide('goog.i18n.DateTimeSymbols_it_CH');
goog.provide('goog.i18n.DateTimeSymbols_it_IT');
goog.provide('goog.i18n.DateTimeSymbols_it_SM');
goog.provide('goog.i18n.DateTimeSymbols_it_VA');
goog.provide('goog.i18n.DateTimeSymbols_ja_JP');
goog.provide('goog.i18n.DateTimeSymbols_jgo');
goog.provide('goog.i18n.DateTimeSymbols_jgo_CM');
goog.provide('goog.i18n.DateTimeSymbols_jmc');
goog.provide('goog.i18n.DateTimeSymbols_jmc_TZ');
goog.provide('goog.i18n.DateTimeSymbols_ka_GE');
goog.provide('goog.i18n.DateTimeSymbols_kab');
goog.provide('goog.i18n.DateTimeSymbols_kab_DZ');
goog.provide('goog.i18n.DateTimeSymbols_kam');
goog.provide('goog.i18n.DateTimeSymbols_kam_KE');
goog.provide('goog.i18n.DateTimeSymbols_kde');
goog.provide('goog.i18n.DateTimeSymbols_kde_TZ');
goog.provide('goog.i18n.DateTimeSymbols_kea');
goog.provide('goog.i18n.DateTimeSymbols_kea_CV');
goog.provide('goog.i18n.DateTimeSymbols_khq');
goog.provide('goog.i18n.DateTimeSymbols_khq_ML');
goog.provide('goog.i18n.DateTimeSymbols_ki');
goog.provide('goog.i18n.DateTimeSymbols_ki_KE');
goog.provide('goog.i18n.DateTimeSymbols_kk_KZ');
goog.provide('goog.i18n.DateTimeSymbols_kkj');
goog.provide('goog.i18n.DateTimeSymbols_kkj_CM');
goog.provide('goog.i18n.DateTimeSymbols_kl');
goog.provide('goog.i18n.DateTimeSymbols_kl_GL');
goog.provide('goog.i18n.DateTimeSymbols_kln');
goog.provide('goog.i18n.DateTimeSymbols_kln_KE');
goog.provide('goog.i18n.DateTimeSymbols_km_KH');
goog.provide('goog.i18n.DateTimeSymbols_kn_IN');
goog.provide('goog.i18n.DateTimeSymbols_ko_KP');
goog.provide('goog.i18n.DateTimeSymbols_ko_KR');
goog.provide('goog.i18n.DateTimeSymbols_kok');
goog.provide('goog.i18n.DateTimeSymbols_kok_IN');
goog.provide('goog.i18n.DateTimeSymbols_ks');
goog.provide('goog.i18n.DateTimeSymbols_ks_IN');
goog.provide('goog.i18n.DateTimeSymbols_ksb');
goog.provide('goog.i18n.DateTimeSymbols_ksb_TZ');
goog.provide('goog.i18n.DateTimeSymbols_ksf');
goog.provide('goog.i18n.DateTimeSymbols_ksf_CM');
goog.provide('goog.i18n.DateTimeSymbols_ksh');
goog.provide('goog.i18n.DateTimeSymbols_ksh_DE');
goog.provide('goog.i18n.DateTimeSymbols_kw');
goog.provide('goog.i18n.DateTimeSymbols_kw_GB');
goog.provide('goog.i18n.DateTimeSymbols_ky_KG');
goog.provide('goog.i18n.DateTimeSymbols_lag');
goog.provide('goog.i18n.DateTimeSymbols_lag_TZ');
goog.provide('goog.i18n.DateTimeSymbols_lb');
goog.provide('goog.i18n.DateTimeSymbols_lb_LU');
goog.provide('goog.i18n.DateTimeSymbols_lg');
goog.provide('goog.i18n.DateTimeSymbols_lg_UG');
goog.provide('goog.i18n.DateTimeSymbols_lkt');
goog.provide('goog.i18n.DateTimeSymbols_lkt_US');
goog.provide('goog.i18n.DateTimeSymbols_ln_AO');
goog.provide('goog.i18n.DateTimeSymbols_ln_CD');
goog.provide('goog.i18n.DateTimeSymbols_ln_CF');
goog.provide('goog.i18n.DateTimeSymbols_ln_CG');
goog.provide('goog.i18n.DateTimeSymbols_lo_LA');
goog.provide('goog.i18n.DateTimeSymbols_lrc');
goog.provide('goog.i18n.DateTimeSymbols_lrc_IQ');
goog.provide('goog.i18n.DateTimeSymbols_lrc_IR');
goog.provide('goog.i18n.DateTimeSymbols_lt_LT');
goog.provide('goog.i18n.DateTimeSymbols_lu');
goog.provide('goog.i18n.DateTimeSymbols_lu_CD');
goog.provide('goog.i18n.DateTimeSymbols_luo');
goog.provide('goog.i18n.DateTimeSymbols_luo_KE');
goog.provide('goog.i18n.DateTimeSymbols_luy');
goog.provide('goog.i18n.DateTimeSymbols_luy_KE');
goog.provide('goog.i18n.DateTimeSymbols_lv_LV');
goog.provide('goog.i18n.DateTimeSymbols_mas');
goog.provide('goog.i18n.DateTimeSymbols_mas_KE');
goog.provide('goog.i18n.DateTimeSymbols_mas_TZ');
goog.provide('goog.i18n.DateTimeSymbols_mer');
goog.provide('goog.i18n.DateTimeSymbols_mer_KE');
goog.provide('goog.i18n.DateTimeSymbols_mfe');
goog.provide('goog.i18n.DateTimeSymbols_mfe_MU');
goog.provide('goog.i18n.DateTimeSymbols_mg');
goog.provide('goog.i18n.DateTimeSymbols_mg_MG');
goog.provide('goog.i18n.DateTimeSymbols_mgh');
goog.provide('goog.i18n.DateTimeSymbols_mgh_MZ');
goog.provide('goog.i18n.DateTimeSymbols_mgo');
goog.provide('goog.i18n.DateTimeSymbols_mgo_CM');
goog.provide('goog.i18n.DateTimeSymbols_mk_MK');
goog.provide('goog.i18n.DateTimeSymbols_ml_IN');
goog.provide('goog.i18n.DateTimeSymbols_mn_MN');
goog.provide('goog.i18n.DateTimeSymbols_mr_IN');
goog.provide('goog.i18n.DateTimeSymbols_ms_BN');
goog.provide('goog.i18n.DateTimeSymbols_ms_MY');
goog.provide('goog.i18n.DateTimeSymbols_ms_SG');
goog.provide('goog.i18n.DateTimeSymbols_mt_MT');
goog.provide('goog.i18n.DateTimeSymbols_mua');
goog.provide('goog.i18n.DateTimeSymbols_mua_CM');
goog.provide('goog.i18n.DateTimeSymbols_my_MM');
goog.provide('goog.i18n.DateTimeSymbols_mzn');
goog.provide('goog.i18n.DateTimeSymbols_mzn_IR');
goog.provide('goog.i18n.DateTimeSymbols_naq');
goog.provide('goog.i18n.DateTimeSymbols_naq_NA');
goog.provide('goog.i18n.DateTimeSymbols_nb_NO');
goog.provide('goog.i18n.DateTimeSymbols_nb_SJ');
goog.provide('goog.i18n.DateTimeSymbols_nd');
goog.provide('goog.i18n.DateTimeSymbols_nd_ZW');
goog.provide('goog.i18n.DateTimeSymbols_nds');
goog.provide('goog.i18n.DateTimeSymbols_nds_DE');
goog.provide('goog.i18n.DateTimeSymbols_nds_NL');
goog.provide('goog.i18n.DateTimeSymbols_ne_IN');
goog.provide('goog.i18n.DateTimeSymbols_ne_NP');
goog.provide('goog.i18n.DateTimeSymbols_nl_AW');
goog.provide('goog.i18n.DateTimeSymbols_nl_BE');
goog.provide('goog.i18n.DateTimeSymbols_nl_BQ');
goog.provide('goog.i18n.DateTimeSymbols_nl_CW');
goog.provide('goog.i18n.DateTimeSymbols_nl_NL');
goog.provide('goog.i18n.DateTimeSymbols_nl_SR');
goog.provide('goog.i18n.DateTimeSymbols_nl_SX');
goog.provide('goog.i18n.DateTimeSymbols_nmg');
goog.provide('goog.i18n.DateTimeSymbols_nmg_CM');
goog.provide('goog.i18n.DateTimeSymbols_nn');
goog.provide('goog.i18n.DateTimeSymbols_nn_NO');
goog.provide('goog.i18n.DateTimeSymbols_nnh');
goog.provide('goog.i18n.DateTimeSymbols_nnh_CM');
goog.provide('goog.i18n.DateTimeSymbols_nus');
goog.provide('goog.i18n.DateTimeSymbols_nus_SS');
goog.provide('goog.i18n.DateTimeSymbols_nyn');
goog.provide('goog.i18n.DateTimeSymbols_nyn_UG');
goog.provide('goog.i18n.DateTimeSymbols_om');
goog.provide('goog.i18n.DateTimeSymbols_om_ET');
goog.provide('goog.i18n.DateTimeSymbols_om_KE');
goog.provide('goog.i18n.DateTimeSymbols_or_IN');
goog.provide('goog.i18n.DateTimeSymbols_os');
goog.provide('goog.i18n.DateTimeSymbols_os_GE');
goog.provide('goog.i18n.DateTimeSymbols_os_RU');
goog.provide('goog.i18n.DateTimeSymbols_pa_Arab');
goog.provide('goog.i18n.DateTimeSymbols_pa_Arab_PK');
goog.provide('goog.i18n.DateTimeSymbols_pa_Guru');
goog.provide('goog.i18n.DateTimeSymbols_pa_Guru_IN');
goog.provide('goog.i18n.DateTimeSymbols_pl_PL');
goog.provide('goog.i18n.DateTimeSymbols_ps');
goog.provide('goog.i18n.DateTimeSymbols_ps_AF');
goog.provide('goog.i18n.DateTimeSymbols_pt_AO');
goog.provide('goog.i18n.DateTimeSymbols_pt_CH');
goog.provide('goog.i18n.DateTimeSymbols_pt_CV');
goog.provide('goog.i18n.DateTimeSymbols_pt_GQ');
goog.provide('goog.i18n.DateTimeSymbols_pt_GW');
goog.provide('goog.i18n.DateTimeSymbols_pt_LU');
goog.provide('goog.i18n.DateTimeSymbols_pt_MO');
goog.provide('goog.i18n.DateTimeSymbols_pt_MZ');
goog.provide('goog.i18n.DateTimeSymbols_pt_ST');
goog.provide('goog.i18n.DateTimeSymbols_pt_TL');
goog.provide('goog.i18n.DateTimeSymbols_qu');
goog.provide('goog.i18n.DateTimeSymbols_qu_BO');
goog.provide('goog.i18n.DateTimeSymbols_qu_EC');
goog.provide('goog.i18n.DateTimeSymbols_qu_PE');
goog.provide('goog.i18n.DateTimeSymbols_rm');
goog.provide('goog.i18n.DateTimeSymbols_rm_CH');
goog.provide('goog.i18n.DateTimeSymbols_rn');
goog.provide('goog.i18n.DateTimeSymbols_rn_BI');
goog.provide('goog.i18n.DateTimeSymbols_ro_MD');
goog.provide('goog.i18n.DateTimeSymbols_ro_RO');
goog.provide('goog.i18n.DateTimeSymbols_rof');
goog.provide('goog.i18n.DateTimeSymbols_rof_TZ');
goog.provide('goog.i18n.DateTimeSymbols_ru_BY');
goog.provide('goog.i18n.DateTimeSymbols_ru_KG');
goog.provide('goog.i18n.DateTimeSymbols_ru_KZ');
goog.provide('goog.i18n.DateTimeSymbols_ru_MD');
goog.provide('goog.i18n.DateTimeSymbols_ru_RU');
goog.provide('goog.i18n.DateTimeSymbols_ru_UA');
goog.provide('goog.i18n.DateTimeSymbols_rw');
goog.provide('goog.i18n.DateTimeSymbols_rw_RW');
goog.provide('goog.i18n.DateTimeSymbols_rwk');
goog.provide('goog.i18n.DateTimeSymbols_rwk_TZ');
goog.provide('goog.i18n.DateTimeSymbols_sah');
goog.provide('goog.i18n.DateTimeSymbols_sah_RU');
goog.provide('goog.i18n.DateTimeSymbols_saq');
goog.provide('goog.i18n.DateTimeSymbols_saq_KE');
goog.provide('goog.i18n.DateTimeSymbols_sbp');
goog.provide('goog.i18n.DateTimeSymbols_sbp_TZ');
goog.provide('goog.i18n.DateTimeSymbols_se');
goog.provide('goog.i18n.DateTimeSymbols_se_FI');
goog.provide('goog.i18n.DateTimeSymbols_se_NO');
goog.provide('goog.i18n.DateTimeSymbols_se_SE');
goog.provide('goog.i18n.DateTimeSymbols_seh');
goog.provide('goog.i18n.DateTimeSymbols_seh_MZ');
goog.provide('goog.i18n.DateTimeSymbols_ses');
goog.provide('goog.i18n.DateTimeSymbols_ses_ML');
goog.provide('goog.i18n.DateTimeSymbols_sg');
goog.provide('goog.i18n.DateTimeSymbols_sg_CF');
goog.provide('goog.i18n.DateTimeSymbols_shi');
goog.provide('goog.i18n.DateTimeSymbols_shi_Latn');
goog.provide('goog.i18n.DateTimeSymbols_shi_Latn_MA');
goog.provide('goog.i18n.DateTimeSymbols_shi_Tfng');
goog.provide('goog.i18n.DateTimeSymbols_shi_Tfng_MA');
goog.provide('goog.i18n.DateTimeSymbols_si_LK');
goog.provide('goog.i18n.DateTimeSymbols_sk_SK');
goog.provide('goog.i18n.DateTimeSymbols_sl_SI');
goog.provide('goog.i18n.DateTimeSymbols_smn');
goog.provide('goog.i18n.DateTimeSymbols_smn_FI');
goog.provide('goog.i18n.DateTimeSymbols_sn');
goog.provide('goog.i18n.DateTimeSymbols_sn_ZW');
goog.provide('goog.i18n.DateTimeSymbols_so');
goog.provide('goog.i18n.DateTimeSymbols_so_DJ');
goog.provide('goog.i18n.DateTimeSymbols_so_ET');
goog.provide('goog.i18n.DateTimeSymbols_so_KE');
goog.provide('goog.i18n.DateTimeSymbols_so_SO');
goog.provide('goog.i18n.DateTimeSymbols_sq_AL');
goog.provide('goog.i18n.DateTimeSymbols_sq_MK');
goog.provide('goog.i18n.DateTimeSymbols_sq_XK');
goog.provide('goog.i18n.DateTimeSymbols_sr_Cyrl');
goog.provide('goog.i18n.DateTimeSymbols_sr_Cyrl_BA');
goog.provide('goog.i18n.DateTimeSymbols_sr_Cyrl_ME');
goog.provide('goog.i18n.DateTimeSymbols_sr_Cyrl_RS');
goog.provide('goog.i18n.DateTimeSymbols_sr_Cyrl_XK');
goog.provide('goog.i18n.DateTimeSymbols_sr_Latn_BA');
goog.provide('goog.i18n.DateTimeSymbols_sr_Latn_ME');
goog.provide('goog.i18n.DateTimeSymbols_sr_Latn_RS');
goog.provide('goog.i18n.DateTimeSymbols_sr_Latn_XK');
goog.provide('goog.i18n.DateTimeSymbols_sv_AX');
goog.provide('goog.i18n.DateTimeSymbols_sv_FI');
goog.provide('goog.i18n.DateTimeSymbols_sv_SE');
goog.provide('goog.i18n.DateTimeSymbols_sw_CD');
goog.provide('goog.i18n.DateTimeSymbols_sw_KE');
goog.provide('goog.i18n.DateTimeSymbols_sw_TZ');
goog.provide('goog.i18n.DateTimeSymbols_sw_UG');
goog.provide('goog.i18n.DateTimeSymbols_ta_IN');
goog.provide('goog.i18n.DateTimeSymbols_ta_LK');
goog.provide('goog.i18n.DateTimeSymbols_ta_MY');
goog.provide('goog.i18n.DateTimeSymbols_ta_SG');
goog.provide('goog.i18n.DateTimeSymbols_te_IN');
goog.provide('goog.i18n.DateTimeSymbols_teo');
goog.provide('goog.i18n.DateTimeSymbols_teo_KE');
goog.provide('goog.i18n.DateTimeSymbols_teo_UG');
goog.provide('goog.i18n.DateTimeSymbols_th_TH');
goog.provide('goog.i18n.DateTimeSymbols_ti');
goog.provide('goog.i18n.DateTimeSymbols_ti_ER');
goog.provide('goog.i18n.DateTimeSymbols_ti_ET');
goog.provide('goog.i18n.DateTimeSymbols_to');
goog.provide('goog.i18n.DateTimeSymbols_to_TO');
goog.provide('goog.i18n.DateTimeSymbols_tr_CY');
goog.provide('goog.i18n.DateTimeSymbols_tr_TR');
goog.provide('goog.i18n.DateTimeSymbols_twq');
goog.provide('goog.i18n.DateTimeSymbols_twq_NE');
goog.provide('goog.i18n.DateTimeSymbols_tzm');
goog.provide('goog.i18n.DateTimeSymbols_tzm_MA');
goog.provide('goog.i18n.DateTimeSymbols_ug');
goog.provide('goog.i18n.DateTimeSymbols_ug_CN');
goog.provide('goog.i18n.DateTimeSymbols_uk_UA');
goog.provide('goog.i18n.DateTimeSymbols_ur_IN');
goog.provide('goog.i18n.DateTimeSymbols_ur_PK');
goog.provide('goog.i18n.DateTimeSymbols_uz_Arab');
goog.provide('goog.i18n.DateTimeSymbols_uz_Arab_AF');
goog.provide('goog.i18n.DateTimeSymbols_uz_Cyrl');
goog.provide('goog.i18n.DateTimeSymbols_uz_Cyrl_UZ');
goog.provide('goog.i18n.DateTimeSymbols_uz_Latn');
goog.provide('goog.i18n.DateTimeSymbols_uz_Latn_UZ');
goog.provide('goog.i18n.DateTimeSymbols_vai');
goog.provide('goog.i18n.DateTimeSymbols_vai_Latn');
goog.provide('goog.i18n.DateTimeSymbols_vai_Latn_LR');
goog.provide('goog.i18n.DateTimeSymbols_vai_Vaii');
goog.provide('goog.i18n.DateTimeSymbols_vai_Vaii_LR');
goog.provide('goog.i18n.DateTimeSymbols_vi_VN');
goog.provide('goog.i18n.DateTimeSymbols_vun');
goog.provide('goog.i18n.DateTimeSymbols_vun_TZ');
goog.provide('goog.i18n.DateTimeSymbols_wae');
goog.provide('goog.i18n.DateTimeSymbols_wae_CH');
goog.provide('goog.i18n.DateTimeSymbols_xog');
goog.provide('goog.i18n.DateTimeSymbols_xog_UG');
goog.provide('goog.i18n.DateTimeSymbols_yav');
goog.provide('goog.i18n.DateTimeSymbols_yav_CM');
goog.provide('goog.i18n.DateTimeSymbols_yi');
goog.provide('goog.i18n.DateTimeSymbols_yi_001');
goog.provide('goog.i18n.DateTimeSymbols_yo');
goog.provide('goog.i18n.DateTimeSymbols_yo_BJ');
goog.provide('goog.i18n.DateTimeSymbols_yo_NG');
goog.provide('goog.i18n.DateTimeSymbols_yue');
goog.provide('goog.i18n.DateTimeSymbols_yue_HK');
goog.provide('goog.i18n.DateTimeSymbols_zgh');
goog.provide('goog.i18n.DateTimeSymbols_zgh_MA');
goog.provide('goog.i18n.DateTimeSymbols_zh_Hans');
goog.provide('goog.i18n.DateTimeSymbols_zh_Hans_CN');
goog.provide('goog.i18n.DateTimeSymbols_zh_Hans_HK');
goog.provide('goog.i18n.DateTimeSymbols_zh_Hans_MO');
goog.provide('goog.i18n.DateTimeSymbols_zh_Hans_SG');
goog.provide('goog.i18n.DateTimeSymbols_zh_Hant');
goog.provide('goog.i18n.DateTimeSymbols_zh_Hant_HK');
goog.provide('goog.i18n.DateTimeSymbols_zh_Hant_MO');
goog.provide('goog.i18n.DateTimeSymbols_zh_Hant_TW');
goog.provide('goog.i18n.DateTimeSymbols_zu_ZA');
goog.require('goog.i18n.DateTimeSymbols');

/**
 * Date/time formatting symbols for locale af_NA.
 */
goog.i18n.DateTimeSymbols_af_NA = {
  ERAS: ['v.C.', 'n.C.'],
  ERANAMES: ['voor Christus', 'na Christus'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['Januarie', 'Februarie', 'Maart', 'April', 'Mei', 'Junie', 'Julie', 'Augustus', 'September', 'Oktober', 'November', 'Desember'],
  STANDALONEMONTHS: ['Januarie', 'Februarie', 'Maart', 'April', 'Mei', 'Junie', 'Julie', 'Augustus', 'September', 'Oktober', 'November', 'Desember'],
  SHORTMONTHS: ['Jan.', 'Feb.', 'Mrt.', 'Apr.', 'Mei', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Des.'],
  STANDALONESHORTMONTHS: ['Jan.', 'Feb.', 'Mrt.', 'Apr.', 'Mei', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Des.'],
  WEEKDAYS: ['Sondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrydag', 'Saterdag'],
  STANDALONEWEEKDAYS: ['Sondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrydag', 'Saterdag'],
  SHORTWEEKDAYS: ['So.', 'Ma.', 'Di.', 'Wo.', 'Do.', 'Vr.', 'Sa.'],
  STANDALONESHORTWEEKDAYS: ['So.', 'Ma.', 'Di.', 'Wo.', 'Do.', 'Vr.', 'Sa.'],
  NARROWWEEKDAYS: ['S', 'M', 'D', 'W', 'D', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'D', 'W', 'D', 'V', 'S'],
  SHORTQUARTERS: ['K1', 'K2', 'K3', 'K4'],
  QUARTERS: ['1ste kwartaal', '2de kwartaal', '3de kwartaal', '4de kwartaal'],
  AMPMS: ['vm.', 'nm.'],
  DATEFORMATS: ['EEEE, dd MMMM y', 'dd MMMM y', 'dd MMM y', 'y-MM-dd'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale af_ZA.
 */
goog.i18n.DateTimeSymbols_af_ZA = goog.i18n.DateTimeSymbols_af;


/**
 * Date/time formatting symbols for locale agq.
 */
goog.i18n.DateTimeSymbols_agq = {
  ERAS: ['SK', 'BK'],
  ERANAMES: ['Sěe Kɨ̀lesto', 'Bǎa Kɨ̀lesto'],
  NARROWMONTHS: ['n', 'k', 't', 't', 's', 'z', 'k', 'f', 'd', 'l', 'c', 'f'],
  STANDALONENARROWMONTHS: ['n', 'k', 't', 't', 's', 'z', 'k', 'f', 'd', 'l', 'c', 'f'],
  MONTHS: ['ndzɔ̀ŋɔ̀nùm', 'ndzɔ̀ŋɔ̀kƗ̀zùʔ', 'ndzɔ̀ŋɔ̀tƗ̀dʉ̀ghà', 'ndzɔ̀ŋɔ̀tǎafʉ̄ghā', 'ndzɔ̀ŋèsèe', 'ndzɔ̀ŋɔ̀nzùghò', 'ndzɔ̀ŋɔ̀dùmlo', 'ndzɔ̀ŋɔ̀kwîfɔ̀e', 'ndzɔ̀ŋɔ̀tƗ̀fʉ̀ghàdzughù', 'ndzɔ̀ŋɔ̀ghǔuwelɔ̀m', 'ndzɔ̀ŋɔ̀chwaʔàkaa wo', 'ndzɔ̀ŋèfwòo'],
  STANDALONEMONTHS: ['ndzɔ̀ŋɔ̀nùm', 'ndzɔ̀ŋɔ̀kƗ̀zùʔ', 'ndzɔ̀ŋɔ̀tƗ̀dʉ̀ghà', 'ndzɔ̀ŋɔ̀tǎafʉ̄ghā', 'ndzɔ̀ŋèsèe', 'ndzɔ̀ŋɔ̀nzùghò', 'ndzɔ̀ŋɔ̀dùmlo', 'ndzɔ̀ŋɔ̀kwîfɔ̀e', 'ndzɔ̀ŋɔ̀tƗ̀fʉ̀ghàdzughù', 'ndzɔ̀ŋɔ̀ghǔuwelɔ̀m', 'ndzɔ̀ŋɔ̀chwaʔàkaa wo', 'ndzɔ̀ŋèfwòo'],
  SHORTMONTHS: ['nùm', 'kɨz', 'tɨd', 'taa', 'see', 'nzu', 'dum', 'fɔe', 'dzu', 'lɔm', 'kaa', 'fwo'],
  STANDALONESHORTMONTHS: ['nùm', 'kɨz', 'tɨd', 'taa', 'see', 'nzu', 'dum', 'fɔe', 'dzu', 'lɔm', 'kaa', 'fwo'],
  WEEKDAYS: ['tsuʔntsɨ', 'tsuʔukpà', 'tsuʔughɔe', 'tsuʔutɔ̀mlò', 'tsuʔumè', 'tsuʔughɨ̂m', 'tsuʔndzɨkɔʔɔ'],
  STANDALONEWEEKDAYS: ['tsuʔntsɨ', 'tsuʔukpà', 'tsuʔughɔe', 'tsuʔutɔ̀mlò', 'tsuʔumè', 'tsuʔughɨ̂m', 'tsuʔndzɨkɔʔɔ'],
  SHORTWEEKDAYS: ['nts', 'kpa', 'ghɔ', 'tɔm', 'ume', 'ghɨ', 'dzk'],
  STANDALONESHORTWEEKDAYS: ['nts', 'kpa', 'ghɔ', 'tɔm', 'ume', 'ghɨ', 'dzk'],
  NARROWWEEKDAYS: ['n', 'k', 'g', 't', 'u', 'g', 'd'],
  STANDALONENARROWWEEKDAYS: ['n', 'k', 'g', 't', 'u', 'g', 'd'],
  SHORTQUARTERS: ['kɨbâ kɨ 1', 'ugbâ u 2', 'ugbâ u 3', 'ugbâ u 4'],
  QUARTERS: ['kɨbâ kɨ 1', 'ugbâ u 2', 'ugbâ u 3', 'ugbâ u 4'],
  AMPMS: ['a.g', 'a.k'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM, y', 'd/M/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale agq_CM.
 */
goog.i18n.DateTimeSymbols_agq_CM = goog.i18n.DateTimeSymbols_agq;


/**
 * Date/time formatting symbols for locale ak.
 */
goog.i18n.DateTimeSymbols_ak = {
  ERAS: ['AK', 'KE'],
  ERANAMES: ['Ansa Kristo', 'Kristo Ekyiri'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['Sanda-Ɔpɛpɔn', 'Kwakwar-Ɔgyefuo', 'Ebɔw-Ɔbenem', 'Ebɔbira-Oforisuo', 'Esusow Aketseaba-Kɔtɔnimba', 'Obirade-Ayɛwohomumu', 'Ayɛwoho-Kitawonsa', 'Difuu-Ɔsandaa', 'Fankwa-Ɛbɔ', 'Ɔbɛsɛ-Ahinime', 'Ɔberɛfɛw-Obubuo', 'Mumu-Ɔpɛnimba'],
  STANDALONEMONTHS: ['Sanda-Ɔpɛpɔn', 'Kwakwar-Ɔgyefuo', 'Ebɔw-Ɔbenem', 'Ebɔbira-Oforisuo', 'Esusow Aketseaba-Kɔtɔnimba', 'Obirade-Ayɛwohomumu', 'Ayɛwoho-Kitawonsa', 'Difuu-Ɔsandaa', 'Fankwa-Ɛbɔ', 'Ɔbɛsɛ-Ahinime', 'Ɔberɛfɛw-Obubuo', 'Mumu-Ɔpɛnimba'],
  SHORTMONTHS: ['S-Ɔ', 'K-Ɔ', 'E-Ɔ', 'E-O', 'E-K', 'O-A', 'A-K', 'D-Ɔ', 'F-Ɛ', 'Ɔ-A', 'Ɔ-O', 'M-Ɔ'],
  STANDALONESHORTMONTHS: ['S-Ɔ', 'K-Ɔ', 'E-Ɔ', 'E-O', 'E-K', 'O-A', 'A-K', 'D-Ɔ', 'F-Ɛ', 'Ɔ-A', 'Ɔ-O', 'M-Ɔ'],
  WEEKDAYS: ['Kwesida', 'Dwowda', 'Benada', 'Wukuda', 'Yawda', 'Fida', 'Memeneda'],
  STANDALONEWEEKDAYS: ['Kwesida', 'Dwowda', 'Benada', 'Wukuda', 'Yawda', 'Fida', 'Memeneda'],
  SHORTWEEKDAYS: ['Kwe', 'Dwo', 'Ben', 'Wuk', 'Yaw', 'Fia', 'Mem'],
  STANDALONESHORTWEEKDAYS: ['Kwe', 'Dwo', 'Ben', 'Wuk', 'Yaw', 'Fia', 'Mem'],
  NARROWWEEKDAYS: ['K', 'D', 'B', 'W', 'Y', 'F', 'M'],
  STANDALONENARROWWEEKDAYS: ['K', 'D', 'B', 'W', 'Y', 'F', 'M'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['AN', 'EW'],
  DATEFORMATS: ['EEEE, y MMMM dd', 'y MMMM d', 'y MMM d', 'yy/MM/dd'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale ak_GH.
 */
goog.i18n.DateTimeSymbols_ak_GH = goog.i18n.DateTimeSymbols_ak;


/**
 * Date/time formatting symbols for locale am_ET.
 */
goog.i18n.DateTimeSymbols_am_ET = goog.i18n.DateTimeSymbols_am;


/**
 * Date/time formatting symbols for locale ar_001.
 */
goog.i18n.DateTimeSymbols_ar_001 = {
  ZERODIGIT: 0x0660,
  ERAS: ['ق.م', 'م'],
  ERANAMES: ['قبل الميلاد', 'ميلادي'],
  NARROWMONTHS: ['ي', 'ف', 'م', 'أ', 'و', 'ن', 'ل', 'غ', 'س', 'ك', 'ب', 'د'],
  STANDALONENARROWMONTHS: ['ي', 'ف', 'م', 'أ', 'و', 'ن', 'ل', 'غ', 'س', 'ك', 'ب', 'د'],
  MONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  STANDALONEMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  SHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  STANDALONESHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  WEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONEWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  SHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONESHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  NARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  STANDALONENARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  SHORTQUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  QUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  AMPMS: ['ص', 'م'],
  DATEFORMATS: ['EEEE، d MMMM، y', 'd MMMM، y', 'dd‏/MM‏/y', 'd‏/M‏/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale ar_AE.
 */
goog.i18n.DateTimeSymbols_ar_AE = goog.i18n.DateTimeSymbols_ar;


/**
 * Date/time formatting symbols for locale ar_BH.
 */
goog.i18n.DateTimeSymbols_ar_BH = goog.i18n.DateTimeSymbols_ar;


/**
 * Date/time formatting symbols for locale ar_DJ.
 */
goog.i18n.DateTimeSymbols_ar_DJ = {
  ZERODIGIT: 0x0660,
  ERAS: ['ق.م', 'م'],
  ERANAMES: ['قبل الميلاد', 'ميلادي'],
  NARROWMONTHS: ['ي', 'ف', 'م', 'أ', 'و', 'ن', 'ل', 'غ', 'س', 'ك', 'ب', 'د'],
  STANDALONENARROWMONTHS: ['ي', 'ف', 'م', 'أ', 'و', 'ن', 'ل', 'غ', 'س', 'ك', 'ب', 'د'],
  MONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  STANDALONEMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  SHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  STANDALONESHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  WEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONEWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  SHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONESHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  NARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  STANDALONENARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  SHORTQUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  QUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  AMPMS: ['ص', 'م'],
  DATEFORMATS: ['EEEE، d MMMM، y', 'd MMMM، y', 'dd‏/MM‏/y', 'd‏/M‏/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 5,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 4
};


/**
 * Date/time formatting symbols for locale ar_EG.
 */
goog.i18n.DateTimeSymbols_ar_EG = goog.i18n.DateTimeSymbols_ar;


/**
 * Date/time formatting symbols for locale ar_EH.
 */
goog.i18n.DateTimeSymbols_ar_EH = {
  ERAS: ['ق.م', 'م'],
  ERANAMES: ['قبل الميلاد', 'ميلادي'],
  NARROWMONTHS: ['ي', 'ف', 'م', 'أ', 'و', 'ن', 'ل', 'غ', 'س', 'ك', 'ب', 'د'],
  STANDALONENARROWMONTHS: ['ي', 'ف', 'م', 'أ', 'و', 'ن', 'ل', 'غ', 'س', 'ك', 'ب', 'د'],
  MONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  STANDALONEMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  SHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  STANDALONESHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  WEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONEWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  SHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONESHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  NARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  STANDALONENARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  SHORTQUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  QUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  AMPMS: ['ص', 'م'],
  DATEFORMATS: ['EEEE، d MMMM، y', 'd MMMM، y', 'dd‏/MM‏/y', 'd‏/M‏/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale ar_ER.
 */
goog.i18n.DateTimeSymbols_ar_ER = {
  ZERODIGIT: 0x0660,
  ERAS: ['ق.م', 'م'],
  ERANAMES: ['قبل الميلاد', 'ميلادي'],
  NARROWMONTHS: ['ي', 'ف', 'م', 'أ', 'و', 'ن', 'ل', 'غ', 'س', 'ك', 'ب', 'د'],
  STANDALONENARROWMONTHS: ['ي', 'ف', 'م', 'أ', 'و', 'ن', 'ل', 'غ', 'س', 'ك', 'ب', 'د'],
  MONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  STANDALONEMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  SHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  STANDALONESHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  WEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONEWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  SHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONESHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  NARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  STANDALONENARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  SHORTQUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  QUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  AMPMS: ['ص', 'م'],
  DATEFORMATS: ['EEEE، d MMMM، y', 'd MMMM، y', 'dd‏/MM‏/y', 'd‏/M‏/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale ar_IL.
 */
goog.i18n.DateTimeSymbols_ar_IL = {
  ZERODIGIT: 0x0660,
  ERAS: ['ق.م', 'م'],
  ERANAMES: ['قبل الميلاد', 'ميلادي'],
  NARROWMONTHS: ['ي', 'ف', 'م', 'أ', 'و', 'ن', 'ل', 'غ', 'س', 'ك', 'ب', 'د'],
  STANDALONENARROWMONTHS: ['ي', 'ف', 'م', 'أ', 'و', 'ن', 'ل', 'غ', 'س', 'ك', 'ب', 'د'],
  MONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  STANDALONEMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  SHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  STANDALONESHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  WEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONEWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  SHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONESHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  NARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  STANDALONENARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  SHORTQUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  QUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  AMPMS: ['ص', 'م'],
  DATEFORMATS: ['EEEE، d MMMM، y', 'd MMMM، y', 'dd‏/MM‏/y', 'd‏/M‏/y'],
  TIMEFORMATS: ['H:mm:ss zzzz', 'H:mm:ss z', 'H:mm:ss', 'H:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [4, 5],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale ar_IQ.
 */
goog.i18n.DateTimeSymbols_ar_IQ = {
  ZERODIGIT: 0x0660,
  ERAS: ['ق.م', 'م'],
  ERANAMES: ['قبل الميلاد', 'ميلادي'],
  NARROWMONTHS: ['ك', 'ش', 'آ', 'ن', 'أ', 'ح', 'ت', 'آ', 'أ', 'ت', 'ت', 'ك'],
  STANDALONENARROWMONTHS: ['ك', 'ش', 'آ', 'ن', 'أ', 'ح', 'ت', 'آ', 'أ', 'ت', 'ت', 'ك'],
  MONTHS: ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'],
  STANDALONEMONTHS: ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'],
  SHORTMONTHS: ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرین الأول', 'تشرين الثاني', 'كانون الأول'],
  STANDALONESHORTMONTHS: ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'],
  WEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONEWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  SHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONESHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  NARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  STANDALONENARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  SHORTQUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  QUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  AMPMS: ['ص', 'م'],
  DATEFORMATS: ['EEEE، d MMMM، y', 'd MMMM، y', 'dd‏/MM‏/y', 'd‏/M‏/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 5,
  WEEKENDRANGE: [4, 5],
  FIRSTWEEKCUTOFFDAY: 4
};


/**
 * Date/time formatting symbols for locale ar_JO.
 */
goog.i18n.DateTimeSymbols_ar_JO = {
  ZERODIGIT: 0x0660,
  ERAS: ['ق.م', 'م'],
  ERANAMES: ['قبل الميلاد', 'ميلادي'],
  NARROWMONTHS: ['ك', 'ش', 'آ', 'ن', 'أ', 'ح', 'ت', 'آ', 'أ', 'ت', 'ت', 'ك'],
  STANDALONENARROWMONTHS: ['ك', 'ش', 'آ', 'ن', 'أ', 'ح', 'ت', 'آ', 'أ', 'ت', 'ت', 'ك'],
  MONTHS: ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'],
  STANDALONEMONTHS: ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'],
  SHORTMONTHS: ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'],
  STANDALONESHORTMONTHS: ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'],
  WEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONEWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  SHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONESHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  NARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  STANDALONENARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  SHORTQUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  QUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  AMPMS: ['ص', 'م'],
  DATEFORMATS: ['EEEE، d MMMM، y', 'd MMMM، y', 'dd‏/MM‏/y', 'd‏/M‏/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 5,
  WEEKENDRANGE: [4, 5],
  FIRSTWEEKCUTOFFDAY: 4
};


/**
 * Date/time formatting symbols for locale ar_KM.
 */
goog.i18n.DateTimeSymbols_ar_KM = {
  ZERODIGIT: 0x0660,
  ERAS: ['ق.م', 'م'],
  ERANAMES: ['قبل الميلاد', 'ميلادي'],
  NARROWMONTHS: ['ي', 'ف', 'م', 'أ', 'و', 'ن', 'ل', 'غ', 'س', 'ك', 'ب', 'د'],
  STANDALONENARROWMONTHS: ['ي', 'ف', 'م', 'أ', 'و', 'ن', 'ل', 'غ', 'س', 'ك', 'ب', 'د'],
  MONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  STANDALONEMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  SHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  STANDALONESHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  WEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONEWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  SHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONESHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  NARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  STANDALONENARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  SHORTQUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  QUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  AMPMS: ['ص', 'م'],
  DATEFORMATS: ['EEEE، d MMMM، y', 'd MMMM، y', 'dd‏/MM‏/y', 'd‏/M‏/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale ar_KW.
 */
goog.i18n.DateTimeSymbols_ar_KW = goog.i18n.DateTimeSymbols_ar;


/**
 * Date/time formatting symbols for locale ar_LB.
 */
goog.i18n.DateTimeSymbols_ar_LB = {
  ZERODIGIT: 0x0660,
  ERAS: ['ق.م', 'م'],
  ERANAMES: ['قبل الميلاد', 'ميلادي'],
  NARROWMONTHS: ['ك', 'ش', 'آ', 'ن', 'أ', 'ح', 'ت', 'آ', 'أ', 'ت', 'ت', 'ك'],
  STANDALONENARROWMONTHS: ['ك', 'ش', 'آ', 'ن', 'أ', 'ح', 'ت', 'آ', 'أ', 'ت', 'ت', 'ك'],
  MONTHS: ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'],
  STANDALONEMONTHS: ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'],
  SHORTMONTHS: ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'],
  STANDALONESHORTMONTHS: ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'],
  WEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONEWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  SHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONESHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  NARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  STANDALONENARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  SHORTQUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  QUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  AMPMS: ['ص', 'م'],
  DATEFORMATS: ['EEEE، d MMMM، y', 'd MMMM، y', 'dd‏/MM‏/y', 'd‏/M‏/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale ar_LY.
 */
goog.i18n.DateTimeSymbols_ar_LY = {
  ERAS: ['ق.م', 'م'],
  ERANAMES: ['قبل الميلاد', 'ميلادي'],
  NARROWMONTHS: ['ي', 'ف', 'م', 'أ', 'و', 'ن', 'ل', 'غ', 'س', 'ك', 'ب', 'د'],
  STANDALONENARROWMONTHS: ['ي', 'ف', 'م', 'أ', 'و', 'ن', 'ل', 'غ', 'س', 'ك', 'ب', 'د'],
  MONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  STANDALONEMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  SHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  STANDALONESHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  WEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONEWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  SHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONESHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  NARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  STANDALONENARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  SHORTQUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  QUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  AMPMS: ['ص', 'م'],
  DATEFORMATS: ['EEEE، d MMMM، y', 'd MMMM، y', 'dd‏/MM‏/y', 'd‏/M‏/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 5,
  WEEKENDRANGE: [4, 5],
  FIRSTWEEKCUTOFFDAY: 4
};


/**
 * Date/time formatting symbols for locale ar_MA.
 */
goog.i18n.DateTimeSymbols_ar_MA = {
  ERAS: ['ق.م', 'م'],
  ERANAMES: ['قبل الميلاد', 'ميلادي'],
  NARROWMONTHS: ['ي', 'ف', 'م', 'أ', 'م', 'ن', 'ل', 'غ', 'ش', 'ك', 'ب', 'د'],
  STANDALONENARROWMONTHS: ['ي', 'ف', 'م', 'أ', 'م', 'ن', 'ل', 'غ', 'ش', 'ك', 'ب', 'د'],
  MONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'ماي', 'يونيو', 'يوليوز', 'غشت', 'شتنبر', 'أكتوبر', 'نونبر', 'دجنبر'],
  STANDALONEMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'ماي', 'يونيو', 'يوليوز', 'غشت', 'شتنبر', 'أكتوبر', 'نونبر', 'دجنبر'],
  SHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'ماي', 'يونيو', 'يوليوز', 'غشت', 'شتنبر', 'أكتوبر', 'نونبر', 'دجنبر'],
  STANDALONESHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'ماي', 'يونيو', 'يوليوز', 'غشت', 'شتنبر', 'أكتوبر', 'نونبر', 'دجنبر'],
  WEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONEWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  SHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONESHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  NARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  STANDALONENARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  SHORTQUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  QUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  AMPMS: ['ص', 'م'],
  DATEFORMATS: ['EEEE، d MMMM، y', 'd MMMM، y', 'dd‏/MM‏/y', 'd‏/M‏/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 5,
  WEEKENDRANGE: [4, 5],
  FIRSTWEEKCUTOFFDAY: 4
};


/**
 * Date/time formatting symbols for locale ar_MR.
 */
goog.i18n.DateTimeSymbols_ar_MR = {
  ZERODIGIT: 0x0660,
  ERAS: ['ق.م', 'م'],
  ERANAMES: ['قبل الميلاد', 'ميلادي'],
  NARROWMONTHS: ['ي', 'ف', 'م', 'إ', 'و', 'ن', 'ل', 'غ', 'ش', 'ك', 'ب', 'د'],
  STANDALONENARROWMONTHS: ['ي', 'ف', 'م', 'إ', 'و', 'ن', 'ل', 'غ', 'ش', 'ك', 'ب', 'د'],
  MONTHS: ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو', 'يوليو', 'أغشت', 'شتمبر', 'أكتوبر', 'نوفمبر', 'دجمبر'],
  STANDALONEMONTHS: ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو', 'يوليو', 'أغشت', 'شتمبر', 'أكتوبر', 'نوفمبر', 'دجمبر'],
  SHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو', 'يوليو', 'أغشت', 'شتمبر', 'أكتوبر', 'نوفمبر', 'دجمبر'],
  STANDALONESHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو', 'يوليو', 'أغشت', 'شتمبر', 'أكتوبر', 'نوفمبر', 'دجمبر'],
  WEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONEWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  SHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONESHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  NARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  STANDALONENARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  SHORTQUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  QUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  AMPMS: ['ص', 'م'],
  DATEFORMATS: ['EEEE، d MMMM، y', 'd MMMM، y', 'dd‏/MM‏/y', 'd‏/M‏/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale ar_OM.
 */
goog.i18n.DateTimeSymbols_ar_OM = goog.i18n.DateTimeSymbols_ar;


/**
 * Date/time formatting symbols for locale ar_PS.
 */
goog.i18n.DateTimeSymbols_ar_PS = {
  ZERODIGIT: 0x0660,
  ERAS: ['ق.م', 'م'],
  ERANAMES: ['قبل الميلاد', 'ميلادي'],
  NARROWMONTHS: ['ك', 'ش', 'آ', 'ن', 'أ', 'ح', 'ت', 'آ', 'أ', 'ت', 'ت', 'ك'],
  STANDALONENARROWMONTHS: ['ك', 'ش', 'آ', 'ن', 'أ', 'ح', 'ت', 'آ', 'أ', 'ت', 'ت', 'ك'],
  MONTHS: ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'],
  STANDALONEMONTHS: ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'],
  SHORTMONTHS: ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'],
  STANDALONESHORTMONTHS: ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'],
  WEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONEWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  SHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONESHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  NARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  STANDALONENARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  SHORTQUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  QUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  AMPMS: ['ص', 'م'],
  DATEFORMATS: ['EEEE، d MMMM، y', 'd MMMM، y', 'dd‏/MM‏/y', 'd‏/M‏/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale ar_QA.
 */
goog.i18n.DateTimeSymbols_ar_QA = goog.i18n.DateTimeSymbols_ar;


/**
 * Date/time formatting symbols for locale ar_SA.
 */
goog.i18n.DateTimeSymbols_ar_SA = {
  ZERODIGIT: 0x0660,
  ERAS: ['ق.م', 'م'],
  ERANAMES: ['قبل الميلاد', 'ميلادي'],
  NARROWMONTHS: ['ي', 'ف', 'م', 'أ', 'و', 'ن', 'ل', 'غ', 'س', 'ك', 'ب', 'د'],
  STANDALONENARROWMONTHS: ['ي', 'ف', 'م', 'أ', 'و', 'ن', 'ل', 'غ', 'س', 'ك', 'ب', 'د'],
  MONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  STANDALONEMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  SHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  STANDALONESHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  WEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONEWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  SHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONESHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  NARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  STANDALONENARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  SHORTQUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  QUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  AMPMS: ['ص', 'م'],
  DATEFORMATS: ['EEEE، d MMMM، y', 'd MMMM، y', 'dd‏/MM‏/y', 'd‏/M‏/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [4, 5],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale ar_SD.
 */
goog.i18n.DateTimeSymbols_ar_SD = goog.i18n.DateTimeSymbols_ar;


/**
 * Date/time formatting symbols for locale ar_SO.
 */
goog.i18n.DateTimeSymbols_ar_SO = {
  ZERODIGIT: 0x0660,
  ERAS: ['ق.م', 'م'],
  ERANAMES: ['قبل الميلاد', 'ميلادي'],
  NARROWMONTHS: ['ي', 'ف', 'م', 'أ', 'و', 'ن', 'ل', 'غ', 'س', 'ك', 'ب', 'د'],
  STANDALONENARROWMONTHS: ['ي', 'ف', 'م', 'أ', 'و', 'ن', 'ل', 'غ', 'س', 'ك', 'ب', 'د'],
  MONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  STANDALONEMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  SHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  STANDALONESHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  WEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONEWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  SHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONESHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  NARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  STANDALONENARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  SHORTQUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  QUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  AMPMS: ['ص', 'م'],
  DATEFORMATS: ['EEEE، d MMMM، y', 'd MMMM، y', 'dd‏/MM‏/y', 'd‏/M‏/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale ar_SS.
 */
goog.i18n.DateTimeSymbols_ar_SS = {
  ZERODIGIT: 0x0660,
  ERAS: ['ق.م', 'م'],
  ERANAMES: ['قبل الميلاد', 'ميلادي'],
  NARROWMONTHS: ['ي', 'ف', 'م', 'أ', 'و', 'ن', 'ل', 'غ', 'س', 'ك', 'ب', 'د'],
  STANDALONENARROWMONTHS: ['ي', 'ف', 'م', 'أ', 'و', 'ن', 'ل', 'غ', 'س', 'ك', 'ب', 'د'],
  MONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  STANDALONEMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  SHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  STANDALONESHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  WEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONEWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  SHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONESHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  NARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  STANDALONENARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  SHORTQUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  QUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  AMPMS: ['ص', 'م'],
  DATEFORMATS: ['EEEE، d MMMM، y', 'd MMMM، y', 'dd‏/MM‏/y', 'd‏/M‏/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale ar_SY.
 */
goog.i18n.DateTimeSymbols_ar_SY = {
  ZERODIGIT: 0x0660,
  ERAS: ['ق.م', 'م'],
  ERANAMES: ['قبل الميلاد', 'ميلادي'],
  NARROWMONTHS: ['ك', 'ش', 'آ', 'ن', 'أ', 'ح', 'ت', 'آ', 'أ', 'ت', 'ت', 'ك'],
  STANDALONENARROWMONTHS: ['ك', 'ش', 'آ', 'ن', 'أ', 'ح', 'ت', 'آ', 'أ', 'ت', 'ت', 'ك'],
  MONTHS: ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'],
  STANDALONEMONTHS: ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'],
  SHORTMONTHS: ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'],
  STANDALONESHORTMONTHS: ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'],
  WEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONEWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  SHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONESHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  NARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  STANDALONENARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  SHORTQUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  QUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  AMPMS: ['ص', 'م'],
  DATEFORMATS: ['EEEE، d MMMM، y', 'd MMMM، y', 'dd‏/MM‏/y', 'd‏/M‏/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 5,
  WEEKENDRANGE: [4, 5],
  FIRSTWEEKCUTOFFDAY: 4
};


/**
 * Date/time formatting symbols for locale ar_TD.
 */
goog.i18n.DateTimeSymbols_ar_TD = {
  ZERODIGIT: 0x0660,
  ERAS: ['ق.م', 'م'],
  ERANAMES: ['قبل الميلاد', 'ميلادي'],
  NARROWMONTHS: ['ي', 'ف', 'م', 'أ', 'و', 'ن', 'ل', 'غ', 'س', 'ك', 'ب', 'د'],
  STANDALONENARROWMONTHS: ['ي', 'ف', 'م', 'أ', 'و', 'ن', 'ل', 'غ', 'س', 'ك', 'ب', 'د'],
  MONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  STANDALONEMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  SHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  STANDALONESHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  WEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONEWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  SHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONESHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  NARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  STANDALONENARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  SHORTQUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  QUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  AMPMS: ['ص', 'م'],
  DATEFORMATS: ['EEEE، d MMMM، y', 'd MMMM، y', 'dd‏/MM‏/y', 'd‏/M‏/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale ar_TN.
 */
goog.i18n.DateTimeSymbols_ar_TN = {
  ERAS: ['ق.م', 'م'],
  ERANAMES: ['قبل الميلاد', 'ميلادي'],
  NARROWMONTHS: ['ج', 'ف', 'م', 'أ', 'م', 'ج', 'ج', 'أ', 'س', 'أ', 'ن', 'د'],
  STANDALONENARROWMONTHS: ['ج', 'ف', 'م', 'أ', 'م', 'ج', 'ج', 'أ', 'س', 'أ', 'ن', 'د'],
  MONTHS: ['جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان', 'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  STANDALONEMONTHS: ['جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان', 'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  SHORTMONTHS: ['جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان', 'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  STANDALONESHORTMONTHS: ['جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان', 'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  WEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONEWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  SHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONESHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  NARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  STANDALONENARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  SHORTQUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  QUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  AMPMS: ['ص', 'م'],
  DATEFORMATS: ['EEEE، d MMMM، y', 'd MMMM، y', 'dd‏/MM‏/y', 'd‏/M‏/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [4, 5],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale ar_XB.
 */
goog.i18n.DateTimeSymbols_ar_XB = {
  ERAS: ['؜‮BC‬؜', '؜‮AD‬؜'],
  ERANAMES: ['؜‮Before‬؜ ؜‮Christ‬؜', '؜‮Anno‬؜ ؜‮Domini‬؜'],
  NARROWMONTHS: ['ي', 'ف', 'م', 'أ', 'و', 'ن', 'ل', 'غ', 'س', 'ك', 'ب', 'د'],
  STANDALONENARROWMONTHS: ['ي', 'ف', 'م', 'أ', 'و', 'ن', 'ل', 'غ', 'س', 'ك', 'ب', 'د'],
  MONTHS: ['؜‮January‬؜', '؜‮February‬؜', '؜‮March‬؜', '؜‮April‬؜', '؜‮May‬؜', '؜‮June‬؜', '؜‮July‬؜', '؜‮August‬؜', '؜‮September‬؜', '؜‮October‬؜', '؜‮November‬؜', '؜‮December‬؜'],
  STANDALONEMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  SHORTMONTHS: ['؜‮Jan‬؜', '؜‮Feb‬؜', '؜‮Mar‬؜', '؜‮Apr‬؜', '؜‮May‬؜', '؜‮Jun‬؜', '؜‮Jul‬؜', '؜‮Aug‬؜', '؜‮Sep‬؜', '؜‮Oct‬؜', '؜‮Nov‬؜', '؜‮Dec‬؜'],
  STANDALONESHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  WEEKDAYS: ['؜‮Sunday‬؜', '؜‮Monday‬؜', '؜‮Tuesday‬؜', '؜‮Wednesday‬؜', '؜‮Thursday‬؜', '؜‮Friday‬؜', '؜‮Saturday‬؜'],
  STANDALONEWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  SHORTWEEKDAYS: ['؜‮Sun‬؜', '؜‮Mon‬؜', '؜‮Tue‬؜', '؜‮Wed‬؜', '؜‮Thu‬؜', '؜‮Fri‬؜', '؜‮Sat‬؜'],
  STANDALONESHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  NARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  STANDALONENARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  SHORTQUARTERS: ['؜‮Q‬؜1', '؜‮Q‬؜2', '؜‮Q‬؜3', '؜‮Q‬؜4'],
  QUARTERS: ['1؜‮st‬؜ ؜‮quarter‬؜', '2؜‮nd‬؜ ؜‮quarter‬؜', '3؜‮rd‬؜ ؜‮quarter‬؜', '4؜‮th‬؜ ؜‮quarter‬؜'],
  AMPMS: ['؜‮AM‬؜', '؜‮PM‬؜'],
  DATEFORMATS: ['EEEE، d MMMM، y', 'd MMMM، y', 'dd‏/MM‏/y', 'd‏/M‏/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'؜‮at‬؜\' {0}', '{1} \'؜‮at‬؜\' {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale ar_YE.
 */
goog.i18n.DateTimeSymbols_ar_YE = {
  ZERODIGIT: 0x0660,
  ERAS: ['ق.م', 'م'],
  ERANAMES: ['قبل الميلاد', 'ميلادي'],
  NARROWMONTHS: ['ي', 'ف', 'م', 'أ', 'و', 'ن', 'ل', 'غ', 'س', 'ك', 'ب', 'د'],
  STANDALONENARROWMONTHS: ['ي', 'ف', 'م', 'أ', 'و', 'ن', 'ل', 'غ', 'س', 'ك', 'ب', 'د'],
  MONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  STANDALONEMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  SHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  STANDALONESHORTMONTHS: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  WEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONEWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  SHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  STANDALONESHORTWEEKDAYS: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  NARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  STANDALONENARROWWEEKDAYS: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  SHORTQUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  QUARTERS: ['الربع الأول', 'الربع الثاني', 'الربع الثالث', 'الربع الرابع'],
  AMPMS: ['ص', 'م'],
  DATEFORMATS: ['EEEE، d MMMM، y', 'd MMMM، y', 'dd‏/MM‏/y', 'd‏/M‏/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [4, 5],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale as.
 */
goog.i18n.DateTimeSymbols_as = {
  ZERODIGIT: 0x09E6,
  ERAS: ['BCE', 'CE'],
  ERANAMES: ['BCE', 'CE'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['জানুৱাৰী', 'ফেব্ৰুৱাৰী', 'মাৰ্চ', 'এপ্ৰিল', 'মে', 'জুন', 'জুলাই', 'আগষ্ট', 'ছেপ্তেম্বৰ', 'অক্টোবৰ', 'নৱেম্বৰ', 'ডিচেম্বৰ'],
  STANDALONEMONTHS: ['জানুৱাৰী', 'ফেব্ৰুৱাৰী', 'মাৰ্চ', 'এপ্ৰিল', 'মে', 'জুন', 'জুলাই', 'আগষ্ট', 'ছেপ্তেম্বৰ', 'অক্টোবৰ', 'নৱেম্বৰ', 'ডিচেম্বৰ'],
  SHORTMONTHS: ['জানু', 'ফেব্ৰু', 'মাৰ্চ', 'এপ্ৰিল', 'মে', 'জুন', 'জুলাই', 'আগ', 'সেপ্ট', 'অক্টো', 'নভে', 'ডিসে'],
  STANDALONESHORTMONTHS: ['জানু', 'ফেব্ৰু', 'মাৰ্চ', 'এপ্ৰিল', 'মে', 'জুন', 'জুলাই', 'আগ', 'সেপ্ট', 'অক্টো', 'নভে', 'ডিসে'],
  WEEKDAYS: ['দেওবাৰ', 'সোমবাৰ', 'মঙ্গলবাৰ', 'বুধবাৰ', 'বৃহষ্পতিবাৰ', 'শুক্ৰবাৰ', 'শনিবাৰ'],
  STANDALONEWEEKDAYS: ['দেওবাৰ', 'সোমবাৰ', 'মঙ্গলবাৰ', 'বুধবাৰ', 'বৃহষ্পতিবাৰ', 'শুক্ৰবাৰ', 'শনিবাৰ'],
  SHORTWEEKDAYS: ['ৰবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহষ্পতি', 'শুক্ৰ', 'শনি'],
  STANDALONESHORTWEEKDAYS: ['ৰবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহষ্পতি', 'শুক্ৰ', 'শনি'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['প্ৰথম প্ৰহৰ', 'দ্বিতীয় প্ৰহৰ', 'তৃতীয় প্ৰহৰ', 'চতুৰ্থ প্ৰহৰ'],
  QUARTERS: ['প্ৰথম প্ৰহৰ', 'দ্বিতীয় প্ৰহৰ', 'তৃতীয় প্ৰহৰ', 'চতুৰ্থ প্ৰহৰ'],
  AMPMS: ['পূৰ্বাহ্ণ', 'অপৰাহ্ণ'],
  DATEFORMATS: ['y MMMM d, EEEE', 'y MMMM d', 'y MMM d', 'y-MM-dd'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [6, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale as_IN.
 */
goog.i18n.DateTimeSymbols_as_IN = goog.i18n.DateTimeSymbols_as;


/**
 * Date/time formatting symbols for locale asa.
 */
goog.i18n.DateTimeSymbols_asa = {
  ERAS: ['KM', 'BM'],
  ERANAMES: ['Kabla yakwe Yethu', 'Baada yakwe Yethu'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['Januari', 'Februari', 'Machi', 'Aprili', 'Mei', 'Juni', 'Julai', 'Agosti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba'],
  STANDALONEMONTHS: ['Januari', 'Februari', 'Machi', 'Aprili', 'Mei', 'Juni', 'Julai', 'Agosti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Dec'],
  WEEKDAYS: ['Jumapili', 'Jumatatu', 'Jumanne', 'Jumatano', 'Alhamisi', 'Ijumaa', 'Jumamosi'],
  STANDALONEWEEKDAYS: ['Jumapili', 'Jumatatu', 'Jumanne', 'Jumatano', 'Alhamisi', 'Ijumaa', 'Jumamosi'],
  SHORTWEEKDAYS: ['Jpi', 'Jtt', 'Jnn', 'Jtn', 'Alh', 'Ijm', 'Jmo'],
  STANDALONESHORTWEEKDAYS: ['Jpi', 'Jtt', 'Jnn', 'Jtn', 'Alh', 'Ijm', 'Jmo'],
  NARROWWEEKDAYS: ['J', 'J', 'J', 'J', 'A', 'I', 'J'],
  STANDALONENARROWWEEKDAYS: ['J', 'J', 'J', 'J', 'A', 'I', 'J'],
  SHORTQUARTERS: ['R1', 'R2', 'R3', 'R4'],
  QUARTERS: ['Robo 1', 'Robo 2', 'Robo 3', 'Robo 4'],
  AMPMS: ['icheheavo', 'ichamthi'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale asa_TZ.
 */
goog.i18n.DateTimeSymbols_asa_TZ = goog.i18n.DateTimeSymbols_asa;


/**
 * Date/time formatting symbols for locale ast.
 */
goog.i18n.DateTimeSymbols_ast = {
  ERAS: ['e.C.', 'd.C.'],
  ERANAMES: ['enantes de Cristu', 'después de Cristu'],
  NARROWMONTHS: ['X', 'F', 'M', 'A', 'M', 'X', 'X', 'A', 'S', 'O', 'P', 'A'],
  STANDALONENARROWMONTHS: ['X', 'F', 'M', 'A', 'M', 'X', 'X', 'A', 'S', 'O', 'P', 'A'],
  MONTHS: ['de xineru', 'de febreru', 'de marzu', 'd’abril', 'de mayu', 'de xunu', 'de xunetu', 'd’agostu', 'de setiembre', 'd’ochobre', 'de payares', 'd’avientu'],
  STANDALONEMONTHS: ['xineru', 'febreru', 'marzu', 'abril', 'mayu', 'xunu', 'xunetu', 'agostu', 'setiembre', 'ochobre', 'payares', 'avientu'],
  SHORTMONTHS: ['xin', 'feb', 'mar', 'abr', 'may', 'xun', 'xnt', 'ago', 'set', 'och', 'pay', 'avi'],
  STANDALONESHORTMONTHS: ['Xin', 'Feb', 'Mar', 'Abr', 'May', 'Xun', 'Xnt', 'Ago', 'Set', 'Och', 'Pay', 'Avi'],
  WEEKDAYS: ['domingu', 'llunes', 'martes', 'miércoles', 'xueves', 'vienres', 'sábadu'],
  STANDALONEWEEKDAYS: ['domingu', 'llunes', 'martes', 'miércoles', 'xueves', 'vienres', 'sábadu'],
  SHORTWEEKDAYS: ['dom', 'llu', 'mar', 'mié', 'xue', 'vie', 'sáb'],
  STANDALONESHORTWEEKDAYS: ['dom', 'llu', 'mar', 'mié', 'xue', 'vie', 'sáb'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'X', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'X', 'V', 'S'],
  SHORTQUARTERS: ['1T', '2T', '3T', '4T'],
  QUARTERS: ['1er trimestre', '2u trimestre', '3er trimestre', '4u trimestre'],
  AMPMS: ['de la mañana', 'de la tarde'],
  DATEFORMATS: ['EEEE, d MMMM \'de\' y', 'd MMMM \'de\' y', 'd MMM y', 'd/M/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'a\' \'les\' {0}', '{1} \'a\' \'les\' {0}', '{1}, {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale ast_ES.
 */
goog.i18n.DateTimeSymbols_ast_ES = goog.i18n.DateTimeSymbols_ast;


/**
 * Date/time formatting symbols for locale az_Cyrl.
 */
goog.i18n.DateTimeSymbols_az_Cyrl = {
  ERAS: ['е.ә.', 'ј.е.'],
  ERANAMES: ['ерамыздан әввәл', 'јени ера'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['јанвар', 'феврал', 'март', 'апрел', 'май', 'ијун', 'ијул', 'август', 'сентјабр', 'октјабр', 'нојабр', 'декабр'],
  STANDALONEMONTHS: ['Јанвар', 'Феврал', 'Март', 'Апрел', 'Май', 'Ијун', 'Ијул', 'Август', 'Сентјабр', 'Октјабр', 'Нојабр', 'Декабр'],
  SHORTMONTHS: ['јан', 'фев', 'мар', 'апр', 'май', 'ијн', 'ијл', 'авг', 'сен', 'окт', 'ној', 'дек'],
  STANDALONESHORTMONTHS: ['јан', 'фев', 'мар', 'апр', 'май', 'ијн', 'ијл', 'авг', 'сен', 'окт', 'ној', 'дек'],
  WEEKDAYS: ['базар', 'базар ертәси', 'чәршәнбә ахшамы', 'чәршәнбә', 'ҹүмә ахшамы', 'ҹүмә', 'шәнбә'],
  STANDALONEWEEKDAYS: ['базар', 'базар ертәси', 'чәршәнбә ахшамы', 'чәршәнбә', 'ҹүмә ахшамы', 'ҹүмә', 'шәнбә'],
  SHORTWEEKDAYS: ['Б.', 'Б.Е.', 'Ч.А.', 'Ч.', 'Ҹ.А.', 'Ҹ.', 'Ш.'],
  STANDALONESHORTWEEKDAYS: ['Б.', 'Б.Е.', 'Ч.А.', 'Ч.', 'Ҹ.А.', 'Ҹ.', 'Ш.'],
  NARROWWEEKDAYS: ['7', '1', '2', '3', '4', '5', '6'],
  STANDALONENARROWWEEKDAYS: ['7', '1', '2', '3', '4', '5', '6'],
  SHORTQUARTERS: ['1-ҹи кв.', '2-ҹи кв.', '3-ҹү кв.', '4-ҹү кв.'],
  QUARTERS: ['1-ҹи квартал', '2-ҹи квартал', '3-ҹү квартал', '4-ҹү квартал'],
  AMPMS: ['АМ', 'ПМ'],
  DATEFORMATS: ['d MMMM y, EEEE', 'd MMMM y', 'd MMM y', 'dd.MM.yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale az_Cyrl_AZ.
 */
goog.i18n.DateTimeSymbols_az_Cyrl_AZ = {
  ERAS: ['е.ә.', 'ј.е.'],
  ERANAMES: ['ерамыздан әввәл', 'јени ера'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['јанвар', 'феврал', 'март', 'апрел', 'май', 'ијун', 'ијул', 'август', 'сентјабр', 'октјабр', 'нојабр', 'декабр'],
  STANDALONEMONTHS: ['Јанвар', 'Феврал', 'Март', 'Апрел', 'Май', 'Ијун', 'Ијул', 'Август', 'Сентјабр', 'Октјабр', 'Нојабр', 'Декабр'],
  SHORTMONTHS: ['јан', 'фев', 'мар', 'апр', 'май', 'ијн', 'ијл', 'авг', 'сен', 'окт', 'ној', 'дек'],
  STANDALONESHORTMONTHS: ['јан', 'фев', 'мар', 'апр', 'май', 'ијн', 'ијл', 'авг', 'сен', 'окт', 'ној', 'дек'],
  WEEKDAYS: ['базар', 'базар ертәси', 'чәршәнбә ахшамы', 'чәршәнбә', 'ҹүмә ахшамы', 'ҹүмә', 'шәнбә'],
  STANDALONEWEEKDAYS: ['базар', 'базар ертәси', 'чәршәнбә ахшамы', 'чәршәнбә', 'ҹүмә ахшамы', 'ҹүмә', 'шәнбә'],
  SHORTWEEKDAYS: ['Б.', 'Б.Е.', 'Ч.А.', 'Ч.', 'Ҹ.А.', 'Ҹ.', 'Ш.'],
  STANDALONESHORTWEEKDAYS: ['Б.', 'Б.Е.', 'Ч.А.', 'Ч.', 'Ҹ.А.', 'Ҹ.', 'Ш.'],
  NARROWWEEKDAYS: ['7', '1', '2', '3', '4', '5', '6'],
  STANDALONENARROWWEEKDAYS: ['7', '1', '2', '3', '4', '5', '6'],
  SHORTQUARTERS: ['1-ҹи кв.', '2-ҹи кв.', '3-ҹү кв.', '4-ҹү кв.'],
  QUARTERS: ['1-ҹи квартал', '2-ҹи квартал', '3-ҹү квартал', '4-ҹү квартал'],
  AMPMS: ['АМ', 'ПМ'],
  DATEFORMATS: ['d MMMM y, EEEE', 'd MMMM y', 'd MMM y', 'dd.MM.yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale az_Latn.
 */
goog.i18n.DateTimeSymbols_az_Latn = goog.i18n.DateTimeSymbols_az;


/**
 * Date/time formatting symbols for locale az_Latn_AZ.
 */
goog.i18n.DateTimeSymbols_az_Latn_AZ = goog.i18n.DateTimeSymbols_az;


/**
 * Date/time formatting symbols for locale bas.
 */
goog.i18n.DateTimeSymbols_bas = {
  ERAS: ['b.Y.K', 'm.Y.K'],
  ERANAMES: ['bisū bi Yesù Krǐstò', 'i mbūs Yesù Krǐstò'],
  NARROWMONTHS: ['k', 'm', 'm', 'm', 'm', 'h', 'n', 'h', 'd', 'b', 'm', 'l'],
  STANDALONENARROWMONTHS: ['k', 'm', 'm', 'm', 'm', 'h', 'n', 'h', 'd', 'b', 'm', 'l'],
  MONTHS: ['Kɔndɔŋ', 'Màcɛ̂l', 'Màtùmb', 'Màtop', 'M̀puyɛ', 'Hìlòndɛ̀', 'Njèbà', 'Hìkaŋ', 'Dìpɔ̀s', 'Bìòôm', 'Màyɛsèp', 'Lìbuy li ńyèe'],
  STANDALONEMONTHS: ['Kɔndɔŋ', 'Màcɛ̂l', 'Màtùmb', 'Màtop', 'M̀puyɛ', 'Hìlòndɛ̀', 'Njèbà', 'Hìkaŋ', 'Dìpɔ̀s', 'Bìòôm', 'Màyɛsèp', 'Lìbuy li ńyèe'],
  SHORTMONTHS: ['kɔn', 'mac', 'mat', 'mto', 'mpu', 'hil', 'nje', 'hik', 'dip', 'bio', 'may', 'liɓ'],
  STANDALONESHORTMONTHS: ['kɔn', 'mac', 'mat', 'mto', 'mpu', 'hil', 'nje', 'hik', 'dip', 'bio', 'may', 'liɓ'],
  WEEKDAYS: ['ŋgwà nɔ̂y', 'ŋgwà njaŋgumba', 'ŋgwà ûm', 'ŋgwà ŋgê', 'ŋgwà mbɔk', 'ŋgwà kɔɔ', 'ŋgwà jôn'],
  STANDALONEWEEKDAYS: ['ŋgwà nɔ̂y', 'ŋgwà njaŋgumba', 'ŋgwà ûm', 'ŋgwà ŋgê', 'ŋgwà mbɔk', 'ŋgwà kɔɔ', 'ŋgwà jôn'],
  SHORTWEEKDAYS: ['nɔy', 'nja', 'uum', 'ŋge', 'mbɔ', 'kɔɔ', 'jon'],
  STANDALONESHORTWEEKDAYS: ['nɔy', 'nja', 'uum', 'ŋge', 'mbɔ', 'kɔɔ', 'jon'],
  NARROWWEEKDAYS: ['n', 'n', 'u', 'ŋ', 'm', 'k', 'j'],
  STANDALONENARROWWEEKDAYS: ['n', 'n', 'u', 'ŋ', 'm', 'k', 'j'],
  SHORTQUARTERS: ['K1s3', 'K2s3', 'K3s3', 'K4s3'],
  QUARTERS: ['Kèk bisu i soŋ iaâ', 'Kèk i ńyonos biɓaà i soŋ iaâ', 'Kèk i ńyonos biaâ i soŋ iaâ', 'Kèk i ńyonos binâ i soŋ iaâ'],
  AMPMS: ['I bikɛ̂glà', 'I ɓugajɔp'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM, y', 'd/M/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale bas_CM.
 */
goog.i18n.DateTimeSymbols_bas_CM = goog.i18n.DateTimeSymbols_bas;


/**
 * Date/time formatting symbols for locale be_BY.
 */
goog.i18n.DateTimeSymbols_be_BY = goog.i18n.DateTimeSymbols_be;


/**
 * Date/time formatting symbols for locale bem.
 */
goog.i18n.DateTimeSymbols_bem = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Yesu', 'After Yesu'],
  NARROWMONTHS: ['J', 'F', 'M', 'E', 'M', 'J', 'J', 'O', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'E', 'M', 'J', 'J', 'O', 'S', 'O', 'N', 'D'],
  MONTHS: ['Januari', 'Februari', 'Machi', 'Epreo', 'Mei', 'Juni', 'Julai', 'Ogasti', 'Septemba', 'Oktoba', 'Novemba', 'Disemba'],
  STANDALONEMONTHS: ['Januari', 'Februari', 'Machi', 'Epreo', 'Mei', 'Juni', 'Julai', 'Ogasti', 'Septemba', 'Oktoba', 'Novemba', 'Disemba'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mac', 'Epr', 'Mei', 'Jun', 'Jul', 'Oga', 'Sep', 'Okt', 'Nov', 'Dis'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mac', 'Epr', 'Mei', 'Jun', 'Jul', 'Oga', 'Sep', 'Okt', 'Nov', 'Dis'],
  WEEKDAYS: ['Pa Mulungu', 'Palichimo', 'Palichibuli', 'Palichitatu', 'Palichine', 'Palichisano', 'Pachibelushi'],
  STANDALONEWEEKDAYS: ['Pa Mulungu', 'Palichimo', 'Palichibuli', 'Palichitatu', 'Palichine', 'Palichisano', 'Pachibelushi'],
  SHORTWEEKDAYS: ['Pa Mulungu', 'Palichimo', 'Palichibuli', 'Palichitatu', 'Palichine', 'Palichisano', 'Pachibelushi'],
  STANDALONESHORTWEEKDAYS: ['Pa Mulungu', 'Palichimo', 'Palichibuli', 'Palichitatu', 'Palichine', 'Palichisano', 'Pachibelushi'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['uluchelo', 'akasuba'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale bem_ZM.
 */
goog.i18n.DateTimeSymbols_bem_ZM = goog.i18n.DateTimeSymbols_bem;


/**
 * Date/time formatting symbols for locale bez.
 */
goog.i18n.DateTimeSymbols_bez = {
  ERAS: ['KM', 'BM'],
  ERANAMES: ['Kabla ya Mtwaa', 'Baada ya Mtwaa'],
  NARROWMONTHS: ['H', 'V', 'D', 'T', 'H', 'S', 'S', 'N', 'T', 'K', 'K', 'K'],
  STANDALONENARROWMONTHS: ['H', 'V', 'D', 'T', 'H', 'S', 'S', 'N', 'T', 'K', 'K', 'K'],
  MONTHS: ['pa mwedzi gwa hutala', 'pa mwedzi gwa wuvili', 'pa mwedzi gwa wudatu', 'pa mwedzi gwa wutai', 'pa mwedzi gwa wuhanu', 'pa mwedzi gwa sita', 'pa mwedzi gwa saba', 'pa mwedzi gwa nane', 'pa mwedzi gwa tisa', 'pa mwedzi gwa kumi', 'pa mwedzi gwa kumi na moja', 'pa mwedzi gwa kumi na mbili'],
  STANDALONEMONTHS: ['pa mwedzi gwa hutala', 'pa mwedzi gwa wuvili', 'pa mwedzi gwa wudatu', 'pa mwedzi gwa wutai', 'pa mwedzi gwa wuhanu', 'pa mwedzi gwa sita', 'pa mwedzi gwa saba', 'pa mwedzi gwa nane', 'pa mwedzi gwa tisa', 'pa mwedzi gwa kumi', 'pa mwedzi gwa kumi na moja', 'pa mwedzi gwa kumi na mbili'],
  SHORTMONTHS: ['Hut', 'Vil', 'Dat', 'Tai', 'Han', 'Sit', 'Sab', 'Nan', 'Tis', 'Kum', 'Kmj', 'Kmb'],
  STANDALONESHORTMONTHS: ['Hut', 'Vil', 'Dat', 'Tai', 'Han', 'Sit', 'Sab', 'Nan', 'Tis', 'Kum', 'Kmj', 'Kmb'],
  WEEKDAYS: ['pa mulungu', 'pa shahuviluha', 'pa hivili', 'pa hidatu', 'pa hitayi', 'pa hihanu', 'pa shahulembela'],
  STANDALONEWEEKDAYS: ['pa mulungu', 'pa shahuviluha', 'pa hivili', 'pa hidatu', 'pa hitayi', 'pa hihanu', 'pa shahulembela'],
  SHORTWEEKDAYS: ['Mul', 'Vil', 'Hiv', 'Hid', 'Hit', 'Hih', 'Lem'],
  STANDALONESHORTWEEKDAYS: ['Mul', 'Vil', 'Hiv', 'Hid', 'Hit', 'Hih', 'Lem'],
  NARROWWEEKDAYS: ['M', 'J', 'H', 'H', 'H', 'W', 'J'],
  STANDALONENARROWWEEKDAYS: ['M', 'J', 'H', 'H', 'H', 'W', 'J'],
  SHORTQUARTERS: ['L1', 'L2', 'L3', 'L4'],
  QUARTERS: ['Lobo 1', 'Lobo 2', 'Lobo 3', 'Lobo 4'],
  AMPMS: ['pamilau', 'pamunyi'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale bez_TZ.
 */
goog.i18n.DateTimeSymbols_bez_TZ = goog.i18n.DateTimeSymbols_bez;


/**
 * Date/time formatting symbols for locale bg_BG.
 */
goog.i18n.DateTimeSymbols_bg_BG = goog.i18n.DateTimeSymbols_bg;


/**
 * Date/time formatting symbols for locale bm.
 */
goog.i18n.DateTimeSymbols_bm = {
  ERAS: ['J.-C. ɲɛ', 'ni J.-C.'],
  ERANAMES: ['jezu krisiti ɲɛ', 'jezu krisiti minkɛ'],
  NARROWMONTHS: ['Z', 'F', 'M', 'A', 'M', 'Z', 'Z', 'U', 'S', 'Ɔ', 'N', 'D'],
  STANDALONENARROWMONTHS: ['Z', 'F', 'M', 'A', 'M', 'Z', 'Z', 'U', 'S', 'Ɔ', 'N', 'D'],
  MONTHS: ['zanwuye', 'feburuye', 'marisi', 'awirili', 'mɛ', 'zuwɛn', 'zuluye', 'uti', 'sɛtanburu', 'ɔkutɔburu', 'nowanburu', 'desanburu'],
  STANDALONEMONTHS: ['zanwuye', 'feburuye', 'marisi', 'awirili', 'mɛ', 'zuwɛn', 'zuluye', 'uti', 'sɛtanburu', 'ɔkutɔburu', 'nowanburu', 'desanburu'],
  SHORTMONTHS: ['zan', 'feb', 'mar', 'awi', 'mɛ', 'zuw', 'zul', 'uti', 'sɛt', 'ɔku', 'now', 'des'],
  STANDALONESHORTMONTHS: ['zan', 'feb', 'mar', 'awi', 'mɛ', 'zuw', 'zul', 'uti', 'sɛt', 'ɔku', 'now', 'des'],
  WEEKDAYS: ['kari', 'ntɛnɛ', 'tarata', 'araba', 'alamisa', 'juma', 'sibiri'],
  STANDALONEWEEKDAYS: ['kari', 'ntɛnɛ', 'tarata', 'araba', 'alamisa', 'juma', 'sibiri'],
  SHORTWEEKDAYS: ['kar', 'ntɛ', 'tar', 'ara', 'ala', 'jum', 'sib'],
  STANDALONESHORTWEEKDAYS: ['kar', 'ntɛ', 'tar', 'ara', 'ala', 'jum', 'sib'],
  NARROWWEEKDAYS: ['K', 'N', 'T', 'A', 'A', 'J', 'S'],
  STANDALONENARROWWEEKDAYS: ['K', 'N', 'T', 'A', 'A', 'J', 'S'],
  SHORTQUARTERS: ['KS1', 'KS2', 'KS3', 'KS4'],
  QUARTERS: ['kalo saba fɔlɔ', 'kalo saba filanan', 'kalo saba sabanan', 'kalo saba naaninan'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM, y', 'd/M/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale bm_ML.
 */
goog.i18n.DateTimeSymbols_bm_ML = goog.i18n.DateTimeSymbols_bm;


/**
 * Date/time formatting symbols for locale bn_BD.
 */
goog.i18n.DateTimeSymbols_bn_BD = goog.i18n.DateTimeSymbols_bn;


/**
 * Date/time formatting symbols for locale bn_IN.
 */
goog.i18n.DateTimeSymbols_bn_IN = {
  ZERODIGIT: 0x09E6,
  ERAS: ['খ্রিস্টপূর্ব', 'খৃষ্টাব্দ'],
  ERANAMES: ['খ্রিস্টপূর্ব', 'খৃষ্টাব্দ'],
  NARROWMONTHS: ['জা', 'ফে', 'মা', 'এ', 'মে', 'জুন', 'জু', 'আ', 'সে', 'অ', 'ন', 'ডি'],
  STANDALONENARROWMONTHS: ['জা', 'ফে', 'মা', 'এ', 'মে', 'জুন', 'জু', 'আ', 'সে', 'অ', 'ন', 'ডি'],
  MONTHS: ['জানুয়ারী', 'ফেব্রুয়ারী', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'],
  STANDALONEMONTHS: ['জানুয়ারী', 'ফেব্রুয়ারী', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'],
  SHORTMONTHS: ['জানু', 'ফেব', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'],
  STANDALONESHORTMONTHS: ['জানুয়ারী', 'ফেব্রুয়ারী', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'],
  WEEKDAYS: ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'],
  STANDALONEWEEKDAYS: ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহষ্পতিবার', 'শুক্রবার', 'শনিবার'],
  SHORTWEEKDAYS: ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি'],
  STANDALONESHORTWEEKDAYS: ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি'],
  NARROWWEEKDAYS: ['র', 'সো', 'ম', 'বু', 'বৃ', 'শু', 'শ'],
  STANDALONENARROWWEEKDAYS: ['র', 'সো', 'ম', 'বু', 'বৃ', 'শু', 'শ'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['ত্রৈমাসিক', 'দ্বিতীয় ত্রৈমাসিক', 'তৃতীয় ত্রৈমাসিক', 'চতুর্থ ত্রৈমাসিক'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM, y', 'd MMMM, y', 'd MMM, y', 'd/M/yy'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [6, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale bo.
 */
goog.i18n.DateTimeSymbols_bo = {
  ERAS: ['སྤྱི་ལོ་སྔོན་', 'སྤྱི་ལོ་'],
  ERANAMES: ['སྤྱི་ལོ་སྔོན་', 'སྤྱི་ལོ་'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['ཟླ་བ་དང་པོ', 'ཟླ་བ་གཉིས་པ', 'ཟླ་བ་གསུམ་པ', 'ཟླ་བ་བཞི་པ', 'ཟླ་བ་ལྔ་པ', 'ཟླ་བ་དྲུག་པ', 'ཟླ་བ་བདུན་པ', 'ཟླ་བ་བརྒྱད་པ', 'ཟླ་བ་དགུ་པ', 'ཟླ་བ་བཅུ་པ', 'ཟླ་བ་བཅུ་གཅིག་པ', 'ཟླ་བ་བཅུ་གཉིས་པ'],
  STANDALONEMONTHS: ['ཟླ་བ་དང་པོ་', 'ཟླ་བ་གཉིས་པ་', 'ཟླ་བ་གསུམ་པ་', 'ཟླ་བ་བཞི་པ་', 'ཟླ་བ་ལྔ་པ་', 'ཟླ་བ་དྲུག་པ་', 'ཟླ་བ་བདུན་པ་', 'ཟླ་བ་བརྒྱད་པ་', 'ཟླ་བ་དགུ་པ་', 'ཟླ་བ་བཅུ་པ་', 'ཟླ་བ་བཅུ་གཅིག་པ་', 'ཟླ་བ་བཅུ་གཉིས་པ་'],
  SHORTMONTHS: ['ཟླ་༡', 'ཟླ་༢', 'ཟླ་༣', 'ཟླ་༤', 'ཟླ་༥', 'ཟླ་༦', 'ཟླ་༧', 'ཟླ་༨', 'ཟླ་༩', 'ཟླ་༡༠', 'ཟླ་༡༡', 'ཟླ་༡༢'],
  STANDALONESHORTMONTHS: ['ཟླ་༡', 'ཟླ་༢', 'ཟླ་༣', 'ཟླ་༤', 'ཟླ་༥', 'ཟླ་༦', 'ཟླ་༧', 'ཟླ་༨', 'ཟླ་༩', 'ཟླ་༡༠', 'ཟླ་༡༡', 'ཟླ་༡༢'],
  WEEKDAYS: ['གཟའ་ཉི་མ་', 'གཟའ་ཟླ་བ་', 'གཟའ་མིག་དམར་', 'གཟའ་ལྷག་པ་', 'གཟའ་ཕུར་བུ་', 'གཟའ་པ་སངས་', 'གཟའ་སྤེན་པ་'],
  STANDALONEWEEKDAYS: ['གཟའ་ཉི་མ་', 'གཟའ་ཟླ་བ་', 'གཟའ་མིག་དམར་', 'གཟའ་ལྷག་པ་', 'གཟའ་ཕུར་བུ་', 'གཟའ་པ་སངས་', 'གཟའ་སྤེན་པ་'],
  SHORTWEEKDAYS: ['ཉི་མ་', 'ཟླ་བ་', 'མིག་དམར་', 'ལྷག་པ་', 'ཕུར་བུ་', 'པ་སངས་', 'སྤེན་པ་'],
  STANDALONESHORTWEEKDAYS: ['ཉི་མ་', 'ཟླ་བ་', 'མིག་དམར་', 'ལྷག་པ་', 'ཕུར་བུ་', 'པ་སངས་', 'སྤེན་པ་'],
  NARROWWEEKDAYS: ['ཉི', 'ཟླ', 'མིག', 'ལྷག', 'ཕུར', 'སངས', 'སྤེན'],
  STANDALONENARROWWEEKDAYS: ['ཉི', 'ཟླ', 'མིག', 'ལྷག', 'ཕུར', 'སངས', 'སྤེན'],
  SHORTQUARTERS: ['དུས་ཚིགས་དང་པོ།', 'དུས་ཚིགས་གཉིས་པ།', 'དུས་ཚིགས་གསུམ་པ།', 'དུས་ཚིགས་བཞི་པ།'],
  QUARTERS: ['དུས་ཚིགས་དང་པོ།', 'དུས་ཚིགས་གཉིས་པ།', 'དུས་ཚིགས་གསུམ་པ།', 'དུས་ཚིགས་བཞི་པ།'],
  AMPMS: ['སྔ་དྲོ་', 'ཕྱི་དྲོ་'],
  DATEFORMATS: ['y MMMMའི་ཚེས་d, EEEE', 'སྤྱི་ལོ་y MMMMའི་ཚེས་d', 'y ལོའི་MMMཚེས་d', 'y-MM-dd'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale bo_CN.
 */
goog.i18n.DateTimeSymbols_bo_CN = goog.i18n.DateTimeSymbols_bo;


/**
 * Date/time formatting symbols for locale bo_IN.
 */
goog.i18n.DateTimeSymbols_bo_IN = {
  ERAS: ['སྤྱི་ལོ་སྔོན་', 'སྤྱི་ལོ་'],
  ERANAMES: ['སྤྱི་ལོ་སྔོན་', 'སྤྱི་ལོ་'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['ཟླ་བ་དང་པོ', 'ཟླ་བ་གཉིས་པ', 'ཟླ་བ་གསུམ་པ', 'ཟླ་བ་བཞི་པ', 'ཟླ་བ་ལྔ་པ', 'ཟླ་བ་དྲུག་པ', 'ཟླ་བ་བདུན་པ', 'ཟླ་བ་བརྒྱད་པ', 'ཟླ་བ་དགུ་པ', 'ཟླ་བ་བཅུ་པ', 'ཟླ་བ་བཅུ་གཅིག་པ', 'ཟླ་བ་བཅུ་གཉིས་པ'],
  STANDALONEMONTHS: ['ཟླ་བ་དང་པོ་', 'ཟླ་བ་གཉིས་པ་', 'ཟླ་བ་གསུམ་པ་', 'ཟླ་བ་བཞི་པ་', 'ཟླ་བ་ལྔ་པ་', 'ཟླ་བ་དྲུག་པ་', 'ཟླ་བ་བདུན་པ་', 'ཟླ་བ་བརྒྱད་པ་', 'ཟླ་བ་དགུ་པ་', 'ཟླ་བ་བཅུ་པ་', 'ཟླ་བ་བཅུ་གཅིག་པ་', 'ཟླ་བ་བཅུ་གཉིས་པ་'],
  SHORTMONTHS: ['ཟླ་༡', 'ཟླ་༢', 'ཟླ་༣', 'ཟླ་༤', 'ཟླ་༥', 'ཟླ་༦', 'ཟླ་༧', 'ཟླ་༨', 'ཟླ་༩', 'ཟླ་༡༠', 'ཟླ་༡༡', 'ཟླ་༡༢'],
  STANDALONESHORTMONTHS: ['ཟླ་༡', 'ཟླ་༢', 'ཟླ་༣', 'ཟླ་༤', 'ཟླ་༥', 'ཟླ་༦', 'ཟླ་༧', 'ཟླ་༨', 'ཟླ་༩', 'ཟླ་༡༠', 'ཟླ་༡༡', 'ཟླ་༡༢'],
  WEEKDAYS: ['གཟའ་ཉི་མ་', 'གཟའ་ཟླ་བ་', 'གཟའ་མིག་དམར་', 'གཟའ་ལྷག་པ་', 'གཟའ་ཕུར་བུ་', 'གཟའ་པ་སངས་', 'གཟའ་སྤེན་པ་'],
  STANDALONEWEEKDAYS: ['གཟའ་ཉི་མ་', 'གཟའ་ཟླ་བ་', 'གཟའ་མིག་དམར་', 'གཟའ་ལྷག་པ་', 'གཟའ་ཕུར་བུ་', 'གཟའ་པ་སངས་', 'གཟའ་སྤེན་པ་'],
  SHORTWEEKDAYS: ['ཉི་མ་', 'ཟླ་བ་', 'མིག་དམར་', 'ལྷག་པ་', 'ཕུར་བུ་', 'པ་སངས་', 'སྤེན་པ་'],
  STANDALONESHORTWEEKDAYS: ['ཉི་མ་', 'ཟླ་བ་', 'མིག་དམར་', 'ལྷག་པ་', 'ཕུར་བུ་', 'པ་སངས་', 'སྤེན་པ་'],
  NARROWWEEKDAYS: ['ཉི', 'ཟླ', 'མིག', 'ལྷག', 'ཕུར', 'སངས', 'སྤེན'],
  STANDALONENARROWWEEKDAYS: ['ཉི', 'ཟླ', 'མིག', 'ལྷག', 'ཕུར', 'སངས', 'སྤེན'],
  SHORTQUARTERS: ['དུས་ཚིགས་དང་པོ།', 'དུས་ཚིགས་གཉིས་པ།', 'དུས་ཚིགས་གསུམ་པ།', 'དུས་ཚིགས་བཞི་པ།'],
  QUARTERS: ['དུས་ཚིགས་དང་པོ།', 'དུས་ཚིགས་གཉིས་པ།', 'དུས་ཚིགས་གསུམ་པ།', 'དུས་ཚིགས་བཞི་པ།'],
  AMPMS: ['སྔ་དྲོ་', 'ཕྱི་དྲོ་'],
  DATEFORMATS: ['y MMMMའི་ཚེས་d, EEEE', 'སྤྱི་ལོ་y MMMMའི་ཚེས་d', 'y ལོའི་MMMཚེས་d', 'y-MM-dd'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [6, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale br_FR.
 */
goog.i18n.DateTimeSymbols_br_FR = goog.i18n.DateTimeSymbols_br;


/**
 * Date/time formatting symbols for locale brx.
 */
goog.i18n.DateTimeSymbols_brx = {
  ERAS: ['ईसा.पूर्व', 'सन'],
  ERANAMES: ['ईसा.पूर्व', 'सन'],
  NARROWMONTHS: ['ज', 'फे', 'मा', 'ए', 'मे', 'जु', 'जु', 'आ', 'से', 'अ', 'न', 'दि'],
  STANDALONENARROWMONTHS: ['ज', 'फे', 'मा', 'ए', 'मे', 'जु', 'जु', 'आ', 'से', 'अ', 'न', 'दि'],
  MONTHS: ['जानुवारी', 'फेब्रुवारी', 'मार्स', 'एफ्रिल', 'मे', 'जुन', 'जुलाइ', 'आगस्थ', 'सेबथेज्ब़र', 'अखथबर', 'नबेज्ब़र', 'दिसेज्ब़र'],
  STANDALONEMONTHS: ['जानुवारी', 'फेब्रुवारी', 'मार्स', 'एफ्रिल', 'मे', 'जुन', 'जुलाइ', 'आगस्थ', 'सेबथेज्ब़र', 'अखथबर', 'नबेज्ब़र', 'दिसेज्ब़र'],
  SHORTMONTHS: ['जानुवारी', 'फेब्रुवारी', 'मार्स', 'एफ्रिल', 'मे', 'जुन', 'जुलाइ', 'आगस्थ', 'सेबथेज्ब़र', 'अखथबर', 'नबेज्ब़र', 'दिसेज्ब़र'],
  STANDALONESHORTMONTHS: ['जानुवारी', 'फेब्रुवारी', 'मार्स', 'एफ्रिल', 'मे', 'जुन', 'जुलाइ', 'आगस्थ', 'सेबथेज्ब़र', 'अखथबर', 'नबेज्ब़र', 'दिसेज्ब़र'],
  WEEKDAYS: ['रबिबार', 'समबार', 'मंगलबार', 'बुदबार', 'बिसथिबार', 'सुखुरबार', 'सुनिबार'],
  STANDALONEWEEKDAYS: ['रबिबार', 'समबार', 'मंगलबार', 'बुदबार', 'बिसथिबार', 'सुखुरबार', 'सुनिबार'],
  SHORTWEEKDAYS: ['रबि', 'सम', 'मंगल', 'बुद', 'बिसथि', 'सुखुर', 'सुनि'],
  STANDALONESHORTWEEKDAYS: ['रबि', 'सम', 'मंगल', 'बुद', 'बिसथि', 'सुखुर', 'सुनि'],
  NARROWWEEKDAYS: ['र', 'स', 'मं', 'बु', 'बि', 'सु', 'सु'],
  STANDALONENARROWWEEKDAYS: ['र', 'स', 'मं', 'बु', 'बि', 'सु', 'सु'],
  SHORTQUARTERS: ['सिथासे/खोन्दोसे/बाहागोसे', 'खावसे/खोन्दोनै/बाहागोनै', 'खावथाम/खोन्दोथाम/बाहागोथाम', 'खावब्रै/खोन्दोब्रै/फुरा/आबुं'],
  QUARTERS: ['सिथासे/खोन्दोसे/बाहागोसे', 'खावसे/खोन्दोनै/बाहागोनै', 'खावथाम/खोन्दोथाम/बाहागोथाम', 'खावब्रै/खोन्दोब्रै/फुरा/आबुं'],
  AMPMS: ['फुं', 'बेलासे'],
  DATEFORMATS: ['EEEE, MMMM d, y', 'MMMM d, y', 'MMM d, y', 'M/d/yy'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [6, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale brx_IN.
 */
goog.i18n.DateTimeSymbols_brx_IN = goog.i18n.DateTimeSymbols_brx;


/**
 * Date/time formatting symbols for locale bs_Cyrl.
 */
goog.i18n.DateTimeSymbols_bs_Cyrl = {
  ERAS: ['п. н. е.', 'н. е.'],
  ERANAMES: ['Пре нове ере', 'Нове ере'],
  NARROWMONTHS: ['ј', 'ф', 'м', 'а', 'м', 'ј', 'ј', 'а', 'с', 'о', 'н', 'д'],
  STANDALONENARROWMONTHS: ['ј', 'ф', 'м', 'а', 'м', 'ј', 'ј', 'а', 'с', 'о', 'н', 'д'],
  MONTHS: ['јануар', 'фебруар', 'март', 'април', 'мај', 'јуни', 'јули', 'август', 'септембар', 'октобар', 'новембар', 'децембар'],
  STANDALONEMONTHS: ['јануар', 'фебруар', 'март', 'април', 'мај', 'јуни', 'јули', 'август', 'септембар', 'октобар', 'новембар', 'децембар'],
  SHORTMONTHS: ['јан', 'феб', 'мар', 'апр', 'мај', 'јун', 'јул', 'авг', 'сеп', 'окт', 'нов', 'дец'],
  STANDALONESHORTMONTHS: ['јан', 'феб', 'мар', 'апр', 'мај', 'јун', 'јул', 'авг', 'сеп', 'окт', 'нов', 'дец'],
  WEEKDAYS: ['недеља', 'понедељак', 'уторак', 'сриједа', 'четвртак', 'петак', 'субота'],
  STANDALONEWEEKDAYS: ['недеља', 'понедељак', 'уторак', 'сриједа', 'четвртак', 'петак', 'субота'],
  SHORTWEEKDAYS: ['нед', 'пон', 'уто', 'сри', 'чет', 'пет', 'суб'],
  STANDALONESHORTWEEKDAYS: ['нед', 'пон', 'уто', 'сри', 'чет', 'пет', 'суб'],
  NARROWWEEKDAYS: ['н', 'п', 'у', 'с', 'ч', 'п', 'с'],
  STANDALONENARROWWEEKDAYS: ['н', 'п', 'у', 'с', 'ч', 'п', 'с'],
  SHORTQUARTERS: ['К1', 'К2', 'К3', 'К4'],
  QUARTERS: ['Прво тромесечје', 'Друго тромесечје', 'Треће тромесечје', 'Четврто тромесечје'],
  AMPMS: ['пре подне', 'поподне'],
  DATEFORMATS: ['EEEE, dd. MMMM y.', 'dd. MMMM y.', 'dd.MM.y.', 'd.M.yy.'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale bs_Cyrl_BA.
 */
goog.i18n.DateTimeSymbols_bs_Cyrl_BA = {
  ERAS: ['п. н. е.', 'н. е.'],
  ERANAMES: ['Пре нове ере', 'Нове ере'],
  NARROWMONTHS: ['ј', 'ф', 'м', 'а', 'м', 'ј', 'ј', 'а', 'с', 'о', 'н', 'д'],
  STANDALONENARROWMONTHS: ['ј', 'ф', 'м', 'а', 'м', 'ј', 'ј', 'а', 'с', 'о', 'н', 'д'],
  MONTHS: ['јануар', 'фебруар', 'март', 'април', 'мај', 'јуни', 'јули', 'август', 'септембар', 'октобар', 'новембар', 'децембар'],
  STANDALONEMONTHS: ['јануар', 'фебруар', 'март', 'април', 'мај', 'јуни', 'јули', 'август', 'септембар', 'октобар', 'новембар', 'децембар'],
  SHORTMONTHS: ['јан', 'феб', 'мар', 'апр', 'мај', 'јун', 'јул', 'авг', 'сеп', 'окт', 'нов', 'дец'],
  STANDALONESHORTMONTHS: ['јан', 'феб', 'мар', 'апр', 'мај', 'јун', 'јул', 'авг', 'сеп', 'окт', 'нов', 'дец'],
  WEEKDAYS: ['недеља', 'понедељак', 'уторак', 'сриједа', 'четвртак', 'петак', 'субота'],
  STANDALONEWEEKDAYS: ['недеља', 'понедељак', 'уторак', 'сриједа', 'четвртак', 'петак', 'субота'],
  SHORTWEEKDAYS: ['нед', 'пон', 'уто', 'сри', 'чет', 'пет', 'суб'],
  STANDALONESHORTWEEKDAYS: ['нед', 'пон', 'уто', 'сри', 'чет', 'пет', 'суб'],
  NARROWWEEKDAYS: ['н', 'п', 'у', 'с', 'ч', 'п', 'с'],
  STANDALONENARROWWEEKDAYS: ['н', 'п', 'у', 'с', 'ч', 'п', 'с'],
  SHORTQUARTERS: ['К1', 'К2', 'К3', 'К4'],
  QUARTERS: ['Прво тромесечје', 'Друго тромесечје', 'Треће тромесечје', 'Четврто тромесечје'],
  AMPMS: ['пре подне', 'поподне'],
  DATEFORMATS: ['EEEE, dd. MMMM y.', 'dd. MMMM y.', 'dd.MM.y.', 'd.M.yy.'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale bs_Latn.
 */
goog.i18n.DateTimeSymbols_bs_Latn = goog.i18n.DateTimeSymbols_bs;


/**
 * Date/time formatting symbols for locale bs_Latn_BA.
 */
goog.i18n.DateTimeSymbols_bs_Latn_BA = goog.i18n.DateTimeSymbols_bs;


/**
 * Date/time formatting symbols for locale ca_AD.
 */
goog.i18n.DateTimeSymbols_ca_AD = goog.i18n.DateTimeSymbols_ca;


/**
 * Date/time formatting symbols for locale ca_ES.
 */
goog.i18n.DateTimeSymbols_ca_ES = goog.i18n.DateTimeSymbols_ca;


/**
 * Date/time formatting symbols for locale ca_FR.
 */
goog.i18n.DateTimeSymbols_ca_FR = goog.i18n.DateTimeSymbols_ca;


/**
 * Date/time formatting symbols for locale ca_IT.
 */
goog.i18n.DateTimeSymbols_ca_IT = goog.i18n.DateTimeSymbols_ca;


/**
 * Date/time formatting symbols for locale ce.
 */
goog.i18n.DateTimeSymbols_ce = {
  ERAS: ['BCE', 'CE'],
  ERANAMES: ['BCE', 'CE'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
  STANDALONEMONTHS: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
  SHORTMONTHS: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
  STANDALONESHORTMONTHS: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
  WEEKDAYS: ['кӀиранан де', 'оршотан де', 'шинарин де', 'кхаарин де', 'еарин де', 'пӀераскан де', 'шот де'],
  STANDALONEWEEKDAYS: ['кӀиранан де', 'оршотан де', 'шинарин де', 'кхаарин де', 'еарин де', 'пӀераскан де', 'шот де'],
  SHORTWEEKDAYS: ['кӀиранан де', 'оршотан де', 'шинарин де', 'кхаарин де', 'еарин де', 'пӀераскан де', 'шот де'],
  STANDALONESHORTWEEKDAYS: ['кӀиранан де', 'оршотан де', 'шинарин де', 'кхаарин де', 'еарин де', 'пӀераскан де', 'шот де'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['y MMMM d, EEEE', 'y MMMM d', 'y MMM d', 'y-MM-dd'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale ce_RU.
 */
goog.i18n.DateTimeSymbols_ce_RU = goog.i18n.DateTimeSymbols_ce;


/**
 * Date/time formatting symbols for locale cgg.
 */
goog.i18n.DateTimeSymbols_cgg = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Kurisito Atakaijire', 'Kurisito Yaijire'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['Okwokubanza', 'Okwakabiri', 'Okwakashatu', 'Okwakana', 'Okwakataana', 'Okwamukaaga', 'Okwamushanju', 'Okwamunaana', 'Okwamwenda', 'Okwaikumi', 'Okwaikumi na kumwe', 'Okwaikumi na ibiri'],
  STANDALONEMONTHS: ['Okwokubanza', 'Okwakabiri', 'Okwakashatu', 'Okwakana', 'Okwakataana', 'Okwamukaaga', 'Okwamushanju', 'Okwamunaana', 'Okwamwenda', 'Okwaikumi', 'Okwaikumi na kumwe', 'Okwaikumi na ibiri'],
  SHORTMONTHS: ['KBZ', 'KBR', 'KST', 'KKN', 'KTN', 'KMK', 'KMS', 'KMN', 'KMW', 'KKM', 'KNK', 'KNB'],
  STANDALONESHORTMONTHS: ['KBZ', 'KBR', 'KST', 'KKN', 'KTN', 'KMK', 'KMS', 'KMN', 'KMW', 'KKM', 'KNK', 'KNB'],
  WEEKDAYS: ['Sande', 'Orwokubanza', 'Orwakabiri', 'Orwakashatu', 'Orwakana', 'Orwakataano', 'Orwamukaaga'],
  STANDALONEWEEKDAYS: ['Sande', 'Orwokubanza', 'Orwakabiri', 'Orwakashatu', 'Orwakana', 'Orwakataano', 'Orwamukaaga'],
  SHORTWEEKDAYS: ['SAN', 'ORK', 'OKB', 'OKS', 'OKN', 'OKT', 'OMK'],
  STANDALONESHORTWEEKDAYS: ['SAN', 'ORK', 'OKB', 'OKS', 'OKN', 'OKT', 'OMK'],
  NARROWWEEKDAYS: ['S', 'K', 'R', 'S', 'N', 'T', 'M'],
  STANDALONENARROWWEEKDAYS: ['S', 'K', 'R', 'S', 'N', 'T', 'M'],
  SHORTQUARTERS: ['K1', 'K2', 'K3', 'K4'],
  QUARTERS: ['KWOTA 1', 'KWOTA 2', 'KWOTA 3', 'KWOTA 4'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale cgg_UG.
 */
goog.i18n.DateTimeSymbols_cgg_UG = goog.i18n.DateTimeSymbols_cgg;


/**
 * Date/time formatting symbols for locale chr_US.
 */
goog.i18n.DateTimeSymbols_chr_US = goog.i18n.DateTimeSymbols_chr;


/**
 * Date/time formatting symbols for locale ckb.
 */
goog.i18n.DateTimeSymbols_ckb = {
  ZERODIGIT: 0x0660,
  ERAS: ['پێش زایین', 'زایینی'],
  ERANAMES: ['پێش زایین', 'زایینی'],
  NARROWMONTHS: ['ک', 'ش', 'ئ', 'ن', 'ئ', 'ح', 'ت', 'ئ', 'ئ', 'ت', 'ت', 'ک'],
  STANDALONENARROWMONTHS: ['ک', 'ش', 'ئ', 'ن', 'ئ', 'ح', 'ت', 'ئ', 'ئ', 'ت', 'ت', 'ک'],
  MONTHS: ['کانوونی دووەم', 'شوبات', 'ئازار', 'نیسان', 'ئایار', 'حوزەیران', 'تەمووز', 'ئاب', 'ئەیلوول', 'تشرینی یەکەم', 'تشرینی دووەم', 'کانونی یەکەم'],
  STANDALONEMONTHS: ['کانوونی دووەم', 'شوبات', 'ئازار', 'نیسان', 'ئایار', 'حوزەیران', 'تەمووز', 'ئاب', 'ئەیلوول', 'تشرینی یەکەم', 'تشرینی دووەم', 'کانونی یەکەم'],
  SHORTMONTHS: ['کانوونی دووەم', 'شوبات', 'ئازار', 'نیسان', 'ئایار', 'حوزەیران', 'تەمووز', 'ئاب', 'ئەیلوول', 'تشرینی یەکەم', 'تشرینی دووەم', 'کانونی یەکەم'],
  STANDALONESHORTMONTHS: ['کانوونی دووەم', 'شوبات', 'ئازار', 'نیسان', 'ئایار', 'حوزەیران', 'تەمووز', 'ئاب', 'ئەیلوول', 'تشرینی یەکەم', 'تشرینی دووەم', 'کانونی یەکەم'],
  WEEKDAYS: ['یەکشەممە', 'دووشەممە', 'سێشەممە', 'چوارشەممە', 'پێنجشەممە', 'ھەینی', 'شەممە'],
  STANDALONEWEEKDAYS: ['یەکشەممە', 'دووشەممە', 'سێشەممە', 'چوارشەممە', 'پێنجشەممە', 'ھەینی', 'شەممە'],
  SHORTWEEKDAYS: ['یەکشەممە', 'دووشەممە', 'سێشەممە', 'چوارشەممە', 'پێنجشەممە', 'ھەینی', 'شەممە'],
  STANDALONESHORTWEEKDAYS: ['یەکشەممە', 'دووشەممە', 'سێشەممە', 'چوارشەممە', 'پێنجشەممە', 'ھەینی', 'شەممە'],
  NARROWWEEKDAYS: ['ی', 'د', 'س', 'چ', 'پ', 'ھ', 'ش'],
  STANDALONENARROWWEEKDAYS: ['ی', 'د', 'س', 'چ', 'پ', 'ھ', 'ش'],
  SHORTQUARTERS: ['چ١', 'چ٢', 'چ٣', 'چ٤'],
  QUARTERS: ['چارەکی یەکەم', 'چارەکی دووەم', 'چارەکی سێەم', 'چارەکی چوارەم'],
  AMPMS: ['ب.ن', 'د.ن'],
  DATEFORMATS: ['y MMMM d, EEEE', 'dی MMMMی y', 'y MMM d', 'y-MM-dd'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 5,
  WEEKENDRANGE: [4, 5],
  FIRSTWEEKCUTOFFDAY: 4
};


/**
 * Date/time formatting symbols for locale ckb_IQ.
 */
goog.i18n.DateTimeSymbols_ckb_IQ = goog.i18n.DateTimeSymbols_ckb;


/**
 * Date/time formatting symbols for locale ckb_IR.
 */
goog.i18n.DateTimeSymbols_ckb_IR = {
  ZERODIGIT: 0x0660,
  ERAS: ['پێش زایین', 'زایینی'],
  ERANAMES: ['پێش زایین', 'زایینی'],
  NARROWMONTHS: ['ک', 'ش', 'ئ', 'ن', 'ئ', 'ح', 'ت', 'ئ', 'ئ', 'ت', 'ت', 'ک'],
  STANDALONENARROWMONTHS: ['ک', 'ش', 'ئ', 'ن', 'ئ', 'ح', 'ت', 'ئ', 'ئ', 'ت', 'ت', 'ک'],
  MONTHS: ['کانوونی دووەم', 'شوبات', 'ئازار', 'نیسان', 'ئایار', 'حوزەیران', 'تەمووز', 'ئاب', 'ئەیلوول', 'تشرینی یەکەم', 'تشرینی دووەم', 'کانونی یەکەم'],
  STANDALONEMONTHS: ['کانوونی دووەم', 'شوبات', 'ئازار', 'نیسان', 'ئایار', 'حوزەیران', 'تەمووز', 'ئاب', 'ئەیلوول', 'تشرینی یەکەم', 'تشرینی دووەم', 'کانونی یەکەم'],
  SHORTMONTHS: ['کانوونی دووەم', 'شوبات', 'ئازار', 'نیسان', 'ئایار', 'حوزەیران', 'تەمووز', 'ئاب', 'ئەیلوول', 'تشرینی یەکەم', 'تشرینی دووەم', 'کانونی یەکەم'],
  STANDALONESHORTMONTHS: ['کانوونی دووەم', 'شوبات', 'ئازار', 'نیسان', 'ئایار', 'حوزەیران', 'تەمووز', 'ئاب', 'ئەیلوول', 'تشرینی یەکەم', 'تشرینی دووەم', 'کانونی یەکەم'],
  WEEKDAYS: ['یەکشەممە', 'دووشەممە', 'سێشەممە', 'چوارشەممە', 'پێنجشەممە', 'ھەینی', 'شەممە'],
  STANDALONEWEEKDAYS: ['یەکشەممە', 'دووشەممە', 'سێشەممە', 'چوارشەممە', 'پێنجشەممە', 'ھەینی', 'شەممە'],
  SHORTWEEKDAYS: ['یەکشەممە', 'دووشەممە', 'سێشەممە', 'چوارشەممە', 'پێنجشەممە', 'ھەینی', 'شەممە'],
  STANDALONESHORTWEEKDAYS: ['یەکشەممە', 'دووشەممە', 'سێشەممە', 'چوارشەممە', 'پێنجشەممە', 'ھەینی', 'شەممە'],
  NARROWWEEKDAYS: ['ی', 'د', 'س', 'چ', 'پ', 'ھ', 'ش'],
  STANDALONENARROWWEEKDAYS: ['ی', 'د', 'س', 'چ', 'پ', 'ھ', 'ش'],
  SHORTQUARTERS: ['چ١', 'چ٢', 'چ٣', 'چ٤'],
  QUARTERS: ['چارەکی یەکەم', 'چارەکی دووەم', 'چارەکی سێەم', 'چارەکی چوارەم'],
  AMPMS: ['ب.ن', 'د.ن'],
  DATEFORMATS: ['y MMMM d, EEEE', 'dی MMMMی y', 'y MMM d', 'y-MM-dd'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 5,
  WEEKENDRANGE: [4, 4],
  FIRSTWEEKCUTOFFDAY: 4
};


/**
 * Date/time formatting symbols for locale cs_CZ.
 */
goog.i18n.DateTimeSymbols_cs_CZ = goog.i18n.DateTimeSymbols_cs;


/**
 * Date/time formatting symbols for locale cy_GB.
 */
goog.i18n.DateTimeSymbols_cy_GB = goog.i18n.DateTimeSymbols_cy;


/**
 * Date/time formatting symbols for locale da_DK.
 */
goog.i18n.DateTimeSymbols_da_DK = goog.i18n.DateTimeSymbols_da;


/**
 * Date/time formatting symbols for locale da_GL.
 */
goog.i18n.DateTimeSymbols_da_GL = {
  ERAS: ['f.Kr.', 'e.Kr.'],
  ERANAMES: ['f.Kr.', 'e.Kr.'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'],
  STANDALONEMONTHS: ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'],
  SHORTMONTHS: ['jan.', 'feb.', 'mar.', 'apr.', 'maj', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.'],
  STANDALONESHORTMONTHS: ['jan.', 'feb.', 'mar.', 'apr.', 'maj', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.'],
  WEEKDAYS: ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'],
  STANDALONEWEEKDAYS: ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'],
  SHORTWEEKDAYS: ['søn.', 'man.', 'tir.', 'ons.', 'tor.', 'fre.', 'lør.'],
  STANDALONESHORTWEEKDAYS: ['søn', 'man', 'tir', 'ons', 'tor', 'fre', 'lør'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'O', 'T', 'F', 'L'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'O', 'T', 'F', 'L'],
  SHORTQUARTERS: ['1. kvt.', '2. kvt.', '3. kvt.', '4. kvt.'],
  QUARTERS: ['1. kvartal', '2. kvartal', '3. kvartal', '4. kvartal'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE \'den\' d. MMMM y', 'd. MMMM y', 'd. MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h.mm.ss a zzzz', 'h.mm.ss a z', 'h.mm.ss a', 'h.mm a'],
  DATETIMEFORMATS: ['{1} \'kl\'. {0}', '{1} \'kl\'. {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale dav.
 */
goog.i18n.DateTimeSymbols_dav = {
  ERAS: ['KK', 'BK'],
  ERANAMES: ['Kabla ya Kristo', 'Baada ya Kristo'],
  NARROWMONTHS: ['I', 'K', 'K', 'K', 'K', 'K', 'M', 'W', 'I', 'I', 'I', 'I'],
  STANDALONENARROWMONTHS: ['I', 'K', 'K', 'K', 'K', 'K', 'M', 'W', 'I', 'I', 'I', 'I'],
  MONTHS: ['Mori ghwa imbiri', 'Mori ghwa kawi', 'Mori ghwa kadadu', 'Mori ghwa kana', 'Mori ghwa kasanu', 'Mori ghwa karandadu', 'Mori ghwa mfungade', 'Mori ghwa wunyanya', 'Mori ghwa ikenda', 'Mori ghwa ikumi', 'Mori ghwa ikumi na imweri', 'Mori ghwa ikumi na iwi'],
  STANDALONEMONTHS: ['Mori ghwa imbiri', 'Mori ghwa kawi', 'Mori ghwa kadadu', 'Mori ghwa kana', 'Mori ghwa kasanu', 'Mori ghwa karandadu', 'Mori ghwa mfungade', 'Mori ghwa wunyanya', 'Mori ghwa ikenda', 'Mori ghwa ikumi', 'Mori ghwa ikumi na imweri', 'Mori ghwa ikumi na iwi'],
  SHORTMONTHS: ['Imb', 'Kaw', 'Kad', 'Kan', 'Kas', 'Kar', 'Mfu', 'Wun', 'Ike', 'Iku', 'Imw', 'Iwi'],
  STANDALONESHORTMONTHS: ['Imb', 'Kaw', 'Kad', 'Kan', 'Kas', 'Kar', 'Mfu', 'Wun', 'Ike', 'Iku', 'Imw', 'Iwi'],
  WEEKDAYS: ['Ituku ja jumwa', 'Kuramuka jimweri', 'Kuramuka kawi', 'Kuramuka kadadu', 'Kuramuka kana', 'Kuramuka kasanu', 'Kifula nguwo'],
  STANDALONEWEEKDAYS: ['Ituku ja jumwa', 'Kuramuka jimweri', 'Kuramuka kawi', 'Kuramuka kadadu', 'Kuramuka kana', 'Kuramuka kasanu', 'Kifula nguwo'],
  SHORTWEEKDAYS: ['Jum', 'Jim', 'Kaw', 'Kad', 'Kan', 'Kas', 'Ngu'],
  STANDALONESHORTWEEKDAYS: ['Jum', 'Jim', 'Kaw', 'Kad', 'Kan', 'Kas', 'Ngu'],
  NARROWWEEKDAYS: ['J', 'J', 'K', 'K', 'K', 'K', 'N'],
  STANDALONENARROWWEEKDAYS: ['J', 'J', 'K', 'K', 'K', 'K', 'N'],
  SHORTQUARTERS: ['K1', 'K2', 'K3', 'K4'],
  QUARTERS: ['Kimu cha imbiri', 'Kimu cha kawi', 'Kimu cha kadadu', 'Kimu cha kana'],
  AMPMS: ['Luma lwa K', 'luma lwa p'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale dav_KE.
 */
goog.i18n.DateTimeSymbols_dav_KE = goog.i18n.DateTimeSymbols_dav;


/**
 * Date/time formatting symbols for locale de_BE.
 */
goog.i18n.DateTimeSymbols_de_BE = goog.i18n.DateTimeSymbols_de;


/**
 * Date/time formatting symbols for locale de_DE.
 */
goog.i18n.DateTimeSymbols_de_DE = goog.i18n.DateTimeSymbols_de;


/**
 * Date/time formatting symbols for locale de_IT.
 */
goog.i18n.DateTimeSymbols_de_IT = {
  ERAS: ['v. Chr.', 'n. Chr.'],
  ERANAMES: ['v. Chr.', 'n. Chr.'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  STANDALONEMONTHS: ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  SHORTMONTHS: ['Jän.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'],
  STANDALONESHORTMONTHS: ['Jän', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
  WEEKDAYS: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
  STANDALONEWEEKDAYS: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
  SHORTWEEKDAYS: ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'],
  STANDALONESHORTWEEKDAYS: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  NARROWWEEKDAYS: ['S', 'M', 'D', 'M', 'D', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'D', 'M', 'D', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1. Quartal', '2. Quartal', '3. Quartal', '4. Quartal'],
  AMPMS: ['vorm.', 'nachm.'],
  DATEFORMATS: ['EEEE, d. MMMM y', 'd. MMMM y', 'dd.MM.y', 'dd.MM.yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'um\' {0}', '{1} \'um\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale de_LI.
 */
goog.i18n.DateTimeSymbols_de_LI = goog.i18n.DateTimeSymbols_de;


/**
 * Date/time formatting symbols for locale de_LU.
 */
goog.i18n.DateTimeSymbols_de_LU = goog.i18n.DateTimeSymbols_de;


/**
 * Date/time formatting symbols for locale dje.
 */
goog.i18n.DateTimeSymbols_dje = {
  ERAS: ['IJ', 'IZ'],
  ERANAMES: ['Isaa jine', 'Isaa zamanoo'],
  NARROWMONTHS: ['Ž', 'F', 'M', 'A', 'M', 'Ž', 'Ž', 'U', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['Ž', 'F', 'M', 'A', 'M', 'Ž', 'Ž', 'U', 'S', 'O', 'N', 'D'],
  MONTHS: ['Žanwiye', 'Feewiriye', 'Marsi', 'Awiril', 'Me', 'Žuweŋ', 'Žuyye', 'Ut', 'Sektanbur', 'Oktoobur', 'Noowanbur', 'Deesanbur'],
  STANDALONEMONTHS: ['Žanwiye', 'Feewiriye', 'Marsi', 'Awiril', 'Me', 'Žuweŋ', 'Žuyye', 'Ut', 'Sektanbur', 'Oktoobur', 'Noowanbur', 'Deesanbur'],
  SHORTMONTHS: ['Žan', 'Fee', 'Mar', 'Awi', 'Me', 'Žuw', 'Žuy', 'Ut', 'Sek', 'Okt', 'Noo', 'Dee'],
  STANDALONESHORTMONTHS: ['Žan', 'Fee', 'Mar', 'Awi', 'Me', 'Žuw', 'Žuy', 'Ut', 'Sek', 'Okt', 'Noo', 'Dee'],
  WEEKDAYS: ['Alhadi', 'Atinni', 'Atalaata', 'Alarba', 'Alhamisi', 'Alzuma', 'Asibti'],
  STANDALONEWEEKDAYS: ['Alhadi', 'Atinni', 'Atalaata', 'Alarba', 'Alhamisi', 'Alzuma', 'Asibti'],
  SHORTWEEKDAYS: ['Alh', 'Ati', 'Ata', 'Ala', 'Alm', 'Alz', 'Asi'],
  STANDALONESHORTWEEKDAYS: ['Alh', 'Ati', 'Ata', 'Ala', 'Alm', 'Alz', 'Asi'],
  NARROWWEEKDAYS: ['H', 'T', 'T', 'L', 'M', 'Z', 'S'],
  STANDALONENARROWWEEKDAYS: ['H', 'T', 'T', 'L', 'M', 'Z', 'S'],
  SHORTQUARTERS: ['A1', 'A2', 'A3', 'A4'],
  QUARTERS: ['Arrubu 1', 'Arrubu 2', 'Arrubu 3', 'Arrubu 4'],
  AMPMS: ['Subbaahi', 'Zaarikay b'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM, y', 'd/M/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale dje_NE.
 */
goog.i18n.DateTimeSymbols_dje_NE = goog.i18n.DateTimeSymbols_dje;


/**
 * Date/time formatting symbols for locale dsb.
 */
goog.i18n.DateTimeSymbols_dsb = {
  ERAS: ['pś.Chr.n.', 'pó Chr.n.'],
  ERANAMES: ['pśed Kristusowym naroźenim', 'pó Kristusowem naroźenju'],
  NARROWMONTHS: ['j', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  STANDALONENARROWMONTHS: ['j', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  MONTHS: ['januara', 'februara', 'měrca', 'apryla', 'maja', 'junija', 'julija', 'awgusta', 'septembra', 'oktobra', 'nowembra', 'decembra'],
  STANDALONEMONTHS: ['januar', 'februar', 'měrc', 'apryl', 'maj', 'junij', 'julij', 'awgust', 'september', 'oktober', 'nowember', 'december'],
  SHORTMONTHS: ['jan.', 'feb.', 'měr.', 'apr.', 'maj.', 'jun.', 'jul.', 'awg.', 'sep.', 'okt.', 'now.', 'dec.'],
  STANDALONESHORTMONTHS: ['jan', 'feb', 'měr', 'apr', 'maj', 'jun', 'jul', 'awg', 'sep', 'okt', 'now', 'dec'],
  WEEKDAYS: ['njeźela', 'pónjeźele', 'wałtora', 'srjoda', 'stwórtk', 'pětk', 'sobota'],
  STANDALONEWEEKDAYS: ['njeźela', 'pónjeźele', 'wałtora', 'srjoda', 'stwórtk', 'pětk', 'sobota'],
  SHORTWEEKDAYS: ['nje', 'pón', 'wał', 'srj', 'stw', 'pět', 'sob'],
  STANDALONESHORTWEEKDAYS: ['nje', 'pón', 'wał', 'srj', 'stw', 'pět', 'sob'],
  NARROWWEEKDAYS: ['n', 'p', 'w', 's', 's', 'p', 's'],
  STANDALONENARROWWEEKDAYS: ['n', 'p', 'w', 's', 's', 'p', 's'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1. kwartal', '2. kwartal', '3. kwartal', '4. kwartal'],
  AMPMS: ['dopołdnja', 'wótpołdnja'],
  DATEFORMATS: ['EEEE, d. MMMM y', 'd. MMMM y', 'd.M.y', 'd.M.yy'],
  TIMEFORMATS: ['H:mm:ss zzzz', 'H:mm:ss z', 'H:mm:ss', 'H:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale dsb_DE.
 */
goog.i18n.DateTimeSymbols_dsb_DE = goog.i18n.DateTimeSymbols_dsb;


/**
 * Date/time formatting symbols for locale dua.
 */
goog.i18n.DateTimeSymbols_dua = {
  ERAS: ['ɓ.Ys', 'mb.Ys'],
  ERANAMES: ['ɓoso ɓwá yáɓe lá', 'mbúsa kwédi a Yés'],
  NARROWMONTHS: ['d', 'ŋ', 's', 'd', 'e', 'e', 'm', 'd', 'n', 'm', 't', 'e'],
  STANDALONENARROWMONTHS: ['d', 'ŋ', 's', 'd', 'e', 'e', 'm', 'd', 'n', 'm', 't', 'e'],
  MONTHS: ['dimɔ́di', 'ŋgɔndɛ', 'sɔŋɛ', 'diɓáɓá', 'emiasele', 'esɔpɛsɔpɛ', 'madiɓɛ́díɓɛ́', 'diŋgindi', 'nyɛtɛki', 'mayésɛ́', 'tiníní', 'eláŋgɛ́'],
  STANDALONEMONTHS: ['dimɔ́di', 'ŋgɔndɛ', 'sɔŋɛ', 'diɓáɓá', 'emiasele', 'esɔpɛsɔpɛ', 'madiɓɛ́díɓɛ́', 'diŋgindi', 'nyɛtɛki', 'mayésɛ́', 'tiníní', 'eláŋgɛ́'],
  SHORTMONTHS: ['di', 'ŋgɔn', 'sɔŋ', 'diɓ', 'emi', 'esɔ', 'mad', 'diŋ', 'nyɛt', 'may', 'tin', 'elá'],
  STANDALONESHORTMONTHS: ['di', 'ŋgɔn', 'sɔŋ', 'diɓ', 'emi', 'esɔ', 'mad', 'diŋ', 'nyɛt', 'may', 'tin', 'elá'],
  WEEKDAYS: ['éti', 'mɔ́sú', 'kwasú', 'mukɔ́sú', 'ŋgisú', 'ɗónɛsú', 'esaɓasú'],
  STANDALONEWEEKDAYS: ['éti', 'mɔ́sú', 'kwasú', 'mukɔ́sú', 'ŋgisú', 'ɗónɛsú', 'esaɓasú'],
  SHORTWEEKDAYS: ['ét', 'mɔ́s', 'kwa', 'muk', 'ŋgi', 'ɗón', 'esa'],
  STANDALONESHORTWEEKDAYS: ['ét', 'mɔ́s', 'kwa', 'muk', 'ŋgi', 'ɗón', 'esa'],
  NARROWWEEKDAYS: ['e', 'm', 'k', 'm', 'ŋ', 'ɗ', 'e'],
  STANDALONENARROWWEEKDAYS: ['e', 'm', 'k', 'm', 'ŋ', 'ɗ', 'e'],
  SHORTQUARTERS: ['ndu1', 'ndu2', 'ndu3', 'ndu4'],
  QUARTERS: ['ndúmbū nyá ɓosó', 'ndúmbū ní lóndɛ́ íɓaá', 'ndúmbū ní lóndɛ́ ílálo', 'ndúmbū ní lóndɛ́ ínɛ́y'],
  AMPMS: ['idiɓa', 'ebyámu'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'd/M/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale dua_CM.
 */
goog.i18n.DateTimeSymbols_dua_CM = goog.i18n.DateTimeSymbols_dua;


/**
 * Date/time formatting symbols for locale dyo.
 */
goog.i18n.DateTimeSymbols_dyo = {
  ERAS: ['ArY', 'AtY'],
  ERANAMES: ['Ariŋuu Yeesu', 'Atooŋe Yeesu'],
  NARROWMONTHS: ['S', 'F', 'M', 'A', 'M', 'S', 'S', 'U', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['S', 'F', 'M', 'A', 'M', 'S', 'S', 'U', 'S', 'O', 'N', 'D'],
  MONTHS: ['Sanvie', 'Fébirie', 'Mars', 'Aburil', 'Mee', 'Sueŋ', 'Súuyee', 'Ut', 'Settembar', 'Oktobar', 'Novembar', 'Disambar'],
  STANDALONEMONTHS: ['Sanvie', 'Fébirie', 'Mars', 'Aburil', 'Mee', 'Sueŋ', 'Súuyee', 'Ut', 'Settembar', 'Oktobar', 'Novembar', 'Disambar'],
  SHORTMONTHS: ['Sa', 'Fe', 'Ma', 'Ab', 'Me', 'Su', 'Sú', 'Ut', 'Se', 'Ok', 'No', 'De'],
  STANDALONESHORTMONTHS: ['Sa', 'Fe', 'Ma', 'Ab', 'Me', 'Su', 'Sú', 'Ut', 'Se', 'Ok', 'No', 'De'],
  WEEKDAYS: ['Dimas', 'Teneŋ', 'Talata', 'Alarbay', 'Aramisay', 'Arjuma', 'Sibiti'],
  STANDALONEWEEKDAYS: ['Dimas', 'Teneŋ', 'Talata', 'Alarbay', 'Aramisay', 'Arjuma', 'Sibiti'],
  SHORTWEEKDAYS: ['Dim', 'Ten', 'Tal', 'Ala', 'Ara', 'Arj', 'Sib'],
  STANDALONESHORTWEEKDAYS: ['Dim', 'Ten', 'Tal', 'Ala', 'Ara', 'Arj', 'Sib'],
  NARROWWEEKDAYS: ['D', 'T', 'T', 'A', 'A', 'A', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'T', 'T', 'A', 'A', 'A', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'd/M/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale dyo_SN.
 */
goog.i18n.DateTimeSymbols_dyo_SN = goog.i18n.DateTimeSymbols_dyo;


/**
 * Date/time formatting symbols for locale dz.
 */
goog.i18n.DateTimeSymbols_dz = {
  ZERODIGIT: 0x0F20,
  ERAS: ['BCE', 'CE'],
  ERANAMES: ['BCE', 'CE'],
  NARROWMONTHS: ['༡', '༢', '༣', '4', '༥', '༦', '༧', '༨', '9', '༡༠', '༡༡', '༡༢'],
  STANDALONENARROWMONTHS: ['༡', '༢', '༣', '༤', '༥', '༦', '༧', '༨', '༩', '༡༠', '༡༡', '༡༢'],
  MONTHS: ['ཟླ་དངཔ་', 'ཟླ་གཉིས་པ་', 'ཟླ་གསུམ་པ་', 'ཟླ་བཞི་པ་', 'ཟླ་ལྔ་པ་', 'ཟླ་དྲུག་པ', 'ཟླ་བདུན་པ་', 'ཟླ་བརྒྱད་པ་', 'ཟླ་དགུ་པ་', 'ཟླ་བཅུ་པ་', 'ཟླ་བཅུ་གཅིག་པ་', 'ཟླ་བཅུ་གཉིས་པ་'],
  STANDALONEMONTHS: ['སྤྱི་ཟླ་དངཔ་', 'སྤྱི་ཟླ་གཉིས་པ་', 'སྤྱི་ཟླ་གསུམ་པ་', 'སྤྱི་ཟླ་བཞི་པ', 'སྤྱི་ཟླ་ལྔ་པ་', 'སྤྱི་ཟླ་དྲུག་པ', 'སྤྱི་ཟླ་བདུན་པ་', 'སྤྱི་ཟླ་བརྒྱད་པ་', 'སྤྱི་ཟླ་དགུ་པ་', 'སྤྱི་ཟླ་བཅུ་པ་', 'སྤྱི་ཟླ་བཅུ་གཅིག་པ་', 'སྤྱི་ཟླ་བཅུ་གཉིས་པ་'],
  SHORTMONTHS: ['༡', '༢', '༣', '༤', '༥', '༦', '༧', '༨', '༩', '༡༠', '༡༡', '12'],
  STANDALONESHORTMONTHS: ['ཟླ་༡', 'ཟླ་༢', 'ཟླ་༣', 'ཟླ་༤', 'ཟླ་༥', 'ཟླ་༦', 'ཟླ་༧', 'ཟླ་༨', 'ཟླ་༩', 'ཟླ་༡༠', 'ཟླ་༡༡', 'ཟླ་༡༢'],
  WEEKDAYS: ['གཟའ་ཟླ་བ་', 'གཟའ་མིག་དམར་', 'གཟའ་ལྷག་པ་', 'གཟའ་ཕུར་བུ་', 'གཟའ་པ་སངས་', 'གཟའ་སྤེན་པ་', 'གཟའ་ཉི་མ་'],
  STANDALONEWEEKDAYS: ['གཟའ་ཟླ་བ་', 'གཟའ་མིག་དམར་', 'གཟའ་ལྷག་པ་', 'གཟའ་ཕུར་བུ་', 'གཟའ་པ་སངས་', 'གཟའ་སྤེན་པ་', 'གཟའ་ཉི་མ་'],
  SHORTWEEKDAYS: ['ཟླ་', 'མིར་', 'ལྷག་', 'ཕུར་', 'སངས་', 'སྤེན་', 'ཉི་'],
  STANDALONESHORTWEEKDAYS: ['ཟླ་', 'མིར་', 'ལྷག་', 'ཕུར་', 'སངས་', 'སྤེན་', 'ཉི་'],
  NARROWWEEKDAYS: ['ཟླ', 'མིར', 'ལྷག', 'ཕུར', 'སངྶ', 'སྤེན', 'ཉི'],
  STANDALONENARROWWEEKDAYS: ['ཟླ', 'མིར', 'ལྷག', 'ཕུར', 'སངྶ', 'སྤེན', 'ཉི'],
  SHORTQUARTERS: ['བཞི་དཔྱ་༡', 'བཞི་དཔྱ་༢', 'བཞི་དཔྱ་༣', 'བཞི་དཔྱ་༤'],
  QUARTERS: ['བཞི་དཔྱ་དང་པ་', 'བཞི་དཔྱ་གཉིས་པ་', 'བཞི་དཔྱ་གསུམ་པ་', 'བཞི་དཔྱ་བཞི་པ་'],
  AMPMS: ['སྔ་ཆ་', 'ཕྱི་ཆ་'],
  DATEFORMATS: ['EEEE, སྤྱི་ལོ་y MMMM ཚེས་dd', 'སྤྱི་ལོ་y MMMM ཚེས་ dd', 'སྤྱི་ལོ་y ཟླ་MMM ཚེས་dd', 'y-MM-dd'],
  TIMEFORMATS: ['ཆུ་ཚོད་ h སྐར་མ་ mm:ss a zzzz', 'ཆུ་ཚོད་ h སྐར་མ་ mm:ss a z', 'ཆུ་ཚོད་h:mm:ss a', 'ཆུ་ཚོད་ h སྐར་མ་ mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale dz_BT.
 */
goog.i18n.DateTimeSymbols_dz_BT = goog.i18n.DateTimeSymbols_dz;


/**
 * Date/time formatting symbols for locale ebu.
 */
goog.i18n.DateTimeSymbols_ebu = {
  ERAS: ['MK', 'TK'],
  ERANAMES: ['Mbere ya Kristo', 'Thutha wa Kristo'],
  NARROWMONTHS: ['M', 'K', 'K', 'K', 'G', 'G', 'M', 'K', 'K', 'I', 'I', 'I'],
  STANDALONENARROWMONTHS: ['M', 'K', 'K', 'K', 'G', 'G', 'M', 'K', 'K', 'I', 'I', 'I'],
  MONTHS: ['Mweri wa mbere', 'Mweri wa kaĩri', 'Mweri wa kathatũ', 'Mweri wa kana', 'Mweri wa gatano', 'Mweri wa gatantatũ', 'Mweri wa mũgwanja', 'Mweri wa kanana', 'Mweri wa kenda', 'Mweri wa ikũmi', 'Mweri wa ikũmi na ũmwe', 'Mweri wa ikũmi na Kaĩrĩ'],
  STANDALONEMONTHS: ['Mweri wa mbere', 'Mweri wa kaĩri', 'Mweri wa kathatũ', 'Mweri wa kana', 'Mweri wa gatano', 'Mweri wa gatantatũ', 'Mweri wa mũgwanja', 'Mweri wa kanana', 'Mweri wa kenda', 'Mweri wa ikũmi', 'Mweri wa ikũmi na ũmwe', 'Mweri wa ikũmi na Kaĩrĩ'],
  SHORTMONTHS: ['Mbe', 'Kai', 'Kat', 'Kan', 'Gat', 'Gan', 'Mug', 'Knn', 'Ken', 'Iku', 'Imw', 'Igi'],
  STANDALONESHORTMONTHS: ['Mbe', 'Kai', 'Kat', 'Kan', 'Gat', 'Gan', 'Mug', 'Knn', 'Ken', 'Iku', 'Imw', 'Igi'],
  WEEKDAYS: ['Kiumia', 'Njumatatu', 'Njumaine', 'Njumatano', 'Aramithi', 'Njumaa', 'NJumamothii'],
  STANDALONEWEEKDAYS: ['Kiumia', 'Njumatatu', 'Njumaine', 'Njumatano', 'Aramithi', 'Njumaa', 'NJumamothii'],
  SHORTWEEKDAYS: ['Kma', 'Tat', 'Ine', 'Tan', 'Arm', 'Maa', 'NMM'],
  STANDALONESHORTWEEKDAYS: ['Kma', 'Tat', 'Ine', 'Tan', 'Arm', 'Maa', 'NMM'],
  NARROWWEEKDAYS: ['K', 'N', 'N', 'N', 'A', 'M', 'N'],
  STANDALONENARROWWEEKDAYS: ['K', 'N', 'N', 'N', 'A', 'M', 'N'],
  SHORTQUARTERS: ['K1', 'K2', 'K3', 'K4'],
  QUARTERS: ['Kuota ya mbere', 'Kuota ya Kaĩrĩ', 'Kuota ya kathatu', 'Kuota ya kana'],
  AMPMS: ['KI', 'UT'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale ebu_KE.
 */
goog.i18n.DateTimeSymbols_ebu_KE = goog.i18n.DateTimeSymbols_ebu;


/**
 * Date/time formatting symbols for locale ee.
 */
goog.i18n.DateTimeSymbols_ee = {
  ERAS: ['hY', 'Yŋ'],
  ERANAMES: ['Hafi Yesu Va Do ŋgɔ', 'Yesu Ŋɔli'],
  NARROWMONTHS: ['d', 'd', 't', 'a', 'd', 'm', 's', 'd', 'a', 'k', 'a', 'd'],
  STANDALONENARROWMONTHS: ['d', 'd', 't', 'a', 'd', 'm', 's', 'd', 'a', 'k', 'a', 'd'],
  MONTHS: ['dzove', 'dzodze', 'tedoxe', 'afɔfĩe', 'dama', 'masa', 'siamlɔm', 'deasiamime', 'anyɔnyɔ', 'kele', 'adeɛmekpɔxe', 'dzome'],
  STANDALONEMONTHS: ['dzove', 'dzodze', 'tedoxe', 'afɔfĩe', 'dama', 'masa', 'siamlɔm', 'deasiamime', 'anyɔnyɔ', 'kele', 'adeɛmekpɔxe', 'dzome'],
  SHORTMONTHS: ['dzv', 'dzd', 'ted', 'afɔ', 'dam', 'mas', 'sia', 'dea', 'any', 'kel', 'ade', 'dzm'],
  STANDALONESHORTMONTHS: ['dzv', 'dzd', 'ted', 'afɔ', 'dam', 'mas', 'sia', 'dea', 'any', 'kel', 'ade', 'dzm'],
  WEEKDAYS: ['kɔsiɖa', 'dzoɖa', 'blaɖa', 'kuɖa', 'yawoɖa', 'fiɖa', 'memleɖa'],
  STANDALONEWEEKDAYS: ['kɔsiɖa', 'dzoɖa', 'blaɖa', 'kuɖa', 'yawoɖa', 'fiɖa', 'memleɖa'],
  SHORTWEEKDAYS: ['kɔs', 'dzo', 'bla', 'kuɖ', 'yaw', 'fiɖ', 'mem'],
  STANDALONESHORTWEEKDAYS: ['kɔs', 'dzo', 'bla', 'kuɖ', 'yaw', 'fiɖ', 'mem'],
  NARROWWEEKDAYS: ['k', 'd', 'b', 'k', 'y', 'f', 'm'],
  STANDALONENARROWWEEKDAYS: ['k', 'd', 'b', 'k', 'y', 'f', 'm'],
  SHORTQUARTERS: ['k1', 'k2', 'k3', 'k4'],
  QUARTERS: ['kɔta gbãtɔ', 'kɔta evelia', 'kɔta etɔ̃lia', 'kɔta enelia'],
  AMPMS: ['ŋdi', 'ɣetrɔ'],
  DATEFORMATS: ['EEEE, MMMM d \'lia\' y', 'MMMM d \'lia\' y', 'MMM d \'lia\', y', 'M/d/yy'],
  TIMEFORMATS: ['a \'ga\' h:mm:ss zzzz', 'a \'ga\' h:mm:ss z', 'a \'ga\' h:mm:ss', 'a \'ga\' h:mm'],
  DATETIMEFORMATS: ['{0} {1}', '{0} {1}', '{0} {1}', '{0} {1}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale ee_GH.
 */
goog.i18n.DateTimeSymbols_ee_GH = goog.i18n.DateTimeSymbols_ee;


/**
 * Date/time formatting symbols for locale ee_TG.
 */
goog.i18n.DateTimeSymbols_ee_TG = {
  ERAS: ['hY', 'Yŋ'],
  ERANAMES: ['Hafi Yesu Va Do ŋgɔ', 'Yesu Ŋɔli'],
  NARROWMONTHS: ['d', 'd', 't', 'a', 'd', 'm', 's', 'd', 'a', 'k', 'a', 'd'],
  STANDALONENARROWMONTHS: ['d', 'd', 't', 'a', 'd', 'm', 's', 'd', 'a', 'k', 'a', 'd'],
  MONTHS: ['dzove', 'dzodze', 'tedoxe', 'afɔfĩe', 'dama', 'masa', 'siamlɔm', 'deasiamime', 'anyɔnyɔ', 'kele', 'adeɛmekpɔxe', 'dzome'],
  STANDALONEMONTHS: ['dzove', 'dzodze', 'tedoxe', 'afɔfĩe', 'dama', 'masa', 'siamlɔm', 'deasiamime', 'anyɔnyɔ', 'kele', 'adeɛmekpɔxe', 'dzome'],
  SHORTMONTHS: ['dzv', 'dzd', 'ted', 'afɔ', 'dam', 'mas', 'sia', 'dea', 'any', 'kel', 'ade', 'dzm'],
  STANDALONESHORTMONTHS: ['dzv', 'dzd', 'ted', 'afɔ', 'dam', 'mas', 'sia', 'dea', 'any', 'kel', 'ade', 'dzm'],
  WEEKDAYS: ['kɔsiɖa', 'dzoɖa', 'blaɖa', 'kuɖa', 'yawoɖa', 'fiɖa', 'memleɖa'],
  STANDALONEWEEKDAYS: ['kɔsiɖa', 'dzoɖa', 'blaɖa', 'kuɖa', 'yawoɖa', 'fiɖa', 'memleɖa'],
  SHORTWEEKDAYS: ['kɔs', 'dzo', 'bla', 'kuɖ', 'yaw', 'fiɖ', 'mem'],
  STANDALONESHORTWEEKDAYS: ['kɔs', 'dzo', 'bla', 'kuɖ', 'yaw', 'fiɖ', 'mem'],
  NARROWWEEKDAYS: ['k', 'd', 'b', 'k', 'y', 'f', 'm'],
  STANDALONENARROWWEEKDAYS: ['k', 'd', 'b', 'k', 'y', 'f', 'm'],
  SHORTQUARTERS: ['k1', 'k2', 'k3', 'k4'],
  QUARTERS: ['kɔta gbãtɔ', 'kɔta evelia', 'kɔta etɔ̃lia', 'kɔta enelia'],
  AMPMS: ['ŋdi', 'ɣetrɔ'],
  DATEFORMATS: ['EEEE, MMMM d \'lia\' y', 'MMMM d \'lia\' y', 'MMM d \'lia\', y', 'M/d/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{0} {1}', '{0} {1}', '{0} {1}', '{0} {1}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale el_CY.
 */
goog.i18n.DateTimeSymbols_el_CY = {
  ERAS: ['π.Χ.', 'μ.Χ.'],
  ERANAMES: ['προ Χριστού', 'μετά Χριστόν'],
  NARROWMONTHS: ['Ι', 'Φ', 'Μ', 'Α', 'Μ', 'Ι', 'Ι', 'Α', 'Σ', 'Ο', 'Ν', 'Δ'],
  STANDALONENARROWMONTHS: ['Ι', 'Φ', 'Μ', 'Α', 'Μ', 'Ι', 'Ι', 'Α', 'Σ', 'Ο', 'Ν', 'Δ'],
  MONTHS: ['Ιανουαρίου', 'Φεβρουαρίου', 'Μαρτίου', 'Απριλίου', 'Μαΐου', 'Ιουνίου', 'Ιουλίου', 'Αυγούστου', 'Σεπτεμβρίου', 'Οκτωβρίου', 'Νοεμβρίου', 'Δεκεμβρίου'],
  STANDALONEMONTHS: ['Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος', 'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'],
  SHORTMONTHS: ['Ιαν', 'Φεβ', 'Μαρ', 'Απρ', 'Μαΐ', 'Ιουν', 'Ιουλ', 'Αυγ', 'Σεπ', 'Οκτ', 'Νοε', 'Δεκ'],
  STANDALONESHORTMONTHS: ['Ιαν', 'Φεβ', 'Μάρ', 'Απρ', 'Μάι', 'Ιούν', 'Ιούλ', 'Αύγ', 'Σεπ', 'Οκτ', 'Νοέ', 'Δεκ'],
  WEEKDAYS: ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'],
  STANDALONEWEEKDAYS: ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'],
  SHORTWEEKDAYS: ['Κυρ', 'Δευ', 'Τρί', 'Τετ', 'Πέμ', 'Παρ', 'Σάβ'],
  STANDALONESHORTWEEKDAYS: ['Κυρ', 'Δευ', 'Τρί', 'Τετ', 'Πέμ', 'Παρ', 'Σάβ'],
  NARROWWEEKDAYS: ['Κ', 'Δ', 'Τ', 'Τ', 'Π', 'Π', 'Σ'],
  STANDALONENARROWWEEKDAYS: ['Κ', 'Δ', 'Τ', 'Τ', 'Π', 'Π', 'Σ'],
  SHORTQUARTERS: ['Τ1', 'Τ2', 'Τ3', 'Τ4'],
  QUARTERS: ['1ο τρίμηνο', '2ο τρίμηνο', '3ο τρίμηνο', '4ο τρίμηνο'],
  AMPMS: ['π.μ.', 'μ.μ.'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'd/M/yy'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} - {0}', '{1} - {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale el_GR.
 */
goog.i18n.DateTimeSymbols_el_GR = goog.i18n.DateTimeSymbols_el;


/**
 * Date/time formatting symbols for locale en_001.
 */
goog.i18n.DateTimeSymbols_en_001 = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_150.
 */
goog.i18n.DateTimeSymbols_en_150 = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_AG.
 */
goog.i18n.DateTimeSymbols_en_AG = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale en_AI.
 */
goog.i18n.DateTimeSymbols_en_AI = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_AS.
 */
goog.i18n.DateTimeSymbols_en_AS = goog.i18n.DateTimeSymbols_en;


/**
 * Date/time formatting symbols for locale en_AT.
 */
goog.i18n.DateTimeSymbols_en_AT = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale en_BB.
 */
goog.i18n.DateTimeSymbols_en_BB = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_BE.
 */
goog.i18n.DateTimeSymbols_en_BE = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'dd MMM y', 'dd/MM/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale en_BI.
 */
goog.i18n.DateTimeSymbols_en_BI = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, MMMM d, y', 'MMMM d, y', 'MMM d, y', 'M/d/yy'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_BM.
 */
goog.i18n.DateTimeSymbols_en_BM = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_BS.
 */
goog.i18n.DateTimeSymbols_en_BS = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale en_BW.
 */
goog.i18n.DateTimeSymbols_en_BW = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, dd MMMM y', 'dd MMMM y', 'dd MMM y', 'dd/MM/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale en_BZ.
 */
goog.i18n.DateTimeSymbols_en_BZ = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, dd MMMM y', 'dd MMMM y', 'dd-MMM-y', 'dd/MM/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale en_CC.
 */
goog.i18n.DateTimeSymbols_en_CC = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_CH.
 */
goog.i18n.DateTimeSymbols_en_CH = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale en_CK.
 */
goog.i18n.DateTimeSymbols_en_CK = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_CM.
 */
goog.i18n.DateTimeSymbols_en_CM = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_CX.
 */
goog.i18n.DateTimeSymbols_en_CX = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_CY.
 */
goog.i18n.DateTimeSymbols_en_CY = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_DE.
 */
goog.i18n.DateTimeSymbols_en_DE = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale en_DG.
 */
goog.i18n.DateTimeSymbols_en_DG = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_DK.
 */
goog.i18n.DateTimeSymbols_en_DK = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH.mm.ss zzzz', 'HH.mm.ss z', 'HH.mm.ss', 'HH.mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale en_DM.
 */
goog.i18n.DateTimeSymbols_en_DM = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale en_ER.
 */
goog.i18n.DateTimeSymbols_en_ER = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_FI.
 */
goog.i18n.DateTimeSymbols_en_FI = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['H.mm.ss zzzz', 'H.mm.ss z', 'H.mm.ss', 'H.mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale en_FJ.
 */
goog.i18n.DateTimeSymbols_en_FJ = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale en_FK.
 */
goog.i18n.DateTimeSymbols_en_FK = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_FM.
 */
goog.i18n.DateTimeSymbols_en_FM = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_GD.
 */
goog.i18n.DateTimeSymbols_en_GD = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_GG.
 */
goog.i18n.DateTimeSymbols_en_GG = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale en_GH.
 */
goog.i18n.DateTimeSymbols_en_GH = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_GI.
 */
goog.i18n.DateTimeSymbols_en_GI = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale en_GM.
 */
goog.i18n.DateTimeSymbols_en_GM = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_GU.
 */
goog.i18n.DateTimeSymbols_en_GU = goog.i18n.DateTimeSymbols_en;


/**
 * Date/time formatting symbols for locale en_GY.
 */
goog.i18n.DateTimeSymbols_en_GY = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_HK.
 */
goog.i18n.DateTimeSymbols_en_HK = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'd/M/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale en_IL.
 */
goog.i18n.DateTimeSymbols_en_IL = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['H:mm:ss zzzz', 'H:mm:ss z', 'H:mm:ss', 'H:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [4, 5],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale en_IM.
 */
goog.i18n.DateTimeSymbols_en_IM = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale en_IO.
 */
goog.i18n.DateTimeSymbols_en_IO = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_JE.
 */
goog.i18n.DateTimeSymbols_en_JE = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale en_JM.
 */
goog.i18n.DateTimeSymbols_en_JM = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale en_KE.
 */
goog.i18n.DateTimeSymbols_en_KE = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale en_KI.
 */
goog.i18n.DateTimeSymbols_en_KI = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_KN.
 */
goog.i18n.DateTimeSymbols_en_KN = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_KY.
 */
goog.i18n.DateTimeSymbols_en_KY = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_LC.
 */
goog.i18n.DateTimeSymbols_en_LC = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_LR.
 */
goog.i18n.DateTimeSymbols_en_LR = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_LS.
 */
goog.i18n.DateTimeSymbols_en_LS = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_MG.
 */
goog.i18n.DateTimeSymbols_en_MG = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_MH.
 */
goog.i18n.DateTimeSymbols_en_MH = goog.i18n.DateTimeSymbols_en;


/**
 * Date/time formatting symbols for locale en_MO.
 */
goog.i18n.DateTimeSymbols_en_MO = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale en_MP.
 */
goog.i18n.DateTimeSymbols_en_MP = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, MMMM d, y', 'MMMM d, y', 'MMM d, y', 'M/d/yy'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_MS.
 */
goog.i18n.DateTimeSymbols_en_MS = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_MT.
 */
goog.i18n.DateTimeSymbols_en_MT = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'dd MMMM y', 'dd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale en_MU.
 */
goog.i18n.DateTimeSymbols_en_MU = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_MW.
 */
goog.i18n.DateTimeSymbols_en_MW = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_MY.
 */
goog.i18n.DateTimeSymbols_en_MY = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_NA.
 */
goog.i18n.DateTimeSymbols_en_NA = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_NF.
 */
goog.i18n.DateTimeSymbols_en_NF = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_NG.
 */
goog.i18n.DateTimeSymbols_en_NG = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_NL.
 */
goog.i18n.DateTimeSymbols_en_NL = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale en_NR.
 */
goog.i18n.DateTimeSymbols_en_NR = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_NU.
 */
goog.i18n.DateTimeSymbols_en_NU = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_NZ.
 */
goog.i18n.DateTimeSymbols_en_NZ = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd/MM/y', 'd/MM/yy'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale en_PG.
 */
goog.i18n.DateTimeSymbols_en_PG = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_PH.
 */
goog.i18n.DateTimeSymbols_en_PH = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale en_PK.
 */
goog.i18n.DateTimeSymbols_en_PK = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'dd-MMM-y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale en_PN.
 */
goog.i18n.DateTimeSymbols_en_PN = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_PR.
 */
goog.i18n.DateTimeSymbols_en_PR = goog.i18n.DateTimeSymbols_en;


/**
 * Date/time formatting symbols for locale en_PW.
 */
goog.i18n.DateTimeSymbols_en_PW = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_RW.
 */
goog.i18n.DateTimeSymbols_en_RW = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_SB.
 */
goog.i18n.DateTimeSymbols_en_SB = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_SC.
 */
goog.i18n.DateTimeSymbols_en_SC = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_SD.
 */
goog.i18n.DateTimeSymbols_en_SD = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 5,
  WEEKENDRANGE: [4, 5],
  FIRSTWEEKCUTOFFDAY: 4
};


/**
 * Date/time formatting symbols for locale en_SE.
 */
goog.i18n.DateTimeSymbols_en_SE = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'y-MM-dd'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale en_SH.
 */
goog.i18n.DateTimeSymbols_en_SH = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_SI.
 */
goog.i18n.DateTimeSymbols_en_SI = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_SL.
 */
goog.i18n.DateTimeSymbols_en_SL = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_SS.
 */
goog.i18n.DateTimeSymbols_en_SS = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_SX.
 */
goog.i18n.DateTimeSymbols_en_SX = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_SZ.
 */
goog.i18n.DateTimeSymbols_en_SZ = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_TC.
 */
goog.i18n.DateTimeSymbols_en_TC = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_TK.
 */
goog.i18n.DateTimeSymbols_en_TK = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_TO.
 */
goog.i18n.DateTimeSymbols_en_TO = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_TT.
 */
goog.i18n.DateTimeSymbols_en_TT = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale en_TV.
 */
goog.i18n.DateTimeSymbols_en_TV = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_TZ.
 */
goog.i18n.DateTimeSymbols_en_TZ = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_UG.
 */
goog.i18n.DateTimeSymbols_en_UG = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_UM.
 */
goog.i18n.DateTimeSymbols_en_UM = goog.i18n.DateTimeSymbols_en;


/**
 * Date/time formatting symbols for locale en_US_POSIX.
 */
goog.i18n.DateTimeSymbols_en_US_POSIX = goog.i18n.DateTimeSymbols_en;


/**
 * Date/time formatting symbols for locale en_VC.
 */
goog.i18n.DateTimeSymbols_en_VC = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_VG.
 */
goog.i18n.DateTimeSymbols_en_VG = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_VI.
 */
goog.i18n.DateTimeSymbols_en_VI = goog.i18n.DateTimeSymbols_en;


/**
 * Date/time formatting symbols for locale en_VU.
 */
goog.i18n.DateTimeSymbols_en_VU = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_WS.
 */
goog.i18n.DateTimeSymbols_en_WS = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale en_XA.
 */
goog.i18n.DateTimeSymbols_en_XA = {
  ERAS: ['[ƁÇ one]', '[ÅÐ one]'],
  ERANAMES: ['[Ɓéƒöŕé Çĥŕîšţ one two]', '[Åññö Ðöɱîñî one two]'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['[Ĵåñûåŕý one]', '[Ƒéƀŕûåŕý one]', '[Ṁåŕçĥ one]', '[Åþŕîļ one]', '[Ṁåý one]', '[Ĵûñé one]', '[Ĵûļý one]', '[Åûĝûšţ one]', '[Šéþţéɱƀéŕ one two]', '[Öçţöƀéŕ one]', '[Ñöṽéɱƀéŕ one]', '[Ðéçéɱƀéŕ one]'],
  STANDALONEMONTHS: ['[Ĵåñûåŕý one]', '[Ƒéƀŕûåŕý one]', '[Ṁåŕçĥ one]', '[Åþŕîļ one]', '[Ṁåý one]', '[Ĵûñé one]', '[Ĵûļý one]', '[Åûĝûšţ one]', '[Šéþţéɱƀéŕ one two]', '[Öçţöƀéŕ one]', '[Ñöṽéɱƀéŕ one]', '[Ðéçéɱƀéŕ one]'],
  SHORTMONTHS: ['[Ĵåñ one]', '[Ƒéƀ one]', '[Ṁåŕ one]', '[Åþŕ one]', '[Ṁåý one]', '[Ĵûñ one]', '[Ĵûļ one]', '[Åûĝ one]', '[Šéþ one]', '[Öçţ one]', '[Ñöṽ one]', '[Ðéç one]'],
  STANDALONESHORTMONTHS: ['[Ĵåñ one]', '[Ƒéƀ one]', '[Ṁåŕ one]', '[Åþŕ one]', '[Ṁåý one]', '[Ĵûñ one]', '[Ĵûļ one]', '[Åûĝ one]', '[Šéþ one]', '[Öçţ one]', '[Ñöṽ one]', '[Ðéç one]'],
  WEEKDAYS: ['[Šûñðåý one]', '[Ṁöñðåý one]', '[Ţûéšðåý one]', '[Ŵéðñéšðåý one two]', '[Ţĥûŕšðåý one]', '[Ƒŕîðåý one]', '[Šåţûŕðåý one]'],
  STANDALONEWEEKDAYS: ['[Šûñðåý one]', '[Ṁöñðåý one]', '[Ţûéšðåý one]', '[Ŵéðñéšðåý one two]', '[Ţĥûŕšðåý one]', '[Ƒŕîðåý one]', '[Šåţûŕðåý one]'],
  SHORTWEEKDAYS: ['[Šûñ one]', '[Ṁöñ one]', '[Ţûé one]', '[Ŵéð one]', '[Ţĥû one]', '[Ƒŕî one]', '[Šåţ one]'],
  STANDALONESHORTWEEKDAYS: ['[Šûñ one]', '[Ṁöñ one]', '[Ţûé one]', '[Ŵéð one]', '[Ţĥû one]', '[Ƒŕî one]', '[Šåţ one]'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['[Ǫ① one]', '[Ǫ② one]', '[Ǫ③ one]', '[Ǫ④ one]'],
  QUARTERS: ['[①šţ ǫûåŕţéŕ one two]', '[②ñð ǫûåŕţéŕ one two]', '[③ŕð ǫûåŕţéŕ one two]', '[④ţĥ ǫûåŕţéŕ one two]'],
  AMPMS: ['[ÅṀ one]', '[ÞṀ one]'],
  DATEFORMATS: ['[EEEE, MMMM d, y]', '[MMMM d, y]', '[MMM d, y]', '[M/d/yy]'],
  TIMEFORMATS: ['[h:mm:ss a zzzz]', '[h:mm:ss a z]', '[h:mm:ss a]', '[h:mm a]'],
  DATETIMEFORMATS: ['[{1} \'åţ\' {0} \'one\']', '[{1} \'åţ\' {0} \'one\']', '[{1}, {0}]', '[{1}, {0}]'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_ZM.
 */
goog.i18n.DateTimeSymbols_en_ZM = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale en_ZW.
 */
goog.i18n.DateTimeSymbols_en_ZW = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Before Christ', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  STANDALONEMONTHS: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  STANDALONEWEEKDAYS: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, dd MMMM y', 'dd MMMM y', 'dd MMM,y', 'd/M/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'at\' {0}', '{1} \'at\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale eo.
 */
goog.i18n.DateTimeSymbols_eo = {
  ERAS: ['aK', 'pK'],
  ERANAMES: ['aK', 'pK'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['januaro', 'februaro', 'marto', 'aprilo', 'majo', 'junio', 'julio', 'aŭgusto', 'septembro', 'oktobro', 'novembro', 'decembro'],
  STANDALONEMONTHS: ['januaro', 'februaro', 'marto', 'aprilo', 'majo', 'junio', 'julio', 'aŭgusto', 'septembro', 'oktobro', 'novembro', 'decembro'],
  SHORTMONTHS: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aŭg', 'sep', 'okt', 'nov', 'dec'],
  STANDALONESHORTMONTHS: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aŭg', 'sep', 'okt', 'nov', 'dec'],
  WEEKDAYS: ['dimanĉo', 'lundo', 'mardo', 'merkredo', 'ĵaŭdo', 'vendredo', 'sabato'],
  STANDALONEWEEKDAYS: ['dimanĉo', 'lundo', 'mardo', 'merkredo', 'ĵaŭdo', 'vendredo', 'sabato'],
  SHORTWEEKDAYS: ['di', 'lu', 'ma', 'me', 'ĵa', 've', 'sa'],
  STANDALONESHORTWEEKDAYS: ['di', 'lu', 'ma', 'me', 'ĵa', 've', 'sa'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['atm', 'ptm'],
  DATEFORMATS: ['EEEE, d-\'a\' \'de\' MMMM y', 'y-MMMM-dd', 'y-MMM-dd', 'yy-MM-dd'],
  TIMEFORMATS: ['H-\'a\' \'horo\' \'kaj\' m:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale es_AR.
 */
goog.i18n.DateTimeSymbols_es_AR = {
  ERAS: ['a. C.', 'd. C.'],
  ERANAMES: ['antes de Cristo', 'después de Cristo'],
  NARROWMONTHS: ['e', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  STANDALONENARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  STANDALONEMONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  SHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  STANDALONESHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  WEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  SHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  STANDALONESHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.er trimestre', '2.º trimestre', '3.er trimestre', '4.º trimestre'],
  AMPMS: ['a. m.', 'p. m.'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'd MMM y', 'd/M/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1}, {0}', '{1}, {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale es_BO.
 */
goog.i18n.DateTimeSymbols_es_BO = {
  ERAS: ['a. C.', 'd. C.'],
  ERANAMES: ['antes de Cristo', 'después de Cristo'],
  NARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  STANDALONEMONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  SHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  STANDALONESHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  WEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  SHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  STANDALONESHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  NARROWWEEKDAYS: ['d', 'l', 'm', 'm', 'j', 'v', 's'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.er trimestre', '2.º trimestre', '3.er trimestre', '4.º trimestre'],
  AMPMS: ['a. m.', 'p. m.'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'd MMM \'de\' y', 'd/M/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1}, {0}', '{1}, {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale es_BR.
 */
goog.i18n.DateTimeSymbols_es_BR = {
  ERAS: ['a. C.', 'd. C.'],
  ERANAMES: ['antes de Cristo', 'después de Cristo'],
  NARROWMONTHS: ['e', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  STANDALONENARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  STANDALONEMONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  SHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  STANDALONESHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  WEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  SHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  STANDALONESHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  NARROWWEEKDAYS: ['d', 'l', 'm', 'm', 'j', 'v', 's'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.er trimestre', '2.º trimestre', '3.er trimestre', '4.º trimestre'],
  AMPMS: ['a.m.', 'p.m.'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'd MMM y', 'd/M/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1}, {0}', '{1}, {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale es_BZ.
 */
goog.i18n.DateTimeSymbols_es_BZ = {
  ERAS: ['a. C.', 'd. C.'],
  ERANAMES: ['antes de Cristo', 'después de Cristo'],
  NARROWMONTHS: ['e', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  STANDALONENARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  STANDALONEMONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  SHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  STANDALONESHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  WEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  SHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  STANDALONESHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  NARROWWEEKDAYS: ['d', 'l', 'm', 'm', 'j', 'v', 's'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.er trimestre', '2.º trimestre', '3.er trimestre', '4.º trimestre'],
  AMPMS: ['a.m.', 'p.m.'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'd MMM y', 'd/M/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1}, {0}', '{1}, {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale es_CL.
 */
goog.i18n.DateTimeSymbols_es_CL = {
  ERAS: ['a. C.', 'd. C.'],
  ERANAMES: ['antes de Cristo', 'después de Cristo'],
  NARROWMONTHS: ['e', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  STANDALONENARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  STANDALONEMONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  SHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  STANDALONESHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sept.', 'oct.', 'nov.', 'dic.'],
  WEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  SHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  STANDALONESHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  NARROWWEEKDAYS: ['d', 'l', 'm', 'm', 'j', 'v', 's'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.er trimestre', '2.º trimestre', '3.er trimestre', '4.º trimestre'],
  AMPMS: ['a. m.', 'p. m.'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'dd-MM-y', 'dd-MM-yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1}, {0}', '{1}, {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale es_CO.
 */
goog.i18n.DateTimeSymbols_es_CO = {
  ERAS: ['a. C.', 'd. C.'],
  ERANAMES: ['antes de Cristo', 'después de Cristo'],
  NARROWMONTHS: ['e', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  STANDALONENARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  STANDALONEMONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  SHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  STANDALONESHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sept.', 'oct.', 'nov.', 'dic.'],
  WEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  SHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  STANDALONESHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['d', 'l', 'm', 'm', 'j', 'v', 's'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.er trimestre', '2.º trimestre', '3.er trimestre', '4.º trimestre'],
  AMPMS: ['a. m.', 'p. m.'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'd/MM/y', 'd/MM/yy'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1}, {0}', '{1}, {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale es_CR.
 */
goog.i18n.DateTimeSymbols_es_CR = {
  ERAS: ['a. C.', 'd. C.'],
  ERANAMES: ['antes de Cristo', 'después de Cristo'],
  NARROWMONTHS: ['e', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  STANDALONENARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  STANDALONEMONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  SHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  STANDALONESHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  WEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  SHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  STANDALONESHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  NARROWWEEKDAYS: ['d', 'l', 'm', 'm', 'j', 'v', 's'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.er trimestre', '2.º trimestre', '3.er trimestre', '4.º trimestre'],
  AMPMS: ['a. m.', 'p. m.'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'd MMM y', 'd/M/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1}, {0}', '{1}, {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale es_CU.
 */
goog.i18n.DateTimeSymbols_es_CU = {
  ERAS: ['a. C.', 'd. C.'],
  ERANAMES: ['antes de Cristo', 'después de Cristo'],
  NARROWMONTHS: ['e', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  STANDALONENARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  STANDALONEMONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  SHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  STANDALONESHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  WEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  SHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  STANDALONESHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  NARROWWEEKDAYS: ['d', 'l', 'm', 'm', 'j', 'v', 's'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.er trimestre', '2.º trimestre', '3.er trimestre', '4.º trimestre'],
  AMPMS: ['a.m.', 'p.m.'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'd MMM y', 'd/M/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1}, {0}', '{1}, {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale es_DO.
 */
goog.i18n.DateTimeSymbols_es_DO = {
  ERAS: ['a. C.', 'd. C.'],
  ERANAMES: ['antes de Cristo', 'después de Cristo'],
  NARROWMONTHS: ['e', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  STANDALONENARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  STANDALONEMONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  SHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  STANDALONESHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  WEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  SHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  STANDALONESHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1.er trimestre', '2.º trimestre', '3.er trimestre', '4.º trimestre'],
  AMPMS: ['a. m.', 'p. m.'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'd MMM y', 'd/M/yy'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1}, {0}', '{1}, {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale es_EA.
 */
goog.i18n.DateTimeSymbols_es_EA = {
  ERAS: ['a. C.', 'd. C.'],
  ERANAMES: ['antes de Cristo', 'después de Cristo'],
  NARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  STANDALONEMONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  SHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sept.', 'oct.', 'nov.', 'dic.'],
  STANDALONESHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sept.', 'oct.', 'nov.', 'dic.'],
  WEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  SHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  STANDALONESHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.er trimestre', '2.º trimestre', '3.er trimestre', '4.º trimestre'],
  AMPMS: ['a. m.', 'p. m.'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'd MMM y', 'd/M/yy'],
  TIMEFORMATS: ['H:mm:ss (zzzz)', 'H:mm:ss z', 'H:mm:ss', 'H:mm'],
  DATETIMEFORMATS: ['{1}, {0}', '{1}, {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale es_EC.
 */
goog.i18n.DateTimeSymbols_es_EC = {
  ERAS: ['a. C.', 'd. C.'],
  ERANAMES: ['antes de Cristo', 'después de Cristo'],
  NARROWMONTHS: ['e', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  STANDALONENARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  STANDALONEMONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  SHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  STANDALONESHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  WEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  SHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  STANDALONESHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  NARROWWEEKDAYS: ['d', 'l', 'm', 'm', 'j', 'v', 's'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.er trimestre', '2.º trimestre', '3.er trimestre', '4.º trimestre'],
  AMPMS: ['a. m.', 'p. m.'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'd MMM y', 'd/M/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1}, {0}', '{1}, {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale es_GQ.
 */
goog.i18n.DateTimeSymbols_es_GQ = {
  ERAS: ['a. C.', 'd. C.'],
  ERANAMES: ['antes de Cristo', 'después de Cristo'],
  NARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  STANDALONEMONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  SHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sept.', 'oct.', 'nov.', 'dic.'],
  STANDALONESHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sept.', 'oct.', 'nov.', 'dic.'],
  WEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  SHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  STANDALONESHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.er trimestre', '2.º trimestre', '3.er trimestre', '4.º trimestre'],
  AMPMS: ['a. m.', 'p. m.'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'd MMM y', 'd/M/yy'],
  TIMEFORMATS: ['H:mm:ss (zzzz)', 'H:mm:ss z', 'H:mm:ss', 'H:mm'],
  DATETIMEFORMATS: ['{1}, {0}', '{1}, {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale es_GT.
 */
goog.i18n.DateTimeSymbols_es_GT = {
  ERAS: ['a. C.', 'd. C.'],
  ERANAMES: ['antes de Cristo', 'después de Cristo'],
  NARROWMONTHS: ['e', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  STANDALONENARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  STANDALONEMONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  SHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  STANDALONESHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  WEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  SHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  STANDALONESHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  NARROWWEEKDAYS: ['d', 'l', 'm', 'm', 'j', 'v', 's'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.er trimestre', '2.º trimestre', '3.er trimestre', '4.º trimestre'],
  AMPMS: ['a. m.', 'p. m.'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'd/MM/y', 'd/MM/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1}, {0}', '{1}, {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale es_HN.
 */
goog.i18n.DateTimeSymbols_es_HN = {
  ERAS: ['a. C.', 'd. C.'],
  ERANAMES: ['antes de Cristo', 'después de Cristo'],
  NARROWMONTHS: ['e', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  STANDALONENARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  STANDALONEMONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  SHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  STANDALONESHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  WEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  SHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  STANDALONESHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  NARROWWEEKDAYS: ['d', 'l', 'm', 'm', 'j', 'v', 's'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.er trimestre', '2.º trimestre', '3.er trimestre', '4.º trimestre'],
  AMPMS: ['a. m.', 'p. m.'],
  DATEFORMATS: ['EEEE dd \'de\' MMMM \'de\' y', 'dd \'de\' MMMM \'de\' y', 'd MMM y', 'd/M/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1}, {0}', '{1}, {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale es_IC.
 */
goog.i18n.DateTimeSymbols_es_IC = {
  ERAS: ['a. C.', 'd. C.'],
  ERANAMES: ['antes de Cristo', 'después de Cristo'],
  NARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  STANDALONEMONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  SHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sept.', 'oct.', 'nov.', 'dic.'],
  STANDALONESHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sept.', 'oct.', 'nov.', 'dic.'],
  WEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  SHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  STANDALONESHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.er trimestre', '2.º trimestre', '3.er trimestre', '4.º trimestre'],
  AMPMS: ['a. m.', 'p. m.'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'd MMM y', 'd/M/yy'],
  TIMEFORMATS: ['H:mm:ss (zzzz)', 'H:mm:ss z', 'H:mm:ss', 'H:mm'],
  DATETIMEFORMATS: ['{1}, {0}', '{1}, {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale es_NI.
 */
goog.i18n.DateTimeSymbols_es_NI = {
  ERAS: ['a. C.', 'd. C.'],
  ERANAMES: ['antes de Cristo', 'después de Cristo'],
  NARROWMONTHS: ['e', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  STANDALONENARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  STANDALONEMONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  SHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  STANDALONESHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  WEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  SHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  STANDALONESHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  NARROWWEEKDAYS: ['d', 'l', 'm', 'm', 'j', 'v', 's'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.er trimestre', '2.º trimestre', '3.er trimestre', '4.º trimestre'],
  AMPMS: ['a. m.', 'p. m.'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'd MMM y', 'd/M/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1}, {0}', '{1}, {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale es_PA.
 */
goog.i18n.DateTimeSymbols_es_PA = {
  ERAS: ['a. C.', 'd. C.'],
  ERANAMES: ['antes de Cristo', 'después de Cristo'],
  NARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  STANDALONEMONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  SHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  STANDALONESHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  WEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  SHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  STANDALONESHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  NARROWWEEKDAYS: ['d', 'l', 'm', 'm', 'j', 'v', 's'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er. trimestre', '2do. trimestre', '3er. trimestre', '4.º trimestre'],
  AMPMS: ['a. m.', 'p. m.'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'MM/dd/y', 'MM/dd/yy'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1}, {0}', '{1}, {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale es_PE.
 */
goog.i18n.DateTimeSymbols_es_PE = {
  ERAS: ['a. C.', 'd. C.'],
  ERANAMES: ['antes de Cristo', 'después de Cristo'],
  NARROWMONTHS: ['e', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  STANDALONENARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre'],
  STANDALONEMONTHS: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  SHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'set.', 'oct.', 'nov.', 'dic.'],
  STANDALONESHORTMONTHS: ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Set.', 'Oct.', 'Nov.', 'Dic.'],
  WEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  SHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  STANDALONESHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  NARROWWEEKDAYS: ['d', 'l', 'm', 'm', 'j', 'v', 's'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.er trimestre', '2.º trimestre', '3.er trimestre', '4.º trimestre'],
  AMPMS: ['a. m.', 'p. m.'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'd MMM y', 'd/MM/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1}, {0}', '{1}, {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale es_PH.
 */
goog.i18n.DateTimeSymbols_es_PH = {
  ERAS: ['a. C.', 'd. C.'],
  ERANAMES: ['antes de Cristo', 'después de Cristo'],
  NARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  STANDALONEMONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  SHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sept.', 'oct.', 'nov.', 'dic.'],
  STANDALONESHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sept.', 'oct.', 'nov.', 'dic.'],
  WEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  SHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  STANDALONESHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.er trimestre', '2.º trimestre', '3.er trimestre', '4.º trimestre'],
  AMPMS: ['a. m.', 'p. m.'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'd MMM y', 'd/M/yy'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1}, {0}', '{1}, {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale es_PR.
 */
goog.i18n.DateTimeSymbols_es_PR = {
  ERAS: ['a. C.', 'd. C.'],
  ERANAMES: ['antes de Cristo', 'después de Cristo'],
  NARROWMONTHS: ['e', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  STANDALONENARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  STANDALONEMONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  SHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  STANDALONESHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  WEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  SHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  STANDALONESHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  NARROWWEEKDAYS: ['d', 'l', 'm', 'm', 'j', 'v', 's'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.er trimestre', '2.º trimestre', '3.er trimestre', '4.º trimestre'],
  AMPMS: ['a. m.', 'p. m.'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'MM/dd/y', 'MM/dd/yy'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1}, {0}', '{1}, {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale es_PY.
 */
goog.i18n.DateTimeSymbols_es_PY = {
  ERAS: ['a. C.', 'd. C.'],
  ERANAMES: ['antes de Cristo', 'después de Cristo'],
  NARROWMONTHS: ['e', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  STANDALONENARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  STANDALONEMONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  SHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sept.', 'oct.', 'nov.', 'dic.'],
  STANDALONESHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sept.', 'oct.', 'nov.', 'dic.'],
  WEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  SHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  STANDALONESHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  NARROWWEEKDAYS: ['d', 'l', 'm', 'm', 'j', 'v', 's'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.er trimestre', '2.º trimestre', '3.er trimestre', '4.º trimestre'],
  AMPMS: ['a. m.', 'p. m.'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'd MMM y', 'd/M/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1}, {0}', '{1}, {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale es_SV.
 */
goog.i18n.DateTimeSymbols_es_SV = {
  ERAS: ['a. C.', 'd. C.'],
  ERANAMES: ['antes de Cristo', 'después de Cristo'],
  NARROWMONTHS: ['e', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  STANDALONENARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  STANDALONEMONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  SHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  STANDALONESHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'],
  WEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  SHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  STANDALONESHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  NARROWWEEKDAYS: ['d', 'l', 'm', 'm', 'j', 'v', 's'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.er trimestre', '2.º trimestre', '3.er trimestre', '4.º trimestre'],
  AMPMS: ['a. m.', 'p. m.'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'd MMM y', 'd/M/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1}, {0}', '{1}, {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale es_UY.
 */
goog.i18n.DateTimeSymbols_es_UY = {
  ERAS: ['a. C.', 'd. C.'],
  ERANAMES: ['antes de Cristo', 'después de Cristo'],
  NARROWMONTHS: ['e', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  STANDALONENARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre', 'octubre', 'noviembre', 'diciembre'],
  STANDALONEMONTHS: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  SHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'set.', 'oct.', 'nov.', 'dic.'],
  STANDALONESHORTMONTHS: ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Set.', 'Oct.', 'Nov.', 'Dic.'],
  WEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  SHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  STANDALONESHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  NARROWWEEKDAYS: ['d', 'l', 'm', 'm', 'j', 'v', 's'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.er trimestre', '2.º trimestre', '3.er trimestre', '4.º trimestre'],
  AMPMS: ['a. m.', 'p. m.'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'd MMM y', 'd/M/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1}, {0}', '{1}, {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale es_VE.
 */
goog.i18n.DateTimeSymbols_es_VE = {
  ERAS: ['a. C.', 'd. C.'],
  ERANAMES: ['antes de Cristo', 'después de Cristo'],
  NARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  STANDALONEMONTHS: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  SHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sept.', 'oct.', 'nov.', 'dic.'],
  STANDALONESHORTMONTHS: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sept.', 'oct.', 'nov.', 'dic.'],
  WEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  SHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  STANDALONESHORTWEEKDAYS: ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.'],
  NARROWWEEKDAYS: ['d', 'l', 'm', 'm', 'j', 'v', 's'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2do trimestre', '3er trimestre', '4to trimestre'],
  AMPMS: ['a. m.', 'p. m.'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'd MMM y', 'd/M/yy'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1}, {0}', '{1}, {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale et_EE.
 */
goog.i18n.DateTimeSymbols_et_EE = goog.i18n.DateTimeSymbols_et;


/**
 * Date/time formatting symbols for locale eu_ES.
 */
goog.i18n.DateTimeSymbols_eu_ES = goog.i18n.DateTimeSymbols_eu;


/**
 * Date/time formatting symbols for locale ewo.
 */
goog.i18n.DateTimeSymbols_ewo = {
  ERAS: ['oyk', 'ayk'],
  ERANAMES: ['osúsúa Yésus kiri', 'ámvus Yésus Kirís'],
  NARROWMONTHS: ['o', 'b', 'l', 'n', 't', 's', 'z', 'm', 'e', 'a', 'd', 'b'],
  STANDALONENARROWMONTHS: ['o', 'b', 'l', 'n', 't', 's', 'z', 'm', 'e', 'a', 'd', 'b'],
  MONTHS: ['ngɔn osú', 'ngɔn bɛ̌', 'ngɔn lála', 'ngɔn nyina', 'ngɔn tána', 'ngɔn saməna', 'ngɔn zamgbála', 'ngɔn mwom', 'ngɔn ebulú', 'ngɔn awóm', 'ngɔn awóm ai dziá', 'ngɔn awóm ai bɛ̌'],
  STANDALONEMONTHS: ['ngɔn osú', 'ngɔn bɛ̌', 'ngɔn lála', 'ngɔn nyina', 'ngɔn tána', 'ngɔn saməna', 'ngɔn zamgbála', 'ngɔn mwom', 'ngɔn ebulú', 'ngɔn awóm', 'ngɔn awóm ai dziá', 'ngɔn awóm ai bɛ̌'],
  SHORTMONTHS: ['ngo', 'ngb', 'ngl', 'ngn', 'ngt', 'ngs', 'ngz', 'ngm', 'nge', 'nga', 'ngad', 'ngab'],
  STANDALONESHORTMONTHS: ['ngo', 'ngb', 'ngl', 'ngn', 'ngt', 'ngs', 'ngz', 'ngm', 'nge', 'nga', 'ngad', 'ngab'],
  WEEKDAYS: ['sɔ́ndɔ', 'mɔ́ndi', 'sɔ́ndɔ məlú mə́bɛ̌', 'sɔ́ndɔ məlú mə́lɛ́', 'sɔ́ndɔ məlú mə́nyi', 'fúladé', 'séradé'],
  STANDALONEWEEKDAYS: ['sɔ́ndɔ', 'mɔ́ndi', 'sɔ́ndɔ məlú mə́bɛ̌', 'sɔ́ndɔ məlú mə́lɛ́', 'sɔ́ndɔ məlú mə́nyi', 'fúladé', 'séradé'],
  SHORTWEEKDAYS: ['sɔ́n', 'mɔ́n', 'smb', 'sml', 'smn', 'fúl', 'sér'],
  STANDALONESHORTWEEKDAYS: ['sɔ́n', 'mɔ́n', 'smb', 'sml', 'smn', 'fúl', 'sér'],
  NARROWWEEKDAYS: ['s', 'm', 's', 's', 's', 'f', 's'],
  STANDALONENARROWWEEKDAYS: ['s', 'm', 's', 's', 's', 'f', 's'],
  SHORTQUARTERS: ['nno', 'nnb', 'nnl', 'nnny'],
  QUARTERS: ['nsámbá ngɔn asú', 'nsámbá ngɔn bɛ̌', 'nsámbá ngɔn lála', 'nsámbá ngɔn nyina'],
  AMPMS: ['kíkíríg', 'ngəgógəle'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'd/M/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale ewo_CM.
 */
goog.i18n.DateTimeSymbols_ewo_CM = goog.i18n.DateTimeSymbols_ewo;


/**
 * Date/time formatting symbols for locale fa_AF.
 */
goog.i18n.DateTimeSymbols_fa_AF = {
  ZERODIGIT: 0x06F0,
  ERAS: ['ق.م.', 'م.'],
  ERANAMES: ['قبل از میلاد', 'میلادی'],
  NARROWMONTHS: ['ج', 'ف', 'م', 'ا', 'م', 'ج', 'ج', 'ا', 'س', 'ا', 'ن', 'د'],
  STANDALONENARROWMONTHS: ['ج', 'ف', 'م', 'ا', 'م', 'ج', 'ج', 'ا', 'س', 'ا', 'ن', 'د'],
  MONTHS: ['جنوری', 'فبروری', 'مارچ', 'اپریل', 'می', 'جون', 'جولای', 'اگست', 'سپتمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
  STANDALONEMONTHS: ['جنوری', 'فبروری', 'مارچ', 'اپریل', 'می', 'جون', 'جولای', 'اگست', 'سپتمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
  SHORTMONTHS: ['جنو', 'فبروری', 'مارچ', 'اپریل', 'می', 'جون', 'جول', 'اگست', 'سپتمبر', 'اکتوبر', 'نومبر', 'دسم'],
  STANDALONESHORTMONTHS: ['جنوری', 'فبروری', 'مارچ', 'اپریل', 'می', 'جون', 'جولای', 'اگست', 'سپتمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
  WEEKDAYS: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
  STANDALONEWEEKDAYS: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
  SHORTWEEKDAYS: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
  STANDALONESHORTWEEKDAYS: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
  NARROWWEEKDAYS: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
  STANDALONENARROWWEEKDAYS: ['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
  SHORTQUARTERS: ['ر۱', 'ر۲', 'ر۳', 'ر۴'],
  QUARTERS: ['ربع اول', 'ربع دوم', 'ربع سوم', 'ربع چهارم'],
  AMPMS: ['قبل‌ازظهر', 'بعدازظهر'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'y/M/d'],
  TIMEFORMATS: ['H:mm:ss (zzzz)', 'H:mm:ss (z)', 'H:mm:ss', 'H:mm'],
  DATETIMEFORMATS: ['{1}، ساعت {0}', '{1}، ساعت {0}', '{1}،‏ {0}', '{1}،‏ {0}'],
  FIRSTDAYOFWEEK: 5,
  WEEKENDRANGE: [3, 4],
  FIRSTWEEKCUTOFFDAY: 4
};


/**
 * Date/time formatting symbols for locale fa_IR.
 */
goog.i18n.DateTimeSymbols_fa_IR = goog.i18n.DateTimeSymbols_fa;


/**
 * Date/time formatting symbols for locale ff.
 */
goog.i18n.DateTimeSymbols_ff = {
  ERAS: ['H-I', 'C-I'],
  ERANAMES: ['Hade Iisa', 'Caggal Iisa'],
  NARROWMONTHS: ['s', 'c', 'm', 's', 'd', 'k', 'm', 'j', 's', 'y', 'j', 'b'],
  STANDALONENARROWMONTHS: ['s', 'c', 'm', 's', 'd', 'k', 'm', 'j', 's', 'y', 'j', 'b'],
  MONTHS: ['siilo', 'colte', 'mbooy', 'seeɗto', 'duujal', 'korse', 'morso', 'juko', 'siilto', 'yarkomaa', 'jolal', 'bowte'],
  STANDALONEMONTHS: ['siilo', 'colte', 'mbooy', 'seeɗto', 'duujal', 'korse', 'morso', 'juko', 'siilto', 'yarkomaa', 'jolal', 'bowte'],
  SHORTMONTHS: ['sii', 'col', 'mbo', 'see', 'duu', 'kor', 'mor', 'juk', 'slt', 'yar', 'jol', 'bow'],
  STANDALONESHORTMONTHS: ['sii', 'col', 'mbo', 'see', 'duu', 'kor', 'mor', 'juk', 'slt', 'yar', 'jol', 'bow'],
  WEEKDAYS: ['dewo', 'aaɓnde', 'mawbaare', 'njeslaare', 'naasaande', 'mawnde', 'hoore-biir'],
  STANDALONEWEEKDAYS: ['dewo', 'aaɓnde', 'mawbaare', 'njeslaare', 'naasaande', 'mawnde', 'hoore-biir'],
  SHORTWEEKDAYS: ['dew', 'aaɓ', 'maw', 'nje', 'naa', 'mwd', 'hbi'],
  STANDALONESHORTWEEKDAYS: ['dew', 'aaɓ', 'maw', 'nje', 'naa', 'mwd', 'hbi'],
  NARROWWEEKDAYS: ['d', 'a', 'm', 'n', 'n', 'm', 'h'],
  STANDALONENARROWWEEKDAYS: ['d', 'a', 'm', 'n', 'n', 'm', 'h'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['Termes 1', 'Termes 2', 'Termes 3', 'Termes 4'],
  AMPMS: ['subaka', 'kikiiɗe'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM, y', 'd/M/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale ff_CM.
 */
goog.i18n.DateTimeSymbols_ff_CM = goog.i18n.DateTimeSymbols_ff;


/**
 * Date/time formatting symbols for locale ff_GN.
 */
goog.i18n.DateTimeSymbols_ff_GN = goog.i18n.DateTimeSymbols_ff;


/**
 * Date/time formatting symbols for locale ff_MR.
 */
goog.i18n.DateTimeSymbols_ff_MR = {
  ERAS: ['H-I', 'C-I'],
  ERANAMES: ['Hade Iisa', 'Caggal Iisa'],
  NARROWMONTHS: ['s', 'c', 'm', 's', 'd', 'k', 'm', 'j', 's', 'y', 'j', 'b'],
  STANDALONENARROWMONTHS: ['s', 'c', 'm', 's', 'd', 'k', 'm', 'j', 's', 'y', 'j', 'b'],
  MONTHS: ['siilo', 'colte', 'mbooy', 'seeɗto', 'duujal', 'korse', 'morso', 'juko', 'siilto', 'yarkomaa', 'jolal', 'bowte'],
  STANDALONEMONTHS: ['siilo', 'colte', 'mbooy', 'seeɗto', 'duujal', 'korse', 'morso', 'juko', 'siilto', 'yarkomaa', 'jolal', 'bowte'],
  SHORTMONTHS: ['sii', 'col', 'mbo', 'see', 'duu', 'kor', 'mor', 'juk', 'slt', 'yar', 'jol', 'bow'],
  STANDALONESHORTMONTHS: ['sii', 'col', 'mbo', 'see', 'duu', 'kor', 'mor', 'juk', 'slt', 'yar', 'jol', 'bow'],
  WEEKDAYS: ['dewo', 'aaɓnde', 'mawbaare', 'njeslaare', 'naasaande', 'mawnde', 'hoore-biir'],
  STANDALONEWEEKDAYS: ['dewo', 'aaɓnde', 'mawbaare', 'njeslaare', 'naasaande', 'mawnde', 'hoore-biir'],
  SHORTWEEKDAYS: ['dew', 'aaɓ', 'maw', 'nje', 'naa', 'mwd', 'hbi'],
  STANDALONESHORTWEEKDAYS: ['dew', 'aaɓ', 'maw', 'nje', 'naa', 'mwd', 'hbi'],
  NARROWWEEKDAYS: ['d', 'a', 'm', 'n', 'n', 'm', 'h'],
  STANDALONENARROWWEEKDAYS: ['d', 'a', 'm', 'n', 'n', 'm', 'h'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['Termes 1', 'Termes 2', 'Termes 3', 'Termes 4'],
  AMPMS: ['subaka', 'kikiiɗe'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM, y', 'd/M/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale ff_SN.
 */
goog.i18n.DateTimeSymbols_ff_SN = goog.i18n.DateTimeSymbols_ff;


/**
 * Date/time formatting symbols for locale fi_FI.
 */
goog.i18n.DateTimeSymbols_fi_FI = goog.i18n.DateTimeSymbols_fi;


/**
 * Date/time formatting symbols for locale fil_PH.
 */
goog.i18n.DateTimeSymbols_fil_PH = goog.i18n.DateTimeSymbols_fil;


/**
 * Date/time formatting symbols for locale fo.
 */
goog.i18n.DateTimeSymbols_fo = {
  ERAS: ['f.Kr.', 'e.Kr.'],
  ERANAMES: ['fyri Krist', 'eftir Krist'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['januar', 'februar', 'mars', 'apríl', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'],
  STANDALONEMONTHS: ['januar', 'februar', 'mars', 'apríl', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'],
  SHORTMONTHS: ['jan.', 'feb.', 'mar.', 'apr.', 'mai', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'des.'],
  STANDALONESHORTMONTHS: ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'],
  WEEKDAYS: ['sunnudagur', 'mánadagur', 'týsdagur', 'mikudagur', 'hósdagur', 'fríggjadagur', 'leygardagur'],
  STANDALONEWEEKDAYS: ['sunnudagur', 'mánadagur', 'týsdagur', 'mikudagur', 'hósdagur', 'fríggjadagur', 'leygardagur'],
  SHORTWEEKDAYS: ['sun.', 'mán.', 'týs.', 'mik.', 'hós.', 'frí.', 'ley.'],
  STANDALONESHORTWEEKDAYS: ['sun', 'mán', 'týs', 'mik', 'hós', 'frí', 'ley'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'M', 'H', 'F', 'L'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'M', 'H', 'F', 'L'],
  SHORTQUARTERS: ['1. ársfj.', '2. ársfj.', '3. ársfj.', '4. ársfj.'],
  QUARTERS: ['1. ársfjórðingur', '2. ársfjórðingur', '3. ársfjórðingur', '4. ársfjórðingur'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d. MMMM y', 'd. MMMM y', 'dd.MM.y', 'dd.MM.yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'kl\'. {0}', '{1} \'kl\'. {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale fo_DK.
 */
goog.i18n.DateTimeSymbols_fo_DK = goog.i18n.DateTimeSymbols_fo;


/**
 * Date/time formatting symbols for locale fo_FO.
 */
goog.i18n.DateTimeSymbols_fo_FO = goog.i18n.DateTimeSymbols_fo;


/**
 * Date/time formatting symbols for locale fr_BE.
 */
goog.i18n.DateTimeSymbols_fr_BE = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'd/MM/yy'],
  TIMEFORMATS: ['H \'h\' mm \'min\' ss \'s\' zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale fr_BF.
 */
goog.i18n.DateTimeSymbols_fr_BF = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_BI.
 */
goog.i18n.DateTimeSymbols_fr_BI = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_BJ.
 */
goog.i18n.DateTimeSymbols_fr_BJ = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_BL.
 */
goog.i18n.DateTimeSymbols_fr_BL = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_CD.
 */
goog.i18n.DateTimeSymbols_fr_CD = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_CF.
 */
goog.i18n.DateTimeSymbols_fr_CF = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_CG.
 */
goog.i18n.DateTimeSymbols_fr_CG = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_CH.
 */
goog.i18n.DateTimeSymbols_fr_CH = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd.MM.yy'],
  TIMEFORMATS: ['HH.mm:ss \'h\' zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale fr_CI.
 */
goog.i18n.DateTimeSymbols_fr_CI = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_CM.
 */
goog.i18n.DateTimeSymbols_fr_CM = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['matin', 'soir'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_DJ.
 */
goog.i18n.DateTimeSymbols_fr_DJ = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 5,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 4
};


/**
 * Date/time formatting symbols for locale fr_DZ.
 */
goog.i18n.DateTimeSymbols_fr_DZ = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 5,
  WEEKENDRANGE: [4, 5],
  FIRSTWEEKCUTOFFDAY: 4
};


/**
 * Date/time formatting symbols for locale fr_FR.
 */
goog.i18n.DateTimeSymbols_fr_FR = goog.i18n.DateTimeSymbols_fr;


/**
 * Date/time formatting symbols for locale fr_GA.
 */
goog.i18n.DateTimeSymbols_fr_GA = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_GF.
 */
goog.i18n.DateTimeSymbols_fr_GF = goog.i18n.DateTimeSymbols_fr;


/**
 * Date/time formatting symbols for locale fr_GN.
 */
goog.i18n.DateTimeSymbols_fr_GN = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_GP.
 */
goog.i18n.DateTimeSymbols_fr_GP = goog.i18n.DateTimeSymbols_fr;


/**
 * Date/time formatting symbols for locale fr_GQ.
 */
goog.i18n.DateTimeSymbols_fr_GQ = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_HT.
 */
goog.i18n.DateTimeSymbols_fr_HT = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_KM.
 */
goog.i18n.DateTimeSymbols_fr_KM = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_LU.
 */
goog.i18n.DateTimeSymbols_fr_LU = goog.i18n.DateTimeSymbols_fr;


/**
 * Date/time formatting symbols for locale fr_MA.
 */
goog.i18n.DateTimeSymbols_fr_MA = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['jan.', 'fév.', 'mar.', 'avr.', 'mai', 'jui.', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['jan.', 'fév.', 'mar.', 'avr.', 'mai', 'jui.', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['a.m.', 'p.m.'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 5,
  WEEKENDRANGE: [4, 5],
  FIRSTWEEKCUTOFFDAY: 4
};


/**
 * Date/time formatting symbols for locale fr_MC.
 */
goog.i18n.DateTimeSymbols_fr_MC = goog.i18n.DateTimeSymbols_fr;


/**
 * Date/time formatting symbols for locale fr_MF.
 */
goog.i18n.DateTimeSymbols_fr_MF = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_MG.
 */
goog.i18n.DateTimeSymbols_fr_MG = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_ML.
 */
goog.i18n.DateTimeSymbols_fr_ML = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['le 1er trimestre', 'le 2ème trimestre', 'le 3ème trimestre', 'le 4ème trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_MQ.
 */
goog.i18n.DateTimeSymbols_fr_MQ = goog.i18n.DateTimeSymbols_fr;


/**
 * Date/time formatting symbols for locale fr_MR.
 */
goog.i18n.DateTimeSymbols_fr_MR = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_MU.
 */
goog.i18n.DateTimeSymbols_fr_MU = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_NC.
 */
goog.i18n.DateTimeSymbols_fr_NC = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_NE.
 */
goog.i18n.DateTimeSymbols_fr_NE = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_PF.
 */
goog.i18n.DateTimeSymbols_fr_PF = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_PM.
 */
goog.i18n.DateTimeSymbols_fr_PM = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_RE.
 */
goog.i18n.DateTimeSymbols_fr_RE = goog.i18n.DateTimeSymbols_fr;


/**
 * Date/time formatting symbols for locale fr_RW.
 */
goog.i18n.DateTimeSymbols_fr_RW = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_SC.
 */
goog.i18n.DateTimeSymbols_fr_SC = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_SN.
 */
goog.i18n.DateTimeSymbols_fr_SN = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_SY.
 */
goog.i18n.DateTimeSymbols_fr_SY = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 5,
  WEEKENDRANGE: [4, 5],
  FIRSTWEEKCUTOFFDAY: 4
};


/**
 * Date/time formatting symbols for locale fr_TD.
 */
goog.i18n.DateTimeSymbols_fr_TD = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_TG.
 */
goog.i18n.DateTimeSymbols_fr_TG = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_TN.
 */
goog.i18n.DateTimeSymbols_fr_TN = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [4, 5],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale fr_VU.
 */
goog.i18n.DateTimeSymbols_fr_VU = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_WF.
 */
goog.i18n.DateTimeSymbols_fr_WF = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fr_YT.
 */
goog.i18n.DateTimeSymbols_fr_YT = {
  ERAS: ['av. J.-C.', 'ap. J.-C.'],
  ERANAMES: ['avant Jésus-Christ', 'après Jésus-Christ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  STANDALONEMONTHS: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  SHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  STANDALONESHORTMONTHS: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  WEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  STANDALONEWEEKDAYS: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
  SHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  STANDALONESHORTWEEKDAYS: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1er trimestre', '2e trimestre', '3e trimestre', '4e trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'à\' {0}', '{1} \'à\' {0}', '{1} \'à\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale fur.
 */
goog.i18n.DateTimeSymbols_fur = {
  ERAS: ['pdC', 'ddC'],
  ERANAMES: ['pdC', 'ddC'],
  NARROWMONTHS: ['Z', 'F', 'M', 'A', 'M', 'J', 'L', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['Z', 'F', 'M', 'A', 'M', 'J', 'L', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['Zenâr', 'Fevrâr', 'Març', 'Avrîl', 'Mai', 'Jugn', 'Lui', 'Avost', 'Setembar', 'Otubar', 'Novembar', 'Dicembar'],
  STANDALONEMONTHS: ['Zenâr', 'Fevrâr', 'Març', 'Avrîl', 'Mai', 'Jugn', 'Lui', 'Avost', 'Setembar', 'Otubar', 'Novembar', 'Dicembar'],
  SHORTMONTHS: ['Zen', 'Fev', 'Mar', 'Avr', 'Mai', 'Jug', 'Lui', 'Avo', 'Set', 'Otu', 'Nov', 'Dic'],
  STANDALONESHORTMONTHS: ['Zen', 'Fev', 'Mar', 'Avr', 'Mai', 'Jug', 'Lui', 'Avo', 'Set', 'Otu', 'Nov', 'Dic'],
  WEEKDAYS: ['domenie', 'lunis', 'martars', 'miercus', 'joibe', 'vinars', 'sabide'],
  STANDALONEWEEKDAYS: ['domenie', 'lunis', 'martars', 'miercus', 'joibe', 'vinars', 'sabide'],
  SHORTWEEKDAYS: ['dom', 'lun', 'mar', 'mie', 'joi', 'vin', 'sab'],
  STANDALONESHORTWEEKDAYS: ['dom', 'lun', 'mar', 'mie', 'joi', 'vin', 'sab'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['Prin trimestri', 'Secont trimestri', 'Tierç trimestri', 'Cuart trimestri'],
  AMPMS: ['a.', 'p.'],
  DATEFORMATS: ['EEEE d \'di\' MMMM \'dal\' y', 'd \'di\' MMMM \'dal\' y', 'dd/MM/y', 'dd/MM/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale fur_IT.
 */
goog.i18n.DateTimeSymbols_fur_IT = goog.i18n.DateTimeSymbols_fur;


/**
 * Date/time formatting symbols for locale fy.
 */
goog.i18n.DateTimeSymbols_fy = {
  ERAS: ['f.Kr.', 'n.Kr.'],
  ERANAMES: ['Foar Kristus', 'nei Kristus'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['Jannewaris', 'Febrewaris', 'Maart', 'April', 'Maaie', 'Juny', 'July', 'Augustus', 'Septimber', 'Oktober', 'Novimber', 'Desimber'],
  STANDALONEMONTHS: ['Jannewaris', 'Febrewaris', 'Maart', 'April', 'Maaie', 'Juny', 'July', 'Augustus', 'Septimber', 'Oktober', 'Novimber', 'Desimber'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mrt', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mrt', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'],
  WEEKDAYS: ['snein', 'moandei', 'tiisdei', 'woansdei', 'tongersdei', 'freed', 'sneon'],
  STANDALONEWEEKDAYS: ['snein', 'moandei', 'tiisdei', 'woansdei', 'tongersdei', 'freed', 'sneon'],
  SHORTWEEKDAYS: ['si', 'mo', 'ti', 'wo', 'to', 'fr', 'so'],
  STANDALONESHORTWEEKDAYS: ['si', 'mo', 'ti', 'wo', 'to', 'fr', 'so'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['K1', 'K2', 'K3', 'K4'],
  QUARTERS: ['1e fearnsjier', '2e fearnsjier', '3e fearnsjier', '4e fearnsjier'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd-MM-yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'om\' {0}', '{1} \'om\' {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale fy_NL.
 */
goog.i18n.DateTimeSymbols_fy_NL = goog.i18n.DateTimeSymbols_fy;


/**
 * Date/time formatting symbols for locale ga_IE.
 */
goog.i18n.DateTimeSymbols_ga_IE = goog.i18n.DateTimeSymbols_ga;


/**
 * Date/time formatting symbols for locale gd.
 */
goog.i18n.DateTimeSymbols_gd = {
  ERAS: ['RC', 'AD'],
  ERANAMES: ['Ro Chrìosta', 'An dèidh Chrìosta'],
  NARROWMONTHS: ['F', 'G', 'M', 'G', 'C', 'Ò', 'I', 'L', 'S', 'D', 'S', 'D'],
  STANDALONENARROWMONTHS: ['F', 'G', 'M', 'G', 'C', 'Ò', 'I', 'L', 'S', 'D', 'S', 'D'],
  MONTHS: ['dhen Fhaoilleach', 'dhen Ghearran', 'dhen Mhàrt', 'dhen Ghiblean', 'dhen Chèitean', 'dhen Ògmhios', 'dhen Iuchar', 'dhen Lùnastal', 'dhen t-Sultain', 'dhen Dàmhair', 'dhen t-Samhain', 'dhen Dùbhlachd'],
  STANDALONEMONTHS: ['Am Faoilleach', 'An Gearran', 'Am Màrt', 'An Giblean', 'An Cèitean', 'An t-Ògmhios', 'An t-Iuchar', 'An Lùnastal', 'An t-Sultain', 'An Dàmhair', 'An t-Samhain', 'An Dùbhlachd'],
  SHORTMONTHS: ['Faoi', 'Gearr', 'Màrt', 'Gibl', 'Cèit', 'Ògmh', 'Iuch', 'Lùna', 'Sult', 'Dàmh', 'Samh', 'Dùbh'],
  STANDALONESHORTMONTHS: ['Faoi', 'Gearr', 'Màrt', 'Gibl', 'Cèit', 'Ògmh', 'Iuch', 'Lùna', 'Sult', 'Dàmh', 'Samh', 'Dùbh'],
  WEEKDAYS: ['DiDòmhnaich', 'DiLuain', 'DiMàirt', 'DiCiadain', 'DiarDaoin', 'DihAoine', 'DiSathairne'],
  STANDALONEWEEKDAYS: ['DiDòmhnaich', 'DiLuain', 'DiMàirt', 'DiCiadain', 'DiarDaoin', 'DihAoine', 'DiSathairne'],
  SHORTWEEKDAYS: ['DiD', 'DiL', 'DiM', 'DiC', 'Dia', 'Dih', 'DiS'],
  STANDALONESHORTWEEKDAYS: ['DiD', 'DiL', 'DiM', 'DiC', 'Dia', 'Dih', 'DiS'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'C', 'A', 'H', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'C', 'A', 'H', 'S'],
  SHORTQUARTERS: ['C1', 'C2', 'C3', 'C4'],
  QUARTERS: ['1d chairteal', '2na cairteal', '3s cairteal', '4mh cairteal'],
  AMPMS: ['m', 'f'],
  DATEFORMATS: ['EEEE, d\'mh\' MMMM y', 'd\'mh\' MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale gd_GB.
 */
goog.i18n.DateTimeSymbols_gd_GB = goog.i18n.DateTimeSymbols_gd;


/**
 * Date/time formatting symbols for locale gl_ES.
 */
goog.i18n.DateTimeSymbols_gl_ES = goog.i18n.DateTimeSymbols_gl;


/**
 * Date/time formatting symbols for locale gsw_CH.
 */
goog.i18n.DateTimeSymbols_gsw_CH = goog.i18n.DateTimeSymbols_gsw;


/**
 * Date/time formatting symbols for locale gsw_FR.
 */
goog.i18n.DateTimeSymbols_gsw_FR = goog.i18n.DateTimeSymbols_gsw;


/**
 * Date/time formatting symbols for locale gsw_LI.
 */
goog.i18n.DateTimeSymbols_gsw_LI = goog.i18n.DateTimeSymbols_gsw;


/**
 * Date/time formatting symbols for locale gu_IN.
 */
goog.i18n.DateTimeSymbols_gu_IN = goog.i18n.DateTimeSymbols_gu;


/**
 * Date/time formatting symbols for locale guz.
 */
goog.i18n.DateTimeSymbols_guz = {
  ERAS: ['YA', 'YK'],
  ERANAMES: ['Yeso ataiborwa', 'Yeso kaiboirwe'],
  NARROWMONTHS: ['C', 'F', 'M', 'A', 'M', 'J', 'C', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['C', 'F', 'M', 'A', 'M', 'J', 'C', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['Chanuari', 'Feburari', 'Machi', 'Apiriri', 'Mei', 'Juni', 'Chulai', 'Agosti', 'Septemba', 'Okitoba', 'Nobemba', 'Disemba'],
  STANDALONEMONTHS: ['Chanuari', 'Feburari', 'Machi', 'Apiriri', 'Mei', 'Juni', 'Chulai', 'Agosti', 'Septemba', 'Okitoba', 'Nobemba', 'Disemba'],
  SHORTMONTHS: ['Can', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Cul', 'Agt', 'Sep', 'Okt', 'Nob', 'Dis'],
  STANDALONESHORTMONTHS: ['Can', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Cul', 'Agt', 'Sep', 'Okt', 'Nob', 'Dis'],
  WEEKDAYS: ['Chumapiri', 'Chumatato', 'Chumaine', 'Chumatano', 'Aramisi', 'Ichuma', 'Esabato'],
  STANDALONEWEEKDAYS: ['Chumapiri', 'Chumatato', 'Chumaine', 'Chumatano', 'Aramisi', 'Ichuma', 'Esabato'],
  SHORTWEEKDAYS: ['Cpr', 'Ctt', 'Cmn', 'Cmt', 'Ars', 'Icm', 'Est'],
  STANDALONESHORTWEEKDAYS: ['Cpr', 'Ctt', 'Cmn', 'Cmt', 'Ars', 'Icm', 'Est'],
  NARROWWEEKDAYS: ['C', 'C', 'C', 'C', 'A', 'I', 'E'],
  STANDALONENARROWWEEKDAYS: ['C', 'C', 'C', 'C', 'A', 'I', 'E'],
  SHORTQUARTERS: ['E1', 'E2', 'E3', 'E4'],
  QUARTERS: ['Erobo entang’ani', 'Erobo yakabere', 'Erobo yagatato', 'Erobo yakane'],
  AMPMS: ['Mambia', 'Mog'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale guz_KE.
 */
goog.i18n.DateTimeSymbols_guz_KE = goog.i18n.DateTimeSymbols_guz;


/**
 * Date/time formatting symbols for locale gv.
 */
goog.i18n.DateTimeSymbols_gv = {
  ERAS: ['RC', 'AD'],
  ERANAMES: ['RC', 'AD'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['Jerrey-geuree', 'Toshiaght-arree', 'Mayrnt', 'Averil', 'Boaldyn', 'Mean-souree', 'Jerrey-souree', 'Luanistyn', 'Mean-fouyir', 'Jerrey-fouyir', 'Mee Houney', 'Mee ny Nollick'],
  STANDALONEMONTHS: ['Jerrey-geuree', 'Toshiaght-arree', 'Mayrnt', 'Averil', 'Boaldyn', 'Mean-souree', 'Jerrey-souree', 'Luanistyn', 'Mean-fouyir', 'Jerrey-fouyir', 'Mee Houney', 'Mee ny Nollick'],
  SHORTMONTHS: ['J-guer', 'T-arree', 'Mayrnt', 'Avrril', 'Boaldyn', 'M-souree', 'J-souree', 'Luanistyn', 'M-fouyir', 'J-fouyir', 'M-Houney', 'M-Nollick'],
  STANDALONESHORTMONTHS: ['J-guer', 'T-arree', 'Mayrnt', 'Avrril', 'Boaldyn', 'M-souree', 'J-souree', 'Luanistyn', 'M-fouyir', 'J-fouyir', 'M-Houney', 'M-Nollick'],
  WEEKDAYS: ['Jedoonee', 'Jelhein', 'Jemayrt', 'Jercean', 'Jerdein', 'Jeheiney', 'Jesarn'],
  STANDALONEWEEKDAYS: ['Jedoonee', 'Jelhein', 'Jemayrt', 'Jercean', 'Jerdein', 'Jeheiney', 'Jesarn'],
  SHORTWEEKDAYS: ['Jed', 'Jel', 'Jem', 'Jerc', 'Jerd', 'Jeh', 'Jes'],
  STANDALONESHORTWEEKDAYS: ['Jed', 'Jel', 'Jem', 'Jerc', 'Jerd', 'Jeh', 'Jes'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['a.m.', 'p.m.'],
  DATEFORMATS: ['y MMMM d, EEEE', 'y MMMM d', 'y MMM d', 'y-MM-dd'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale gv_IM.
 */
goog.i18n.DateTimeSymbols_gv_IM = goog.i18n.DateTimeSymbols_gv;


/**
 * Date/time formatting symbols for locale ha.
 */
goog.i18n.DateTimeSymbols_ha = {
  ERAS: ['KHAI', 'BHAI'],
  ERANAMES: ['Kafin haihuwar annab', 'Bayan haihuwar annab'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'Y', 'Y', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'Y', 'Y', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['Janairu', 'Faburairu', 'Maris', 'Afirilu', 'Mayu', 'Yuni', 'Yuli', 'Agusta', 'Satumba', 'Oktoba', 'Nuwamba', 'Disamba'],
  STANDALONEMONTHS: ['Janairu', 'Faburairu', 'Maris', 'Afirilu', 'Mayu', 'Yuni', 'Yuli', 'Agusta', 'Satumba', 'Oktoba', 'Nuwamba', 'Disamba'],
  SHORTMONTHS: ['Jan', 'Fab', 'Mar', 'Afi', 'May', 'Yun', 'Yul', 'Agu', 'Sat', 'Okt', 'Nuw', 'Dis'],
  STANDALONESHORTMONTHS: ['Jan', 'Fab', 'Mar', 'Afi', 'May', 'Yun', 'Yul', 'Agu', 'Sat', 'Okt', 'Nuw', 'Dis'],
  WEEKDAYS: ['Lahadi', 'Litinin', 'Talata', 'Laraba', 'Alhamis', 'Jummaʼa', 'Asabar'],
  STANDALONEWEEKDAYS: ['Lahadi', 'Litinin', 'Talata', 'Laraba', 'Alhamis', 'Jummaʼa', 'Asabar'],
  SHORTWEEKDAYS: ['Lah', 'Lit', 'Tal', 'Lar', 'Alh', 'Jum', 'Asa'],
  STANDALONESHORTWEEKDAYS: ['Lah', 'Lit', 'Tal', 'Lar', 'Alh', 'Jum', 'Asa'],
  NARROWWEEKDAYS: ['L', 'L', 'T', 'L', 'A', 'J', 'A'],
  STANDALONENARROWWEEKDAYS: ['L', 'L', 'T', 'L', 'A', 'J', 'A'],
  SHORTQUARTERS: ['K1', 'K2', 'K3', 'K4'],
  QUARTERS: ['Kwata na ɗaya', 'Kwata na biyu', 'Kwata na uku', 'Kwata na huɗu'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM, y', 'd MMMM, y', 'd MMM, y', 'd/M/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale ha_GH.
 */
goog.i18n.DateTimeSymbols_ha_GH = goog.i18n.DateTimeSymbols_ha;


/**
 * Date/time formatting symbols for locale ha_NE.
 */
goog.i18n.DateTimeSymbols_ha_NE = goog.i18n.DateTimeSymbols_ha;


/**
 * Date/time formatting symbols for locale ha_NG.
 */
goog.i18n.DateTimeSymbols_ha_NG = goog.i18n.DateTimeSymbols_ha;


/**
 * Date/time formatting symbols for locale haw_US.
 */
goog.i18n.DateTimeSymbols_haw_US = goog.i18n.DateTimeSymbols_haw;


/**
 * Date/time formatting symbols for locale he_IL.
 */
goog.i18n.DateTimeSymbols_he_IL = goog.i18n.DateTimeSymbols_he;


/**
 * Date/time formatting symbols for locale hi_IN.
 */
goog.i18n.DateTimeSymbols_hi_IN = goog.i18n.DateTimeSymbols_hi;


/**
 * Date/time formatting symbols for locale hr_BA.
 */
goog.i18n.DateTimeSymbols_hr_BA = {
  ERAS: ['pr. Kr.', 'po. Kr.'],
  ERANAMES: ['prije Krista', 'poslije Krista'],
  NARROWMONTHS: ['1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.', '11.', '12.'],
  STANDALONENARROWMONTHS: ['1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.', '11.', '12.'],
  MONTHS: ['siječnja', 'veljače', 'ožujka', 'travnja', 'svibnja', 'lipnja', 'srpnja', 'kolovoza', 'rujna', 'listopada', 'studenoga', 'prosinca'],
  STANDALONEMONTHS: ['siječanj', 'veljača', 'ožujak', 'travanj', 'svibanj', 'lipanj', 'srpanj', 'kolovoz', 'rujan', 'listopad', 'studeni', 'prosinac'],
  SHORTMONTHS: ['sij', 'velj', 'ožu', 'tra', 'svi', 'lip', 'srp', 'kol', 'ruj', 'lis', 'stu', 'pro'],
  STANDALONESHORTMONTHS: ['sij', 'velj', 'ožu', 'tra', 'svi', 'lip', 'srp', 'kol', 'ruj', 'lis', 'stu', 'pro'],
  WEEKDAYS: ['nedjelja', 'ponedjeljak', 'utorak', 'srijeda', 'četvrtak', 'petak', 'subota'],
  STANDALONEWEEKDAYS: ['nedjelja', 'ponedjeljak', 'utorak', 'srijeda', 'četvrtak', 'petak', 'subota'],
  SHORTWEEKDAYS: ['ned', 'pon', 'uto', 'sri', 'čet', 'pet', 'sub'],
  STANDALONESHORTWEEKDAYS: ['ned', 'pon', 'uto', 'sri', 'čet', 'pet', 'sub'],
  NARROWWEEKDAYS: ['N', 'P', 'U', 'S', 'Č', 'P', 'S'],
  STANDALONENARROWWEEKDAYS: ['N', 'P', 'U', 'S', 'Č', 'P', 'S'],
  SHORTQUARTERS: ['1. kv.', '2. kv.', '3. kv.', '4. kv.'],
  QUARTERS: ['1. kvartal', '2. kvartal', '3. kvartal', '4. kvartal'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d. MMMM y.', 'd. MMMM y.', 'd. MMM y.', 'd. M. yy.'],
  TIMEFORMATS: ['HH:mm:ss (zzzz)', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'u\' {0}', '{1} \'u\' {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale hr_HR.
 */
goog.i18n.DateTimeSymbols_hr_HR = goog.i18n.DateTimeSymbols_hr;


/**
 * Date/time formatting symbols for locale hsb.
 */
goog.i18n.DateTimeSymbols_hsb = {
  ERAS: ['př.Chr.n.', 'po Chr.n.'],
  ERANAMES: ['před Chrystowym narodźenjom', 'po Chrystowym narodźenju'],
  NARROWMONTHS: ['j', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  STANDALONENARROWMONTHS: ['j', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  MONTHS: ['januara', 'februara', 'měrca', 'apryla', 'meje', 'junija', 'julija', 'awgusta', 'septembra', 'oktobra', 'nowembra', 'decembra'],
  STANDALONEMONTHS: ['januar', 'februar', 'měrc', 'apryl', 'meja', 'junij', 'julij', 'awgust', 'september', 'oktober', 'nowember', 'december'],
  SHORTMONTHS: ['jan.', 'feb.', 'měr.', 'apr.', 'mej.', 'jun.', 'jul.', 'awg.', 'sep.', 'okt.', 'now.', 'dec.'],
  STANDALONESHORTMONTHS: ['jan', 'feb', 'měr', 'apr', 'mej', 'jun', 'jul', 'awg', 'sep', 'okt', 'now', 'dec'],
  WEEKDAYS: ['njedźela', 'póndźela', 'wutora', 'srjeda', 'štwórtk', 'pjatk', 'sobota'],
  STANDALONEWEEKDAYS: ['njedźela', 'póndźela', 'wutora', 'srjeda', 'štwórtk', 'pjatk', 'sobota'],
  SHORTWEEKDAYS: ['nje', 'pón', 'wut', 'srj', 'štw', 'pja', 'sob'],
  STANDALONESHORTWEEKDAYS: ['nje', 'pón', 'wut', 'srj', 'štw', 'pja', 'sob'],
  NARROWWEEKDAYS: ['n', 'p', 'w', 's', 'š', 'p', 's'],
  STANDALONENARROWWEEKDAYS: ['n', 'p', 'w', 's', 'š', 'p', 's'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1. kwartal', '2. kwartal', '3. kwartal', '4. kwartal'],
  AMPMS: ['dopołdnja', 'popołdnju'],
  DATEFORMATS: ['EEEE, d. MMMM y', 'd. MMMM y', 'd.M.y', 'd.M.yy'],
  TIMEFORMATS: ['H:mm:ss zzzz', 'H:mm:ss z', 'H:mm:ss', 'H:mm \'hodź\'.'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale hsb_DE.
 */
goog.i18n.DateTimeSymbols_hsb_DE = goog.i18n.DateTimeSymbols_hsb;


/**
 * Date/time formatting symbols for locale hu_HU.
 */
goog.i18n.DateTimeSymbols_hu_HU = goog.i18n.DateTimeSymbols_hu;


/**
 * Date/time formatting symbols for locale hy_AM.
 */
goog.i18n.DateTimeSymbols_hy_AM = goog.i18n.DateTimeSymbols_hy;


/**
 * Date/time formatting symbols for locale id_ID.
 */
goog.i18n.DateTimeSymbols_id_ID = goog.i18n.DateTimeSymbols_id;


/**
 * Date/time formatting symbols for locale ig.
 */
goog.i18n.DateTimeSymbols_ig = {
  ERAS: ['T.K.', 'A.K.'],
  ERANAMES: ['Tupu Kristi', 'Afọ Kristi'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['Jenụwarị', 'Febrụwarị', 'Maachị', 'Eprel', 'Mee', 'Juun', 'Julaị', 'Ọgọọst', 'Septemba', 'Ọktoba', 'Novemba', 'Disemba'],
  STANDALONEMONTHS: ['Jenụwarị', 'Febrụwarị', 'Maachị', 'Eprel', 'Mee', 'Juun', 'Julaị', 'Ọgọọst', 'Septemba', 'Ọktoba', 'Novemba', 'Disemba'],
  SHORTMONTHS: ['Jen', 'Feb', 'Maa', 'Epr', 'Mee', 'Juu', 'Jul', 'Ọgọ', 'Sep', 'Ọkt', 'Nov', 'Dis'],
  STANDALONESHORTMONTHS: ['Jen', 'Feb', 'Maa', 'Epr', 'Mee', 'Juu', 'Jul', 'Ọgọ', 'Sep', 'Ọkt', 'Nov', 'Dis'],
  WEEKDAYS: ['Mbọsị Ụka', 'Mọnde', 'Tiuzdee', 'Wenezdee', 'Tọọzdee', 'Fraịdee', 'Satọdee'],
  STANDALONEWEEKDAYS: ['Mbọsị Ụka', 'Mọnde', 'Tiuzdee', 'Wenezdee', 'Tọọzdee', 'Fraịdee', 'Satọdee'],
  SHORTWEEKDAYS: ['Ụka', 'Mọn', 'Tiu', 'Wen', 'Tọọ', 'Fraị', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Ụka', 'Mọn', 'Tiu', 'Wen', 'Tọọ', 'Fraị', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Ọ1', 'Ọ2', 'Ọ3', 'Ọ4'],
  QUARTERS: ['Ọkara 1', 'Ọkara 2', 'Ọkara 3', 'Ọkara 4'],
  AMPMS: ['A.M.', 'P.M.'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale ig_NG.
 */
goog.i18n.DateTimeSymbols_ig_NG = goog.i18n.DateTimeSymbols_ig;


/**
 * Date/time formatting symbols for locale ii.
 */
goog.i18n.DateTimeSymbols_ii = {
  ERAS: ['ꃅꋊꂿ', 'ꃅꋊꊂ'],
  ERANAMES: ['ꃅꋊꂿ', 'ꃅꋊꊂ'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['ꋍꆪ', 'ꑍꆪ', 'ꌕꆪ', 'ꇖꆪ', 'ꉬꆪ', 'ꃘꆪ', 'ꏃꆪ', 'ꉆꆪ', 'ꈬꆪ', 'ꊰꆪ', 'ꊰꊪꆪ', 'ꊰꑋꆪ'],
  STANDALONEMONTHS: ['ꋍꆪ', 'ꑍꆪ', 'ꌕꆪ', 'ꇖꆪ', 'ꉬꆪ', 'ꃘꆪ', 'ꏃꆪ', 'ꉆꆪ', 'ꈬꆪ', 'ꊰꆪ', 'ꊰꊪꆪ', 'ꊰꑋꆪ'],
  SHORTMONTHS: ['ꋍꆪ', 'ꑍꆪ', 'ꌕꆪ', 'ꇖꆪ', 'ꉬꆪ', 'ꃘꆪ', 'ꏃꆪ', 'ꉆꆪ', 'ꈬꆪ', 'ꊰꆪ', 'ꊰꊪꆪ', 'ꊰꑋꆪ'],
  STANDALONESHORTMONTHS: ['ꋍꆪ', 'ꑍꆪ', 'ꌕꆪ', 'ꇖꆪ', 'ꉬꆪ', 'ꃘꆪ', 'ꏃꆪ', 'ꉆꆪ', 'ꈬꆪ', 'ꊰꆪ', 'ꊰꊪꆪ', 'ꊰꑋꆪ'],
  WEEKDAYS: ['ꑭꆏꑍ', 'ꆏꊂꋍ', 'ꆏꊂꑍ', 'ꆏꊂꌕ', 'ꆏꊂꇖ', 'ꆏꊂꉬ', 'ꆏꊂꃘ'],
  STANDALONEWEEKDAYS: ['ꑭꆏꑍ', 'ꆏꊂꋍ', 'ꆏꊂꑍ', 'ꆏꊂꌕ', 'ꆏꊂꇖ', 'ꆏꊂꉬ', 'ꆏꊂꃘ'],
  SHORTWEEKDAYS: ['ꑭꆏ', 'ꆏꋍ', 'ꆏꑍ', 'ꆏꌕ', 'ꆏꇖ', 'ꆏꉬ', 'ꆏꃘ'],
  STANDALONESHORTWEEKDAYS: ['ꑭꆏ', 'ꆏꋍ', 'ꆏꑍ', 'ꆏꌕ', 'ꆏꇖ', 'ꆏꉬ', 'ꆏꃘ'],
  NARROWWEEKDAYS: ['ꆏ', 'ꋍ', 'ꑍ', 'ꌕ', 'ꇖ', 'ꉬ', 'ꃘ'],
  STANDALONENARROWWEEKDAYS: ['ꆏ', 'ꋍ', 'ꑍ', 'ꌕ', 'ꇖ', 'ꉬ', 'ꃘ'],
  SHORTQUARTERS: ['ꃅꑌ', 'ꃅꎸ', 'ꃅꍵ', 'ꃅꋆ'],
  QUARTERS: ['ꃅꑌ', 'ꃅꎸ', 'ꃅꍵ', 'ꃅꋆ'],
  AMPMS: ['ꎸꄑ', 'ꁯꋒ'],
  DATEFORMATS: ['y MMMM d, EEEE', 'y MMMM d', 'y MMM d', 'y-MM-dd'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale ii_CN.
 */
goog.i18n.DateTimeSymbols_ii_CN = goog.i18n.DateTimeSymbols_ii;


/**
 * Date/time formatting symbols for locale is_IS.
 */
goog.i18n.DateTimeSymbols_is_IS = goog.i18n.DateTimeSymbols_is;


/**
 * Date/time formatting symbols for locale it_CH.
 */
goog.i18n.DateTimeSymbols_it_CH = {
  ERAS: ['a.C.', 'd.C.'],
  ERANAMES: ['avanti Cristo', 'dopo Cristo'],
  NARROWMONTHS: ['G', 'F', 'M', 'A', 'M', 'G', 'L', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['G', 'F', 'M', 'A', 'M', 'G', 'L', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
  STANDALONEMONTHS: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
  SHORTMONTHS: ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'],
  STANDALONESHORTMONTHS: ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'],
  WEEKDAYS: ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'],
  STANDALONEWEEKDAYS: ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'],
  SHORTWEEKDAYS: ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'],
  STANDALONESHORTWEEKDAYS: ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'G', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'M', 'G', 'V', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1º trimestre', '2º trimestre', '3º trimestre', '4º trimestre'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd.MM.yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale it_IT.
 */
goog.i18n.DateTimeSymbols_it_IT = goog.i18n.DateTimeSymbols_it;


/**
 * Date/time formatting symbols for locale it_SM.
 */
goog.i18n.DateTimeSymbols_it_SM = goog.i18n.DateTimeSymbols_it;


/**
 * Date/time formatting symbols for locale it_VA.
 */
goog.i18n.DateTimeSymbols_it_VA = goog.i18n.DateTimeSymbols_it;


/**
 * Date/time formatting symbols for locale ja_JP.
 */
goog.i18n.DateTimeSymbols_ja_JP = goog.i18n.DateTimeSymbols_ja;


/**
 * Date/time formatting symbols for locale jgo.
 */
goog.i18n.DateTimeSymbols_jgo = {
  ERAS: ['BCE', 'CE'],
  ERANAMES: ['tsɛttsɛt mɛŋguꞌ mi ɛ́ lɛɛnɛ Kɛlísɛtɔ gɔ ńɔ́', 'tsɛttsɛt mɛŋguꞌ mi ɛ́ fúnɛ Kɛlísɛtɔ tɔ́ mɔ́'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['Nduŋmbi Saŋ', 'Pɛsaŋ Pɛ́pá', 'Pɛsaŋ Pɛ́tát', 'Pɛsaŋ Pɛ́nɛ́kwa', 'Pɛsaŋ Pataa', 'Pɛsaŋ Pɛ́nɛ́ntúkú', 'Pɛsaŋ Saambá', 'Pɛsaŋ Pɛ́nɛ́fɔm', 'Pɛsaŋ Pɛ́nɛ́pfúꞋú', 'Pɛsaŋ Nɛgɛ́m', 'Pɛsaŋ Ntsɔ̌pmɔ́', 'Pɛsaŋ Ntsɔ̌ppá'],
  STANDALONEMONTHS: ['Nduŋmbi Saŋ', 'Pɛsaŋ Pɛ́pá', 'Pɛsaŋ Pɛ́tát', 'Pɛsaŋ Pɛ́nɛ́kwa', 'Pɛsaŋ Pataa', 'Pɛsaŋ Pɛ́nɛ́ntúkú', 'Pɛsaŋ Saambá', 'Pɛsaŋ Pɛ́nɛ́fɔm', 'Pɛsaŋ Pɛ́nɛ́pfúꞋú', 'Pɛsaŋ Nɛgɛ́m', 'Pɛsaŋ Ntsɔ̌pmɔ́', 'Pɛsaŋ Ntsɔ̌ppá'],
  SHORTMONTHS: ['Nduŋmbi Saŋ', 'Pɛsaŋ Pɛ́pá', 'Pɛsaŋ Pɛ́tát', 'Pɛsaŋ Pɛ́nɛ́kwa', 'Pɛsaŋ Pataa', 'Pɛsaŋ Pɛ́nɛ́ntúkú', 'Pɛsaŋ Saambá', 'Pɛsaŋ Pɛ́nɛ́fɔm', 'Pɛsaŋ Pɛ́nɛ́pfúꞋú', 'Pɛsaŋ Nɛgɛ́m', 'Pɛsaŋ Ntsɔ̌pmɔ́', 'Pɛsaŋ Ntsɔ̌ppá'],
  STANDALONESHORTMONTHS: ['Nduŋmbi Saŋ', 'Pɛsaŋ Pɛ́pá', 'Pɛsaŋ Pɛ́tát', 'Pɛsaŋ Pɛ́nɛ́kwa', 'Pɛsaŋ Pataa', 'Pɛsaŋ Pɛ́nɛ́ntúkú', 'Pɛsaŋ Saambá', 'Pɛsaŋ Pɛ́nɛ́fɔm', 'Pɛsaŋ Pɛ́nɛ́pfúꞋú', 'Pɛsaŋ Nɛgɛ́m', 'Pɛsaŋ Ntsɔ̌pmɔ́', 'Pɛsaŋ Ntsɔ̌ppá'],
  WEEKDAYS: ['Sɔ́ndi', 'Mɔ́ndi', 'Ápta Mɔ́ndi', 'Wɛ́nɛsɛdɛ', 'Tɔ́sɛdɛ', 'Fɛlâyɛdɛ', 'Sásidɛ'],
  STANDALONEWEEKDAYS: ['Sɔ́ndi', 'Mɔ́ndi', 'Ápta Mɔ́ndi', 'Wɛ́nɛsɛdɛ', 'Tɔ́sɛdɛ', 'Fɛlâyɛdɛ', 'Sásidɛ'],
  SHORTWEEKDAYS: ['Sɔ́ndi', 'Mɔ́ndi', 'Ápta Mɔ́ndi', 'Wɛ́nɛsɛdɛ', 'Tɔ́sɛdɛ', 'Fɛlâyɛdɛ', 'Sásidɛ'],
  STANDALONESHORTWEEKDAYS: ['Sɔ́ndi', 'Mɔ́ndi', 'Ápta Mɔ́ndi', 'Wɛ́nɛsɛdɛ', 'Tɔ́sɛdɛ', 'Fɛlâyɛdɛ', 'Sásidɛ'],
  NARROWWEEKDAYS: ['Sɔ́', 'Mɔ́', 'ÁM', 'Wɛ́', 'Tɔ́', 'Fɛ', 'Sá'],
  STANDALONENARROWWEEKDAYS: ['Sɔ́', 'Mɔ́', 'ÁM', 'Wɛ́', 'Tɔ́', 'Fɛ', 'Sá'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['mbaꞌmbaꞌ', 'ŋka mbɔ́t nji'],
  DATEFORMATS: ['EEEE, y MMMM dd', 'y MMMM d', 'y MMM d', 'y-MM-dd'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale jgo_CM.
 */
goog.i18n.DateTimeSymbols_jgo_CM = goog.i18n.DateTimeSymbols_jgo;


/**
 * Date/time formatting symbols for locale jmc.
 */
goog.i18n.DateTimeSymbols_jmc = {
  ERAS: ['KK', 'BK'],
  ERANAMES: ['Kabla ya Kristu', 'Baada ya Kristu'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['Januari', 'Februari', 'Machi', 'Aprilyi', 'Mei', 'Junyi', 'Julyai', 'Agusti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba'],
  STANDALONEMONTHS: ['Januari', 'Februari', 'Machi', 'Aprilyi', 'Mei', 'Junyi', 'Julyai', 'Agusti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Des'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Des'],
  WEEKDAYS: ['Jumapilyi', 'Jumatatuu', 'Jumanne', 'Jumatanu', 'Alhamisi', 'Ijumaa', 'Jumamosi'],
  STANDALONEWEEKDAYS: ['Jumapilyi', 'Jumatatuu', 'Jumanne', 'Jumatanu', 'Alhamisi', 'Ijumaa', 'Jumamosi'],
  SHORTWEEKDAYS: ['Jpi', 'Jtt', 'Jnn', 'Jtn', 'Alh', 'Iju', 'Jmo'],
  STANDALONESHORTWEEKDAYS: ['Jpi', 'Jtt', 'Jnn', 'Jtn', 'Alh', 'Iju', 'Jmo'],
  NARROWWEEKDAYS: ['J', 'J', 'J', 'J', 'A', 'I', 'J'],
  STANDALONENARROWWEEKDAYS: ['J', 'J', 'J', 'J', 'A', 'I', 'J'],
  SHORTQUARTERS: ['R1', 'R2', 'R3', 'R4'],
  QUARTERS: ['Robo 1', 'Robo 2', 'Robo 3', 'Robo 4'],
  AMPMS: ['utuko', 'kyiukonyi'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale jmc_TZ.
 */
goog.i18n.DateTimeSymbols_jmc_TZ = goog.i18n.DateTimeSymbols_jmc;


/**
 * Date/time formatting symbols for locale ka_GE.
 */
goog.i18n.DateTimeSymbols_ka_GE = goog.i18n.DateTimeSymbols_ka;


/**
 * Date/time formatting symbols for locale kab.
 */
goog.i18n.DateTimeSymbols_kab = {
  ERAS: ['snd. T.Ɛ', 'sld. T.Ɛ'],
  ERANAMES: ['send talalit n Ɛisa', 'seld talalit n Ɛisa'],
  NARROWMONTHS: ['Y', 'F', 'M', 'Y', 'M', 'Y', 'Y', 'Ɣ', 'C', 'T', 'N', 'D'],
  STANDALONENARROWMONTHS: ['Y', 'F', 'M', 'Y', 'M', 'Y', 'Y', 'Ɣ', 'C', 'T', 'N', 'D'],
  MONTHS: ['Yennayer', 'Fuṛar', 'Meɣres', 'Yebrir', 'Mayyu', 'Yunyu', 'Yulyu', 'Ɣuct', 'Ctembeṛ', 'Tubeṛ', 'Nunembeṛ', 'Duǧembeṛ'],
  STANDALONEMONTHS: ['Yennayer', 'Fuṛar', 'Meɣres', 'Yebrir', 'Mayyu', 'Yunyu', 'Yulyu', 'Ɣuct', 'Ctembeṛ', 'Tubeṛ', 'Nunembeṛ', 'Duǧembeṛ'],
  SHORTMONTHS: ['Yen', 'Fur', 'Meɣ', 'Yeb', 'May', 'Yun', 'Yul', 'Ɣuc', 'Cte', 'Tub', 'Nun', 'Duǧ'],
  STANDALONESHORTMONTHS: ['Yen', 'Fur', 'Meɣ', 'Yeb', 'May', 'Yun', 'Yul', 'Ɣuc', 'Cte', 'Tub', 'Nun', 'Duǧ'],
  WEEKDAYS: ['Yanass', 'Sanass', 'Kraḍass', 'Kuẓass', 'Samass', 'Sḍisass', 'Sayass'],
  STANDALONEWEEKDAYS: ['Yanass', 'Sanass', 'Kraḍass', 'Kuẓass', 'Samass', 'Sḍisass', 'Sayass'],
  SHORTWEEKDAYS: ['Yan', 'San', 'Kraḍ', 'Kuẓ', 'Sam', 'Sḍis', 'Say'],
  STANDALONESHORTWEEKDAYS: ['Yan', 'San', 'Kraḍ', 'Kuẓ', 'Sam', 'Sḍis', 'Say'],
  NARROWWEEKDAYS: ['Y', 'S', 'K', 'K', 'S', 'S', 'S'],
  STANDALONENARROWWEEKDAYS: ['Y', 'S', 'K', 'K', 'S', 'S', 'S'],
  SHORTQUARTERS: ['Kḍg1', 'Kḍg2', 'Kḍg3', 'Kḍg4'],
  QUARTERS: ['akraḍaggur amenzu', 'akraḍaggur wis-sin', 'akraḍaggur wis-kraḍ', 'akraḍaggur wis-kuẓ'],
  AMPMS: ['n tufat', 'n tmeddit'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM, y', 'd/M/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 5,
  WEEKENDRANGE: [4, 5],
  FIRSTWEEKCUTOFFDAY: 4
};


/**
 * Date/time formatting symbols for locale kab_DZ.
 */
goog.i18n.DateTimeSymbols_kab_DZ = goog.i18n.DateTimeSymbols_kab;


/**
 * Date/time formatting symbols for locale kam.
 */
goog.i18n.DateTimeSymbols_kam = {
  ERAS: ['MY', 'IY'],
  ERANAMES: ['Mbee wa Yesũ', 'Ĩtina wa Yesũ'],
  NARROWMONTHS: ['M', 'K', 'K', 'K', 'K', 'T', 'M', 'N', 'K', 'Ĩ', 'Ĩ', 'Ĩ'],
  STANDALONENARROWMONTHS: ['M', 'K', 'K', 'K', 'K', 'T', 'M', 'N', 'K', 'Ĩ', 'Ĩ', 'Ĩ'],
  MONTHS: ['Mwai wa mbee', 'Mwai wa kelĩ', 'Mwai wa katatũ', 'Mwai wa kana', 'Mwai wa katano', 'Mwai wa thanthatũ', 'Mwai wa muonza', 'Mwai wa nyaanya', 'Mwai wa kenda', 'Mwai wa ĩkumi', 'Mwai wa ĩkumi na ĩmwe', 'Mwai wa ĩkumi na ilĩ'],
  STANDALONEMONTHS: ['Mwai wa mbee', 'Mwai wa kelĩ', 'Mwai wa katatũ', 'Mwai wa kana', 'Mwai wa katano', 'Mwai wa thanthatũ', 'Mwai wa muonza', 'Mwai wa nyaanya', 'Mwai wa kenda', 'Mwai wa ĩkumi', 'Mwai wa ĩkumi na ĩmwe', 'Mwai wa ĩkumi na ilĩ'],
  SHORTMONTHS: ['Mbe', 'Kel', 'Ktũ', 'Kan', 'Ktn', 'Tha', 'Moo', 'Nya', 'Knd', 'Ĩku', 'Ĩkm', 'Ĩkl'],
  STANDALONESHORTMONTHS: ['Mbe', 'Kel', 'Ktũ', 'Kan', 'Ktn', 'Tha', 'Moo', 'Nya', 'Knd', 'Ĩku', 'Ĩkm', 'Ĩkl'],
  WEEKDAYS: ['Wa kyumwa', 'Wa kwambĩlĩlya', 'Wa kelĩ', 'Wa katatũ', 'Wa kana', 'Wa katano', 'Wa thanthatũ'],
  STANDALONEWEEKDAYS: ['Wa kyumwa', 'Wa kwambĩlĩlya', 'Wa kelĩ', 'Wa katatũ', 'Wa kana', 'Wa katano', 'Wa thanthatũ'],
  SHORTWEEKDAYS: ['Wky', 'Wkw', 'Wkl', 'Wtũ', 'Wkn', 'Wtn', 'Wth'],
  STANDALONESHORTWEEKDAYS: ['Wky', 'Wkw', 'Wkl', 'Wtũ', 'Wkn', 'Wtn', 'Wth'],
  NARROWWEEKDAYS: ['Y', 'W', 'E', 'A', 'A', 'A', 'A'],
  STANDALONENARROWWEEKDAYS: ['Y', 'W', 'E', 'A', 'A', 'A', 'A'],
  SHORTQUARTERS: ['L1', 'L2', 'L3', 'L4'],
  QUARTERS: ['Lovo ya mbee', 'Lovo ya kelĩ', 'Lovo ya katatũ', 'Lovo ya kana'],
  AMPMS: ['Ĩyakwakya', 'Ĩyawĩoo'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale kam_KE.
 */
goog.i18n.DateTimeSymbols_kam_KE = goog.i18n.DateTimeSymbols_kam;


/**
 * Date/time formatting symbols for locale kde.
 */
goog.i18n.DateTimeSymbols_kde = {
  ERAS: ['AY', 'NY'],
  ERANAMES: ['Akanapawa Yesu', 'Nankuida Yesu'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['Mwedi Ntandi', 'Mwedi wa Pili', 'Mwedi wa Tatu', 'Mwedi wa Nchechi', 'Mwedi wa Nnyano', 'Mwedi wa Nnyano na Umo', 'Mwedi wa Nnyano na Mivili', 'Mwedi wa Nnyano na Mitatu', 'Mwedi wa Nnyano na Nchechi', 'Mwedi wa Nnyano na Nnyano', 'Mwedi wa Nnyano na Nnyano na U', 'Mwedi wa Nnyano na Nnyano na M'],
  STANDALONEMONTHS: ['Mwedi Ntandi', 'Mwedi wa Pili', 'Mwedi wa Tatu', 'Mwedi wa Nchechi', 'Mwedi wa Nnyano', 'Mwedi wa Nnyano na Umo', 'Mwedi wa Nnyano na Mivili', 'Mwedi wa Nnyano na Mitatu', 'Mwedi wa Nnyano na Nchechi', 'Mwedi wa Nnyano na Nnyano', 'Mwedi wa Nnyano na Nnyano na U', 'Mwedi wa Nnyano na Nnyano na M'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Des'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Des'],
  WEEKDAYS: ['Liduva lyapili', 'Liduva lyatatu', 'Liduva lyanchechi', 'Liduva lyannyano', 'Liduva lyannyano na linji', 'Liduva lyannyano na mavili', 'Liduva litandi'],
  STANDALONEWEEKDAYS: ['Liduva lyapili', 'Liduva lyatatu', 'Liduva lyanchechi', 'Liduva lyannyano', 'Liduva lyannyano na linji', 'Liduva lyannyano na mavili', 'Liduva litandi'],
  SHORTWEEKDAYS: ['Ll2', 'Ll3', 'Ll4', 'Ll5', 'Ll6', 'Ll7', 'Ll1'],
  STANDALONESHORTWEEKDAYS: ['Ll2', 'Ll3', 'Ll4', 'Ll5', 'Ll6', 'Ll7', 'Ll1'],
  NARROWWEEKDAYS: ['2', '3', '4', '5', '6', '7', '1'],
  STANDALONENARROWWEEKDAYS: ['2', '3', '4', '5', '6', '7', '1'],
  SHORTQUARTERS: ['L1', 'L2', 'L3', 'L4'],
  QUARTERS: ['Lobo 1', 'Lobo 2', 'Lobo 3', 'Lobo 4'],
  AMPMS: ['Muhi', 'Chilo'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale kde_TZ.
 */
goog.i18n.DateTimeSymbols_kde_TZ = goog.i18n.DateTimeSymbols_kde;


/**
 * Date/time formatting symbols for locale kea.
 */
goog.i18n.DateTimeSymbols_kea = {
  ERAS: ['AK', 'DK'],
  ERANAMES: ['Antis di Kristu', 'Dispos di Kristu'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['Janeru', 'Febreru', 'Marsu', 'Abril', 'Maiu', 'Junhu', 'Julhu', 'Agostu', 'Setenbru', 'Otubru', 'Nuvenbru', 'Dizenbru'],
  STANDALONEMONTHS: ['Janeru', 'Febreru', 'Marsu', 'Abril', 'Maiu', 'Junhu', 'Julhu', 'Agostu', 'Setenbru', 'Otubru', 'Nuvenbru', 'Dizenbru'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Otu', 'Nuv', 'Diz'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Otu', 'Nuv', 'Diz'],
  WEEKDAYS: ['dumingu', 'sigunda-fera', 'tersa-fera', 'kuarta-fera', 'kinta-fera', 'sesta-fera', 'sabadu'],
  STANDALONEWEEKDAYS: ['dumingu', 'sigunda-fera', 'tersa-fera', 'kuarta-fera', 'kinta-fera', 'sesta-fera', 'sábadu'],
  SHORTWEEKDAYS: ['dum', 'sig', 'ter', 'kua', 'kin', 'ses', 'sab'],
  STANDALONESHORTWEEKDAYS: ['dum', 'sig', 'ter', 'kua', 'kin', 'ses', 'sab'],
  NARROWWEEKDAYS: ['D', 'S', 'T', 'K', 'K', 'S', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'S', 'T', 'K', 'K', 'S', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1º trimestri', '2º trimestri', '3º trimestri', '4º trimestri'],
  AMPMS: ['am', 'pm'],
  DATEFORMATS: ['EEEE, d \'di\' MMMM \'di\' y', 'd \'di\' MMMM \'di\' y', 'd MMM y', 'd/M/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale kea_CV.
 */
goog.i18n.DateTimeSymbols_kea_CV = goog.i18n.DateTimeSymbols_kea;


/**
 * Date/time formatting symbols for locale khq.
 */
goog.i18n.DateTimeSymbols_khq = {
  ERAS: ['IJ', 'IZ'],
  ERANAMES: ['Isaa jine', 'Isaa jamanoo'],
  NARROWMONTHS: ['Ž', 'F', 'M', 'A', 'M', 'Ž', 'Ž', 'U', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['Ž', 'F', 'M', 'A', 'M', 'Ž', 'Ž', 'U', 'S', 'O', 'N', 'D'],
  MONTHS: ['Žanwiye', 'Feewiriye', 'Marsi', 'Awiril', 'Me', 'Žuweŋ', 'Žuyye', 'Ut', 'Sektanbur', 'Oktoobur', 'Noowanbur', 'Deesanbur'],
  STANDALONEMONTHS: ['Žanwiye', 'Feewiriye', 'Marsi', 'Awiril', 'Me', 'Žuweŋ', 'Žuyye', 'Ut', 'Sektanbur', 'Oktoobur', 'Noowanbur', 'Deesanbur'],
  SHORTMONTHS: ['Žan', 'Fee', 'Mar', 'Awi', 'Me', 'Žuw', 'Žuy', 'Ut', 'Sek', 'Okt', 'Noo', 'Dee'],
  STANDALONESHORTMONTHS: ['Žan', 'Fee', 'Mar', 'Awi', 'Me', 'Žuw', 'Žuy', 'Ut', 'Sek', 'Okt', 'Noo', 'Dee'],
  WEEKDAYS: ['Alhadi', 'Atini', 'Atalata', 'Alarba', 'Alhamiisa', 'Aljuma', 'Assabdu'],
  STANDALONEWEEKDAYS: ['Alhadi', 'Atini', 'Atalata', 'Alarba', 'Alhamiisa', 'Aljuma', 'Assabdu'],
  SHORTWEEKDAYS: ['Alh', 'Ati', 'Ata', 'Ala', 'Alm', 'Alj', 'Ass'],
  STANDALONESHORTWEEKDAYS: ['Alh', 'Ati', 'Ata', 'Ala', 'Alm', 'Alj', 'Ass'],
  NARROWWEEKDAYS: ['H', 'T', 'T', 'L', 'L', 'L', 'S'],
  STANDALONENARROWWEEKDAYS: ['H', 'T', 'T', 'L', 'L', 'L', 'S'],
  SHORTQUARTERS: ['A1', 'A2', 'A3', 'A4'],
  QUARTERS: ['Arrubu 1', 'Arrubu 2', 'Arrubu 3', 'Arrubu 4'],
  AMPMS: ['Adduha', 'Aluula'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM, y', 'd/M/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale khq_ML.
 */
goog.i18n.DateTimeSymbols_khq_ML = goog.i18n.DateTimeSymbols_khq;


/**
 * Date/time formatting symbols for locale ki.
 */
goog.i18n.DateTimeSymbols_ki = {
  ERAS: ['MK', 'TK'],
  ERANAMES: ['Mbere ya Kristo', 'Thutha wa Kristo'],
  NARROWMONTHS: ['J', 'K', 'G', 'K', 'G', 'G', 'M', 'K', 'K', 'I', 'I', 'D'],
  STANDALONENARROWMONTHS: ['J', 'K', 'G', 'K', 'G', 'G', 'M', 'K', 'K', 'I', 'I', 'D'],
  MONTHS: ['Njenuarĩ', 'Mwere wa kerĩ', 'Mwere wa gatatũ', 'Mwere wa kana', 'Mwere wa gatano', 'Mwere wa gatandatũ', 'Mwere wa mũgwanja', 'Mwere wa kanana', 'Mwere wa kenda', 'Mwere wa ikũmi', 'Mwere wa ikũmi na ũmwe', 'Ndithemba'],
  STANDALONEMONTHS: ['Njenuarĩ', 'Mwere wa kerĩ', 'Mwere wa gatatũ', 'Mwere wa kana', 'Mwere wa gatano', 'Mwere wa gatandatũ', 'Mwere wa mũgwanja', 'Mwere wa kanana', 'Mwere wa kenda', 'Mwere wa ikũmi', 'Mwere wa ikũmi na ũmwe', 'Ndithemba'],
  SHORTMONTHS: ['JEN', 'WKR', 'WGT', 'WKN', 'WTN', 'WTD', 'WMJ', 'WNN', 'WKD', 'WIK', 'WMW', 'DIT'],
  STANDALONESHORTMONTHS: ['JEN', 'WKR', 'WGT', 'WKN', 'WTN', 'WTD', 'WMJ', 'WNN', 'WKD', 'WIK', 'WMW', 'DIT'],
  WEEKDAYS: ['Kiumia', 'Njumatatũ', 'Njumaine', 'Njumatana', 'Aramithi', 'Njumaa', 'Njumamothi'],
  STANDALONEWEEKDAYS: ['Kiumia', 'Njumatatũ', 'Njumaine', 'Njumatana', 'Aramithi', 'Njumaa', 'Njumamothi'],
  SHORTWEEKDAYS: ['KMA', 'NTT', 'NMN', 'NMT', 'ART', 'NMA', 'NMM'],
  STANDALONESHORTWEEKDAYS: ['KMA', 'NTT', 'NMN', 'NMT', 'ART', 'NMA', 'NMM'],
  NARROWWEEKDAYS: ['K', 'N', 'N', 'N', 'A', 'N', 'N'],
  STANDALONENARROWWEEKDAYS: ['K', 'N', 'N', 'N', 'A', 'N', 'N'],
  SHORTQUARTERS: ['R1', 'R2', 'R3', 'R4'],
  QUARTERS: ['Robo ya mbere', 'Robo ya kerĩ', 'Robo ya gatatũ', 'Robo ya kana'],
  AMPMS: ['Kiroko', 'Hwaĩ-inĩ'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale ki_KE.
 */
goog.i18n.DateTimeSymbols_ki_KE = goog.i18n.DateTimeSymbols_ki;


/**
 * Date/time formatting symbols for locale kk_KZ.
 */
goog.i18n.DateTimeSymbols_kk_KZ = goog.i18n.DateTimeSymbols_kk;


/**
 * Date/time formatting symbols for locale kkj.
 */
goog.i18n.DateTimeSymbols_kkj = {
  ERAS: ['BCE', 'CE'],
  ERANAMES: ['BCE', 'CE'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['pamba', 'wanja', 'mbiyɔ mɛndoŋgɔ', 'Nyɔlɔmbɔŋgɔ', 'Mɔnɔ ŋgbanja', 'Nyaŋgwɛ ŋgbanja', 'kuŋgwɛ', 'fɛ', 'njapi', 'nyukul', '11', 'ɓulɓusɛ'],
  STANDALONEMONTHS: ['pamba', 'wanja', 'mbiyɔ mɛndoŋgɔ', 'Nyɔlɔmbɔŋgɔ', 'Mɔnɔ ŋgbanja', 'Nyaŋgwɛ ŋgbanja', 'kuŋgwɛ', 'fɛ', 'njapi', 'nyukul', '11', 'ɓulɓusɛ'],
  SHORTMONTHS: ['pamba', 'wanja', 'mbiyɔ mɛndoŋgɔ', 'Nyɔlɔmbɔŋgɔ', 'Mɔnɔ ŋgbanja', 'Nyaŋgwɛ ŋgbanja', 'kuŋgwɛ', 'fɛ', 'njapi', 'nyukul', '11', 'ɓulɓusɛ'],
  STANDALONESHORTMONTHS: ['pamba', 'wanja', 'mbiyɔ mɛndoŋgɔ', 'Nyɔlɔmbɔŋgɔ', 'Mɔnɔ ŋgbanja', 'Nyaŋgwɛ ŋgbanja', 'kuŋgwɛ', 'fɛ', 'njapi', 'nyukul', '11', 'ɓulɓusɛ'],
  WEEKDAYS: ['sɔndi', 'lundi', 'mardi', 'mɛrkɛrɛdi', 'yedi', 'vaŋdɛrɛdi', 'mɔnɔ sɔndi'],
  STANDALONEWEEKDAYS: ['sɔndi', 'lundi', 'mardi', 'mɛrkɛrɛdi', 'yedi', 'vaŋdɛrɛdi', 'mɔnɔ sɔndi'],
  SHORTWEEKDAYS: ['sɔndi', 'lundi', 'mardi', 'mɛrkɛrɛdi', 'yedi', 'vaŋdɛrɛdi', 'mɔnɔ sɔndi'],
  STANDALONESHORTWEEKDAYS: ['sɔndi', 'lundi', 'mardi', 'mɛrkɛrɛdi', 'yedi', 'vaŋdɛrɛdi', 'mɔnɔ sɔndi'],
  NARROWWEEKDAYS: ['so', 'lu', 'ma', 'mɛ', 'ye', 'va', 'ms'],
  STANDALONENARROWWEEKDAYS: ['so', 'lu', 'ma', 'mɛ', 'ye', 'va', 'ms'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE dd MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale kkj_CM.
 */
goog.i18n.DateTimeSymbols_kkj_CM = goog.i18n.DateTimeSymbols_kkj;


/**
 * Date/time formatting symbols for locale kl.
 */
goog.i18n.DateTimeSymbols_kl = {
  ERAS: ['BCE', 'CE'],
  ERANAMES: ['BCE', 'CE'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['januari', 'februari', 'martsi', 'aprili', 'maji', 'juni', 'juli', 'augustusi', 'septemberi', 'oktoberi', 'novemberi', 'decemberi'],
  STANDALONEMONTHS: ['januari', 'februari', 'martsi', 'aprili', 'maji', 'juni', 'juli', 'augustusi', 'septemberi', 'oktoberi', 'novemberi', 'decemberi'],
  SHORTMONTHS: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
  STANDALONESHORTMONTHS: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
  WEEKDAYS: ['sabaat', 'ataasinngorneq', 'marlunngorneq', 'pingasunngorneq', 'sisamanngorneq', 'tallimanngorneq', 'arfininngorneq'],
  STANDALONEWEEKDAYS: ['sabaat', 'ataasinngorneq', 'marlunngorneq', 'pingasunngorneq', 'sisamanngorneq', 'tallimanngorneq', 'arfininngorneq'],
  SHORTWEEKDAYS: ['sab', 'ata', 'mar', 'pin', 'sis', 'tal', 'arf'],
  STANDALONESHORTWEEKDAYS: ['sab', 'ata', 'mar', 'pin', 'sis', 'tal', 'arf'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['y MMMM d, EEEE', 'y MMMM d', 'y MMM d', 'y-MM-dd'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale kl_GL.
 */
goog.i18n.DateTimeSymbols_kl_GL = goog.i18n.DateTimeSymbols_kl;


/**
 * Date/time formatting symbols for locale kln.
 */
goog.i18n.DateTimeSymbols_kln = {
  ERAS: ['AM', 'KO'],
  ERANAMES: ['Amait kesich Jesu', 'Kokakesich Jesu'],
  NARROWMONTHS: ['M', 'N', 'T', 'I', 'M', 'P', 'N', 'R', 'B', 'E', 'K', 'K'],
  STANDALONENARROWMONTHS: ['M', 'N', 'T', 'I', 'M', 'P', 'N', 'R', 'B', 'E', 'K', 'K'],
  MONTHS: ['Mulgul', 'Ng’atyaato', 'Kiptaamo', 'Iwootkuut', 'Mamuut', 'Paagi', 'Ng’eiyeet', 'Rooptui', 'Bureet', 'Epeeso', 'Kipsuunde ne taai', 'Kipsuunde nebo aeng’'],
  STANDALONEMONTHS: ['Mulgul', 'Ng’atyaato', 'Kiptaamo', 'Iwootkuut', 'Mamuut', 'Paagi', 'Ng’eiyeet', 'Rooptui', 'Bureet', 'Epeeso', 'Kipsuunde ne taai', 'Kipsuunde nebo aeng’'],
  SHORTMONTHS: ['Mul', 'Ngat', 'Taa', 'Iwo', 'Mam', 'Paa', 'Nge', 'Roo', 'Bur', 'Epe', 'Kpt', 'Kpa'],
  STANDALONESHORTMONTHS: ['Mul', 'Ngat', 'Taa', 'Iwo', 'Mam', 'Paa', 'Nge', 'Roo', 'Bur', 'Epe', 'Kpt', 'Kpa'],
  WEEKDAYS: ['Kotisap', 'Kotaai', 'Koaeng’', 'Kosomok', 'Koang’wan', 'Komuut', 'Kolo'],
  STANDALONEWEEKDAYS: ['Kotisap', 'Kotaai', 'Koaeng’', 'Kosomok', 'Koang’wan', 'Komuut', 'Kolo'],
  SHORTWEEKDAYS: ['Kts', 'Kot', 'Koo', 'Kos', 'Koa', 'Kom', 'Kol'],
  STANDALONESHORTWEEKDAYS: ['Kts', 'Kot', 'Koo', 'Kos', 'Koa', 'Kom', 'Kol'],
  NARROWWEEKDAYS: ['T', 'T', 'O', 'S', 'A', 'M', 'L'],
  STANDALONENARROWWEEKDAYS: ['T', 'T', 'O', 'S', 'A', 'M', 'L'],
  SHORTQUARTERS: ['R1', 'R2', 'R3', 'R4'],
  QUARTERS: ['Robo netai', 'Robo nebo aeng’', 'Robo nebo somok', 'Robo nebo ang’wan'],
  AMPMS: ['karoon', 'kooskoliny'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale kln_KE.
 */
goog.i18n.DateTimeSymbols_kln_KE = goog.i18n.DateTimeSymbols_kln;


/**
 * Date/time formatting symbols for locale km_KH.
 */
goog.i18n.DateTimeSymbols_km_KH = goog.i18n.DateTimeSymbols_km;


/**
 * Date/time formatting symbols for locale kn_IN.
 */
goog.i18n.DateTimeSymbols_kn_IN = goog.i18n.DateTimeSymbols_kn;


/**
 * Date/time formatting symbols for locale ko_KP.
 */
goog.i18n.DateTimeSymbols_ko_KP = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['기원전', '서기'],
  NARROWMONTHS: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  STANDALONENARROWMONTHS: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  MONTHS: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  STANDALONEMONTHS: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  SHORTMONTHS: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  STANDALONESHORTMONTHS: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  WEEKDAYS: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  STANDALONEWEEKDAYS: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  SHORTWEEKDAYS: ['일', '월', '화', '수', '목', '금', '토'],
  STANDALONESHORTWEEKDAYS: ['일', '월', '화', '수', '목', '금', '토'],
  NARROWWEEKDAYS: ['일', '월', '화', '수', '목', '금', '토'],
  STANDALONENARROWWEEKDAYS: ['일', '월', '화', '수', '목', '금', '토'],
  SHORTQUARTERS: ['1분기', '2분기', '3분기', '4분기'],
  QUARTERS: ['제 1/4분기', '제 2/4분기', '제 3/4분기', '제 4/4분기'],
  AMPMS: ['오전', '오후'],
  DATEFORMATS: ['y년 M월 d일 EEEE', 'y년 M월 d일', 'y. M. d.', 'yy. M. d.'],
  TIMEFORMATS: ['a h시 m분 s초 zzzz', 'a h시 m분 s초 z', 'a h:mm:ss', 'a h:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale ko_KR.
 */
goog.i18n.DateTimeSymbols_ko_KR = goog.i18n.DateTimeSymbols_ko;


/**
 * Date/time formatting symbols for locale kok.
 */
goog.i18n.DateTimeSymbols_kok = {
  ERAS: ['क्रिस्तपूर्व', 'क्रिस्तशखा'],
  ERANAMES: ['क्रिस्तपूर्व', 'क्रिस्तशखा'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून', 'जुलै', 'ओगस्ट', 'सेप्टेंबर', 'ओक्टोबर', 'नोव्हेंबर', 'डिसेंबर'],
  STANDALONEMONTHS: ['जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून', 'जुलै', 'ओगस्ट', 'सेप्टेंबर', 'ओक्टोबर', 'नोव्हेंबर', 'डिसेंबर'],
  SHORTMONTHS: ['जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून', 'जुलै', 'ओगस्ट', 'सेप्टेंबर', 'ओक्टोबर', 'नोव्हेंबर', 'डिसेंबर'],
  STANDALONESHORTMONTHS: ['जानेवारी', 'फेब्रुवारी', 'मार्च', 'एप्रिल', 'मे', 'जून', 'जुलै', 'ओगस्ट', 'सेप्टेंबर', 'ओक्टोबर', 'नोव्हेंबर', 'डिसेंबर'],
  WEEKDAYS: ['आदित्यवार', 'सोमवार', 'मंगळार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
  STANDALONEWEEKDAYS: ['आदित्यवार', 'सोमवार', 'मंगळार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'],
  SHORTWEEKDAYS: ['रवि', 'सोम', 'मंगळ', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
  STANDALONESHORTWEEKDAYS: ['रवि', 'सोम', 'मंगळ', 'बुध', 'गुरु', 'शुक्र', 'शनि'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['म.पू.', 'म.नं.'],
  DATEFORMATS: ['y MMMM d, EEEE', 'y MMMM d', 'y MMM d', 'y-MM-dd'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [6, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale kok_IN.
 */
goog.i18n.DateTimeSymbols_kok_IN = goog.i18n.DateTimeSymbols_kok;


/**
 * Date/time formatting symbols for locale ks.
 */
goog.i18n.DateTimeSymbols_ks = {
  ZERODIGIT: 0x06F0,
  ERAS: ['بی سی', 'اے ڈی'],
  ERANAMES: ['قبٕل مسیٖح', 'عیٖسوی سنہٕ'],
  NARROWMONTHS: ['ج', 'ف', 'م', 'ا', 'م', 'ج', 'ج', 'ا', 'س', 'س', 'ا', 'ن'],
  STANDALONENARROWMONTHS: ['ج', 'ف', 'م', 'ا', 'م', 'ج', 'ج', 'ا', 'س', 'س', 'ا', 'ن'],
  MONTHS: ['جنؤری', 'فرؤری', 'مارٕچ', 'اپریل', 'میٔ', 'جوٗن', 'جوٗلایی', 'اگست', 'ستمبر', 'اکتوٗبر', 'نومبر', 'دسمبر'],
  STANDALONEMONTHS: ['جنؤری', 'فرؤری', 'مارٕچ', 'اپریل', 'میٔ', 'جوٗن', 'جوٗلایی', 'اگست', 'ستمبر', 'اکتوٗبر', 'نومبر', 'دسمبر'],
  SHORTMONTHS: ['جنؤری', 'فرؤری', 'مارٕچ', 'اپریل', 'میٔ', 'جوٗن', 'جوٗلایی', 'اگست', 'ستمبر', 'اکتوٗبر', 'نومبر', 'دسمبر'],
  STANDALONESHORTMONTHS: ['جنؤری', 'فرؤری', 'مارٕچ', 'اپریل', 'میٔ', 'جوٗن', 'جوٗلایی', 'اگست', 'ستمبر', 'اکتوٗبر', 'نومبر', 'دسمبر'],
  WEEKDAYS: ['اَتھوار', 'ژٔنٛدرٕروار', 'بوٚموار', 'بودوار', 'برٛٮ۪سوار', 'جُمہ', 'بٹوار'],
  STANDALONEWEEKDAYS: ['اَتھوار', 'ژٔنٛدرٕروار', 'بوٚموار', 'بودوار', 'برٛٮ۪سوار', 'جُمہ', 'بٹوار'],
  SHORTWEEKDAYS: ['آتھوار', 'ژٔنٛدٕروار', 'بوٚموار', 'بودوار', 'برٛٮ۪سوار', 'جُمہ', 'بٹوار'],
  STANDALONESHORTWEEKDAYS: ['آتھوار', 'ژٔنٛدٕروار', 'بوٚموار', 'بودوار', 'برٛٮ۪سوار', 'جُمہ', 'بٹوار'],
  NARROWWEEKDAYS: ['ا', 'ژ', 'ب', 'ب', 'ب', 'ج', 'ب'],
  STANDALONENARROWWEEKDAYS: ['ا', 'ژ', 'ب', 'ب', 'ب', 'ج', 'ب'],
  SHORTQUARTERS: ['ژۄباگ', 'دوٚیِم ژۄباگ', 'ترٛیِم ژۄباگ', 'ژوٗرِم ژۄباگ'],
  QUARTERS: ['گۄڑنیُک ژۄباگ', 'دوٚیِم ژۄباگ', 'ترٛیِم ژۄباگ', 'ژوٗرِم ژۄباگ'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, MMMM d, y', 'MMMM d, y', 'MMM d, y', 'M/d/yy'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [6, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale ks_IN.
 */
goog.i18n.DateTimeSymbols_ks_IN = goog.i18n.DateTimeSymbols_ks;


/**
 * Date/time formatting symbols for locale ksb.
 */
goog.i18n.DateTimeSymbols_ksb = {
  ERAS: ['KK', 'BK'],
  ERANAMES: ['Kabla ya Klisto', 'Baada ya Klisto'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['Januali', 'Febluali', 'Machi', 'Aplili', 'Mei', 'Juni', 'Julai', 'Agosti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba'],
  STANDALONEMONTHS: ['Januali', 'Febluali', 'Machi', 'Aplili', 'Mei', 'Juni', 'Julai', 'Agosti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Des'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Des'],
  WEEKDAYS: ['Jumaapii', 'Jumaatatu', 'Jumaane', 'Jumaatano', 'Alhamisi', 'Ijumaa', 'Jumaamosi'],
  STANDALONEWEEKDAYS: ['Jumaapii', 'Jumaatatu', 'Jumaane', 'Jumaatano', 'Alhamisi', 'Ijumaa', 'Jumaamosi'],
  SHORTWEEKDAYS: ['Jpi', 'Jtt', 'Jmn', 'Jtn', 'Alh', 'Iju', 'Jmo'],
  STANDALONESHORTWEEKDAYS: ['Jpi', 'Jtt', 'Jmn', 'Jtn', 'Alh', 'Iju', 'Jmo'],
  NARROWWEEKDAYS: ['2', '3', '4', '5', 'A', 'I', '1'],
  STANDALONENARROWWEEKDAYS: ['2', '3', '4', '5', 'A', 'I', '1'],
  SHORTQUARTERS: ['L1', 'L2', 'L3', 'L4'],
  QUARTERS: ['Lobo ya bosi', 'Lobo ya mbii', 'Lobo ya nnd’atu', 'Lobo ya nne'],
  AMPMS: ['makeo', 'nyiaghuo'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale ksb_TZ.
 */
goog.i18n.DateTimeSymbols_ksb_TZ = goog.i18n.DateTimeSymbols_ksb;


/**
 * Date/time formatting symbols for locale ksf.
 */
goog.i18n.DateTimeSymbols_ksf = {
  ERAS: ['d.Y.', 'k.Y.'],
  ERANAMES: ['di Yɛ́sus aká yálɛ', 'cámɛɛn kǝ kǝbɔpka Y'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['ŋwíí a ntɔ́ntɔ', 'ŋwíí akǝ bɛ́ɛ', 'ŋwíí akǝ ráá', 'ŋwíí akǝ nin', 'ŋwíí akǝ táan', 'ŋwíí akǝ táafɔk', 'ŋwíí akǝ táabɛɛ', 'ŋwíí akǝ táaraa', 'ŋwíí akǝ táanin', 'ŋwíí akǝ ntɛk', 'ŋwíí akǝ ntɛk di bɔ́k', 'ŋwíí akǝ ntɛk di bɛ́ɛ'],
  STANDALONEMONTHS: ['ŋwíí a ntɔ́ntɔ', 'ŋwíí akǝ bɛ́ɛ', 'ŋwíí akǝ ráá', 'ŋwíí akǝ nin', 'ŋwíí akǝ táan', 'ŋwíí akǝ táafɔk', 'ŋwíí akǝ táabɛɛ', 'ŋwíí akǝ táaraa', 'ŋwíí akǝ táanin', 'ŋwíí akǝ ntɛk', 'ŋwíí akǝ ntɛk di bɔ́k', 'ŋwíí akǝ ntɛk di bɛ́ɛ'],
  SHORTMONTHS: ['ŋ1', 'ŋ2', 'ŋ3', 'ŋ4', 'ŋ5', 'ŋ6', 'ŋ7', 'ŋ8', 'ŋ9', 'ŋ10', 'ŋ11', 'ŋ12'],
  STANDALONESHORTMONTHS: ['ŋ1', 'ŋ2', 'ŋ3', 'ŋ4', 'ŋ5', 'ŋ6', 'ŋ7', 'ŋ8', 'ŋ9', 'ŋ10', 'ŋ11', 'ŋ12'],
  WEEKDAYS: ['sɔ́ndǝ', 'lǝndí', 'maadí', 'mɛkrɛdí', 'jǝǝdí', 'júmbá', 'samdí'],
  STANDALONEWEEKDAYS: ['sɔ́ndǝ', 'lǝndí', 'maadí', 'mɛkrɛdí', 'jǝǝdí', 'júmbá', 'samdí'],
  SHORTWEEKDAYS: ['sɔ́n', 'lǝn', 'maa', 'mɛk', 'jǝǝ', 'júm', 'sam'],
  STANDALONESHORTWEEKDAYS: ['sɔ́n', 'lǝn', 'maa', 'mɛk', 'jǝǝ', 'júm', 'sam'],
  NARROWWEEKDAYS: ['s', 'l', 'm', 'm', 'j', 'j', 's'],
  STANDALONENARROWWEEKDAYS: ['s', 'l', 'm', 'm', 'j', 'j', 's'],
  SHORTQUARTERS: ['i1', 'i2', 'i3', 'i4'],
  QUARTERS: ['id́ɛ́n kǝbǝk kǝ ntɔ́ntɔ́', 'idɛ́n kǝbǝk kǝ kǝbɛ́ɛ', 'idɛ́n kǝbǝk kǝ kǝráá', 'idɛ́n kǝbǝk kǝ kǝnin'],
  AMPMS: ['sárúwá', 'cɛɛ́nko'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'd/M/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale ksf_CM.
 */
goog.i18n.DateTimeSymbols_ksf_CM = goog.i18n.DateTimeSymbols_ksf;


/**
 * Date/time formatting symbols for locale ksh.
 */
goog.i18n.DateTimeSymbols_ksh = {
  ERAS: ['v. Chr.', 'n. Chr.'],
  ERANAMES: ['vür Krestos', 'noh Krestos'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'O', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'O', 'S', 'O', 'N', 'D'],
  MONTHS: ['Jannewa', 'Fäbrowa', 'Määz', 'Aprell', 'Mai', 'Juuni', 'Juuli', 'Oujoß', 'Septämber', 'Oktohber', 'Novämber', 'Dezämber'],
  STANDALONEMONTHS: ['Jannewa', 'Fäbrowa', 'Määz', 'Aprell', 'Mai', 'Juuni', 'Juuli', 'Oujoß', 'Septämber', 'Oktohber', 'Novämber', 'Dezämber'],
  SHORTMONTHS: ['Jan', 'Fäb', 'Mäz', 'Apr', 'Mai', 'Jun', 'Jul', 'Ouj', 'Säp', 'Okt', 'Nov', 'Dez'],
  STANDALONESHORTMONTHS: ['Jan.', 'Fäb.', 'Mäz.', 'Apr.', 'Mai', 'Jun.', 'Jul.', 'Ouj.', 'Säp.', 'Okt.', 'Nov.', 'Dez.'],
  WEEKDAYS: ['Sunndaach', 'Mohndaach', 'Dinnsdaach', 'Metwoch', 'Dunnersdaach', 'Friidaach', 'Samsdaach'],
  STANDALONEWEEKDAYS: ['Sunndaach', 'Mohndaach', 'Dinnsdaach', 'Metwoch', 'Dunnersdaach', 'Friidaach', 'Samsdaach'],
  SHORTWEEKDAYS: ['Su.', 'Mo.', 'Di.', 'Me.', 'Du.', 'Fr.', 'Sa.'],
  STANDALONESHORTWEEKDAYS: ['Su.', 'Mo.', 'Di.', 'Me.', 'Du.', 'Fr.', 'Sa.'],
  NARROWWEEKDAYS: ['S', 'M', 'D', 'M', 'D', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'D', 'M', 'D', 'F', 'S'],
  SHORTQUARTERS: ['1.Q.', '2.Q.', '3.Q.', '4.Q.'],
  QUARTERS: ['1. Quattahl', '2. Quattahl', '3. Quattahl', '4. Quattahl'],
  AMPMS: ['Uhr vörmiddaachs', 'Uhr nommendaachs'],
  DATEFORMATS: ['EEEE, \'dä\' d. MMMM y', 'd. MMMM y', 'd. MMM. y', 'd. M. y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale ksh_DE.
 */
goog.i18n.DateTimeSymbols_ksh_DE = goog.i18n.DateTimeSymbols_ksh;


/**
 * Date/time formatting symbols for locale kw.
 */
goog.i18n.DateTimeSymbols_kw = {
  ERAS: ['RC', 'AD'],
  ERANAMES: ['RC', 'AD'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['mis Genver', 'mis Hwevrer', 'mis Meurth', 'mis Ebrel', 'mis Me', 'mis Metheven', 'mis Gortheren', 'mis Est', 'mis Gwynngala', 'mis Hedra', 'mis Du', 'mis Kevardhu'],
  STANDALONEMONTHS: ['mis Genver', 'mis Hwevrer', 'mis Meurth', 'mis Ebrel', 'mis Me', 'mis Metheven', 'mis Gortheren', 'mis Est', 'mis Gwynngala', 'mis Hedra', 'mis Du', 'mis Kevardhu'],
  SHORTMONTHS: ['Gen', 'Hwe', 'Meu', 'Ebr', 'Me', 'Met', 'Gor', 'Est', 'Gwn', 'Hed', 'Du', 'Kev'],
  STANDALONESHORTMONTHS: ['Gen', 'Hwe', 'Meu', 'Ebr', 'Me', 'Met', 'Gor', 'Est', 'Gwn', 'Hed', 'Du', 'Kev'],
  WEEKDAYS: ['dy Sul', 'dy Lun', 'dy Meurth', 'dy Merher', 'dy Yow', 'dy Gwener', 'dy Sadorn'],
  STANDALONEWEEKDAYS: ['dy Sul', 'dy Lun', 'dy Meurth', 'dy Merher', 'dy Yow', 'dy Gwener', 'dy Sadorn'],
  SHORTWEEKDAYS: ['Sul', 'Lun', 'Mth', 'Mhr', 'Yow', 'Gwe', 'Sad'],
  STANDALONESHORTWEEKDAYS: ['Sul', 'Lun', 'Mth', 'Mhr', 'Yow', 'Gwe', 'Sad'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['a.m.', 'p.m.'],
  DATEFORMATS: ['y MMMM d, EEEE', 'y MMMM d', 'y MMM d', 'y-MM-dd'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale kw_GB.
 */
goog.i18n.DateTimeSymbols_kw_GB = goog.i18n.DateTimeSymbols_kw;


/**
 * Date/time formatting symbols for locale ky_KG.
 */
goog.i18n.DateTimeSymbols_ky_KG = goog.i18n.DateTimeSymbols_ky;


/**
 * Date/time formatting symbols for locale lag.
 */
goog.i18n.DateTimeSymbols_lag = {
  ERAS: ['KSA', 'KA'],
  ERANAMES: ['Kɨrɨsitʉ sɨ anavyaal', 'Kɨrɨsitʉ akavyaalwe'],
  NARROWMONTHS: ['F', 'N', 'K', 'I', 'I', 'I', 'M', 'V', 'S', 'I', 'S', 'S'],
  STANDALONENARROWMONTHS: ['F', 'N', 'K', 'I', 'I', 'I', 'M', 'V', 'S', 'I', 'S', 'S'],
  MONTHS: ['Kʉfúngatɨ', 'Kʉnaanɨ', 'Kʉkeenda', 'Kwiikumi', 'Kwiinyambála', 'Kwiidwaata', 'Kʉmʉʉnchɨ', 'Kʉvɨɨrɨ', 'Kʉsaatʉ', 'Kwiinyi', 'Kʉsaano', 'Kʉsasatʉ'],
  STANDALONEMONTHS: ['Kʉfúngatɨ', 'Kʉnaanɨ', 'Kʉkeenda', 'Kwiikumi', 'Kwiinyambála', 'Kwiidwaata', 'Kʉmʉʉnchɨ', 'Kʉvɨɨrɨ', 'Kʉsaatʉ', 'Kwiinyi', 'Kʉsaano', 'Kʉsasatʉ'],
  SHORTMONTHS: ['Fúngatɨ', 'Naanɨ', 'Keenda', 'Ikúmi', 'Inyambala', 'Idwaata', 'Mʉʉnchɨ', 'Vɨɨrɨ', 'Saatʉ', 'Inyi', 'Saano', 'Sasatʉ'],
  STANDALONESHORTMONTHS: ['Fúngatɨ', 'Naanɨ', 'Keenda', 'Ikúmi', 'Inyambala', 'Idwaata', 'Mʉʉnchɨ', 'Vɨɨrɨ', 'Saatʉ', 'Inyi', 'Saano', 'Sasatʉ'],
  WEEKDAYS: ['Jumapíiri', 'Jumatátu', 'Jumaíne', 'Jumatáano', 'Alamíisi', 'Ijumáa', 'Jumamóosi'],
  STANDALONEWEEKDAYS: ['Jumapíiri', 'Jumatátu', 'Jumaíne', 'Jumatáano', 'Alamíisi', 'Ijumáa', 'Jumamóosi'],
  SHORTWEEKDAYS: ['Píili', 'Táatu', 'Íne', 'Táano', 'Alh', 'Ijm', 'Móosi'],
  STANDALONESHORTWEEKDAYS: ['Píili', 'Táatu', 'Íne', 'Táano', 'Alh', 'Ijm', 'Móosi'],
  NARROWWEEKDAYS: ['P', 'T', 'E', 'O', 'A', 'I', 'M'],
  STANDALONENARROWWEEKDAYS: ['P', 'T', 'E', 'O', 'A', 'I', 'M'],
  SHORTQUARTERS: ['Ncho 1', 'Ncho 2', 'Ncho 3', 'Ncho 4'],
  QUARTERS: ['Ncholo ya 1', 'Ncholo ya 2', 'Ncholo ya 3', 'Ncholo ya 4'],
  AMPMS: ['TOO', 'MUU'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale lag_TZ.
 */
goog.i18n.DateTimeSymbols_lag_TZ = goog.i18n.DateTimeSymbols_lag;


/**
 * Date/time formatting symbols for locale lb.
 */
goog.i18n.DateTimeSymbols_lb = {
  ERAS: ['v. Chr.', 'n. Chr.'],
  ERANAMES: ['v. Chr.', 'n. Chr.'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['Januar', 'Februar', 'Mäerz', 'Abrëll', 'Mee', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  STANDALONEMONTHS: ['Januar', 'Februar', 'Mäerz', 'Abrëll', 'Mee', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  SHORTMONTHS: ['Jan.', 'Feb.', 'Mäe.', 'Abr.', 'Mee', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mäe', 'Abr', 'Mee', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
  WEEKDAYS: ['Sonndeg', 'Méindeg', 'Dënschdeg', 'Mëttwoch', 'Donneschdeg', 'Freideg', 'Samschdeg'],
  STANDALONEWEEKDAYS: ['Sonndeg', 'Méindeg', 'Dënschdeg', 'Mëttwoch', 'Donneschdeg', 'Freideg', 'Samschdeg'],
  SHORTWEEKDAYS: ['Son.', 'Méi.', 'Dën.', 'Mët.', 'Don.', 'Fre.', 'Sam.'],
  STANDALONESHORTWEEKDAYS: ['Son', 'Méi', 'Dën', 'Mët', 'Don', 'Fre', 'Sam'],
  NARROWWEEKDAYS: ['S', 'M', 'D', 'M', 'D', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'D', 'M', 'D', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1. Quartal', '2. Quartal', '3. Quartal', '4. Quartal'],
  AMPMS: ['moies', 'nomëttes'],
  DATEFORMATS: ['EEEE, d. MMMM y', 'd. MMMM y', 'd. MMM y', 'dd.MM.yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale lb_LU.
 */
goog.i18n.DateTimeSymbols_lb_LU = goog.i18n.DateTimeSymbols_lb;


/**
 * Date/time formatting symbols for locale lg.
 */
goog.i18n.DateTimeSymbols_lg = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Kulisito nga tannaza', 'Bukya Kulisito Azaal'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['Janwaliyo', 'Febwaliyo', 'Marisi', 'Apuli', 'Maayi', 'Juuni', 'Julaayi', 'Agusito', 'Sebuttemba', 'Okitobba', 'Novemba', 'Desemba'],
  STANDALONEMONTHS: ['Janwaliyo', 'Febwaliyo', 'Marisi', 'Apuli', 'Maayi', 'Juuni', 'Julaayi', 'Agusito', 'Sebuttemba', 'Okitobba', 'Novemba', 'Desemba'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apu', 'Maa', 'Juu', 'Jul', 'Agu', 'Seb', 'Oki', 'Nov', 'Des'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apu', 'Maa', 'Juu', 'Jul', 'Agu', 'Seb', 'Oki', 'Nov', 'Des'],
  WEEKDAYS: ['Sabbiiti', 'Balaza', 'Lwakubiri', 'Lwakusatu', 'Lwakuna', 'Lwakutaano', 'Lwamukaaga'],
  STANDALONEWEEKDAYS: ['Sabbiiti', 'Balaza', 'Lwakubiri', 'Lwakusatu', 'Lwakuna', 'Lwakutaano', 'Lwamukaaga'],
  SHORTWEEKDAYS: ['Sab', 'Bal', 'Lw2', 'Lw3', 'Lw4', 'Lw5', 'Lw6'],
  STANDALONESHORTWEEKDAYS: ['Sab', 'Bal', 'Lw2', 'Lw3', 'Lw4', 'Lw5', 'Lw6'],
  NARROWWEEKDAYS: ['S', 'B', 'L', 'L', 'L', 'L', 'L'],
  STANDALONENARROWWEEKDAYS: ['S', 'B', 'L', 'L', 'L', 'L', 'L'],
  SHORTQUARTERS: ['Kya1', 'Kya2', 'Kya3', 'Kya4'],
  QUARTERS: ['Kyakuna 1', 'Kyakuna 2', 'Kyakuna 3', 'Kyakuna 4'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale lg_UG.
 */
goog.i18n.DateTimeSymbols_lg_UG = goog.i18n.DateTimeSymbols_lg;


/**
 * Date/time formatting symbols for locale lkt.
 */
goog.i18n.DateTimeSymbols_lkt = {
  ERAS: ['BCE', 'CE'],
  ERANAMES: ['BCE', 'CE'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['Wiótheȟika Wí', 'Thiyóȟeyuŋka Wí', 'Ištáwičhayazaŋ Wí', 'Pȟežítȟo Wí', 'Čhaŋwápetȟo Wí', 'Wípazukȟa-wašté Wí', 'Čhaŋpȟásapa Wí', 'Wasútȟuŋ Wí', 'Čhaŋwápeǧi Wí', 'Čhaŋwápe-kasná Wí', 'Waníyetu Wí', 'Tȟahékapšuŋ Wí'],
  STANDALONEMONTHS: ['Wiótheȟika Wí', 'Thiyóȟeyuŋka Wí', 'Ištáwičhayazaŋ Wí', 'Pȟežítȟo Wí', 'Čhaŋwápetȟo Wí', 'Wípazukȟa-wašté Wí', 'Čhaŋpȟásapa Wí', 'Wasútȟuŋ Wí', 'Čhaŋwápeǧi Wí', 'Čhaŋwápe-kasná Wí', 'Waníyetu Wí', 'Tȟahékapšuŋ Wí'],
  SHORTMONTHS: ['Wiótheȟika Wí', 'Thiyóȟeyuŋka Wí', 'Ištáwičhayazaŋ Wí', 'Pȟežítȟo Wí', 'Čhaŋwápetȟo Wí', 'Wípazukȟa-wašté Wí', 'Čhaŋpȟásapa Wí', 'Wasútȟuŋ Wí', 'Čhaŋwápeǧi Wí', 'Čhaŋwápe-kasná Wí', 'Waníyetu Wí', 'Tȟahékapšuŋ Wí'],
  STANDALONESHORTMONTHS: ['Wiótheȟika Wí', 'Thiyóȟeyuŋka Wí', 'Ištáwičhayazaŋ Wí', 'Pȟežítȟo Wí', 'Čhaŋwápetȟo Wí', 'Wípazukȟa-wašté Wí', 'Čhaŋpȟásapa Wí', 'Wasútȟuŋ Wí', 'Čhaŋwápeǧi Wí', 'Čhaŋwápe-kasná Wí', 'Waníyetu Wí', 'Tȟahékapšuŋ Wí'],
  WEEKDAYS: ['Aŋpétuwakȟaŋ', 'Aŋpétuwaŋži', 'Aŋpétunuŋpa', 'Aŋpétuyamni', 'Aŋpétutopa', 'Aŋpétuzaptaŋ', 'Owáŋgyužažapi'],
  STANDALONEWEEKDAYS: ['Aŋpétuwakȟaŋ', 'Aŋpétuwaŋži', 'Aŋpétunuŋpa', 'Aŋpétuyamni', 'Aŋpétutopa', 'Aŋpétuzaptaŋ', 'Owáŋgyužažapi'],
  SHORTWEEKDAYS: ['Aŋpétuwakȟaŋ', 'Aŋpétuwaŋži', 'Aŋpétunuŋpa', 'Aŋpétuyamni', 'Aŋpétutopa', 'Aŋpétuzaptaŋ', 'Owáŋgyužažapi'],
  STANDALONESHORTWEEKDAYS: ['Aŋpétuwakȟaŋ', 'Aŋpétuwaŋži', 'Aŋpétunuŋpa', 'Aŋpétuyamni', 'Aŋpétutopa', 'Aŋpétuzaptaŋ', 'Owáŋgyužažapi'],
  NARROWWEEKDAYS: ['A', 'W', 'N', 'Y', 'T', 'Z', 'O'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['y MMMM d, EEEE', 'y MMMM d', 'y MMM d', 'y-MM-dd'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale lkt_US.
 */
goog.i18n.DateTimeSymbols_lkt_US = goog.i18n.DateTimeSymbols_lkt;


/**
 * Date/time formatting symbols for locale ln_AO.
 */
goog.i18n.DateTimeSymbols_ln_AO = goog.i18n.DateTimeSymbols_ln;


/**
 * Date/time formatting symbols for locale ln_CD.
 */
goog.i18n.DateTimeSymbols_ln_CD = goog.i18n.DateTimeSymbols_ln;


/**
 * Date/time formatting symbols for locale ln_CF.
 */
goog.i18n.DateTimeSymbols_ln_CF = goog.i18n.DateTimeSymbols_ln;


/**
 * Date/time formatting symbols for locale ln_CG.
 */
goog.i18n.DateTimeSymbols_ln_CG = goog.i18n.DateTimeSymbols_ln;


/**
 * Date/time formatting symbols for locale lo_LA.
 */
goog.i18n.DateTimeSymbols_lo_LA = goog.i18n.DateTimeSymbols_lo;


/**
 * Date/time formatting symbols for locale lrc.
 */
goog.i18n.DateTimeSymbols_lrc = {
  ZERODIGIT: 0x06F0,
  ERAS: ['BCE', 'CE'],
  ERANAMES: ['BCE', 'CE'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['جانڤیە', 'فئڤریە', 'مارس', 'آڤریل', 'مئی', 'جوٙأن', 'جوٙلا', 'آگوست', 'سئپتامر', 'ئوکتوڤر', 'نوڤامر', 'دئسامر'],
  STANDALONEMONTHS: ['جانڤیە', 'فئڤریە', 'مارس', 'آڤریل', 'مئی', 'جوٙأن', 'جوٙلا', 'آگوست', 'سئپتامر', 'ئوکتوڤر', 'نوڤامر', 'دئسامر'],
  SHORTMONTHS: ['جانڤیە', 'فئڤریە', 'مارس', 'آڤریل', 'مئی', 'جوٙأن', 'جوٙلا', 'آگوست', 'سئپتامر', 'ئوکتوڤر', 'نوڤامر', 'دئسامر'],
  STANDALONESHORTMONTHS: ['جانڤیە', 'فئڤریە', 'مارس', 'آڤریل', 'مئی', 'جوٙأن', 'جوٙلا', 'آگوست', 'سئپتامر', 'ئوکتوڤر', 'نوڤامر', 'دئسامر'],
  WEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONEWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['y MMMM d, EEEE', 'y MMMM d', 'y MMM d', 'y-MM-dd'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 5,
  WEEKENDRANGE: [4, 4],
  FIRSTWEEKCUTOFFDAY: 4
};


/**
 * Date/time formatting symbols for locale lrc_IQ.
 */
goog.i18n.DateTimeSymbols_lrc_IQ = {
  ZERODIGIT: 0x06F0,
  ERAS: ['BCE', 'CE'],
  ERANAMES: ['BCE', 'CE'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['جانڤیە', 'فئڤریە', 'مارس', 'آڤریل', 'مئی', 'جوٙأن', 'جوٙلا', 'آگوست', 'سئپتامر', 'ئوکتوڤر', 'نوڤامر', 'دئسامر'],
  STANDALONEMONTHS: ['جانڤیە', 'فئڤریە', 'مارس', 'آڤریل', 'مئی', 'جوٙأن', 'جوٙلا', 'آگوست', 'سئپتامر', 'ئوکتوڤر', 'نوڤامر', 'دئسامر'],
  SHORTMONTHS: ['جانڤیە', 'فئڤریە', 'مارس', 'آڤریل', 'مئی', 'جوٙأن', 'جوٙلا', 'آگوست', 'سئپتامر', 'ئوکتوڤر', 'نوڤامر', 'دئسامر'],
  STANDALONESHORTMONTHS: ['جانڤیە', 'فئڤریە', 'مارس', 'آڤریل', 'مئی', 'جوٙأن', 'جوٙلا', 'آگوست', 'سئپتامر', 'ئوکتوڤر', 'نوڤامر', 'دئسامر'],
  WEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONEWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['y MMMM d, EEEE', 'y MMMM d', 'y MMM d', 'y-MM-dd'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 5,
  WEEKENDRANGE: [4, 5],
  FIRSTWEEKCUTOFFDAY: 4
};


/**
 * Date/time formatting symbols for locale lrc_IR.
 */
goog.i18n.DateTimeSymbols_lrc_IR = goog.i18n.DateTimeSymbols_lrc;


/**
 * Date/time formatting symbols for locale lt_LT.
 */
goog.i18n.DateTimeSymbols_lt_LT = goog.i18n.DateTimeSymbols_lt;


/**
 * Date/time formatting symbols for locale lu.
 */
goog.i18n.DateTimeSymbols_lu = {
  ERAS: ['kmp. Y.K.', 'kny. Y. K.'],
  ERANAMES: ['Kumpala kwa Yezu Kli', 'Kunyima kwa Yezu Kli'],
  NARROWMONTHS: ['C', 'L', 'L', 'M', 'L', 'L', 'K', 'L', 'L', 'L', 'K', 'C'],
  STANDALONENARROWMONTHS: ['C', 'L', 'L', 'M', 'L', 'L', 'K', 'L', 'L', 'L', 'K', 'C'],
  MONTHS: ['Ciongo', 'Lùishi', 'Lusòlo', 'Mùuyà', 'Lumùngùlù', 'Lufuimi', 'Kabàlàshìpù', 'Lùshìkà', 'Lutongolo', 'Lungùdi', 'Kaswèkèsè', 'Ciswà'],
  STANDALONEMONTHS: ['Ciongo', 'Lùishi', 'Lusòlo', 'Mùuyà', 'Lumùngùlù', 'Lufuimi', 'Kabàlàshìpù', 'Lùshìkà', 'Lutongolo', 'Lungùdi', 'Kaswèkèsè', 'Ciswà'],
  SHORTMONTHS: ['Cio', 'Lui', 'Lus', 'Muu', 'Lum', 'Luf', 'Kab', 'Lush', 'Lut', 'Lun', 'Kas', 'Cis'],
  STANDALONESHORTMONTHS: ['Cio', 'Lui', 'Lus', 'Muu', 'Lum', 'Luf', 'Kab', 'Lush', 'Lut', 'Lun', 'Kas', 'Cis'],
  WEEKDAYS: ['Lumingu', 'Nkodya', 'Ndàayà', 'Ndangù', 'Njòwa', 'Ngòvya', 'Lubingu'],
  STANDALONEWEEKDAYS: ['Lumingu', 'Nkodya', 'Ndàayà', 'Ndangù', 'Njòwa', 'Ngòvya', 'Lubingu'],
  SHORTWEEKDAYS: ['Lum', 'Nko', 'Ndy', 'Ndg', 'Njw', 'Ngv', 'Lub'],
  STANDALONESHORTWEEKDAYS: ['Lum', 'Nko', 'Ndy', 'Ndg', 'Njw', 'Ngv', 'Lub'],
  NARROWWEEKDAYS: ['L', 'N', 'N', 'N', 'N', 'N', 'L'],
  STANDALONENARROWWEEKDAYS: ['L', 'N', 'N', 'N', 'N', 'N', 'L'],
  SHORTQUARTERS: ['M1', 'M2', 'M3', 'M4'],
  QUARTERS: ['Mueji 1', 'Mueji 2', 'Mueji 3', 'Mueji 4'],
  AMPMS: ['Dinda', 'Dilolo'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'd/M/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale lu_CD.
 */
goog.i18n.DateTimeSymbols_lu_CD = goog.i18n.DateTimeSymbols_lu;


/**
 * Date/time formatting symbols for locale luo.
 */
goog.i18n.DateTimeSymbols_luo = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Kapok Kristo obiro', 'Ka Kristo osebiro'],
  NARROWMONTHS: ['C', 'R', 'D', 'N', 'B', 'U', 'B', 'B', 'C', 'P', 'C', 'P'],
  STANDALONENARROWMONTHS: ['C', 'R', 'D', 'N', 'B', 'U', 'B', 'B', 'C', 'P', 'C', 'P'],
  MONTHS: ['Dwe mar Achiel', 'Dwe mar Ariyo', 'Dwe mar Adek', 'Dwe mar Ang’wen', 'Dwe mar Abich', 'Dwe mar Auchiel', 'Dwe mar Abiriyo', 'Dwe mar Aboro', 'Dwe mar Ochiko', 'Dwe mar Apar', 'Dwe mar gi achiel', 'Dwe mar Apar gi ariyo'],
  STANDALONEMONTHS: ['Dwe mar Achiel', 'Dwe mar Ariyo', 'Dwe mar Adek', 'Dwe mar Ang’wen', 'Dwe mar Abich', 'Dwe mar Auchiel', 'Dwe mar Abiriyo', 'Dwe mar Aboro', 'Dwe mar Ochiko', 'Dwe mar Apar', 'Dwe mar gi achiel', 'Dwe mar Apar gi ariyo'],
  SHORTMONTHS: ['DAC', 'DAR', 'DAD', 'DAN', 'DAH', 'DAU', 'DAO', 'DAB', 'DOC', 'DAP', 'DGI', 'DAG'],
  STANDALONESHORTMONTHS: ['DAC', 'DAR', 'DAD', 'DAN', 'DAH', 'DAU', 'DAO', 'DAB', 'DOC', 'DAP', 'DGI', 'DAG'],
  WEEKDAYS: ['Jumapil', 'Wuok Tich', 'Tich Ariyo', 'Tich Adek', 'Tich Ang’wen', 'Tich Abich', 'Ngeso'],
  STANDALONEWEEKDAYS: ['Jumapil', 'Wuok Tich', 'Tich Ariyo', 'Tich Adek', 'Tich Ang’wen', 'Tich Abich', 'Ngeso'],
  SHORTWEEKDAYS: ['JMP', 'WUT', 'TAR', 'TAD', 'TAN', 'TAB', 'NGS'],
  STANDALONESHORTWEEKDAYS: ['JMP', 'WUT', 'TAR', 'TAD', 'TAN', 'TAB', 'NGS'],
  NARROWWEEKDAYS: ['J', 'W', 'T', 'T', 'T', 'T', 'N'],
  STANDALONENARROWWEEKDAYS: ['J', 'W', 'T', 'T', 'T', 'T', 'N'],
  SHORTQUARTERS: ['NMN1', 'NMN2', 'NMN3', 'NMN4'],
  QUARTERS: ['nus mar nus 1', 'nus mar nus 2', 'nus mar nus 3', 'nus mar nus 4'],
  AMPMS: ['OD', 'OT'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale luo_KE.
 */
goog.i18n.DateTimeSymbols_luo_KE = goog.i18n.DateTimeSymbols_luo;


/**
 * Date/time formatting symbols for locale luy.
 */
goog.i18n.DateTimeSymbols_luy = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Imberi ya Kuuza Kwa', 'Muhiga Kuvita Kuuza'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['Januari', 'Februari', 'Machi', 'Aprili', 'Mei', 'Juni', 'Julai', 'Agosti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba'],
  STANDALONEMONTHS: ['Januari', 'Februari', 'Machi', 'Aprili', 'Mei', 'Juni', 'Julai', 'Agosti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Des'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Des'],
  WEEKDAYS: ['Jumapiri', 'Jumatatu', 'Jumanne', 'Jumatano', 'Murwa wa Kanne', 'Murwa wa Katano', 'Jumamosi'],
  STANDALONEWEEKDAYS: ['Jumapiri', 'Jumatatu', 'Jumanne', 'Jumatano', 'Murwa wa Kanne', 'Murwa wa Katano', 'Jumamosi'],
  SHORTWEEKDAYS: ['J2', 'J3', 'J4', 'J5', 'Al', 'Ij', 'J1'],
  STANDALONESHORTWEEKDAYS: ['J2', 'J3', 'J4', 'J5', 'Al', 'Ij', 'J1'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Robo ya Kala', 'Robo ya Kaviri', 'Robo ya Kavaga', 'Robo ya Kanne'],
  AMPMS: ['a.m.', 'p.m.'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale luy_KE.
 */
goog.i18n.DateTimeSymbols_luy_KE = goog.i18n.DateTimeSymbols_luy;


/**
 * Date/time formatting symbols for locale lv_LV.
 */
goog.i18n.DateTimeSymbols_lv_LV = goog.i18n.DateTimeSymbols_lv;


/**
 * Date/time formatting symbols for locale mas.
 */
goog.i18n.DateTimeSymbols_mas = {
  ERAS: ['MY', 'EY'],
  ERANAMES: ['Meínō Yɛ́sʉ', 'Eínō Yɛ́sʉ'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['Oladalʉ́', 'Arát', 'Ɔɛnɨ́ɔɨŋɔk', 'Olodoyíóríê inkókúâ', 'Oloilépūnyīē inkókúâ', 'Kújúɔrɔk', 'Mórusásin', 'Ɔlɔ́ɨ́bɔ́rárɛ', 'Kúshîn', 'Olgísan', 'Pʉshʉ́ka', 'Ntʉ́ŋʉ́s'],
  STANDALONEMONTHS: ['Oladalʉ́', 'Arát', 'Ɔɛnɨ́ɔɨŋɔk', 'Olodoyíóríê inkókúâ', 'Oloilépūnyīē inkókúâ', 'Kújúɔrɔk', 'Mórusásin', 'Ɔlɔ́ɨ́bɔ́rárɛ', 'Kúshîn', 'Olgísan', 'Pʉshʉ́ka', 'Ntʉ́ŋʉ́s'],
  SHORTMONTHS: ['Dal', 'Ará', 'Ɔɛn', 'Doy', 'Lép', 'Rok', 'Sás', 'Bɔ́r', 'Kús', 'Gís', 'Shʉ́', 'Ntʉ́'],
  STANDALONESHORTMONTHS: ['Dal', 'Ará', 'Ɔɛn', 'Doy', 'Lép', 'Rok', 'Sás', 'Bɔ́r', 'Kús', 'Gís', 'Shʉ́', 'Ntʉ́'],
  WEEKDAYS: ['Jumapílí', 'Jumatátu', 'Jumane', 'Jumatánɔ', 'Alaámisi', 'Jumáa', 'Jumamósi'],
  STANDALONEWEEKDAYS: ['Jumapílí', 'Jumatátu', 'Jumane', 'Jumatánɔ', 'Alaámisi', 'Jumáa', 'Jumamósi'],
  SHORTWEEKDAYS: ['Jpi', 'Jtt', 'Jnn', 'Jtn', 'Alh', 'Iju', 'Jmo'],
  STANDALONESHORTWEEKDAYS: ['Jpi', 'Jtt', 'Jnn', 'Jtn', 'Alh', 'Iju', 'Jmo'],
  NARROWWEEKDAYS: ['2', '3', '4', '5', '6', '7', '1'],
  STANDALONENARROWWEEKDAYS: ['2', '3', '4', '5', '6', '7', '1'],
  SHORTQUARTERS: ['E1', 'E2', 'E3', 'E4'],
  QUARTERS: ['Erobo 1', 'Erobo 2', 'Erobo 3', 'Erobo 4'],
  AMPMS: ['Ɛnkakɛnyá', 'Ɛndámâ'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale mas_KE.
 */
goog.i18n.DateTimeSymbols_mas_KE = goog.i18n.DateTimeSymbols_mas;


/**
 * Date/time formatting symbols for locale mas_TZ.
 */
goog.i18n.DateTimeSymbols_mas_TZ = {
  ERAS: ['MY', 'EY'],
  ERANAMES: ['Meínō Yɛ́sʉ', 'Eínō Yɛ́sʉ'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['Oladalʉ́', 'Arát', 'Ɔɛnɨ́ɔɨŋɔk', 'Olodoyíóríê inkókúâ', 'Oloilépūnyīē inkókúâ', 'Kújúɔrɔk', 'Mórusásin', 'Ɔlɔ́ɨ́bɔ́rárɛ', 'Kúshîn', 'Olgísan', 'Pʉshʉ́ka', 'Ntʉ́ŋʉ́s'],
  STANDALONEMONTHS: ['Oladalʉ́', 'Arát', 'Ɔɛnɨ́ɔɨŋɔk', 'Olodoyíóríê inkókúâ', 'Oloilépūnyīē inkókúâ', 'Kújúɔrɔk', 'Mórusásin', 'Ɔlɔ́ɨ́bɔ́rárɛ', 'Kúshîn', 'Olgísan', 'Pʉshʉ́ka', 'Ntʉ́ŋʉ́s'],
  SHORTMONTHS: ['Dal', 'Ará', 'Ɔɛn', 'Doy', 'Lép', 'Rok', 'Sás', 'Bɔ́r', 'Kús', 'Gís', 'Shʉ́', 'Ntʉ́'],
  STANDALONESHORTMONTHS: ['Dal', 'Ará', 'Ɔɛn', 'Doy', 'Lép', 'Rok', 'Sás', 'Bɔ́r', 'Kús', 'Gís', 'Shʉ́', 'Ntʉ́'],
  WEEKDAYS: ['Jumapílí', 'Jumatátu', 'Jumane', 'Jumatánɔ', 'Alaámisi', 'Jumáa', 'Jumamósi'],
  STANDALONEWEEKDAYS: ['Jumapílí', 'Jumatátu', 'Jumane', 'Jumatánɔ', 'Alaámisi', 'Jumáa', 'Jumamósi'],
  SHORTWEEKDAYS: ['Jpi', 'Jtt', 'Jnn', 'Jtn', 'Alh', 'Iju', 'Jmo'],
  STANDALONESHORTWEEKDAYS: ['Jpi', 'Jtt', 'Jnn', 'Jtn', 'Alh', 'Iju', 'Jmo'],
  NARROWWEEKDAYS: ['2', '3', '4', '5', '6', '7', '1'],
  STANDALONENARROWWEEKDAYS: ['2', '3', '4', '5', '6', '7', '1'],
  SHORTQUARTERS: ['E1', 'E2', 'E3', 'E4'],
  QUARTERS: ['Erobo 1', 'Erobo 2', 'Erobo 3', 'Erobo 4'],
  AMPMS: ['Ɛnkakɛnyá', 'Ɛndámâ'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale mer.
 */
goog.i18n.DateTimeSymbols_mer = {
  ERAS: ['MK', 'NK'],
  ERANAMES: ['Mbere ya Kristũ', 'Nyuma ya Kristũ'],
  NARROWMONTHS: ['J', 'F', 'M', 'Ĩ', 'M', 'N', 'N', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'Ĩ', 'M', 'N', 'N', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['Januarĩ', 'Feburuarĩ', 'Machi', 'Ĩpurũ', 'Mĩĩ', 'Njuni', 'Njuraĩ', 'Agasti', 'Septemba', 'Oktũba', 'Novemba', 'Dicemba'],
  STANDALONEMONTHS: ['Januarĩ', 'Feburuarĩ', 'Machi', 'Ĩpurũ', 'Mĩĩ', 'Njuni', 'Njuraĩ', 'Agasti', 'Septemba', 'Oktũba', 'Novemba', 'Dicemba'],
  SHORTMONTHS: ['JAN', 'FEB', 'MAC', 'ĨPU', 'MĨĨ', 'NJU', 'NJR', 'AGA', 'SPT', 'OKT', 'NOV', 'DEC'],
  STANDALONESHORTMONTHS: ['JAN', 'FEB', 'MAC', 'ĨPU', 'MĨĨ', 'NJU', 'NJR', 'AGA', 'SPT', 'OKT', 'NOV', 'DEC'],
  WEEKDAYS: ['Kiumia', 'Muramuko', 'Wairi', 'Wethatu', 'Wena', 'Wetano', 'Jumamosi'],
  STANDALONEWEEKDAYS: ['Kiumia', 'Muramuko', 'Wairi', 'Wethatu', 'Wena', 'Wetano', 'Jumamosi'],
  SHORTWEEKDAYS: ['KIU', 'MRA', 'WAI', 'WET', 'WEN', 'WTN', 'JUM'],
  STANDALONESHORTWEEKDAYS: ['KIU', 'MRA', 'WAI', 'WET', 'WEN', 'WTN', 'JUM'],
  NARROWWEEKDAYS: ['K', 'M', 'W', 'W', 'W', 'W', 'J'],
  STANDALONENARROWWEEKDAYS: ['K', 'M', 'W', 'W', 'W', 'W', 'J'],
  SHORTQUARTERS: ['Ĩmwe kĩrĩ inya', 'Ijĩrĩ kĩrĩ inya', 'Ithatũ kĩrĩ inya', 'Inya kĩrĩ inya'],
  QUARTERS: ['Ĩmwe kĩrĩ inya', 'Ijĩrĩ kĩrĩ inya', 'Ithatũ kĩrĩ inya', 'Inya kĩrĩ inya'],
  AMPMS: ['RŨ', 'ŨG'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale mer_KE.
 */
goog.i18n.DateTimeSymbols_mer_KE = goog.i18n.DateTimeSymbols_mer;


/**
 * Date/time formatting symbols for locale mfe.
 */
goog.i18n.DateTimeSymbols_mfe = {
  ERAS: ['av. Z-K', 'ap. Z-K'],
  ERANAMES: ['avan Zezi-Krist', 'apre Zezi-Krist'],
  NARROWMONTHS: ['z', 'f', 'm', 'a', 'm', 'z', 'z', 'o', 's', 'o', 'n', 'd'],
  STANDALONENARROWMONTHS: ['z', 'f', 'm', 'a', 'm', 'z', 'z', 'o', 's', 'o', 'n', 'd'],
  MONTHS: ['zanvie', 'fevriye', 'mars', 'avril', 'me', 'zin', 'zilye', 'out', 'septam', 'oktob', 'novam', 'desam'],
  STANDALONEMONTHS: ['zanvie', 'fevriye', 'mars', 'avril', 'me', 'zin', 'zilye', 'out', 'septam', 'oktob', 'novam', 'desam'],
  SHORTMONTHS: ['zan', 'fev', 'mar', 'avr', 'me', 'zin', 'zil', 'out', 'sep', 'okt', 'nov', 'des'],
  STANDALONESHORTMONTHS: ['zan', 'fev', 'mar', 'avr', 'me', 'zin', 'zil', 'out', 'sep', 'okt', 'nov', 'des'],
  WEEKDAYS: ['dimans', 'lindi', 'mardi', 'merkredi', 'zedi', 'vandredi', 'samdi'],
  STANDALONEWEEKDAYS: ['dimans', 'lindi', 'mardi', 'merkredi', 'zedi', 'vandredi', 'samdi'],
  SHORTWEEKDAYS: ['dim', 'lin', 'mar', 'mer', 'ze', 'van', 'sam'],
  STANDALONESHORTWEEKDAYS: ['dim', 'lin', 'mar', 'mer', 'ze', 'van', 'sam'],
  NARROWWEEKDAYS: ['d', 'l', 'm', 'm', 'z', 'v', 's'],
  STANDALONENARROWWEEKDAYS: ['d', 'l', 'm', 'm', 'z', 'v', 's'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1e trimes', '2em trimes', '3em trimes', '4em trimes'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM, y', 'd/M/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale mfe_MU.
 */
goog.i18n.DateTimeSymbols_mfe_MU = goog.i18n.DateTimeSymbols_mfe;


/**
 * Date/time formatting symbols for locale mg.
 */
goog.i18n.DateTimeSymbols_mg = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Alohan’i JK', 'Aorian’i JK'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['Janoary', 'Febroary', 'Martsa', 'Aprily', 'Mey', 'Jona', 'Jolay', 'Aogositra', 'Septambra', 'Oktobra', 'Novambra', 'Desambra'],
  STANDALONEMONTHS: ['Janoary', 'Febroary', 'Martsa', 'Aprily', 'Mey', 'Jona', 'Jolay', 'Aogositra', 'Septambra', 'Oktobra', 'Novambra', 'Desambra'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'Mey', 'Jon', 'Jol', 'Aog', 'Sep', 'Okt', 'Nov', 'Des'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'Mey', 'Jon', 'Jol', 'Aog', 'Sep', 'Okt', 'Nov', 'Des'],
  WEEKDAYS: ['Alahady', 'Alatsinainy', 'Talata', 'Alarobia', 'Alakamisy', 'Zoma', 'Asabotsy'],
  STANDALONEWEEKDAYS: ['Alahady', 'Alatsinainy', 'Talata', 'Alarobia', 'Alakamisy', 'Zoma', 'Asabotsy'],
  SHORTWEEKDAYS: ['Alah', 'Alats', 'Tal', 'Alar', 'Alak', 'Zom', 'Asab'],
  STANDALONESHORTWEEKDAYS: ['Alah', 'Alats', 'Tal', 'Alar', 'Alak', 'Zom', 'Asab'],
  NARROWWEEKDAYS: ['A', 'A', 'T', 'A', 'A', 'Z', 'A'],
  STANDALONENARROWWEEKDAYS: ['A', 'A', 'T', 'A', 'A', 'Z', 'A'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['Telovolana voalohany', 'Telovolana faharoa', 'Telovolana fahatelo', 'Telovolana fahefatra'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'y MMM d', 'y-MM-dd'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale mg_MG.
 */
goog.i18n.DateTimeSymbols_mg_MG = goog.i18n.DateTimeSymbols_mg;


/**
 * Date/time formatting symbols for locale mgh.
 */
goog.i18n.DateTimeSymbols_mgh = {
  ERAS: ['HY', 'YY'],
  ERANAMES: ['Hinapiya yesu', 'Yopia yesu'],
  NARROWMONTHS: ['K', 'U', 'R', 'C', 'T', 'M', 'S', 'N', 'T', 'K', 'M', 'Y'],
  STANDALONENARROWMONTHS: ['K', 'U', 'R', 'C', 'T', 'M', 'S', 'N', 'T', 'K', 'M', 'Y'],
  MONTHS: ['Mweri wo kwanza', 'Mweri wo unayeli', 'Mweri wo uneraru', 'Mweri wo unecheshe', 'Mweri wo unethanu', 'Mweri wo thanu na mocha', 'Mweri wo saba', 'Mweri wo nane', 'Mweri wo tisa', 'Mweri wo kumi', 'Mweri wo kumi na moja', 'Mweri wo kumi na yel’li'],
  STANDALONEMONTHS: ['Mweri wo kwanza', 'Mweri wo unayeli', 'Mweri wo uneraru', 'Mweri wo unecheshe', 'Mweri wo unethanu', 'Mweri wo thanu na mocha', 'Mweri wo saba', 'Mweri wo nane', 'Mweri wo tisa', 'Mweri wo kumi', 'Mweri wo kumi na moja', 'Mweri wo kumi na yel’li'],
  SHORTMONTHS: ['Kwa', 'Una', 'Rar', 'Che', 'Tha', 'Moc', 'Sab', 'Nan', 'Tis', 'Kum', 'Moj', 'Yel'],
  STANDALONESHORTMONTHS: ['Kwa', 'Una', 'Rar', 'Che', 'Tha', 'Moc', 'Sab', 'Nan', 'Tis', 'Kum', 'Moj', 'Yel'],
  WEEKDAYS: ['Sabato', 'Jumatatu', 'Jumanne', 'Jumatano', 'Arahamisi', 'Ijumaa', 'Jumamosi'],
  STANDALONEWEEKDAYS: ['Sabato', 'Jumatatu', 'Jumanne', 'Jumatano', 'Arahamisi', 'Ijumaa', 'Jumamosi'],
  SHORTWEEKDAYS: ['Sab', 'Jtt', 'Jnn', 'Jtn', 'Ara', 'Iju', 'Jmo'],
  STANDALONESHORTWEEKDAYS: ['Sab', 'Jtt', 'Jnn', 'Jtn', 'Ara', 'Iju', 'Jmo'],
  NARROWWEEKDAYS: ['S', 'J', 'J', 'J', 'A', 'I', 'J'],
  STANDALONENARROWWEEKDAYS: ['S', 'J', 'J', 'J', 'A', 'I', 'J'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['wichishu', 'mchochil’l'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale mgh_MZ.
 */
goog.i18n.DateTimeSymbols_mgh_MZ = goog.i18n.DateTimeSymbols_mgh;


/**
 * Date/time formatting symbols for locale mgo.
 */
goog.i18n.DateTimeSymbols_mgo = {
  ERAS: ['BCE', 'CE'],
  ERANAMES: ['BCE', 'CE'],
  NARROWMONTHS: ['M1', 'A2', 'M3', 'N4', 'F5', 'I6', 'A7', 'I8', 'K9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['M1', 'A2', 'M3', 'N4', 'F5', 'I6', 'A7', 'I8', 'K9', '10', '11', '12'],
  MONTHS: ['iməg mbegtug', 'imeg àbùbì', 'imeg mbəŋchubi', 'iməg ngwə̀t', 'iməg fog', 'iməg ichiibɔd', 'iməg àdùmbə̀ŋ', 'iməg ichika', 'iməg kud', 'iməg tèsiʼe', 'iməg zò', 'iməg krizmed'],
  STANDALONEMONTHS: ['iməg mbegtug', 'imeg àbùbì', 'imeg mbəŋchubi', 'iməg ngwə̀t', 'iməg fog', 'iməg ichiibɔd', 'iməg àdùmbə̀ŋ', 'iməg ichika', 'iməg kud', 'iməg tèsiʼe', 'iməg zò', 'iməg krizmed'],
  SHORTMONTHS: ['mbegtug', 'imeg àbùbì', 'imeg mbəŋchubi', 'iməg ngwə̀t', 'iməg fog', 'iməg ichiibɔd', 'iməg àdùmbə̀ŋ', 'iməg ichika', 'iməg kud', 'iməg tèsiʼe', 'iməg zò', 'iməg krizmed'],
  STANDALONESHORTMONTHS: ['mbegtug', 'imeg àbùbì', 'imeg mbəŋchubi', 'iməg ngwə̀t', 'iməg fog', 'iməg ichiibɔd', 'iməg àdùmbə̀ŋ', 'iməg ichika', 'iməg kud', 'iməg tèsiʼe', 'iməg zò', 'iməg krizmed'],
  WEEKDAYS: ['Aneg 1', 'Aneg 2', 'Aneg 3', 'Aneg 4', 'Aneg 5', 'Aneg 6', 'Aneg 7'],
  STANDALONEWEEKDAYS: ['Aneg 1', 'Aneg 2', 'Aneg 3', 'Aneg 4', 'Aneg 5', 'Aneg 6', 'Aneg 7'],
  SHORTWEEKDAYS: ['Aneg 1', 'Aneg 2', 'Aneg 3', 'Aneg 4', 'Aneg 5', 'Aneg 6', 'Aneg 7'],
  STANDALONESHORTWEEKDAYS: ['Aneg 1', 'Aneg 2', 'Aneg 3', 'Aneg 4', 'Aneg 5', 'Aneg 6', 'Aneg 7'],
  NARROWWEEKDAYS: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7'],
  STANDALONENARROWWEEKDAYS: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, y MMMM dd', 'y MMMM d', 'y MMM d', 'y-MM-dd'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale mgo_CM.
 */
goog.i18n.DateTimeSymbols_mgo_CM = goog.i18n.DateTimeSymbols_mgo;


/**
 * Date/time formatting symbols for locale mk_MK.
 */
goog.i18n.DateTimeSymbols_mk_MK = goog.i18n.DateTimeSymbols_mk;


/**
 * Date/time formatting symbols for locale ml_IN.
 */
goog.i18n.DateTimeSymbols_ml_IN = goog.i18n.DateTimeSymbols_ml;


/**
 * Date/time formatting symbols for locale mn_MN.
 */
goog.i18n.DateTimeSymbols_mn_MN = goog.i18n.DateTimeSymbols_mn;


/**
 * Date/time formatting symbols for locale mr_IN.
 */
goog.i18n.DateTimeSymbols_mr_IN = goog.i18n.DateTimeSymbols_mr;


/**
 * Date/time formatting symbols for locale ms_BN.
 */
goog.i18n.DateTimeSymbols_ms_BN = {
  ERAS: ['S.M.', 'TM'],
  ERANAMES: ['S.M.', 'TM'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'O', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'O', 'S', 'O', 'N', 'D'],
  MONTHS: ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'],
  STANDALONEMONTHS: ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'],
  WEEKDAYS: ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'],
  STANDALONEWEEKDAYS: ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'],
  SHORTWEEKDAYS: ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'],
  STANDALONESHORTWEEKDAYS: ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'],
  NARROWWEEKDAYS: ['A', 'I', 'S', 'R', 'K', 'J', 'S'],
  STANDALONENARROWWEEKDAYS: ['A', 'I', 'S', 'R', 'K', 'J', 'S'],
  SHORTQUARTERS: ['S1', 'S2', 'S3', 'S4'],
  QUARTERS: ['Suku pertama', 'Suku Ke-2', 'Suku Ke-3', 'Suku Ke-4'],
  AMPMS: ['PG', 'PTG'],
  DATEFORMATS: ['dd MMMM y', 'd MMMM y', 'd MMM y', 'd/MM/yy'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale ms_MY.
 */
goog.i18n.DateTimeSymbols_ms_MY = goog.i18n.DateTimeSymbols_ms;


/**
 * Date/time formatting symbols for locale ms_SG.
 */
goog.i18n.DateTimeSymbols_ms_SG = {
  ERAS: ['S.M.', 'TM'],
  ERANAMES: ['S.M.', 'TM'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'O', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'O', 'S', 'O', 'N', 'D'],
  MONTHS: ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'],
  STANDALONEMONTHS: ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogo', 'Sep', 'Okt', 'Nov', 'Dis'],
  WEEKDAYS: ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'],
  STANDALONEWEEKDAYS: ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'],
  SHORTWEEKDAYS: ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'],
  STANDALONESHORTWEEKDAYS: ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'],
  NARROWWEEKDAYS: ['A', 'I', 'S', 'R', 'K', 'J', 'S'],
  STANDALONENARROWWEEKDAYS: ['A', 'I', 'S', 'R', 'K', 'J', 'S'],
  SHORTQUARTERS: ['S1', 'S2', 'S3', 'S4'],
  QUARTERS: ['Suku pertama', 'Suku Ke-2', 'Suku Ke-3', 'Suku Ke-4'],
  AMPMS: ['PG', 'PTG'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'd/MM/yy'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale mt_MT.
 */
goog.i18n.DateTimeSymbols_mt_MT = goog.i18n.DateTimeSymbols_mt;


/**
 * Date/time formatting symbols for locale mua.
 */
goog.i18n.DateTimeSymbols_mua = {
  ERAS: ['KK', 'PK'],
  ERANAMES: ['KǝPel Kristu', 'Pel Kristu'],
  NARROWMONTHS: ['O', 'A', 'I', 'F', 'D', 'B', 'L', 'M', 'E', 'U', 'W', 'Y'],
  STANDALONENARROWMONTHS: ['O', 'A', 'I', 'F', 'D', 'B', 'L', 'M', 'E', 'U', 'W', 'Y'],
  MONTHS: ['Fĩi Loo', 'Cokcwaklaŋne', 'Cokcwaklii', 'Fĩi Marfoo', 'Madǝǝuutǝbijaŋ', 'Mamǝŋgwãafahbii', 'Mamǝŋgwãalii', 'Madǝmbii', 'Fĩi Dǝɓlii', 'Fĩi Mundaŋ', 'Fĩi Gwahlle', 'Fĩi Yuru'],
  STANDALONEMONTHS: ['Fĩi Loo', 'Cokcwaklaŋne', 'Cokcwaklii', 'Fĩi Marfoo', 'Madǝǝuutǝbijaŋ', 'Mamǝŋgwãafahbii', 'Mamǝŋgwãalii', 'Madǝmbii', 'Fĩi Dǝɓlii', 'Fĩi Mundaŋ', 'Fĩi Gwahlle', 'Fĩi Yuru'],
  SHORTMONTHS: ['FLO', 'CLA', 'CKI', 'FMF', 'MAD', 'MBI', 'MLI', 'MAM', 'FDE', 'FMU', 'FGW', 'FYU'],
  STANDALONESHORTMONTHS: ['FLO', 'CLA', 'CKI', 'FMF', 'MAD', 'MBI', 'MLI', 'MAM', 'FDE', 'FMU', 'FGW', 'FYU'],
  WEEKDAYS: ['Com’yakke', 'Comlaaɗii', 'Comzyiiɗii', 'Comkolle', 'Comkaldǝɓlii', 'Comgaisuu', 'Comzyeɓsuu'],
  STANDALONEWEEKDAYS: ['Com’yakke', 'Comlaaɗii', 'Comzyiiɗii', 'Comkolle', 'Comkaldǝɓlii', 'Comgaisuu', 'Comzyeɓsuu'],
  SHORTWEEKDAYS: ['Cya', 'Cla', 'Czi', 'Cko', 'Cka', 'Cga', 'Cze'],
  STANDALONESHORTWEEKDAYS: ['Cya', 'Cla', 'Czi', 'Cko', 'Cka', 'Cga', 'Cze'],
  NARROWWEEKDAYS: ['Y', 'L', 'Z', 'O', 'A', 'G', 'E'],
  STANDALONENARROWWEEKDAYS: ['Y', 'L', 'Z', 'O', 'A', 'G', 'E'],
  SHORTQUARTERS: ['F1', 'F2', 'F3', 'F4'],
  QUARTERS: ['Tai fĩi sai ma tǝn kee zah', 'Tai fĩi sai zah lǝn gwa ma kee', 'Tai fĩi sai zah lǝn sai ma kee', 'Tai fĩi sai ma coo kee zah ‘na'],
  AMPMS: ['comme', 'lilli'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'd/M/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale mua_CM.
 */
goog.i18n.DateTimeSymbols_mua_CM = goog.i18n.DateTimeSymbols_mua;


/**
 * Date/time formatting symbols for locale my_MM.
 */
goog.i18n.DateTimeSymbols_my_MM = goog.i18n.DateTimeSymbols_my;


/**
 * Date/time formatting symbols for locale mzn.
 */
goog.i18n.DateTimeSymbols_mzn = {
  ZERODIGIT: 0x06F0,
  ERAS: ['پ.م', 'م.'],
  ERANAMES: ['قبل میلاد', 'بعد میلاد'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن', 'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'],
  STANDALONEMONTHS: ['ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن', 'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'],
  SHORTMONTHS: ['ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن', 'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'],
  STANDALONESHORTMONTHS: ['ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن', 'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'],
  WEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONEWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['y MMMM d, EEEE', 'y MMMM d', 'y MMM d', 'y-MM-dd'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 5,
  WEEKENDRANGE: [4, 4],
  FIRSTWEEKCUTOFFDAY: 4
};


/**
 * Date/time formatting symbols for locale mzn_IR.
 */
goog.i18n.DateTimeSymbols_mzn_IR = goog.i18n.DateTimeSymbols_mzn;


/**
 * Date/time formatting symbols for locale naq.
 */
goog.i18n.DateTimeSymbols_naq = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Xristub aiǃâ', 'Xristub khaoǃgâ'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['ǃKhanni', 'ǃKhanǀgôab', 'ǀKhuuǁkhâb', 'ǃHôaǂkhaib', 'ǃKhaitsâb', 'Gamaǀaeb', 'ǂKhoesaob', 'Aoǁkhuumûǁkhâb', 'Taraǀkhuumûǁkhâb', 'ǂNûǁnâiseb', 'ǀHooǂgaeb', 'Hôasoreǁkhâb'],
  STANDALONEMONTHS: ['ǃKhanni', 'ǃKhanǀgôab', 'ǀKhuuǁkhâb', 'ǃHôaǂkhaib', 'ǃKhaitsâb', 'Gamaǀaeb', 'ǂKhoesaob', 'Aoǁkhuumûǁkhâb', 'Taraǀkhuumûǁkhâb', 'ǂNûǁnâiseb', 'ǀHooǂgaeb', 'Hôasoreǁkhâb'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  WEEKDAYS: ['Sontaxtsees', 'Mantaxtsees', 'Denstaxtsees', 'Wunstaxtsees', 'Dondertaxtsees', 'Fraitaxtsees', 'Satertaxtsees'],
  STANDALONEWEEKDAYS: ['Sontaxtsees', 'Mantaxtsees', 'Denstaxtsees', 'Wunstaxtsees', 'Dondertaxtsees', 'Fraitaxtsees', 'Satertaxtsees'],
  SHORTWEEKDAYS: ['Son', 'Ma', 'De', 'Wu', 'Do', 'Fr', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Son', 'Ma', 'De', 'Wu', 'Do', 'Fr', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'E', 'W', 'D', 'F', 'A'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'E', 'W', 'D', 'F', 'A'],
  SHORTQUARTERS: ['KW1', 'KW2', 'KW3', 'KW4'],
  QUARTERS: ['1ro kwartals', '2ǁî kwartals', '3ǁî kwartals', '4ǁî kwartals'],
  AMPMS: ['ǁgoagas', 'ǃuias'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale naq_NA.
 */
goog.i18n.DateTimeSymbols_naq_NA = goog.i18n.DateTimeSymbols_naq;


/**
 * Date/time formatting symbols for locale nb_NO.
 */
goog.i18n.DateTimeSymbols_nb_NO = goog.i18n.DateTimeSymbols_nb;


/**
 * Date/time formatting symbols for locale nb_SJ.
 */
goog.i18n.DateTimeSymbols_nb_SJ = goog.i18n.DateTimeSymbols_nb;


/**
 * Date/time formatting symbols for locale nd.
 */
goog.i18n.DateTimeSymbols_nd = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['UKristo angakabuyi', 'Ukristo ebuyile'],
  NARROWMONTHS: ['Z', 'N', 'M', 'M', 'N', 'N', 'N', 'N', 'M', 'M', 'L', 'M'],
  STANDALONENARROWMONTHS: ['Z', 'N', 'M', 'M', 'N', 'N', 'N', 'N', 'M', 'M', 'L', 'M'],
  MONTHS: ['Zibandlela', 'Nhlolanja', 'Mbimbitho', 'Mabasa', 'Nkwenkwezi', 'Nhlangula', 'Ntulikazi', 'Ncwabakazi', 'Mpandula', 'Mfumfu', 'Lwezi', 'Mpalakazi'],
  STANDALONEMONTHS: ['Zibandlela', 'Nhlolanja', 'Mbimbitho', 'Mabasa', 'Nkwenkwezi', 'Nhlangula', 'Ntulikazi', 'Ncwabakazi', 'Mpandula', 'Mfumfu', 'Lwezi', 'Mpalakazi'],
  SHORTMONTHS: ['Zib', 'Nhlo', 'Mbi', 'Mab', 'Nkw', 'Nhla', 'Ntu', 'Ncw', 'Mpan', 'Mfu', 'Lwe', 'Mpal'],
  STANDALONESHORTMONTHS: ['Zib', 'Nhlo', 'Mbi', 'Mab', 'Nkw', 'Nhla', 'Ntu', 'Ncw', 'Mpan', 'Mfu', 'Lwe', 'Mpal'],
  WEEKDAYS: ['Sonto', 'Mvulo', 'Sibili', 'Sithathu', 'Sine', 'Sihlanu', 'Mgqibelo'],
  STANDALONEWEEKDAYS: ['Sonto', 'Mvulo', 'Sibili', 'Sithathu', 'Sine', 'Sihlanu', 'Mgqibelo'],
  SHORTWEEKDAYS: ['Son', 'Mvu', 'Sib', 'Sit', 'Sin', 'Sih', 'Mgq'],
  STANDALONESHORTWEEKDAYS: ['Son', 'Mvu', 'Sib', 'Sit', 'Sin', 'Sih', 'Mgq'],
  NARROWWEEKDAYS: ['S', 'M', 'S', 'S', 'S', 'S', 'M'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'S', 'S', 'S', 'S', 'M'],
  SHORTQUARTERS: ['K1', 'K2', 'K3', 'K4'],
  QUARTERS: ['Kota 1', 'Kota 2', 'Kota 3', 'Kota 4'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale nd_ZW.
 */
goog.i18n.DateTimeSymbols_nd_ZW = goog.i18n.DateTimeSymbols_nd;


/**
 * Date/time formatting symbols for locale nds.
 */
goog.i18n.DateTimeSymbols_nds = {
  ERAS: ['BCE', 'CE'],
  ERANAMES: ['BCE', 'CE'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M09', 'M10', 'M11', 'M12'],
  STANDALONEMONTHS: ['M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M09', 'M10', 'M11', 'M12'],
  SHORTMONTHS: ['M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M09', 'M10', 'M11', 'M12'],
  STANDALONESHORTMONTHS: ['M01', 'M02', 'M03', 'M04', 'M05', 'M06', 'M07', 'M08', 'M09', 'M10', 'M11', 'M12'],
  WEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONEWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  SHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['y MMMM d, EEEE', 'y MMMM d', 'y MMM d', 'y-MM-dd'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale nds_DE.
 */
goog.i18n.DateTimeSymbols_nds_DE = goog.i18n.DateTimeSymbols_nds;


/**
 * Date/time formatting symbols for locale nds_NL.
 */
goog.i18n.DateTimeSymbols_nds_NL = goog.i18n.DateTimeSymbols_nds;


/**
 * Date/time formatting symbols for locale ne_IN.
 */
goog.i18n.DateTimeSymbols_ne_IN = {
  ZERODIGIT: 0x0966,
  ERAS: ['ईसा पूर्व', 'सन्'],
  ERANAMES: ['ईसा पूर्व', 'सन्'],
  NARROWMONTHS: ['१', '२', '३', '४', '५', '६', '७', '८', '९', '१०', '११', '१२'],
  STANDALONENARROWMONTHS: ['१', '२', '३', '४', '५', '६', '७', '८', '९', '१०', '११', '१२'],
  MONTHS: ['जनवरी', 'फेब्रुअरी', 'मार्च', 'अप्रिल', 'मई', 'जुन', 'जुलाई', 'अगस्ट', 'सेप्टेम्बर', 'अक्टोबर', 'नोभेम्बर', 'डिसेम्बर'],
  STANDALONEMONTHS: ['जनवरी', 'फेब्रुअरी', 'मार्च', 'अप्रिल', 'मे', 'जुन', 'जुलाई', 'अगस्ट', 'सेप्टेम्बर', 'अक्टोबर', 'नोभेम्बर', 'डिसेम्बर'],
  SHORTMONTHS: ['जनवरी', 'फेब्रुअरी', 'मार्च', 'अप्रिल', 'मे', 'जुन', 'जुलाई', 'अगस्ट', 'सेप्टेम्बर', 'अक्टोबर', 'नोभेम्बर', 'डिसेम्बर'],
  STANDALONESHORTMONTHS: ['जनवरी', 'फेब्रुअरी', 'मार्च', 'अप्रिल', 'मे', 'जुन', 'जुलाई', 'अगस्ट', 'सेप्टेम्बर', 'अक्टोबर', 'नोभेम्बर', 'डिसेम्बर'],
  WEEKDAYS: ['आइतबार', 'सोमबार', 'मङ्गलबार', 'बुधबार', 'बिहिबार', 'शुक्रबार', 'शनिबार'],
  STANDALONEWEEKDAYS: ['आइतबार', 'सोमबार', 'मङ्गलबार', 'बुधबार', 'बिहिबार', 'शुक्रबार', 'शनिबार'],
  SHORTWEEKDAYS: ['आइत', 'सोम', 'मङ्गल', 'बुध', 'बिहि', 'शुक्र', 'शनि'],
  STANDALONESHORTWEEKDAYS: ['आइत', 'सोम', 'मङ्गल', 'बुध', 'बिहि', 'शुक्र', 'शनि'],
  NARROWWEEKDAYS: ['आ', 'सो', 'म', 'बु', 'बि', 'शु', 'श'],
  STANDALONENARROWWEEKDAYS: ['आ', 'सो', 'म', 'बु', 'बि', 'शु', 'श'],
  SHORTQUARTERS: ['पहिलो सत्र', 'दोस्रो सत्र', 'तेस्रो सत्र', 'चौथो सत्र'],
  QUARTERS: ['पहिलो सत्र', 'दोस्रो सत्र', 'तेस्रो सत्र', 'चौथो सत्र'],
  AMPMS: ['पूर्वाह्न', 'अपराह्न'],
  DATEFORMATS: ['y MMMM d, EEEE', 'y MMMM d', 'y MMM d', 'y-MM-dd'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [6, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale ne_NP.
 */
goog.i18n.DateTimeSymbols_ne_NP = goog.i18n.DateTimeSymbols_ne;


/**
 * Date/time formatting symbols for locale nl_AW.
 */
goog.i18n.DateTimeSymbols_nl_AW = {
  ERAS: ['v.Chr.', 'n.Chr.'],
  ERANAMES: ['voor Christus', 'na Christus'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
  STANDALONEMONTHS: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
  SHORTMONTHS: ['jan.', 'feb.', 'mrt.', 'apr.', 'mei', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.'],
  STANDALONESHORTMONTHS: ['jan.', 'feb.', 'mrt.', 'apr.', 'mei', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.'],
  WEEKDAYS: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
  STANDALONEWEEKDAYS: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
  SHORTWEEKDAYS: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
  STANDALONESHORTWEEKDAYS: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
  NARROWWEEKDAYS: ['Z', 'M', 'D', 'W', 'D', 'V', 'Z'],
  STANDALONENARROWWEEKDAYS: ['Z', 'M', 'D', 'W', 'D', 'V', 'Z'],
  SHORTQUARTERS: ['K1', 'K2', 'K3', 'K4'],
  QUARTERS: ['1e kwartaal', '2e kwartaal', '3e kwartaal', '4e kwartaal'],
  AMPMS: ['a.m.', 'p.m.'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd-MM-yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'om\' {0}', '{1} \'om\' {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale nl_BE.
 */
goog.i18n.DateTimeSymbols_nl_BE = {
  ERAS: ['v.Chr.', 'n.Chr.'],
  ERANAMES: ['voor Christus', 'na Christus'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
  STANDALONEMONTHS: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
  SHORTMONTHS: ['jan.', 'feb.', 'mrt.', 'apr.', 'mei', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.'],
  STANDALONESHORTMONTHS: ['jan.', 'feb.', 'mrt.', 'apr.', 'mei', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.'],
  WEEKDAYS: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
  STANDALONEWEEKDAYS: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
  SHORTWEEKDAYS: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
  STANDALONESHORTWEEKDAYS: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
  NARROWWEEKDAYS: ['Z', 'M', 'D', 'W', 'D', 'V', 'Z'],
  STANDALONENARROWWEEKDAYS: ['Z', 'M', 'D', 'W', 'D', 'V', 'Z'],
  SHORTQUARTERS: ['K1', 'K2', 'K3', 'K4'],
  QUARTERS: ['1e kwartaal', '2e kwartaal', '3e kwartaal', '4e kwartaal'],
  AMPMS: ['a.m.', 'p.m.'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'd/MM/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'om\' {0}', '{1} \'om\' {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale nl_BQ.
 */
goog.i18n.DateTimeSymbols_nl_BQ = {
  ERAS: ['v.Chr.', 'n.Chr.'],
  ERANAMES: ['voor Christus', 'na Christus'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
  STANDALONEMONTHS: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
  SHORTMONTHS: ['jan.', 'feb.', 'mrt.', 'apr.', 'mei', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.'],
  STANDALONESHORTMONTHS: ['jan.', 'feb.', 'mrt.', 'apr.', 'mei', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.'],
  WEEKDAYS: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
  STANDALONEWEEKDAYS: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
  SHORTWEEKDAYS: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
  STANDALONESHORTWEEKDAYS: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
  NARROWWEEKDAYS: ['Z', 'M', 'D', 'W', 'D', 'V', 'Z'],
  STANDALONENARROWWEEKDAYS: ['Z', 'M', 'D', 'W', 'D', 'V', 'Z'],
  SHORTQUARTERS: ['K1', 'K2', 'K3', 'K4'],
  QUARTERS: ['1e kwartaal', '2e kwartaal', '3e kwartaal', '4e kwartaal'],
  AMPMS: ['a.m.', 'p.m.'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd-MM-yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'om\' {0}', '{1} \'om\' {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale nl_CW.
 */
goog.i18n.DateTimeSymbols_nl_CW = {
  ERAS: ['v.Chr.', 'n.Chr.'],
  ERANAMES: ['voor Christus', 'na Christus'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
  STANDALONEMONTHS: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
  SHORTMONTHS: ['jan.', 'feb.', 'mrt.', 'apr.', 'mei', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.'],
  STANDALONESHORTMONTHS: ['jan.', 'feb.', 'mrt.', 'apr.', 'mei', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.'],
  WEEKDAYS: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
  STANDALONEWEEKDAYS: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
  SHORTWEEKDAYS: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
  STANDALONESHORTWEEKDAYS: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
  NARROWWEEKDAYS: ['Z', 'M', 'D', 'W', 'D', 'V', 'Z'],
  STANDALONENARROWWEEKDAYS: ['Z', 'M', 'D', 'W', 'D', 'V', 'Z'],
  SHORTQUARTERS: ['K1', 'K2', 'K3', 'K4'],
  QUARTERS: ['1e kwartaal', '2e kwartaal', '3e kwartaal', '4e kwartaal'],
  AMPMS: ['a.m.', 'p.m.'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd-MM-yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'om\' {0}', '{1} \'om\' {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale nl_NL.
 */
goog.i18n.DateTimeSymbols_nl_NL = goog.i18n.DateTimeSymbols_nl;


/**
 * Date/time formatting symbols for locale nl_SR.
 */
goog.i18n.DateTimeSymbols_nl_SR = {
  ERAS: ['v.Chr.', 'n.Chr.'],
  ERANAMES: ['voor Christus', 'na Christus'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
  STANDALONEMONTHS: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
  SHORTMONTHS: ['jan.', 'feb.', 'mrt.', 'apr.', 'mei', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.'],
  STANDALONESHORTMONTHS: ['jan.', 'feb.', 'mrt.', 'apr.', 'mei', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.'],
  WEEKDAYS: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
  STANDALONEWEEKDAYS: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
  SHORTWEEKDAYS: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
  STANDALONESHORTWEEKDAYS: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
  NARROWWEEKDAYS: ['Z', 'M', 'D', 'W', 'D', 'V', 'Z'],
  STANDALONENARROWWEEKDAYS: ['Z', 'M', 'D', 'W', 'D', 'V', 'Z'],
  SHORTQUARTERS: ['K1', 'K2', 'K3', 'K4'],
  QUARTERS: ['1e kwartaal', '2e kwartaal', '3e kwartaal', '4e kwartaal'],
  AMPMS: ['a.m.', 'p.m.'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd-MM-yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'om\' {0}', '{1} \'om\' {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale nl_SX.
 */
goog.i18n.DateTimeSymbols_nl_SX = {
  ERAS: ['v.Chr.', 'n.Chr.'],
  ERANAMES: ['voor Christus', 'na Christus'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
  STANDALONEMONTHS: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
  SHORTMONTHS: ['jan.', 'feb.', 'mrt.', 'apr.', 'mei', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.'],
  STANDALONESHORTMONTHS: ['jan.', 'feb.', 'mrt.', 'apr.', 'mei', 'jun.', 'jul.', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.'],
  WEEKDAYS: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
  STANDALONEWEEKDAYS: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
  SHORTWEEKDAYS: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
  STANDALONESHORTWEEKDAYS: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
  NARROWWEEKDAYS: ['Z', 'M', 'D', 'W', 'D', 'V', 'Z'],
  STANDALONENARROWWEEKDAYS: ['Z', 'M', 'D', 'W', 'D', 'V', 'Z'],
  SHORTQUARTERS: ['K1', 'K2', 'K3', 'K4'],
  QUARTERS: ['1e kwartaal', '2e kwartaal', '3e kwartaal', '4e kwartaal'],
  AMPMS: ['a.m.', 'p.m.'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd-MM-yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'om\' {0}', '{1} \'om\' {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale nmg.
 */
goog.i18n.DateTimeSymbols_nmg = {
  ERAS: ['BL', 'PB'],
  ERANAMES: ['Bó Lahlɛ̄', 'Pfiɛ Burī'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['ngwɛn matáhra', 'ngwɛn ńmba', 'ngwɛn ńlal', 'ngwɛn ńna', 'ngwɛn ńtan', 'ngwɛn ńtuó', 'ngwɛn hɛmbuɛrí', 'ngwɛn lɔmbi', 'ngwɛn rɛbvuâ', 'ngwɛn wum', 'ngwɛn wum navǔr', 'krísimin'],
  STANDALONEMONTHS: ['ngwɛn matáhra', 'ngwɛn ńmba', 'ngwɛn ńlal', 'ngwɛn ńna', 'ngwɛn ńtan', 'ngwɛn ńtuó', 'ngwɛn hɛmbuɛrí', 'ngwɛn lɔmbi', 'ngwɛn rɛbvuâ', 'ngwɛn wum', 'ngwɛn wum navǔr', 'krísimin'],
  SHORTMONTHS: ['ng1', 'ng2', 'ng3', 'ng4', 'ng5', 'ng6', 'ng7', 'ng8', 'ng9', 'ng10', 'ng11', 'kris'],
  STANDALONESHORTMONTHS: ['ng1', 'ng2', 'ng3', 'ng4', 'ng5', 'ng6', 'ng7', 'ng8', 'ng9', 'ng10', 'ng11', 'kris'],
  WEEKDAYS: ['sɔ́ndɔ', 'mɔ́ndɔ', 'sɔ́ndɔ mafú mába', 'sɔ́ndɔ mafú málal', 'sɔ́ndɔ mafú mána', 'mabágá má sukul', 'sásadi'],
  STANDALONEWEEKDAYS: ['sɔ́ndɔ', 'mɔ́ndɔ', 'sɔ́ndɔ mafú mába', 'sɔ́ndɔ mafú málal', 'sɔ́ndɔ mafú mána', 'mabágá má sukul', 'sásadi'],
  SHORTWEEKDAYS: ['sɔ́n', 'mɔ́n', 'smb', 'sml', 'smn', 'mbs', 'sas'],
  STANDALONESHORTWEEKDAYS: ['sɔ́n', 'mɔ́n', 'smb', 'sml', 'smn', 'mbs', 'sas'],
  NARROWWEEKDAYS: ['s', 'm', 's', 's', 's', 'm', 's'],
  STANDALONENARROWWEEKDAYS: ['s', 'm', 's', 's', 's', 'm', 's'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['Tindɛ nvúr', 'Tindɛ ńmba', 'Tindɛ ńlal', 'Tindɛ ńna'],
  AMPMS: ['maná', 'kugú'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'd/M/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale nmg_CM.
 */
goog.i18n.DateTimeSymbols_nmg_CM = goog.i18n.DateTimeSymbols_nmg;


/**
 * Date/time formatting symbols for locale nn.
 */
goog.i18n.DateTimeSymbols_nn = {
  ERAS: ['f.Kr.', 'e.Kr.'],
  ERANAMES: ['f.Kr.', 'e.Kr.'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'],
  STANDALONEMONTHS: ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'],
  SHORTMONTHS: ['jan.', 'feb.', 'mars', 'apr.', 'mai', 'juni', 'juli', 'aug.', 'sep.', 'okt.', 'nov.', 'des.'],
  STANDALONESHORTMONTHS: ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'],
  WEEKDAYS: ['søndag', 'måndag', 'tysdag', 'onsdag', 'torsdag', 'fredag', 'laurdag'],
  STANDALONEWEEKDAYS: ['søndag', 'måndag', 'tysdag', 'onsdag', 'torsdag', 'fredag', 'laurdag'],
  SHORTWEEKDAYS: ['sø.', 'må.', 'ty.', 'on.', 'to.', 'fr.', 'la.'],
  STANDALONESHORTWEEKDAYS: ['søn', 'mån', 'tys', 'ons', 'tor', 'fre', 'lau'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'O', 'T', 'F', 'L'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'O', 'T', 'F', 'L'],
  SHORTQUARTERS: ['K1', 'K2', 'K3', 'K4'],
  QUARTERS: ['1. kvartal', '2. kvartal', '3. kvartal', '4. kvartal'],
  AMPMS: ['formiddag', 'ettermiddag'],
  DATEFORMATS: ['EEEE d. MMMM y', 'd. MMMM y', 'd. MMM y', 'dd.MM.y'],
  TIMEFORMATS: ['\'kl\'. HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} \'kl\'. {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale nn_NO.
 */
goog.i18n.DateTimeSymbols_nn_NO = goog.i18n.DateTimeSymbols_nn;


/**
 * Date/time formatting symbols for locale nnh.
 */
goog.i18n.DateTimeSymbols_nnh = {
  ERAS: ['m.z.Y.', 'm.g.n.Y.'],
  ERANAMES: ['mé zyé Yěsô', 'mé gÿo ńzyé Yěsô'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['saŋ tsetsɛ̀ɛ lùm', 'saŋ kàg ngwóŋ', 'saŋ lepyè shúm', 'saŋ cÿó', 'saŋ tsɛ̀ɛ cÿó', 'saŋ njÿoláʼ', 'saŋ tyɛ̀b tyɛ̀b mbʉ̀ŋ', 'saŋ mbʉ̀ŋ', 'saŋ ngwɔ̀ʼ mbÿɛ', 'saŋ tàŋa tsetsáʼ', 'saŋ mejwoŋó', 'saŋ lùm'],
  STANDALONEMONTHS: ['saŋ tsetsɛ̀ɛ lùm', 'saŋ kàg ngwóŋ', 'saŋ lepyè shúm', 'saŋ cÿó', 'saŋ tsɛ̀ɛ cÿó', 'saŋ njÿoláʼ', 'saŋ tyɛ̀b tyɛ̀b mbʉ̀ŋ', 'saŋ mbʉ̀ŋ', 'saŋ ngwɔ̀ʼ mbÿɛ', 'saŋ tàŋa tsetsáʼ', 'saŋ mejwoŋó', 'saŋ lùm'],
  SHORTMONTHS: ['saŋ tsetsɛ̀ɛ lùm', 'saŋ kàg ngwóŋ', 'saŋ lepyè shúm', 'saŋ cÿó', 'saŋ tsɛ̀ɛ cÿó', 'saŋ njÿoláʼ', 'saŋ tyɛ̀b tyɛ̀b mbʉ̀ŋ', 'saŋ mbʉ̀ŋ', 'saŋ ngwɔ̀ʼ mbÿɛ', 'saŋ tàŋa tsetsáʼ', 'saŋ mejwoŋó', 'saŋ lùm'],
  STANDALONESHORTMONTHS: ['saŋ tsetsɛ̀ɛ lùm', 'saŋ kàg ngwóŋ', 'saŋ lepyè shúm', 'saŋ cÿó', 'saŋ tsɛ̀ɛ cÿó', 'saŋ njÿoláʼ', 'saŋ tyɛ̀b tyɛ̀b mbʉ̀ŋ', 'saŋ mbʉ̀ŋ', 'saŋ ngwɔ̀ʼ mbÿɛ', 'saŋ tàŋa tsetsáʼ', 'saŋ mejwoŋó', 'saŋ lùm'],
  WEEKDAYS: ['lyɛʼɛ́ sẅíŋtè', 'mvfò lyɛ̌ʼ', 'mbɔ́ɔntè mvfò lyɛ̌ʼ', 'tsètsɛ̀ɛ lyɛ̌ʼ', 'mbɔ́ɔntè tsetsɛ̀ɛ lyɛ̌ʼ', 'mvfò màga lyɛ̌ʼ', 'màga lyɛ̌ʼ'],
  STANDALONEWEEKDAYS: ['lyɛʼɛ́ sẅíŋtè', 'mvfò lyɛ̌ʼ', 'mbɔ́ɔntè mvfò lyɛ̌ʼ', 'tsètsɛ̀ɛ lyɛ̌ʼ', 'mbɔ́ɔntè tsetsɛ̀ɛ lyɛ̌ʼ', 'mvfò màga lyɛ̌ʼ', 'màga lyɛ̌ʼ'],
  SHORTWEEKDAYS: ['lyɛʼɛ́ sẅíŋtè', 'mvfò lyɛ̌ʼ', 'mbɔ́ɔntè mvfò lyɛ̌ʼ', 'tsètsɛ̀ɛ lyɛ̌ʼ', 'mbɔ́ɔntè tsetsɛ̀ɛ lyɛ̌ʼ', 'mvfò màga lyɛ̌ʼ', 'màga lyɛ̌ʼ'],
  STANDALONESHORTWEEKDAYS: ['lyɛʼɛ́ sẅíŋtè', 'mvfò lyɛ̌ʼ', 'mbɔ́ɔntè mvfò lyɛ̌ʼ', 'tsètsɛ̀ɛ lyɛ̌ʼ', 'mbɔ́ɔntè tsetsɛ̀ɛ lyɛ̌ʼ', 'mvfò màga lyɛ̌ʼ', 'màga lyɛ̌ʼ'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['mbaʼámbaʼ', 'ncwònzém'],
  DATEFORMATS: ['EEEE , \'lyɛ\'̌ʼ d \'na\' MMMM, y', '\'lyɛ\'̌ʼ d \'na\' MMMM, y', 'd MMM, y', 'dd/MM/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1},{0}', '{1}, {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale nnh_CM.
 */
goog.i18n.DateTimeSymbols_nnh_CM = goog.i18n.DateTimeSymbols_nnh;


/**
 * Date/time formatting symbols for locale nus.
 */
goog.i18n.DateTimeSymbols_nus = {
  ERAS: ['AY', 'ƐY'],
  ERANAMES: ['A ka̱n Yecu ni dap', 'Ɛ ca Yecu dap'],
  NARROWMONTHS: ['T', 'P', 'D', 'G', 'D', 'K', 'P', 'T', 'T', 'L', 'K', 'T'],
  STANDALONENARROWMONTHS: ['T', 'P', 'D', 'G', 'D', 'K', 'P', 'T', 'T', 'L', 'K', 'T'],
  MONTHS: ['Tiop thar pɛt', 'Pɛt', 'Duɔ̱ɔ̱ŋ', 'Guak', 'Duät', 'Kornyoot', 'Pay yie̱tni', 'Tho̱o̱r', 'Tɛɛr', 'Laath', 'Kur', 'Tio̱p in di̱i̱t'],
  STANDALONEMONTHS: ['Tiop thar pɛt', 'Pɛt', 'Duɔ̱ɔ̱ŋ', 'Guak', 'Duät', 'Kornyoot', 'Pay yie̱tni', 'Tho̱o̱r', 'Tɛɛr', 'Laath', 'Kur', 'Tio̱p in di̱i̱t'],
  SHORTMONTHS: ['Tiop', 'Pɛt', 'Duɔ̱ɔ̱', 'Guak', 'Duä', 'Kor', 'Pay', 'Thoo', 'Tɛɛ', 'Laa', 'Kur', 'Tid'],
  STANDALONESHORTMONTHS: ['Tiop', 'Pɛt', 'Duɔ̱ɔ̱', 'Guak', 'Duä', 'Kor', 'Pay', 'Thoo', 'Tɛɛ', 'Laa', 'Kur', 'Tid'],
  WEEKDAYS: ['Cäŋ kuɔth', 'Jiec la̱t', 'Rɛw lätni', 'Diɔ̱k lätni', 'Ŋuaan lätni', 'Dhieec lätni', 'Bäkɛl lätni'],
  STANDALONEWEEKDAYS: ['Cäŋ kuɔth', 'Jiec la̱t', 'Rɛw lätni', 'Diɔ̱k lätni', 'Ŋuaan lätni', 'Dhieec lätni', 'Bäkɛl lätni'],
  SHORTWEEKDAYS: ['Cäŋ', 'Jiec', 'Rɛw', 'Diɔ̱k', 'Ŋuaan', 'Dhieec', 'Bäkɛl'],
  STANDALONESHORTWEEKDAYS: ['Cäŋ', 'Jiec', 'Rɛw', 'Diɔ̱k', 'Ŋuaan', 'Dhieec', 'Bäkɛl'],
  NARROWWEEKDAYS: ['C', 'J', 'R', 'D', 'Ŋ', 'D', 'B'],
  STANDALONENARROWWEEKDAYS: ['C', 'J', 'R', 'D', 'Ŋ', 'D', 'B'],
  SHORTQUARTERS: ['P1', 'P2', 'P3', 'P4'],
  QUARTERS: ['Päth diɔk tin nhiam', 'Päth diɔk tin guurɛ', 'Päth diɔk tin wä kɔɔriɛn', 'Päth diɔk tin jiɔakdiɛn'],
  AMPMS: ['RW', 'TŊ'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'd/MM/y'],
  TIMEFORMATS: ['zzzz h:mm:ss a', 'z h:mm:ss a', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale nus_SS.
 */
goog.i18n.DateTimeSymbols_nus_SS = goog.i18n.DateTimeSymbols_nus;


/**
 * Date/time formatting symbols for locale nyn.
 */
goog.i18n.DateTimeSymbols_nyn = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Kurisito Atakaijire', 'Kurisito Yaijire'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['Okwokubanza', 'Okwakabiri', 'Okwakashatu', 'Okwakana', 'Okwakataana', 'Okwamukaaga', 'Okwamushanju', 'Okwamunaana', 'Okwamwenda', 'Okwaikumi', 'Okwaikumi na kumwe', 'Okwaikumi na ibiri'],
  STANDALONEMONTHS: ['Okwokubanza', 'Okwakabiri', 'Okwakashatu', 'Okwakana', 'Okwakataana', 'Okwamukaaga', 'Okwamushanju', 'Okwamunaana', 'Okwamwenda', 'Okwaikumi', 'Okwaikumi na kumwe', 'Okwaikumi na ibiri'],
  SHORTMONTHS: ['KBZ', 'KBR', 'KST', 'KKN', 'KTN', 'KMK', 'KMS', 'KMN', 'KMW', 'KKM', 'KNK', 'KNB'],
  STANDALONESHORTMONTHS: ['KBZ', 'KBR', 'KST', 'KKN', 'KTN', 'KMK', 'KMS', 'KMN', 'KMW', 'KKM', 'KNK', 'KNB'],
  WEEKDAYS: ['Sande', 'Orwokubanza', 'Orwakabiri', 'Orwakashatu', 'Orwakana', 'Orwakataano', 'Orwamukaaga'],
  STANDALONEWEEKDAYS: ['Sande', 'Orwokubanza', 'Orwakabiri', 'Orwakashatu', 'Orwakana', 'Orwakataano', 'Orwamukaaga'],
  SHORTWEEKDAYS: ['SAN', 'ORK', 'OKB', 'OKS', 'OKN', 'OKT', 'OMK'],
  STANDALONESHORTWEEKDAYS: ['SAN', 'ORK', 'OKB', 'OKS', 'OKN', 'OKT', 'OMK'],
  NARROWWEEKDAYS: ['S', 'K', 'R', 'S', 'N', 'T', 'M'],
  STANDALONENARROWWEEKDAYS: ['S', 'K', 'R', 'S', 'N', 'T', 'M'],
  SHORTQUARTERS: ['K1', 'K2', 'K3', 'K4'],
  QUARTERS: ['KWOTA 1', 'KWOTA 2', 'KWOTA 3', 'KWOTA 4'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale nyn_UG.
 */
goog.i18n.DateTimeSymbols_nyn_UG = goog.i18n.DateTimeSymbols_nyn;


/**
 * Date/time formatting symbols for locale om.
 */
goog.i18n.DateTimeSymbols_om = {
  ERAS: ['BCE', 'CE'],
  ERANAMES: ['Dheengadda Jeesu', 'CE'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['Amajjii', 'Guraandhala', 'Bitooteessa', 'Elba', 'Caamsa', 'Waxabajjii', 'Adooleessa', 'Hagayya', 'Fuulbana', 'Onkololeessa', 'Sadaasa', 'Muddee'],
  STANDALONEMONTHS: ['Amajjii', 'Guraandhala', 'Bitooteessa', 'Elba', 'Caamsa', 'Waxabajjii', 'Adooleessa', 'Hagayya', 'Fuulbana', 'Onkololeessa', 'Sadaasa', 'Muddee'],
  SHORTMONTHS: ['Ama', 'Gur', 'Bit', 'Elb', 'Cam', 'Wax', 'Ado', 'Hag', 'Ful', 'Onk', 'Sad', 'Mud'],
  STANDALONESHORTMONTHS: ['Ama', 'Gur', 'Bit', 'Elb', 'Cam', 'Wax', 'Ado', 'Hag', 'Ful', 'Onk', 'Sad', 'Mud'],
  WEEKDAYS: ['Dilbata', 'Wiixata', 'Qibxata', 'Roobii', 'Kamiisa', 'Jimaata', 'Sanbata'],
  STANDALONEWEEKDAYS: ['Dilbata', 'Wiixata', 'Qibxata', 'Roobii', 'Kamiisa', 'Jimaata', 'Sanbata'],
  SHORTWEEKDAYS: ['Dil', 'Wix', 'Qib', 'Rob', 'Kam', 'Jim', 'San'],
  STANDALONESHORTWEEKDAYS: ['Dil', 'Wix', 'Qib', 'Rob', 'Kam', 'Jim', 'San'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Kurmaana 1', 'Kurmaana 2', 'Kurmaana 3', 'Kurmaana 4'],
  AMPMS: ['WD', 'WB'],
  DATEFORMATS: ['EEEE, MMMM d, y', 'dd MMMM y', 'dd-MMM-y', 'dd/MM/yy'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale om_ET.
 */
goog.i18n.DateTimeSymbols_om_ET = goog.i18n.DateTimeSymbols_om;


/**
 * Date/time formatting symbols for locale om_KE.
 */
goog.i18n.DateTimeSymbols_om_KE = {
  ERAS: ['KD', 'CE'],
  ERANAMES: ['Dheengadda Jeesu', 'CE'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['A', 'G', 'B', 'E', 'C', 'W', 'A', 'H', 'F', 'O', 'S', 'M'],
  MONTHS: ['Amajjii', 'Guraandhala', 'Bitooteessa', 'Elba', 'Caamsa', 'Waxabajjii', 'Adooleessa', 'Hagayya', 'Fuulbana', 'Onkololeessa', 'Sadaasa', 'Muddee'],
  STANDALONEMONTHS: ['Amajjii', 'Guraandhala', 'Bitooteessa', 'Elba', 'Caamsa', 'Waxabajjii', 'Adooleessa', 'Hagayya', 'Fuulbana', 'Onkololeessa', 'Sadaasa', 'Muddee'],
  SHORTMONTHS: ['Ama', 'Gur', 'Bit', 'Elb', 'Cam', 'Wax', 'Ado', 'Hag', 'Ful', 'Onk', 'Sad', 'Mud'],
  STANDALONESHORTMONTHS: ['Ama', 'Gur', 'Bit', 'Elb', 'Cam', 'Wax', 'Ado', 'Hag', 'Ful', 'Onk', 'Sad', 'Mud'],
  WEEKDAYS: ['Dilbata', 'Wiixata', 'Qibxata', 'Roobii', 'Kamiisa', 'Jimaata', 'Sanbata'],
  STANDALONEWEEKDAYS: ['Dilbata', 'Wiixata', 'Qibxata', 'Roobii', 'Kamiisa', 'Jimaata', 'Sanbata'],
  SHORTWEEKDAYS: ['Dil', 'Wix', 'Qib', 'Rob', 'Kam', 'Jim', 'San'],
  STANDALONESHORTWEEKDAYS: ['Dil', 'Wix', 'Qib', 'Rob', 'Kam', 'Jim', 'San'],
  NARROWWEEKDAYS: ['D', 'W', 'Q', 'R', 'K', 'J', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'W', 'Q', 'R', 'K', 'J', 'S'],
  SHORTQUARTERS: ['K1', 'K2', 'K3', 'K4'],
  QUARTERS: ['Kurmaana 1', 'Kurmaana 2', 'Kurmaana 3', 'Kurmaana 4'],
  AMPMS: ['WD', 'WB'],
  DATEFORMATS: ['EEEE, MMMM d, y', 'dd MMMM y', 'dd-MMM-y', 'dd/MM/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale or_IN.
 */
goog.i18n.DateTimeSymbols_or_IN = goog.i18n.DateTimeSymbols_or;


/**
 * Date/time formatting symbols for locale os.
 */
goog.i18n.DateTimeSymbols_os = {
  ERAS: ['н.д.а.', 'н.д.'],
  ERANAMES: ['н.д.а.', 'н.д.'],
  NARROWMONTHS: ['Я', 'Ф', 'М', 'А', 'М', 'И', 'И', 'А', 'С', 'О', 'Н', 'Д'],
  STANDALONENARROWMONTHS: ['Я', 'Ф', 'М', 'А', 'М', 'И', 'И', 'А', 'С', 'О', 'Н', 'Д'],
  MONTHS: ['январы', 'февралы', 'мартъийы', 'апрелы', 'майы', 'июны', 'июлы', 'августы', 'сентябры', 'октябры', 'ноябры', 'декабры'],
  STANDALONEMONTHS: ['Январь', 'Февраль', 'Мартъи', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
  SHORTMONTHS: ['янв.', 'фев.', 'мар.', 'апр.', 'майы', 'июны', 'июлы', 'авг.', 'сен.', 'окт.', 'ноя.', 'дек.'],
  STANDALONESHORTMONTHS: ['Янв.', 'Февр.', 'Март.', 'Апр.', 'Май', 'Июнь', 'Июль', 'Авг.', 'Сент.', 'Окт.', 'Нояб.', 'Дек.'],
  WEEKDAYS: ['хуыцаубон', 'къуырисӕр', 'дыццӕг', 'ӕртыццӕг', 'цыппӕрӕм', 'майрӕмбон', 'сабат'],
  STANDALONEWEEKDAYS: ['Хуыцаубон', 'Къуырисӕр', 'Дыццӕг', 'Ӕртыццӕг', 'Цыппӕрӕм', 'Майрӕмбон', 'Сабат'],
  SHORTWEEKDAYS: ['хцб', 'крс', 'дцг', 'ӕрт', 'цпр', 'мрб', 'сбт'],
  STANDALONESHORTWEEKDAYS: ['Хцб', 'Крс', 'Дцг', 'Ӕрт', 'Цпр', 'Мрб', 'Сбт'],
  NARROWWEEKDAYS: ['Х', 'К', 'Д', 'Ӕ', 'Ц', 'М', 'С'],
  STANDALONENARROWWEEKDAYS: ['Х', 'К', 'Д', 'Ӕ', 'Ц', 'М', 'С'],
  SHORTQUARTERS: ['1-аг кв.', '2-аг кв.', '3-аг кв.', '4-ӕм кв.'],
  QUARTERS: ['1-аг квартал', '2-аг квартал', '3-аг квартал', '4-ӕм квартал'],
  AMPMS: ['ӕмбисбоны размӕ', 'ӕмбисбоны фӕстӕ'],
  DATEFORMATS: ['EEEE, d MMMM, y \'аз\'', 'd MMMM, y \'аз\'', 'dd MMM y \'аз\'', 'dd.MM.yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1}, {0}', '{1}, {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale os_GE.
 */
goog.i18n.DateTimeSymbols_os_GE = goog.i18n.DateTimeSymbols_os;


/**
 * Date/time formatting symbols for locale os_RU.
 */
goog.i18n.DateTimeSymbols_os_RU = goog.i18n.DateTimeSymbols_os;


/**
 * Date/time formatting symbols for locale pa_Arab.
 */
goog.i18n.DateTimeSymbols_pa_Arab = {
  ZERODIGIT: 0x06F0,
  ERAS: ['ايساپورو', 'سں'],
  ERANAMES: ['ايساپورو', 'سں'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئ', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
  STANDALONEMONTHS: ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئ', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
  SHORTMONTHS: ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئ', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
  STANDALONESHORTMONTHS: ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئ', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
  WEEKDAYS: ['اتوار', 'پیر', 'منگل', 'بُدھ', 'جمعرات', 'جمعہ', 'ہفتہ'],
  STANDALONEWEEKDAYS: ['اتوار', 'پیر', 'منگل', 'بُدھ', 'جمعرات', 'جمعہ', 'ہفتہ'],
  SHORTWEEKDAYS: ['اتوار', 'پیر', 'منگل', 'بُدھ', 'جمعرات', 'جمعہ', 'ہفتہ'],
  STANDALONESHORTWEEKDAYS: ['اتوار', 'پیر', 'منگل', 'بُدھ', 'جمعرات', 'جمعہ', 'ہفتہ'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['چوتھاي پہلاں', 'چوتھاي دوجا', 'چوتھاي تيجا', 'چوتھاي چوتھا'],
  QUARTERS: ['چوتھاي پہلاں', 'چوتھاي دوجا', 'چوتھاي تيجا', 'چوتھاي چوتھا'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, dd MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale pa_Arab_PK.
 */
goog.i18n.DateTimeSymbols_pa_Arab_PK = {
  ZERODIGIT: 0x06F0,
  ERAS: ['ايساپورو', 'سں'],
  ERANAMES: ['ايساپورو', 'سں'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئ', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
  STANDALONEMONTHS: ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئ', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
  SHORTMONTHS: ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئ', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
  STANDALONESHORTMONTHS: ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئ', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
  WEEKDAYS: ['اتوار', 'پیر', 'منگل', 'بُدھ', 'جمعرات', 'جمعہ', 'ہفتہ'],
  STANDALONEWEEKDAYS: ['اتوار', 'پیر', 'منگل', 'بُدھ', 'جمعرات', 'جمعہ', 'ہفتہ'],
  SHORTWEEKDAYS: ['اتوار', 'پیر', 'منگل', 'بُدھ', 'جمعرات', 'جمعہ', 'ہفتہ'],
  STANDALONESHORTWEEKDAYS: ['اتوار', 'پیر', 'منگل', 'بُدھ', 'جمعرات', 'جمعہ', 'ہفتہ'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['چوتھاي پہلاں', 'چوتھاي دوجا', 'چوتھاي تيجا', 'چوتھاي چوتھا'],
  QUARTERS: ['چوتھاي پہلاں', 'چوتھاي دوجا', 'چوتھاي تيجا', 'چوتھاي چوتھا'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, dd MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale pa_Guru.
 */
goog.i18n.DateTimeSymbols_pa_Guru = goog.i18n.DateTimeSymbols_pa;


/**
 * Date/time formatting symbols for locale pa_Guru_IN.
 */
goog.i18n.DateTimeSymbols_pa_Guru_IN = goog.i18n.DateTimeSymbols_pa;


/**
 * Date/time formatting symbols for locale pl_PL.
 */
goog.i18n.DateTimeSymbols_pl_PL = goog.i18n.DateTimeSymbols_pl;


/**
 * Date/time formatting symbols for locale ps.
 */
goog.i18n.DateTimeSymbols_ps = {
  ZERODIGIT: 0x06F0,
  ERAS: ['له میلاد وړاندې', 'م.'],
  ERANAMES: ['له میلاد څخه وړاندې', 'له میلاد څخه وروسته'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['جنوري', 'فبروري', 'مارچ', 'اپریل', 'مۍ', 'جون', 'جولای', 'اګست', 'سپتمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
  STANDALONEMONTHS: ['جنوري', 'فبروري', 'مارچ', 'اپریل', 'مۍ', 'جون', 'جولای', 'اګست', 'سپتمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
  SHORTMONTHS: ['جنوري', 'فبروري', 'مارچ', 'اپریل', 'مۍ', 'جون', 'جولای', 'اګست', 'سپتمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
  STANDALONESHORTMONTHS: ['جنوري', 'فبروري', 'مارچ', 'اپریل', 'مۍ', 'جون', 'جولای', 'اګست', 'سپتمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
  WEEKDAYS: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
  STANDALONEWEEKDAYS: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
  SHORTWEEKDAYS: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
  STANDALONESHORTWEEKDAYS: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['لومړۍ ربعه', '۲مه ربعه', '۳مه ربعه', '۴مه ربعه'],
  QUARTERS: ['لومړۍ ربعه', '۲مه ربعه', '۳مه ربعه', '۴مه ربعه'],
  AMPMS: ['غ.م.', 'غ.و.'],
  DATEFORMATS: ['EEEE د y د MMMM d', 'د y د MMMM d', 'y MMM d', 'y/M/d'],
  TIMEFORMATS: ['H:mm:ss (zzzz)', 'H:mm:ss (z)', 'H:mm:ss', 'H:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 5,
  WEEKENDRANGE: [3, 4],
  FIRSTWEEKCUTOFFDAY: 4
};


/**
 * Date/time formatting symbols for locale ps_AF.
 */
goog.i18n.DateTimeSymbols_ps_AF = goog.i18n.DateTimeSymbols_ps;


/**
 * Date/time formatting symbols for locale pt_AO.
 */
goog.i18n.DateTimeSymbols_pt_AO = {
  ERAS: ['a.C.', 'd.C.'],
  ERANAMES: ['antes de Cristo', 'depois de Cristo'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  STANDALONEMONTHS: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  SHORTMONTHS: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  STANDALONESHORTMONTHS: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  WEEKDAYS: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
  SHORTWEEKDAYS: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
  STANDALONESHORTWEEKDAYS: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
  NARROWWEEKDAYS: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.º trimestre', '2.º trimestre', '3.º trimestre', '4.º trimestre'],
  AMPMS: ['da manhã', 'da tarde'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'dd/MM/y', 'dd/MM/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'às\' {0}', '{1} \'às\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale pt_CH.
 */
goog.i18n.DateTimeSymbols_pt_CH = {
  ERAS: ['a.C.', 'd.C.'],
  ERANAMES: ['antes de Cristo', 'depois de Cristo'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  STANDALONEMONTHS: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  SHORTMONTHS: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  STANDALONESHORTMONTHS: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  WEEKDAYS: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
  SHORTWEEKDAYS: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
  STANDALONESHORTWEEKDAYS: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
  NARROWWEEKDAYS: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.º trimestre', '2.º trimestre', '3.º trimestre', '4.º trimestre'],
  AMPMS: ['da manhã', 'da tarde'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'dd/MM/y', 'dd/MM/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'às\' {0}', '{1} \'às\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale pt_CV.
 */
goog.i18n.DateTimeSymbols_pt_CV = {
  ERAS: ['a.C.', 'd.C.'],
  ERANAMES: ['antes de Cristo', 'depois de Cristo'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  STANDALONEMONTHS: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  SHORTMONTHS: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  STANDALONESHORTMONTHS: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  WEEKDAYS: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
  SHORTWEEKDAYS: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
  STANDALONESHORTWEEKDAYS: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
  NARROWWEEKDAYS: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.º trimestre', '2.º trimestre', '3.º trimestre', '4.º trimestre'],
  AMPMS: ['da manhã', 'da tarde'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'dd/MM/y', 'dd/MM/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'às\' {0}', '{1} \'às\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale pt_GQ.
 */
goog.i18n.DateTimeSymbols_pt_GQ = {
  ERAS: ['a.C.', 'd.C.'],
  ERANAMES: ['antes de Cristo', 'depois de Cristo'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  STANDALONEMONTHS: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  SHORTMONTHS: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  STANDALONESHORTMONTHS: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  WEEKDAYS: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
  SHORTWEEKDAYS: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
  STANDALONESHORTWEEKDAYS: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
  NARROWWEEKDAYS: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.º trimestre', '2.º trimestre', '3.º trimestre', '4.º trimestre'],
  AMPMS: ['da manhã', 'da tarde'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'dd/MM/y', 'dd/MM/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'às\' {0}', '{1} \'às\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale pt_GW.
 */
goog.i18n.DateTimeSymbols_pt_GW = {
  ERAS: ['a.C.', 'd.C.'],
  ERANAMES: ['antes de Cristo', 'depois de Cristo'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  STANDALONEMONTHS: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  SHORTMONTHS: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  STANDALONESHORTMONTHS: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  WEEKDAYS: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
  SHORTWEEKDAYS: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
  STANDALONESHORTWEEKDAYS: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
  NARROWWEEKDAYS: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.º trimestre', '2.º trimestre', '3.º trimestre', '4.º trimestre'],
  AMPMS: ['da manhã', 'da tarde'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'dd/MM/y', 'dd/MM/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'às\' {0}', '{1} \'às\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale pt_LU.
 */
goog.i18n.DateTimeSymbols_pt_LU = {
  ERAS: ['a.C.', 'd.C.'],
  ERANAMES: ['antes de Cristo', 'depois de Cristo'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  STANDALONEMONTHS: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  SHORTMONTHS: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  STANDALONESHORTMONTHS: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  WEEKDAYS: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
  SHORTWEEKDAYS: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
  STANDALONESHORTWEEKDAYS: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
  NARROWWEEKDAYS: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.º trimestre', '2.º trimestre', '3.º trimestre', '4.º trimestre'],
  AMPMS: ['da manhã', 'da tarde'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'dd/MM/y', 'dd/MM/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'às\' {0}', '{1} \'às\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale pt_MO.
 */
goog.i18n.DateTimeSymbols_pt_MO = {
  ERAS: ['a.C.', 'd.C.'],
  ERANAMES: ['antes de Cristo', 'depois de Cristo'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  STANDALONEMONTHS: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  SHORTMONTHS: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  STANDALONESHORTMONTHS: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  WEEKDAYS: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
  SHORTWEEKDAYS: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
  STANDALONESHORTWEEKDAYS: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
  NARROWWEEKDAYS: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.º trimestre', '2.º trimestre', '3.º trimestre', '4.º trimestre'],
  AMPMS: ['da manhã', 'da tarde'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'dd/MM/y', 'dd/MM/yy'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} \'às\' {0}', '{1} \'às\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale pt_MZ.
 */
goog.i18n.DateTimeSymbols_pt_MZ = {
  ERAS: ['a.C.', 'd.C.'],
  ERANAMES: ['antes de Cristo', 'depois de Cristo'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  STANDALONEMONTHS: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  SHORTMONTHS: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  STANDALONESHORTMONTHS: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  WEEKDAYS: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
  SHORTWEEKDAYS: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
  STANDALONESHORTWEEKDAYS: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
  NARROWWEEKDAYS: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.º trimestre', '2.º trimestre', '3.º trimestre', '4.º trimestre'],
  AMPMS: ['da manhã', 'da tarde'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'dd/MM/y', 'dd/MM/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'às\' {0}', '{1} \'às\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale pt_ST.
 */
goog.i18n.DateTimeSymbols_pt_ST = {
  ERAS: ['a.C.', 'd.C.'],
  ERANAMES: ['antes de Cristo', 'depois de Cristo'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  STANDALONEMONTHS: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  SHORTMONTHS: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  STANDALONESHORTMONTHS: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  WEEKDAYS: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
  SHORTWEEKDAYS: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
  STANDALONESHORTWEEKDAYS: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
  NARROWWEEKDAYS: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.º trimestre', '2.º trimestre', '3.º trimestre', '4.º trimestre'],
  AMPMS: ['da manhã', 'da tarde'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'dd/MM/y', 'dd/MM/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'às\' {0}', '{1} \'às\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale pt_TL.
 */
goog.i18n.DateTimeSymbols_pt_TL = {
  ERAS: ['a.C.', 'd.C.'],
  ERANAMES: ['antes de Cristo', 'depois de Cristo'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  STANDALONEMONTHS: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  SHORTMONTHS: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  STANDALONESHORTMONTHS: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  WEEKDAYS: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
  STANDALONEWEEKDAYS: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
  SHORTWEEKDAYS: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
  STANDALONESHORTWEEKDAYS: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
  NARROWWEEKDAYS: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  SHORTQUARTERS: ['T1', 'T2', 'T3', 'T4'],
  QUARTERS: ['1.º trimestre', '2.º trimestre', '3.º trimestre', '4.º trimestre'],
  AMPMS: ['da manhã', 'da tarde'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'dd/MM/y', 'dd/MM/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'às\' {0}', '{1} \'às\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale qu.
 */
goog.i18n.DateTimeSymbols_qu = {
  ERAS: ['BCE', 'd.C.'],
  ERANAMES: ['BCE', 'd.C.'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['Qulla puquy', 'Hatun puquy', 'Pauqar waray', 'Ayriwa', 'Aymuray', 'Inti raymi', 'Anta Sitwa', 'Qhapaq Sitwa', 'Uma raymi', 'Kantaray', 'Ayamarqʼa', 'Kapaq Raymi'],
  STANDALONEMONTHS: ['Qulla puquy', 'Hatun puquy', 'Pauqar waray', 'Ayriwa', 'Aymuray', 'Inti raymi', 'Anta Sitwa', 'Qhapaq Sitwa', 'Uma raymi', 'Kantaray', 'Ayamarqʼa', 'Kapaq Raymi'],
  SHORTMONTHS: ['Qul', 'Hat', 'Pau', 'Ayr', 'Aym', 'Int', 'Ant', 'Qha', 'Uma', 'Kan', 'Aya', 'Kap'],
  STANDALONESHORTMONTHS: ['Qul', 'Hat', 'Pau', 'Ayr', 'Aym', 'Int', 'Ant', 'Qha', 'Uma', 'Kan', 'Aya', 'Kap'],
  WEEKDAYS: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  STANDALONEWEEKDAYS: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  SHORTWEEKDAYS: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'],
  STANDALONESHORTWEEKDAYS: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['a.m.', 'p.m.'],
  DATEFORMATS: ['EEEE, d MMMM, y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{0} {1}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale qu_BO.
 */
goog.i18n.DateTimeSymbols_qu_BO = {
  ERAS: ['BCE', 'd.C.'],
  ERANAMES: ['BCE', 'd.C.'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['Qulla puquy', 'Hatun puquy', 'Pauqar waray', 'Ayriwa', 'Aymuray', 'Inti raymi', 'Anta Sitwa', 'Qhapaq Sitwa', 'Uma raymi', 'Kantaray', 'Ayamarqʼa', 'Kapaq Raymi'],
  STANDALONEMONTHS: ['Qulla puquy', 'Hatun puquy', 'Pauqar waray', 'Ayriwa', 'Aymuray', 'Inti raymi', 'Anta Sitwa', 'Qhapaq Sitwa', 'Uma raymi', 'Kantaray', 'Ayamarqʼa', 'Kapaq Raymi'],
  SHORTMONTHS: ['Qul', 'Hat', 'Pau', 'Ayr', 'Aym', 'Int', 'Ant', 'Qha', 'Uma', 'Kan', 'Aya', 'Kap'],
  STANDALONESHORTMONTHS: ['Qul', 'Hat', 'Pau', 'Ayr', 'Aym', 'Int', 'Ant', 'Qha', 'Uma', 'Kan', 'Aya', 'Kap'],
  WEEKDAYS: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  STANDALONEWEEKDAYS: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  SHORTWEEKDAYS: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'],
  STANDALONESHORTWEEKDAYS: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['a.m.', 'p.m.'],
  DATEFORMATS: ['EEEE, d MMMM, y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{0} {1}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale qu_EC.
 */
goog.i18n.DateTimeSymbols_qu_EC = {
  ERAS: ['BCE', 'd.C.'],
  ERANAMES: ['BCE', 'd.C.'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['Qulla puquy', 'Hatun puquy', 'Pauqar waray', 'Ayriwa', 'Aymuray', 'Inti raymi', 'Anta Sitwa', 'Qhapaq Sitwa', 'Uma raymi', 'Kantaray', 'Ayamarqʼa', 'Kapaq Raymi'],
  STANDALONEMONTHS: ['Qulla puquy', 'Hatun puquy', 'Pauqar waray', 'Ayriwa', 'Aymuray', 'Inti raymi', 'Anta Sitwa', 'Qhapaq Sitwa', 'Uma raymi', 'Kantaray', 'Ayamarqʼa', 'Kapaq Raymi'],
  SHORTMONTHS: ['Qul', 'Hat', 'Pau', 'Ayr', 'Aym', 'Int', 'Ant', 'Qha', 'Uma', 'Kan', 'Aya', 'Kap'],
  STANDALONESHORTMONTHS: ['Qul', 'Hat', 'Pau', 'Ayr', 'Aym', 'Int', 'Ant', 'Qha', 'Uma', 'Kan', 'Aya', 'Kap'],
  WEEKDAYS: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  STANDALONEWEEKDAYS: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  SHORTWEEKDAYS: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'],
  STANDALONESHORTWEEKDAYS: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'],
  NARROWWEEKDAYS: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['a.m.', 'p.m.'],
  DATEFORMATS: ['EEEE, d MMMM, y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{0} {1}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale qu_PE.
 */
goog.i18n.DateTimeSymbols_qu_PE = goog.i18n.DateTimeSymbols_qu;


/**
 * Date/time formatting symbols for locale rm.
 */
goog.i18n.DateTimeSymbols_rm = {
  ERAS: ['av. Cr.', 's. Cr.'],
  ERANAMES: ['avant Cristus', 'suenter Cristus'],
  NARROWMONTHS: ['S', 'F', 'M', 'A', 'M', 'Z', 'F', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['S', 'F', 'M', 'A', 'M', 'Z', 'F', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['schaner', 'favrer', 'mars', 'avrigl', 'matg', 'zercladur', 'fanadur', 'avust', 'settember', 'october', 'november', 'december'],
  STANDALONEMONTHS: ['schaner', 'favrer', 'mars', 'avrigl', 'matg', 'zercladur', 'fanadur', 'avust', 'settember', 'october', 'november', 'december'],
  SHORTMONTHS: ['schan.', 'favr.', 'mars', 'avr.', 'matg', 'zercl.', 'fan.', 'avust', 'sett.', 'oct.', 'nov.', 'dec.'],
  STANDALONESHORTMONTHS: ['schan.', 'favr.', 'mars', 'avr.', 'matg', 'zercl.', 'fan.', 'avust', 'sett.', 'oct.', 'nov.', 'dec.'],
  WEEKDAYS: ['dumengia', 'glindesdi', 'mardi', 'mesemna', 'gievgia', 'venderdi', 'sonda'],
  STANDALONEWEEKDAYS: ['dumengia', 'glindesdi', 'mardi', 'mesemna', 'gievgia', 'venderdi', 'sonda'],
  SHORTWEEKDAYS: ['du', 'gli', 'ma', 'me', 'gie', 've', 'so'],
  STANDALONESHORTWEEKDAYS: ['du', 'gli', 'ma', 'me', 'gie', 've', 'so'],
  NARROWWEEKDAYS: ['D', 'G', 'M', 'M', 'G', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'G', 'M', 'M', 'G', 'V', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1. quartal', '2. quartal', '3. quartal', '4. quartal'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, \'ils\' d \'da\' MMMM y', 'd \'da\' MMMM y', 'dd-MM-y', 'dd-MM-yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale rm_CH.
 */
goog.i18n.DateTimeSymbols_rm_CH = goog.i18n.DateTimeSymbols_rm;


/**
 * Date/time formatting symbols for locale rn.
 */
goog.i18n.DateTimeSymbols_rn = {
  ERAS: ['Mb.Y.', 'Ny.Y'],
  ERANAMES: ['Mbere ya Yezu', 'Nyuma ya Yezu'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['Nzero', 'Ruhuhuma', 'Ntwarante', 'Ndamukiza', 'Rusama', 'Ruheshi', 'Mukakaro', 'Nyandagaro', 'Nyakanga', 'Gitugutu', 'Munyonyo', 'Kigarama'],
  STANDALONEMONTHS: ['Nzero', 'Ruhuhuma', 'Ntwarante', 'Ndamukiza', 'Rusama', 'Ruheshi', 'Mukakaro', 'Nyandagaro', 'Nyakanga', 'Gitugutu', 'Munyonyo', 'Kigarama'],
  SHORTMONTHS: ['Mut.', 'Gas.', 'Wer.', 'Mat.', 'Gic.', 'Kam.', 'Nya.', 'Kan.', 'Nze.', 'Ukw.', 'Ugu.', 'Uku.'],
  STANDALONESHORTMONTHS: ['Mut.', 'Gas.', 'Wer.', 'Mat.', 'Gic.', 'Kam.', 'Nya.', 'Kan.', 'Nze.', 'Ukw.', 'Ugu.', 'Uku.'],
  WEEKDAYS: ['Ku w’indwi', 'Ku wa mbere', 'Ku wa kabiri', 'Ku wa gatatu', 'Ku wa kane', 'Ku wa gatanu', 'Ku wa gatandatu'],
  STANDALONEWEEKDAYS: ['Ku w’indwi', 'Ku wa mbere', 'Ku wa kabiri', 'Ku wa gatatu', 'Ku wa kane', 'Ku wa gatanu', 'Ku wa gatandatu'],
  SHORTWEEKDAYS: ['cu.', 'mbe.', 'kab.', 'gtu.', 'kan.', 'gnu.', 'gnd.'],
  STANDALONESHORTWEEKDAYS: ['cu.', 'mbe.', 'kab.', 'gtu.', 'kan.', 'gnu.', 'gnd.'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['I1', 'I2', 'I3', 'I4'],
  QUARTERS: ['Igice ca mbere c’umwaka', 'Igice ca kabiri c’umwaka', 'Igice ca gatatu c’umwaka', 'Igice ca kane c’umwaka'],
  AMPMS: ['Z.MU.', 'Z.MW.'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'd/M/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale rn_BI.
 */
goog.i18n.DateTimeSymbols_rn_BI = goog.i18n.DateTimeSymbols_rn;


/**
 * Date/time formatting symbols for locale ro_MD.
 */
goog.i18n.DateTimeSymbols_ro_MD = {
  ERAS: ['î.Hr.', 'd.Hr.'],
  ERANAMES: ['înainte de Hristos', 'după Hristos'],
  NARROWMONTHS: ['I', 'F', 'M', 'A', 'M', 'I', 'I', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['I', 'F', 'M', 'A', 'M', 'I', 'I', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'],
  STANDALONEMONTHS: ['ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie', 'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie'],
  SHORTMONTHS: ['ian.', 'feb.', 'mar.', 'apr.', 'mai', 'iun.', 'iul.', 'aug.', 'sept.', 'oct.', 'nov.', 'dec.'],
  STANDALONESHORTMONTHS: ['ian.', 'feb.', 'mar.', 'apr.', 'mai', 'iun.', 'iul.', 'aug.', 'sept.', 'oct.', 'nov.', 'dec.'],
  WEEKDAYS: ['duminică', 'luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă'],
  STANDALONEWEEKDAYS: ['duminică', 'luni', 'marți', 'miercuri', 'joi', 'vineri', 'sâmbătă'],
  SHORTWEEKDAYS: ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'],
  STANDALONESHORTWEEKDAYS: ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'],
  NARROWWEEKDAYS: ['D', 'L', 'Ma', 'Mi', 'J', 'V', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'L', 'Ma', 'Mi', 'J', 'V', 'S'],
  SHORTQUARTERS: ['trim. 1', 'trim. 2', 'trim. 3', 'trim. 4'],
  QUARTERS: ['trimestrul 1', 'trimestrul 2', 'trimestrul 3', 'trimestrul 4'],
  AMPMS: ['a.m.', 'p.m.'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd.MM.y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1}, {0}', '{1}, {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale ro_RO.
 */
goog.i18n.DateTimeSymbols_ro_RO = goog.i18n.DateTimeSymbols_ro;


/**
 * Date/time formatting symbols for locale rof.
 */
goog.i18n.DateTimeSymbols_rof = {
  ERAS: ['KM', 'BM'],
  ERANAMES: ['Kabla ya Mayesu', 'Baada ya Mayesu'],
  NARROWMONTHS: ['K', 'K', 'K', 'K', 'T', 'S', 'S', 'N', 'T', 'I', 'I', 'I'],
  STANDALONENARROWMONTHS: ['K', 'K', 'K', 'K', 'T', 'S', 'S', 'N', 'T', 'I', 'I', 'I'],
  MONTHS: ['Mweri wa kwanza', 'Mweri wa kaili', 'Mweri wa katatu', 'Mweri wa kaana', 'Mweri wa tanu', 'Mweri wa sita', 'Mweri wa saba', 'Mweri wa nane', 'Mweri wa tisa', 'Mweri wa ikumi', 'Mweri wa ikumi na moja', 'Mweri wa ikumi na mbili'],
  STANDALONEMONTHS: ['Mweri wa kwanza', 'Mweri wa kaili', 'Mweri wa katatu', 'Mweri wa kaana', 'Mweri wa tanu', 'Mweri wa sita', 'Mweri wa saba', 'Mweri wa nane', 'Mweri wa tisa', 'Mweri wa ikumi', 'Mweri wa ikumi na moja', 'Mweri wa ikumi na mbili'],
  SHORTMONTHS: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'],
  STANDALONESHORTMONTHS: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'],
  WEEKDAYS: ['Ijumapili', 'Ijumatatu', 'Ijumanne', 'Ijumatano', 'Alhamisi', 'Ijumaa', 'Ijumamosi'],
  STANDALONEWEEKDAYS: ['Ijumapili', 'Ijumatatu', 'Ijumanne', 'Ijumatano', 'Alhamisi', 'Ijumaa', 'Ijumamosi'],
  SHORTWEEKDAYS: ['Ijp', 'Ijt', 'Ijn', 'Ijtn', 'Alh', 'Iju', 'Ijm'],
  STANDALONESHORTWEEKDAYS: ['Ijp', 'Ijt', 'Ijn', 'Ijtn', 'Alh', 'Iju', 'Ijm'],
  NARROWWEEKDAYS: ['2', '3', '4', '5', '6', '7', '1'],
  STANDALONENARROWWEEKDAYS: ['2', '3', '4', '5', '6', '7', '1'],
  SHORTQUARTERS: ['R1', 'R2', 'R3', 'R4'],
  QUARTERS: ['Robo ya kwanza', 'Robo ya kaili', 'Robo ya katatu', 'Robo ya kaana'],
  AMPMS: ['kang’ama', 'kingoto'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale rof_TZ.
 */
goog.i18n.DateTimeSymbols_rof_TZ = goog.i18n.DateTimeSymbols_rof;


/**
 * Date/time formatting symbols for locale ru_BY.
 */
goog.i18n.DateTimeSymbols_ru_BY = goog.i18n.DateTimeSymbols_ru;


/**
 * Date/time formatting symbols for locale ru_KG.
 */
goog.i18n.DateTimeSymbols_ru_KG = goog.i18n.DateTimeSymbols_ru;


/**
 * Date/time formatting symbols for locale ru_KZ.
 */
goog.i18n.DateTimeSymbols_ru_KZ = goog.i18n.DateTimeSymbols_ru;


/**
 * Date/time formatting symbols for locale ru_MD.
 */
goog.i18n.DateTimeSymbols_ru_MD = goog.i18n.DateTimeSymbols_ru;


/**
 * Date/time formatting symbols for locale ru_RU.
 */
goog.i18n.DateTimeSymbols_ru_RU = goog.i18n.DateTimeSymbols_ru;


/**
 * Date/time formatting symbols for locale ru_UA.
 */
goog.i18n.DateTimeSymbols_ru_UA = {
  ERAS: ['до н. э.', 'н. э.'],
  ERANAMES: ['до Рождества Христова', 'от Рождества Христова'],
  NARROWMONTHS: ['Я', 'Ф', 'М', 'А', 'М', 'И', 'И', 'А', 'С', 'О', 'Н', 'Д'],
  STANDALONENARROWMONTHS: ['Я', 'Ф', 'М', 'А', 'М', 'И', 'И', 'А', 'С', 'О', 'Н', 'Д'],
  MONTHS: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
  STANDALONEMONTHS: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
  SHORTMONTHS: ['янв.', 'февр.', 'мар.', 'апр.', 'мая', 'июн.', 'июл.', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'],
  STANDALONESHORTMONTHS: ['янв.', 'февр.', 'март', 'апр.', 'май', 'июнь', 'июль', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'],
  WEEKDAYS: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
  STANDALONEWEEKDAYS: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
  SHORTWEEKDAYS: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
  STANDALONESHORTWEEKDAYS: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
  NARROWWEEKDAYS: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
  STANDALONENARROWWEEKDAYS: ['В', 'П', 'В', 'С', 'Ч', 'П', 'С'],
  SHORTQUARTERS: ['1-й кв.', '2-й кв.', '3-й кв.', '4-й кв.'],
  QUARTERS: ['1-й квартал', '2-й квартал', '3-й квартал', '4-й квартал'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y \'г\'.', 'd MMMM y \'г\'.', 'd MMM y \'г\'.', 'dd.MM.y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1}, {0}', '{1}, {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale rw.
 */
goog.i18n.DateTimeSymbols_rw = {
  ERAS: ['BCE', 'CE'],
  ERANAMES: ['BCE', 'CE'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['Mutarama', 'Gashyantare', 'Werurwe', 'Mata', 'Gicuransi', 'Kamena', 'Nyakanga', 'Kanama', 'Nzeli', 'Ukwakira', 'Ugushyingo', 'Ukuboza'],
  STANDALONEMONTHS: ['Mutarama', 'Gashyantare', 'Werurwe', 'Mata', 'Gicuransi', 'Kamena', 'Nyakanga', 'Kanama', 'Nzeli', 'Ukwakira', 'Ugushyingo', 'Ukuboza'],
  SHORTMONTHS: ['mut.', 'gas.', 'wer.', 'mat.', 'gic.', 'kam.', 'nya.', 'kan.', 'nze.', 'ukw.', 'ugu.', 'uku.'],
  STANDALONESHORTMONTHS: ['mut.', 'gas.', 'wer.', 'mat.', 'gic.', 'kam.', 'nya.', 'kan.', 'nze.', 'ukw.', 'ugu.', 'uku.'],
  WEEKDAYS: ['Ku cyumweru', 'Kuwa mbere', 'Kuwa kabiri', 'Kuwa gatatu', 'Kuwa kane', 'Kuwa gatanu', 'Kuwa gatandatu'],
  STANDALONEWEEKDAYS: ['Ku cyumweru', 'Kuwa mbere', 'Kuwa kabiri', 'Kuwa gatatu', 'Kuwa kane', 'Kuwa gatanu', 'Kuwa gatandatu'],
  SHORTWEEKDAYS: ['cyu.', 'mbe.', 'kab.', 'gtu.', 'kan.', 'gnu.', 'gnd.'],
  STANDALONESHORTWEEKDAYS: ['cyu.', 'mbe.', 'kab.', 'gtu.', 'kan.', 'gnu.', 'gnd.'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['I1', 'I2', 'I3', 'I4'],
  QUARTERS: ['igihembwe cya mbere', 'igihembwe cya kabiri', 'igihembwe cya gatatu', 'igihembwe cya kane'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['y MMMM d, EEEE', 'y MMMM d', 'y MMM d', 'y-MM-dd'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale rw_RW.
 */
goog.i18n.DateTimeSymbols_rw_RW = goog.i18n.DateTimeSymbols_rw;


/**
 * Date/time formatting symbols for locale rwk.
 */
goog.i18n.DateTimeSymbols_rwk = {
  ERAS: ['KK', 'BK'],
  ERANAMES: ['Kabla ya Kristu', 'Baada ya Kristu'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['Januari', 'Februari', 'Machi', 'Aprilyi', 'Mei', 'Junyi', 'Julyai', 'Agusti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba'],
  STANDALONEMONTHS: ['Januari', 'Februari', 'Machi', 'Aprilyi', 'Mei', 'Junyi', 'Julyai', 'Agusti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Des'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Des'],
  WEEKDAYS: ['Jumapilyi', 'Jumatatuu', 'Jumanne', 'Jumatanu', 'Alhamisi', 'Ijumaa', 'Jumamosi'],
  STANDALONEWEEKDAYS: ['Jumapilyi', 'Jumatatuu', 'Jumanne', 'Jumatanu', 'Alhamisi', 'Ijumaa', 'Jumamosi'],
  SHORTWEEKDAYS: ['Jpi', 'Jtt', 'Jnn', 'Jtn', 'Alh', 'Iju', 'Jmo'],
  STANDALONESHORTWEEKDAYS: ['Jpi', 'Jtt', 'Jnn', 'Jtn', 'Alh', 'Iju', 'Jmo'],
  NARROWWEEKDAYS: ['J', 'J', 'J', 'J', 'A', 'I', 'J'],
  STANDALONENARROWWEEKDAYS: ['J', 'J', 'J', 'J', 'A', 'I', 'J'],
  SHORTQUARTERS: ['R1', 'R2', 'R3', 'R4'],
  QUARTERS: ['Robo 1', 'Robo 2', 'Robo 3', 'Robo 4'],
  AMPMS: ['utuko', 'kyiukonyi'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale rwk_TZ.
 */
goog.i18n.DateTimeSymbols_rwk_TZ = goog.i18n.DateTimeSymbols_rwk;


/**
 * Date/time formatting symbols for locale sah.
 */
goog.i18n.DateTimeSymbols_sah = {
  ERAS: ['б. э. и.', 'б. э'],
  ERANAMES: ['б. э. и.', 'б. э'],
  NARROWMONTHS: ['Т', 'О', 'К', 'М', 'Ы', 'Б', 'О', 'А', 'Б', 'А', 'С', 'А'],
  STANDALONENARROWMONTHS: ['Т', 'О', 'К', 'М', 'Ы', 'Б', 'О', 'А', 'Б', 'А', 'С', 'А'],
  MONTHS: ['Тохсунньу', 'Олунньу', 'Кулун тутар', 'Муус устар', 'Ыам ыйын', 'Бэс ыйын', 'От ыйын', 'Атырдьых ыйын', 'Балаҕан ыйын', 'Алтынньы', 'Сэтинньи', 'ахсынньы'],
  STANDALONEMONTHS: ['тохсунньу', 'олунньу', 'кулун тутар', 'муус устар', 'ыам ыйа', 'бэс ыйа', 'от ыйа', 'атырдьых ыйа', 'балаҕан ыйа', 'алтынньы', 'сэтинньи', 'ахсынньы'],
  SHORTMONTHS: ['Тохс', 'Олун', 'Клн', 'Мсу', 'Ыам', 'Бэс', 'Отй', 'Атр', 'Блҕ', 'Алт', 'Сэт', 'Ахс'],
  STANDALONESHORTMONTHS: ['Тохс', 'Олун', 'Клн', 'Мсу', 'Ыам', 'Бэс', 'Отй', 'Атр', 'Блҕ', 'Алт', 'Сэт', 'Ахс'],
  WEEKDAYS: ['баскыһыанньа', 'бэнидиэнньик', 'оптуорунньук', 'сэрэдэ', 'чэппиэр', 'Бээтиҥсэ', 'субуота'],
  STANDALONEWEEKDAYS: ['баскыһыанньа', 'бэнидиэнньик', 'оптуорунньук', 'сэрэдэ', 'чэппиэр', 'Бээтиҥсэ', 'субуота'],
  SHORTWEEKDAYS: ['бс', 'бн', 'оп', 'сэ', 'чп', 'бэ', 'сб'],
  STANDALONESHORTWEEKDAYS: ['бс', 'бн', 'оп', 'сэ', 'чп', 'бэ', 'сб'],
  NARROWWEEKDAYS: ['Б', 'Б', 'О', 'С', 'Ч', 'Б', 'С'],
  STANDALONENARROWWEEKDAYS: ['Б', 'Б', 'О', 'С', 'Ч', 'Б', 'С'],
  SHORTQUARTERS: ['1-кы кб', '2-с кб', '3-с кб', '4-с кб'],
  QUARTERS: ['1-кы кыбаартал', '2-с кыбаартал', '3-с кыбаартал', '4-с кыбаартал'],
  AMPMS: ['ЭИ', 'ЭК'],
  DATEFORMATS: ['y \'сыл\' MMMM d \'күнэ\', EEEE', 'y, MMMM d', 'y, MMM d', 'yy/M/d'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale sah_RU.
 */
goog.i18n.DateTimeSymbols_sah_RU = goog.i18n.DateTimeSymbols_sah;


/**
 * Date/time formatting symbols for locale saq.
 */
goog.i18n.DateTimeSymbols_saq = {
  ERAS: ['KK', 'BK'],
  ERANAMES: ['Kabla ya Christo', 'Baada ya Christo'],
  NARROWMONTHS: ['O', 'W', 'O', 'O', 'I', 'I', 'S', 'I', 'S', 'T', 'T', 'T'],
  STANDALONENARROWMONTHS: ['O', 'W', 'O', 'O', 'I', 'I', 'S', 'I', 'S', 'T', 'T', 'T'],
  MONTHS: ['Lapa le obo', 'Lapa le waare', 'Lapa le okuni', 'Lapa le ong’wan', 'Lapa le imet', 'Lapa le ile', 'Lapa le sapa', 'Lapa le isiet', 'Lapa le saal', 'Lapa le tomon', 'Lapa le tomon obo', 'Lapa le tomon waare'],
  STANDALONEMONTHS: ['Lapa le obo', 'Lapa le waare', 'Lapa le okuni', 'Lapa le ong’wan', 'Lapa le imet', 'Lapa le ile', 'Lapa le sapa', 'Lapa le isiet', 'Lapa le saal', 'Lapa le tomon', 'Lapa le tomon obo', 'Lapa le tomon waare'],
  SHORTMONTHS: ['Obo', 'Waa', 'Oku', 'Ong', 'Ime', 'Ile', 'Sap', 'Isi', 'Saa', 'Tom', 'Tob', 'Tow'],
  STANDALONESHORTMONTHS: ['Obo', 'Waa', 'Oku', 'Ong', 'Ime', 'Ile', 'Sap', 'Isi', 'Saa', 'Tom', 'Tob', 'Tow'],
  WEEKDAYS: ['Mderot ee are', 'Mderot ee kuni', 'Mderot ee ong’wan', 'Mderot ee inet', 'Mderot ee ile', 'Mderot ee sapa', 'Mderot ee kwe'],
  STANDALONEWEEKDAYS: ['Mderot ee are', 'Mderot ee kuni', 'Mderot ee ong’wan', 'Mderot ee inet', 'Mderot ee ile', 'Mderot ee sapa', 'Mderot ee kwe'],
  SHORTWEEKDAYS: ['Are', 'Kun', 'Ong', 'Ine', 'Ile', 'Sap', 'Kwe'],
  STANDALONESHORTWEEKDAYS: ['Are', 'Kun', 'Ong', 'Ine', 'Ile', 'Sap', 'Kwe'],
  NARROWWEEKDAYS: ['A', 'K', 'O', 'I', 'I', 'S', 'K'],
  STANDALONENARROWWEEKDAYS: ['A', 'K', 'O', 'I', 'I', 'S', 'K'],
  SHORTQUARTERS: ['R1', 'R2', 'R3', 'R4'],
  QUARTERS: ['Robo 1', 'Robo 2', 'Robo 3', 'Robo 4'],
  AMPMS: ['Tesiran', 'Teipa'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale saq_KE.
 */
goog.i18n.DateTimeSymbols_saq_KE = goog.i18n.DateTimeSymbols_saq;


/**
 * Date/time formatting symbols for locale sbp.
 */
goog.i18n.DateTimeSymbols_sbp = {
  ERAS: ['AK', 'PK'],
  ERANAMES: ['Ashanali uKilisito', 'Pamwandi ya Kilisto'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['Mupalangulwa', 'Mwitope', 'Mushende', 'Munyi', 'Mushende Magali', 'Mujimbi', 'Mushipepo', 'Mupuguto', 'Munyense', 'Mokhu', 'Musongandembwe', 'Muhaano'],
  STANDALONEMONTHS: ['Mupalangulwa', 'Mwitope', 'Mushende', 'Munyi', 'Mushende Magali', 'Mujimbi', 'Mushipepo', 'Mupuguto', 'Munyense', 'Mokhu', 'Musongandembwe', 'Muhaano'],
  SHORTMONTHS: ['Mup', 'Mwi', 'Msh', 'Mun', 'Mag', 'Muj', 'Msp', 'Mpg', 'Mye', 'Mok', 'Mus', 'Muh'],
  STANDALONESHORTMONTHS: ['Mup', 'Mwi', 'Msh', 'Mun', 'Mag', 'Muj', 'Msp', 'Mpg', 'Mye', 'Mok', 'Mus', 'Muh'],
  WEEKDAYS: ['Mulungu', 'Jumatatu', 'Jumanne', 'Jumatano', 'Alahamisi', 'Ijumaa', 'Jumamosi'],
  STANDALONEWEEKDAYS: ['Mulungu', 'Jumatatu', 'Jumanne', 'Jumatano', 'Alahamisi', 'Ijumaa', 'Jumamosi'],
  SHORTWEEKDAYS: ['Mul', 'Jtt', 'Jnn', 'Jtn', 'Alh', 'Iju', 'Jmo'],
  STANDALONESHORTWEEKDAYS: ['Mul', 'Jtt', 'Jnn', 'Jtn', 'Alh', 'Iju', 'Jmo'],
  NARROWWEEKDAYS: ['M', 'J', 'J', 'J', 'A', 'I', 'J'],
  STANDALONENARROWWEEKDAYS: ['M', 'J', 'J', 'J', 'A', 'I', 'J'],
  SHORTQUARTERS: ['L1', 'L2', 'L3', 'L4'],
  QUARTERS: ['Lobo 1', 'Lobo 2', 'Lobo 3', 'Lobo 4'],
  AMPMS: ['Lwamilawu', 'Pashamihe'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale sbp_TZ.
 */
goog.i18n.DateTimeSymbols_sbp_TZ = goog.i18n.DateTimeSymbols_sbp;


/**
 * Date/time formatting symbols for locale se.
 */
goog.i18n.DateTimeSymbols_se = {
  ERAS: ['o.Kr.', 'm.Kr.'],
  ERANAMES: ['ovdal Kristtusa', 'maŋŋel Kristtusa'],
  NARROWMONTHS: ['O', 'G', 'N', 'C', 'M', 'G', 'S', 'B', 'Č', 'G', 'S', 'J'],
  STANDALONENARROWMONTHS: ['O', 'G', 'N', 'C', 'M', 'G', 'S', 'B', 'Č', 'G', 'S', 'J'],
  MONTHS: ['ođđajagemánnu', 'guovvamánnu', 'njukčamánnu', 'cuoŋománnu', 'miessemánnu', 'geassemánnu', 'suoidnemánnu', 'borgemánnu', 'čakčamánnu', 'golggotmánnu', 'skábmamánnu', 'juovlamánnu'],
  STANDALONEMONTHS: ['ođđajagemánnu', 'guovvamánnu', 'njukčamánnu', 'cuoŋománnu', 'miessemánnu', 'geassemánnu', 'suoidnemánnu', 'borgemánnu', 'čakčamánnu', 'golggotmánnu', 'skábmamánnu', 'juovlamánnu'],
  SHORTMONTHS: ['ođđj', 'guov', 'njuk', 'cuo', 'mies', 'geas', 'suoi', 'borg', 'čakč', 'golg', 'skáb', 'juov'],
  STANDALONESHORTMONTHS: ['ođđj', 'guov', 'njuk', 'cuo', 'mies', 'geas', 'suoi', 'borg', 'čakč', 'golg', 'skáb', 'juov'],
  WEEKDAYS: ['sotnabeaivi', 'vuossárga', 'maŋŋebárga', 'gaskavahkku', 'duorasdat', 'bearjadat', 'lávvardat'],
  STANDALONEWEEKDAYS: ['sotnabeaivi', 'vuossárga', 'maŋŋebárga', 'gaskavahkku', 'duorasdat', 'bearjadat', 'lávvardat'],
  SHORTWEEKDAYS: ['sotn', 'vuos', 'maŋ', 'gask', 'duor', 'bear', 'láv'],
  STANDALONESHORTWEEKDAYS: ['sotn', 'vuos', 'maŋ', 'gask', 'duor', 'bear', 'láv'],
  NARROWWEEKDAYS: ['S', 'V', 'M', 'G', 'D', 'B', 'L'],
  STANDALONENARROWWEEKDAYS: ['S', 'V', 'M', 'G', 'D', 'B', 'L'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['iđitbeaivet', 'eahketbeaivet'],
  DATEFORMATS: ['y MMMM d, EEEE', 'y MMMM d', 'y MMM d', 'y-MM-dd'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale se_FI.
 */
goog.i18n.DateTimeSymbols_se_FI = {
  ERAS: ['o.Kr.', 'm.Kr.'],
  ERANAMES: ['ovdal Kristtusa', 'maŋŋel Kristtusa'],
  NARROWMONTHS: ['O', 'G', 'N', 'C', 'M', 'G', 'S', 'B', 'Č', 'G', 'S', 'J'],
  STANDALONENARROWMONTHS: ['O', 'G', 'N', 'C', 'M', 'G', 'S', 'B', 'Č', 'G', 'S', 'J'],
  MONTHS: ['ođđajagemánnu', 'guovvamánnu', 'njukčamánnu', 'cuoŋománnu', 'miessemánnu', 'geassemánnu', 'suoidnemánnu', 'borgemánnu', 'čakčamánnu', 'golggotmánnu', 'skábmamánnu', 'juovlamánnu'],
  STANDALONEMONTHS: ['ođđajagemánnu', 'guovvamánnu', 'njukčamánnu', 'cuoŋománnu', 'miessemánnu', 'geassemánnu', 'suoidnemánnu', 'borgemánnu', 'čakčamánnu', 'golggotmánnu', 'skábmamánnu', 'juovlamánnu'],
  SHORTMONTHS: ['ođđj', 'guov', 'njuk', 'cuo', 'mies', 'geas', 'suoi', 'borg', 'čakč', 'golg', 'skáb', 'juov'],
  STANDALONESHORTMONTHS: ['ođđj', 'guov', 'njuk', 'cuo', 'mies', 'geas', 'suoi', 'borg', 'čakč', 'golg', 'skáb', 'juov'],
  WEEKDAYS: ['sotnabeaivi', 'vuossárgga', 'maŋŋebárgga', 'gaskavahku', 'duorastaga', 'bearjadaga', 'lávvardaga'],
  STANDALONEWEEKDAYS: ['sotnabeaivi', 'vuossárga', 'maŋŋebárga', 'gaskavahkku', 'duorasdat', 'bearjadat', 'lávvardat'],
  SHORTWEEKDAYS: ['sotn', 'vuos', 'maŋ', 'gask', 'duor', 'bear', 'láv'],
  STANDALONESHORTWEEKDAYS: ['sotn', 'vuos', 'maŋ', 'gask', 'duor', 'bear', 'láv'],
  NARROWWEEKDAYS: ['S', 'M', 'D', 'G', 'D', 'B', 'L'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'D', 'G', 'D', 'B', 'L'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['iđitbeaivet', 'eahketbeaivet'],
  DATEFORMATS: ['y MMMM d, EEEE', 'y MMMM d', 'y MMM d', 'y-MM-dd'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale se_NO.
 */
goog.i18n.DateTimeSymbols_se_NO = goog.i18n.DateTimeSymbols_se;


/**
 * Date/time formatting symbols for locale se_SE.
 */
goog.i18n.DateTimeSymbols_se_SE = goog.i18n.DateTimeSymbols_se;


/**
 * Date/time formatting symbols for locale seh.
 */
goog.i18n.DateTimeSymbols_seh = {
  ERAS: ['AC', 'AD'],
  ERANAMES: ['Antes de Cristo', 'Anno Domini'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['Janeiro', 'Fevreiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Augusto', 'Setembro', 'Otubro', 'Novembro', 'Decembro'],
  STANDALONEMONTHS: ['Janeiro', 'Fevreiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Augusto', 'Setembro', 'Otubro', 'Novembro', 'Decembro'],
  SHORTMONTHS: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Aug', 'Set', 'Otu', 'Nov', 'Dec'],
  STANDALONESHORTMONTHS: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Aug', 'Set', 'Otu', 'Nov', 'Dec'],
  WEEKDAYS: ['Dimingu', 'Chiposi', 'Chipiri', 'Chitatu', 'Chinai', 'Chishanu', 'Sabudu'],
  STANDALONEWEEKDAYS: ['Dimingu', 'Chiposi', 'Chipiri', 'Chitatu', 'Chinai', 'Chishanu', 'Sabudu'],
  SHORTWEEKDAYS: ['Dim', 'Pos', 'Pir', 'Tat', 'Nai', 'Sha', 'Sab'],
  STANDALONESHORTWEEKDAYS: ['Dim', 'Pos', 'Pir', 'Tat', 'Nai', 'Sha', 'Sab'],
  NARROWWEEKDAYS: ['D', 'P', 'C', 'T', 'N', 'S', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'P', 'C', 'T', 'N', 'S', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d \'de\' MMMM \'de\' y', 'd \'de\' MMMM \'de\' y', 'd \'de\' MMM \'de\' y', 'd/M/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale seh_MZ.
 */
goog.i18n.DateTimeSymbols_seh_MZ = goog.i18n.DateTimeSymbols_seh;


/**
 * Date/time formatting symbols for locale ses.
 */
goog.i18n.DateTimeSymbols_ses = {
  ERAS: ['IJ', 'IZ'],
  ERANAMES: ['Isaa jine', 'Isaa zamanoo'],
  NARROWMONTHS: ['Ž', 'F', 'M', 'A', 'M', 'Ž', 'Ž', 'U', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['Ž', 'F', 'M', 'A', 'M', 'Ž', 'Ž', 'U', 'S', 'O', 'N', 'D'],
  MONTHS: ['Žanwiye', 'Feewiriye', 'Marsi', 'Awiril', 'Me', 'Žuweŋ', 'Žuyye', 'Ut', 'Sektanbur', 'Oktoobur', 'Noowanbur', 'Deesanbur'],
  STANDALONEMONTHS: ['Žanwiye', 'Feewiriye', 'Marsi', 'Awiril', 'Me', 'Žuweŋ', 'Žuyye', 'Ut', 'Sektanbur', 'Oktoobur', 'Noowanbur', 'Deesanbur'],
  SHORTMONTHS: ['Žan', 'Fee', 'Mar', 'Awi', 'Me', 'Žuw', 'Žuy', 'Ut', 'Sek', 'Okt', 'Noo', 'Dee'],
  STANDALONESHORTMONTHS: ['Žan', 'Fee', 'Mar', 'Awi', 'Me', 'Žuw', 'Žuy', 'Ut', 'Sek', 'Okt', 'Noo', 'Dee'],
  WEEKDAYS: ['Alhadi', 'Atinni', 'Atalaata', 'Alarba', 'Alhamiisa', 'Alzuma', 'Asibti'],
  STANDALONEWEEKDAYS: ['Alhadi', 'Atinni', 'Atalaata', 'Alarba', 'Alhamiisa', 'Alzuma', 'Asibti'],
  SHORTWEEKDAYS: ['Alh', 'Ati', 'Ata', 'Ala', 'Alm', 'Alz', 'Asi'],
  STANDALONESHORTWEEKDAYS: ['Alh', 'Ati', 'Ata', 'Ala', 'Alm', 'Alz', 'Asi'],
  NARROWWEEKDAYS: ['H', 'T', 'T', 'L', 'L', 'L', 'S'],
  STANDALONENARROWWEEKDAYS: ['H', 'T', 'T', 'L', 'L', 'L', 'S'],
  SHORTQUARTERS: ['A1', 'A2', 'A3', 'A4'],
  QUARTERS: ['Arrubu 1', 'Arrubu 2', 'Arrubu 3', 'Arrubu 4'],
  AMPMS: ['Adduha', 'Aluula'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM, y', 'd/M/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale ses_ML.
 */
goog.i18n.DateTimeSymbols_ses_ML = goog.i18n.DateTimeSymbols_ses;


/**
 * Date/time formatting symbols for locale sg.
 */
goog.i18n.DateTimeSymbols_sg = {
  ERAS: ['KnK', 'NpK'],
  ERANAMES: ['Kôzo na Krîstu', 'Na pekô tî Krîstu'],
  NARROWMONTHS: ['N', 'F', 'M', 'N', 'B', 'F', 'L', 'K', 'M', 'N', 'N', 'K'],
  STANDALONENARROWMONTHS: ['N', 'F', 'M', 'N', 'B', 'F', 'L', 'K', 'M', 'N', 'N', 'K'],
  MONTHS: ['Nyenye', 'Fulundïgi', 'Mbängü', 'Ngubùe', 'Bêläwü', 'Föndo', 'Lengua', 'Kükürü', 'Mvuka', 'Ngberere', 'Nabändüru', 'Kakauka'],
  STANDALONEMONTHS: ['Nyenye', 'Fulundïgi', 'Mbängü', 'Ngubùe', 'Bêläwü', 'Föndo', 'Lengua', 'Kükürü', 'Mvuka', 'Ngberere', 'Nabändüru', 'Kakauka'],
  SHORTMONTHS: ['Nye', 'Ful', 'Mbä', 'Ngu', 'Bêl', 'Fön', 'Len', 'Kük', 'Mvu', 'Ngb', 'Nab', 'Kak'],
  STANDALONESHORTMONTHS: ['Nye', 'Ful', 'Mbä', 'Ngu', 'Bêl', 'Fön', 'Len', 'Kük', 'Mvu', 'Ngb', 'Nab', 'Kak'],
  WEEKDAYS: ['Bikua-ôko', 'Bïkua-ûse', 'Bïkua-ptâ', 'Bïkua-usïö', 'Bïkua-okü', 'Lâpôsö', 'Lâyenga'],
  STANDALONEWEEKDAYS: ['Bikua-ôko', 'Bïkua-ûse', 'Bïkua-ptâ', 'Bïkua-usïö', 'Bïkua-okü', 'Lâpôsö', 'Lâyenga'],
  SHORTWEEKDAYS: ['Bk1', 'Bk2', 'Bk3', 'Bk4', 'Bk5', 'Lâp', 'Lây'],
  STANDALONESHORTWEEKDAYS: ['Bk1', 'Bk2', 'Bk3', 'Bk4', 'Bk5', 'Lâp', 'Lây'],
  NARROWWEEKDAYS: ['K', 'S', 'T', 'S', 'K', 'P', 'Y'],
  STANDALONENARROWWEEKDAYS: ['K', 'S', 'T', 'S', 'K', 'P', 'Y'],
  SHORTQUARTERS: ['F4–1', 'F4–2', 'F4–3', 'F4–4'],
  QUARTERS: ['Fângbisïö ôko', 'Fângbisïö ûse', 'Fângbisïö otâ', 'Fângbisïö usïö'],
  AMPMS: ['ND', 'LK'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM, y', 'd/M/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale sg_CF.
 */
goog.i18n.DateTimeSymbols_sg_CF = goog.i18n.DateTimeSymbols_sg;


/**
 * Date/time formatting symbols for locale shi.
 */
goog.i18n.DateTimeSymbols_shi = {
  ERAS: ['ⴷⴰⵄ', 'ⴷⴼⵄ'],
  ERANAMES: ['ⴷⴰⵜ ⵏ ⵄⵉⵙⴰ', 'ⴷⴼⴼⵉⵔ ⵏ ⵄⵉⵙⴰ'],
  NARROWMONTHS: ['ⵉ', 'ⴱ', 'ⵎ', 'ⵉ', 'ⵎ', 'ⵢ', 'ⵢ', 'ⵖ', 'ⵛ', 'ⴽ', 'ⵏ', 'ⴷ'],
  STANDALONENARROWMONTHS: ['ⵉ', 'ⴱ', 'ⵎ', 'ⵉ', 'ⵎ', 'ⵢ', 'ⵢ', 'ⵖ', 'ⵛ', 'ⴽ', 'ⵏ', 'ⴷ'],
  MONTHS: ['ⵉⵏⵏⴰⵢⵔ', 'ⴱⵕⴰⵢⵕ', 'ⵎⴰⵕⵚ', 'ⵉⴱⵔⵉⵔ', 'ⵎⴰⵢⵢⵓ', 'ⵢⵓⵏⵢⵓ', 'ⵢⵓⵍⵢⵓⵣ', 'ⵖⵓⵛⵜ', 'ⵛⵓⵜⴰⵏⴱⵉⵔ', 'ⴽⵜⵓⴱⵔ', 'ⵏⵓⵡⴰⵏⴱⵉⵔ', 'ⴷⵓⵊⴰⵏⴱⵉⵔ'],
  STANDALONEMONTHS: ['ⵉⵏⵏⴰⵢⵔ', 'ⴱⵕⴰⵢⵕ', 'ⵎⴰⵕⵚ', 'ⵉⴱⵔⵉⵔ', 'ⵎⴰⵢⵢⵓ', 'ⵢⵓⵏⵢⵓ', 'ⵢⵓⵍⵢⵓⵣ', 'ⵖⵓⵛⵜ', 'ⵛⵓⵜⴰⵏⴱⵉⵔ', 'ⴽⵜⵓⴱⵔ', 'ⵏⵓⵡⴰⵏⴱⵉⵔ', 'ⴷⵓⵊⴰⵏⴱⵉⵔ'],
  SHORTMONTHS: ['ⵉⵏⵏ', 'ⴱⵕⴰ', 'ⵎⴰⵕ', 'ⵉⴱⵔ', 'ⵎⴰⵢ', 'ⵢⵓⵏ', 'ⵢⵓⵍ', 'ⵖⵓⵛ', 'ⵛⵓⵜ', 'ⴽⵜⵓ', 'ⵏⵓⵡ', 'ⴷⵓⵊ'],
  STANDALONESHORTMONTHS: ['ⵉⵏⵏ', 'ⴱⵕⴰ', 'ⵎⴰⵕ', 'ⵉⴱⵔ', 'ⵎⴰⵢ', 'ⵢⵓⵏ', 'ⵢⵓⵍ', 'ⵖⵓⵛ', 'ⵛⵓⵜ', 'ⴽⵜⵓ', 'ⵏⵓⵡ', 'ⴷⵓⵊ'],
  WEEKDAYS: ['ⴰⵙⴰⵎⴰⵙ', 'ⴰⵢⵏⴰⵙ', 'ⴰⵙⵉⵏⴰⵙ', 'ⴰⴽⵕⴰⵙ', 'ⴰⴽⵡⴰⵙ', 'ⵙⵉⵎⵡⴰⵙ', 'ⴰⵙⵉⴹⵢⴰⵙ'],
  STANDALONEWEEKDAYS: ['ⴰⵙⴰⵎⴰⵙ', 'ⴰⵢⵏⴰⵙ', 'ⴰⵙⵉⵏⴰⵙ', 'ⴰⴽⵕⴰⵙ', 'ⴰⴽⵡⴰⵙ', 'ⵙⵉⵎⵡⴰⵙ', 'ⴰⵙⵉⴹⵢⴰⵙ'],
  SHORTWEEKDAYS: ['ⴰⵙⴰ', 'ⴰⵢⵏ', 'ⴰⵙⵉ', 'ⴰⴽⵕ', 'ⴰⴽⵡ', 'ⴰⵙⵉⵎ', 'ⴰⵙⵉⴹ'],
  STANDALONESHORTWEEKDAYS: ['ⴰⵙⴰ', 'ⴰⵢⵏ', 'ⴰⵙⵉ', 'ⴰⴽⵕ', 'ⴰⴽⵡ', 'ⴰⵙⵉⵎ', 'ⴰⵙⵉⴹ'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['ⴰⴽ 1', 'ⴰⴽ 2', 'ⴰⴽ 3', 'ⴰⴽ 4'],
  QUARTERS: ['ⴰⴽⵕⴰⴹⵢⵓⵔ 1', 'ⴰⴽⵕⴰⴹⵢⵓⵔ 2', 'ⴰⴽⵕⴰⴹⵢⵓⵔ 3', 'ⴰⴽⵕⴰⴹⵢⵓⵔ 4'],
  AMPMS: ['ⵜⵉⴼⴰⵡⵜ', 'ⵜⴰⴷⴳⴳⵯⴰⵜ'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM, y', 'd/M/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 5,
  WEEKENDRANGE: [4, 5],
  FIRSTWEEKCUTOFFDAY: 4
};


/**
 * Date/time formatting symbols for locale shi_Latn.
 */
goog.i18n.DateTimeSymbols_shi_Latn = {
  ERAS: ['daɛ', 'dfɛ'],
  ERANAMES: ['dat n ɛisa', 'dffir n ɛisa'],
  NARROWMONTHS: ['i', 'b', 'm', 'i', 'm', 'y', 'y', 'ɣ', 'c', 'k', 'n', 'd'],
  STANDALONENARROWMONTHS: ['i', 'b', 'm', 'i', 'm', 'y', 'y', 'ɣ', 'c', 'k', 'n', 'd'],
  MONTHS: ['innayr', 'bṛayṛ', 'maṛṣ', 'ibrir', 'mayyu', 'yunyu', 'yulyuz', 'ɣuct', 'cutanbir', 'ktubr', 'nuwanbir', 'dujanbir'],
  STANDALONEMONTHS: ['innayr', 'bṛayṛ', 'maṛṣ', 'ibrir', 'mayyu', 'yunyu', 'yulyuz', 'ɣuct', 'cutanbir', 'ktubr', 'nuwanbir', 'dujanbir'],
  SHORTMONTHS: ['inn', 'bṛa', 'maṛ', 'ibr', 'may', 'yun', 'yul', 'ɣuc', 'cut', 'ktu', 'nuw', 'duj'],
  STANDALONESHORTMONTHS: ['inn', 'bṛa', 'maṛ', 'ibr', 'may', 'yun', 'yul', 'ɣuc', 'cut', 'ktu', 'nuw', 'duj'],
  WEEKDAYS: ['asamas', 'aynas', 'asinas', 'akṛas', 'akwas', 'asimwas', 'asiḍyas'],
  STANDALONEWEEKDAYS: ['asamas', 'aynas', 'asinas', 'akṛas', 'akwas', 'asimwas', 'asiḍyas'],
  SHORTWEEKDAYS: ['asa', 'ayn', 'asi', 'akṛ', 'akw', 'asim', 'asiḍ'],
  STANDALONESHORTWEEKDAYS: ['asa', 'ayn', 'asi', 'akṛ', 'akw', 'asim', 'asiḍ'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['ak 1', 'ak 2', 'ak 3', 'ak 4'],
  QUARTERS: ['akṛaḍyur 1', 'akṛaḍyur 2', 'akṛaḍyur 3', 'akṛaḍyur 4'],
  AMPMS: ['tifawt', 'tadggʷat'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM, y', 'd/M/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 5,
  WEEKENDRANGE: [4, 5],
  FIRSTWEEKCUTOFFDAY: 4
};


/**
 * Date/time formatting symbols for locale shi_Latn_MA.
 */
goog.i18n.DateTimeSymbols_shi_Latn_MA = {
  ERAS: ['daɛ', 'dfɛ'],
  ERANAMES: ['dat n ɛisa', 'dffir n ɛisa'],
  NARROWMONTHS: ['i', 'b', 'm', 'i', 'm', 'y', 'y', 'ɣ', 'c', 'k', 'n', 'd'],
  STANDALONENARROWMONTHS: ['i', 'b', 'm', 'i', 'm', 'y', 'y', 'ɣ', 'c', 'k', 'n', 'd'],
  MONTHS: ['innayr', 'bṛayṛ', 'maṛṣ', 'ibrir', 'mayyu', 'yunyu', 'yulyuz', 'ɣuct', 'cutanbir', 'ktubr', 'nuwanbir', 'dujanbir'],
  STANDALONEMONTHS: ['innayr', 'bṛayṛ', 'maṛṣ', 'ibrir', 'mayyu', 'yunyu', 'yulyuz', 'ɣuct', 'cutanbir', 'ktubr', 'nuwanbir', 'dujanbir'],
  SHORTMONTHS: ['inn', 'bṛa', 'maṛ', 'ibr', 'may', 'yun', 'yul', 'ɣuc', 'cut', 'ktu', 'nuw', 'duj'],
  STANDALONESHORTMONTHS: ['inn', 'bṛa', 'maṛ', 'ibr', 'may', 'yun', 'yul', 'ɣuc', 'cut', 'ktu', 'nuw', 'duj'],
  WEEKDAYS: ['asamas', 'aynas', 'asinas', 'akṛas', 'akwas', 'asimwas', 'asiḍyas'],
  STANDALONEWEEKDAYS: ['asamas', 'aynas', 'asinas', 'akṛas', 'akwas', 'asimwas', 'asiḍyas'],
  SHORTWEEKDAYS: ['asa', 'ayn', 'asi', 'akṛ', 'akw', 'asim', 'asiḍ'],
  STANDALONESHORTWEEKDAYS: ['asa', 'ayn', 'asi', 'akṛ', 'akw', 'asim', 'asiḍ'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['ak 1', 'ak 2', 'ak 3', 'ak 4'],
  QUARTERS: ['akṛaḍyur 1', 'akṛaḍyur 2', 'akṛaḍyur 3', 'akṛaḍyur 4'],
  AMPMS: ['tifawt', 'tadggʷat'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM, y', 'd/M/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 5,
  WEEKENDRANGE: [4, 5],
  FIRSTWEEKCUTOFFDAY: 4
};


/**
 * Date/time formatting symbols for locale shi_Tfng.
 */
goog.i18n.DateTimeSymbols_shi_Tfng = goog.i18n.DateTimeSymbols_shi;


/**
 * Date/time formatting symbols for locale shi_Tfng_MA.
 */
goog.i18n.DateTimeSymbols_shi_Tfng_MA = goog.i18n.DateTimeSymbols_shi;


/**
 * Date/time formatting symbols for locale si_LK.
 */
goog.i18n.DateTimeSymbols_si_LK = goog.i18n.DateTimeSymbols_si;


/**
 * Date/time formatting symbols for locale sk_SK.
 */
goog.i18n.DateTimeSymbols_sk_SK = goog.i18n.DateTimeSymbols_sk;


/**
 * Date/time formatting symbols for locale sl_SI.
 */
goog.i18n.DateTimeSymbols_sl_SI = goog.i18n.DateTimeSymbols_sl;


/**
 * Date/time formatting symbols for locale smn.
 */
goog.i18n.DateTimeSymbols_smn = {
  ERAS: ['oKr.', 'mKr.'],
  ERANAMES: ['Ovdil Kristus šoddâm', 'maŋa Kristus šoddâm'],
  NARROWMONTHS: ['U', 'K', 'NJ', 'C', 'V', 'K', 'S', 'P', 'Č', 'R', 'S', 'J'],
  STANDALONENARROWMONTHS: ['U', 'K', 'NJ', 'C', 'V', 'K', 'S', 'P', 'Č', 'R', 'S', 'J'],
  MONTHS: ['uđđâivemáánu', 'kuovâmáánu', 'njuhčâmáánu', 'cuáŋuimáánu', 'vyesimáánu', 'kesimáánu', 'syeinimáánu', 'porgemáánu', 'čohčâmáánu', 'roovvâdmáánu', 'skammâmáánu', 'juovlâmáánu'],
  STANDALONEMONTHS: ['uđđâivemáánu', 'kuovâmáánu', 'njuhčâmáánu', 'cuáŋuimáánu', 'vyesimáánu', 'kesimáánu', 'syeinimáánu', 'porgemáánu', 'čohčâmáánu', 'roovvâdmáánu', 'skammâmáánu', 'juovlâmáánu'],
  SHORTMONTHS: ['uđiv', 'kuovâ', 'njuhčâ', 'cuáŋui', 'vyesi', 'kesi', 'syeini', 'porge', 'čohčâ', 'roovvâd', 'skammâ', 'juovlâ'],
  STANDALONESHORTMONTHS: ['uđiv', 'kuovâ', 'njuhčâ', 'cuáŋui', 'vyesi', 'kesi', 'syeini', 'porge', 'čohčâ', 'roovvâd', 'skammâ', 'juovlâ'],
  WEEKDAYS: ['pasepeeivi', 'vuossaargâ', 'majebaargâ', 'koskoho', 'tuorâstuv', 'vástuppeeivi', 'lávurduv'],
  STANDALONEWEEKDAYS: ['pasepeivi', 'vuossargâ', 'majebargâ', 'koskokko', 'tuorâstâh', 'vástuppeivi', 'lávurdâh'],
  SHORTWEEKDAYS: ['pas', 'vuo', 'maj', 'kos', 'tuo', 'vás', 'láv'],
  STANDALONESHORTWEEKDAYS: ['pas', 'vuo', 'maj', 'kos', 'tuo', 'vás', 'láv'],
  NARROWWEEKDAYS: ['p', 'V', 'M', 'K', 'T', 'V', 'L'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['1. niälj.', '2. niälj.', '3. niälj.', '4. niälj.'],
  QUARTERS: ['1. niäljádâs', '2. niäljádâs', '3. niäljádâs', '4. niäljádâs'],
  AMPMS: ['ip.', 'ep.'],
  DATEFORMATS: ['cccc, MMMM d. y', 'MMMM d. y', 'MMM d. y', 'd.M.y'],
  TIMEFORMATS: ['H.mm.ss zzzz', 'H.mm.ss z', 'H.mm.ss', 'H.mm'],
  DATETIMEFORMATS: ['{1} \'tme\' {0}', '{1} \'tme\' {0}', '{1} \'tme\' {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale smn_FI.
 */
goog.i18n.DateTimeSymbols_smn_FI = goog.i18n.DateTimeSymbols_smn;


/**
 * Date/time formatting symbols for locale sn.
 */
goog.i18n.DateTimeSymbols_sn = {
  ERAS: ['BC', 'AD'],
  ERANAMES: ['Kristo asati auya', 'mugore ramambo vedu'],
  NARROWMONTHS: ['N', 'K', 'K', 'K', 'C', 'C', 'C', 'N', 'G', 'G', 'M', 'Z'],
  STANDALONENARROWMONTHS: ['N', 'K', 'K', 'K', 'C', 'C', 'C', 'N', 'G', 'G', 'M', 'Z'],
  MONTHS: ['Ndira', 'Kukadzi', 'Kurume', 'Kubvumbi', 'Chivabvu', 'Chikumi', 'Chikunguru', 'Nyamavhuvhu', 'Gunyana', 'Gumiguru', 'Mbudzi', 'Zvita'],
  STANDALONEMONTHS: ['Ndira', 'Kukadzi', 'Kurume', 'Kubvumbi', 'Chivabvu', 'Chikumi', 'Chikunguru', 'Nyamavhuvhu', 'Gunyana', 'Gumiguru', 'Mbudzi', 'Zvita'],
  SHORTMONTHS: ['Ndi', 'Kuk', 'Kur', 'Kub', 'Chv', 'Chk', 'Chg', 'Nya', 'Gun', 'Gum', 'Mbu', 'Zvi'],
  STANDALONESHORTMONTHS: ['Ndi', 'Kuk', 'Kur', 'Kub', 'Chv', 'Chk', 'Chg', 'Nya', 'Gun', 'Gum', 'Mbu', 'Zvi'],
  WEEKDAYS: ['Svondo', 'Muvhuro', 'Chipiri', 'Chitatu', 'China', 'Chishanu', 'Mugovera'],
  STANDALONEWEEKDAYS: ['Svondo', 'Muvhuro', 'Chipiri', 'Chitatu', 'China', 'Chishanu', 'Mugovera'],
  SHORTWEEKDAYS: ['Svo', 'Muv', 'Chp', 'Cht', 'Chn', 'Chs', 'Mug'],
  STANDALONESHORTWEEKDAYS: ['Svo', 'Muv', 'Chp', 'Cht', 'Chn', 'Chs', 'Mug'],
  NARROWWEEKDAYS: ['S', 'M', 'C', 'C', 'C', 'C', 'M'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'C', 'C', 'C', 'C', 'M'],
  SHORTQUARTERS: ['K1', 'K2', 'K3', 'K4'],
  QUARTERS: ['Kota 1', 'Kota 2', 'Kota 3', 'Kota 4'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['y MMMM d, EEEE', 'y MMMM d', 'y MMM d', 'y-MM-dd'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale sn_ZW.
 */
goog.i18n.DateTimeSymbols_sn_ZW = goog.i18n.DateTimeSymbols_sn;


/**
 * Date/time formatting symbols for locale so.
 */
goog.i18n.DateTimeSymbols_so = {
  ERAS: ['CK', 'CD'],
  ERANAMES: ['CK', 'CD'],
  NARROWMONTHS: ['K', 'L', 'S', 'A', 'S', 'L', 'T', 'S', 'S', 'T', 'K', 'L'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['Bisha Koobaad', 'Bisha Labaad', 'Bisha Saddexaad', 'Bisha Afraad', 'Bisha Shanaad', 'Bisha Lixaad', 'Bisha Todobaad', 'Bisha Sideedaad', 'Bisha Sagaalaad', 'Bisha Tobnaad', 'Bisha Kow iyo Tobnaad', 'Bisha Laba iyo Tobnaad'],
  STANDALONEMONTHS: ['Bisha Koobaad', 'Bisha Labaad', 'Bisha Saddexaad', 'Bisha Afraad', 'Bisha Shanaad', 'Bisha Lixaad', 'Bisha Todobaad', 'Bisha Sideedaad', 'Bisha Sagaalaad', 'Bisha Tobnaad', 'Bisha Kow iyo Tobnaad', 'Bisha Laba iyo Tobnaad'],
  SHORTMONTHS: ['Kob', 'Lab', 'Sad', 'Afr', 'Sha', 'Lix', 'Tod', 'Sid', 'Sag', 'Tob', 'KIT', 'LIT'],
  STANDALONESHORTMONTHS: ['Kob', 'Lab', 'Sad', 'Afr', 'Sha', 'Lix', 'Tod', 'Sid', 'Sag', 'Tob', 'KIT', 'LIT'],
  WEEKDAYS: ['Axad', 'Isniin', 'Talaado', 'Arbaco', 'Khamiis', 'Jimco', 'Sabti'],
  STANDALONEWEEKDAYS: ['Axad', 'Isniin', 'Talaado', 'Arbaco', 'Khamiis', 'Jimco', 'Sabti'],
  SHORTWEEKDAYS: ['Axd', 'Isn', 'Tal', 'Arb', 'Kha', 'Jim', 'Sab'],
  STANDALONESHORTWEEKDAYS: ['Axd', 'Isn', 'Tal', 'Arb', 'Kha', 'Jim', 'Sab'],
  NARROWWEEKDAYS: ['A', 'I', 'T', 'A', 'Kh', 'J', 'S'],
  STANDALONENARROWWEEKDAYS: ['A', 'I', 'T', 'A', 'Kh', 'J', 'S'],
  SHORTQUARTERS: ['R1', 'R2', 'R3', 'R4'],
  QUARTERS: ['Rubaca 1aad', 'Rubaca 2aad', 'Rubaca 3aad', 'Rubaca 4aad'],
  AMPMS: ['sn.', 'gn.'],
  DATEFORMATS: ['EEEE, MMMM dd, y', 'dd MMMM y', 'dd-MMM-y', 'dd/MM/yy'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale so_DJ.
 */
goog.i18n.DateTimeSymbols_so_DJ = {
  ERAS: ['CK', 'CD'],
  ERANAMES: ['CK', 'CD'],
  NARROWMONTHS: ['K', 'L', 'S', 'A', 'S', 'L', 'T', 'S', 'S', 'T', 'K', 'L'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['Bisha Koobaad', 'Bisha Labaad', 'Bisha Saddexaad', 'Bisha Afraad', 'Bisha Shanaad', 'Bisha Lixaad', 'Bisha Todobaad', 'Bisha Sideedaad', 'Bisha Sagaalaad', 'Bisha Tobnaad', 'Bisha Kow iyo Tobnaad', 'Bisha Laba iyo Tobnaad'],
  STANDALONEMONTHS: ['Bisha Koobaad', 'Bisha Labaad', 'Bisha Saddexaad', 'Bisha Afraad', 'Bisha Shanaad', 'Bisha Lixaad', 'Bisha Todobaad', 'Bisha Sideedaad', 'Bisha Sagaalaad', 'Bisha Tobnaad', 'Bisha Kow iyo Tobnaad', 'Bisha Laba iyo Tobnaad'],
  SHORTMONTHS: ['Kob', 'Lab', 'Sad', 'Afr', 'Sha', 'Lix', 'Tod', 'Sid', 'Sag', 'Tob', 'KIT', 'LIT'],
  STANDALONESHORTMONTHS: ['Kob', 'Lab', 'Sad', 'Afr', 'Sha', 'Lix', 'Tod', 'Sid', 'Sag', 'Tob', 'KIT', 'LIT'],
  WEEKDAYS: ['Axad', 'Isniin', 'Talaado', 'Arbaco', 'Khamiis', 'Jimco', 'Sabti'],
  STANDALONEWEEKDAYS: ['Axad', 'Isniin', 'Talaado', 'Arbaco', 'Khamiis', 'Jimco', 'Sabti'],
  SHORTWEEKDAYS: ['Axd', 'Isn', 'Tal', 'Arb', 'Kha', 'Jim', 'Sab'],
  STANDALONESHORTWEEKDAYS: ['Axd', 'Isn', 'Tal', 'Arb', 'Kha', 'Jim', 'Sab'],
  NARROWWEEKDAYS: ['A', 'I', 'T', 'A', 'Kh', 'J', 'S'],
  STANDALONENARROWWEEKDAYS: ['A', 'I', 'T', 'A', 'Kh', 'J', 'S'],
  SHORTQUARTERS: ['R1', 'R2', 'R3', 'R4'],
  QUARTERS: ['Rubaca 1aad', 'Rubaca 2aad', 'Rubaca 3aad', 'Rubaca 4aad'],
  AMPMS: ['sn.', 'gn.'],
  DATEFORMATS: ['EEEE, MMMM dd, y', 'dd MMMM y', 'dd-MMM-y', 'dd/MM/yy'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 5,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 4
};


/**
 * Date/time formatting symbols for locale so_ET.
 */
goog.i18n.DateTimeSymbols_so_ET = {
  ERAS: ['CK', 'CD'],
  ERANAMES: ['CK', 'CD'],
  NARROWMONTHS: ['K', 'L', 'S', 'A', 'S', 'L', 'T', 'S', 'S', 'T', 'K', 'L'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['Bisha Koobaad', 'Bisha Labaad', 'Bisha Saddexaad', 'Bisha Afraad', 'Bisha Shanaad', 'Bisha Lixaad', 'Bisha Todobaad', 'Bisha Sideedaad', 'Bisha Sagaalaad', 'Bisha Tobnaad', 'Bisha Kow iyo Tobnaad', 'Bisha Laba iyo Tobnaad'],
  STANDALONEMONTHS: ['Bisha Koobaad', 'Bisha Labaad', 'Bisha Saddexaad', 'Bisha Afraad', 'Bisha Shanaad', 'Bisha Lixaad', 'Bisha Todobaad', 'Bisha Sideedaad', 'Bisha Sagaalaad', 'Bisha Tobnaad', 'Bisha Kow iyo Tobnaad', 'Bisha Laba iyo Tobnaad'],
  SHORTMONTHS: ['Kob', 'Lab', 'Sad', 'Afr', 'Sha', 'Lix', 'Tod', 'Sid', 'Sag', 'Tob', 'KIT', 'LIT'],
  STANDALONESHORTMONTHS: ['Kob', 'Lab', 'Sad', 'Afr', 'Sha', 'Lix', 'Tod', 'Sid', 'Sag', 'Tob', 'KIT', 'LIT'],
  WEEKDAYS: ['Axad', 'Isniin', 'Talaado', 'Arbaco', 'Khamiis', 'Jimco', 'Sabti'],
  STANDALONEWEEKDAYS: ['Axad', 'Isniin', 'Talaado', 'Arbaco', 'Khamiis', 'Jimco', 'Sabti'],
  SHORTWEEKDAYS: ['Axd', 'Isn', 'Tal', 'Arb', 'Kha', 'Jim', 'Sab'],
  STANDALONESHORTWEEKDAYS: ['Axd', 'Isn', 'Tal', 'Arb', 'Kha', 'Jim', 'Sab'],
  NARROWWEEKDAYS: ['A', 'I', 'T', 'A', 'Kh', 'J', 'S'],
  STANDALONENARROWWEEKDAYS: ['A', 'I', 'T', 'A', 'Kh', 'J', 'S'],
  SHORTQUARTERS: ['R1', 'R2', 'R3', 'R4'],
  QUARTERS: ['Rubaca 1aad', 'Rubaca 2aad', 'Rubaca 3aad', 'Rubaca 4aad'],
  AMPMS: ['sn.', 'gn.'],
  DATEFORMATS: ['EEEE, MMMM dd, y', 'dd MMMM y', 'dd-MMM-y', 'dd/MM/yy'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale so_KE.
 */
goog.i18n.DateTimeSymbols_so_KE = {
  ERAS: ['CK', 'CD'],
  ERANAMES: ['CK', 'CD'],
  NARROWMONTHS: ['K', 'L', 'S', 'A', 'S', 'L', 'T', 'S', 'S', 'T', 'K', 'L'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['Bisha Koobaad', 'Bisha Labaad', 'Bisha Saddexaad', 'Bisha Afraad', 'Bisha Shanaad', 'Bisha Lixaad', 'Bisha Todobaad', 'Bisha Sideedaad', 'Bisha Sagaalaad', 'Bisha Tobnaad', 'Bisha Kow iyo Tobnaad', 'Bisha Laba iyo Tobnaad'],
  STANDALONEMONTHS: ['Bisha Koobaad', 'Bisha Labaad', 'Bisha Saddexaad', 'Bisha Afraad', 'Bisha Shanaad', 'Bisha Lixaad', 'Bisha Todobaad', 'Bisha Sideedaad', 'Bisha Sagaalaad', 'Bisha Tobnaad', 'Bisha Kow iyo Tobnaad', 'Bisha Laba iyo Tobnaad'],
  SHORTMONTHS: ['Kob', 'Lab', 'Sad', 'Afr', 'Sha', 'Lix', 'Tod', 'Sid', 'Sag', 'Tob', 'KIT', 'LIT'],
  STANDALONESHORTMONTHS: ['Kob', 'Lab', 'Sad', 'Afr', 'Sha', 'Lix', 'Tod', 'Sid', 'Sag', 'Tob', 'KIT', 'LIT'],
  WEEKDAYS: ['Axad', 'Isniin', 'Talaado', 'Arbaco', 'Khamiis', 'Jimco', 'Sabti'],
  STANDALONEWEEKDAYS: ['Axad', 'Isniin', 'Talaado', 'Arbaco', 'Khamiis', 'Jimco', 'Sabti'],
  SHORTWEEKDAYS: ['Axd', 'Isn', 'Tal', 'Arb', 'Kha', 'Jim', 'Sab'],
  STANDALONESHORTWEEKDAYS: ['Axd', 'Isn', 'Tal', 'Arb', 'Kha', 'Jim', 'Sab'],
  NARROWWEEKDAYS: ['A', 'I', 'T', 'A', 'Kh', 'J', 'S'],
  STANDALONENARROWWEEKDAYS: ['A', 'I', 'T', 'A', 'Kh', 'J', 'S'],
  SHORTQUARTERS: ['R1', 'R2', 'R3', 'R4'],
  QUARTERS: ['Rubaca 1aad', 'Rubaca 2aad', 'Rubaca 3aad', 'Rubaca 4aad'],
  AMPMS: ['sn.', 'gn.'],
  DATEFORMATS: ['EEEE, MMMM dd, y', 'dd MMMM y', 'dd-MMM-y', 'dd/MM/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale so_SO.
 */
goog.i18n.DateTimeSymbols_so_SO = goog.i18n.DateTimeSymbols_so;


/**
 * Date/time formatting symbols for locale sq_AL.
 */
goog.i18n.DateTimeSymbols_sq_AL = goog.i18n.DateTimeSymbols_sq;


/**
 * Date/time formatting symbols for locale sq_MK.
 */
goog.i18n.DateTimeSymbols_sq_MK = {
  ERAS: ['p.K.', 'mb.K.'],
  ERANAMES: ['para Krishtit', 'mbas Krishtit'],
  NARROWMONTHS: ['j', 's', 'm', 'p', 'm', 'q', 'k', 'g', 's', 't', 'n', 'd'],
  STANDALONENARROWMONTHS: ['J', 'S', 'M', 'P', 'M', 'Q', 'K', 'G', 'S', 'T', 'N', 'D'],
  MONTHS: ['janar', 'shkurt', 'mars', 'prill', 'maj', 'qershor', 'korrik', 'gusht', 'shtator', 'tetor', 'nëntor', 'dhjetor'],
  STANDALONEMONTHS: ['Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor', 'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor'],
  SHORTMONTHS: ['jan', 'shk', 'mar', 'pri', 'maj', 'qer', 'kor', 'gsh', 'sht', 'tet', 'nën', 'dhj'],
  STANDALONESHORTMONTHS: ['Jan', 'Shk', 'Mar', 'Pri', 'Maj', 'Qer', 'Kor', 'Gsh', 'Sht', 'Tet', 'Nën', 'Dhj'],
  WEEKDAYS: ['e diel', 'e hënë', 'e martë', 'e mërkurë', 'e enjte', 'e premte', 'e shtunë'],
  STANDALONEWEEKDAYS: ['E diel', 'E hënë', 'E martë', 'E mërkurë', 'E enjte', 'E premte', 'E shtunë'],
  SHORTWEEKDAYS: ['Die', 'Hën', 'Mar', 'Mër', 'Enj', 'Pre', 'Sht'],
  STANDALONESHORTWEEKDAYS: ['Die', 'Hën', 'Mar', 'Mër', 'Enj', 'Pre', 'Sht'],
  NARROWWEEKDAYS: ['D', 'H', 'M', 'M', 'E', 'P', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'H', 'M', 'M', 'E', 'P', 'S'],
  SHORTQUARTERS: ['tremujori I', 'tremujori II', 'tremujori III', 'tremujori IV'],
  QUARTERS: ['tremujori i parë', 'tremujori i dytë', 'tremujori i tretë', 'tremujori i katërt'],
  AMPMS: ['e paradites', 'e pasdites'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'd.M.yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'në\' {0}', '{1} \'në\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale sq_XK.
 */
goog.i18n.DateTimeSymbols_sq_XK = {
  ERAS: ['p.K.', 'mb.K.'],
  ERANAMES: ['para Krishtit', 'mbas Krishtit'],
  NARROWMONTHS: ['j', 's', 'm', 'p', 'm', 'q', 'k', 'g', 's', 't', 'n', 'd'],
  STANDALONENARROWMONTHS: ['J', 'S', 'M', 'P', 'M', 'Q', 'K', 'G', 'S', 'T', 'N', 'D'],
  MONTHS: ['janar', 'shkurt', 'mars', 'prill', 'maj', 'qershor', 'korrik', 'gusht', 'shtator', 'tetor', 'nëntor', 'dhjetor'],
  STANDALONEMONTHS: ['Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor', 'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor'],
  SHORTMONTHS: ['jan', 'shk', 'mar', 'pri', 'maj', 'qer', 'kor', 'gsh', 'sht', 'tet', 'nën', 'dhj'],
  STANDALONESHORTMONTHS: ['Jan', 'Shk', 'Mar', 'Pri', 'Maj', 'Qer', 'Kor', 'Gsh', 'Sht', 'Tet', 'Nën', 'Dhj'],
  WEEKDAYS: ['e diel', 'e hënë', 'e martë', 'e mërkurë', 'e enjte', 'e premte', 'e shtunë'],
  STANDALONEWEEKDAYS: ['E diel', 'E hënë', 'E martë', 'E mërkurë', 'E enjte', 'E premte', 'E shtunë'],
  SHORTWEEKDAYS: ['Die', 'Hën', 'Mar', 'Mër', 'Enj', 'Pre', 'Sht'],
  STANDALONESHORTWEEKDAYS: ['Die', 'Hën', 'Mar', 'Mër', 'Enj', 'Pre', 'Sht'],
  NARROWWEEKDAYS: ['D', 'H', 'M', 'M', 'E', 'P', 'S'],
  STANDALONENARROWWEEKDAYS: ['D', 'H', 'M', 'M', 'E', 'P', 'S'],
  SHORTQUARTERS: ['tremujori I', 'tremujori II', 'tremujori III', 'tremujori IV'],
  QUARTERS: ['tremujori i parë', 'tremujori i dytë', 'tremujori i tretë', 'tremujori i katërt'],
  AMPMS: ['e paradites', 'e pasdites'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'd.M.yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'në\' {0}', '{1} \'në\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale sr_Cyrl.
 */
goog.i18n.DateTimeSymbols_sr_Cyrl = goog.i18n.DateTimeSymbols_sr;


/**
 * Date/time formatting symbols for locale sr_Cyrl_BA.
 */
goog.i18n.DateTimeSymbols_sr_Cyrl_BA = {
  ERAS: ['п. н. е.', 'н. е.'],
  ERANAMES: ['прије нове ере', 'нове ере'],
  NARROWMONTHS: ['ј', 'ф', 'м', 'а', 'м', 'ј', 'ј', 'а', 'с', 'о', 'н', 'д'],
  STANDALONENARROWMONTHS: ['ј', 'ф', 'м', 'а', 'м', 'ј', 'ј', 'а', 'с', 'о', 'н', 'д'],
  MONTHS: ['јануар', 'фебруар', 'март', 'април', 'мај', 'јун', 'јул', 'август', 'септембар', 'октобар', 'новембар', 'децембар'],
  STANDALONEMONTHS: ['јануар', 'фебруар', 'март', 'април', 'мај', 'јун', 'јул', 'август', 'септембар', 'октобар', 'новембар', 'децембар'],
  SHORTMONTHS: ['јан.', 'феб.', 'март', 'апр.', 'мај', 'јун', 'јул', 'авг.', 'септ.', 'окт.', 'нов.', 'дец.'],
  STANDALONESHORTMONTHS: ['јан.', 'феб.', 'март', 'апр.', 'мај', 'јун', 'јул', 'авг.', 'септ.', 'окт.', 'нов.', 'дец.'],
  WEEKDAYS: ['недјеља', 'понедељак', 'уторак', 'сриједа', 'четвртак', 'петак', 'субота'],
  STANDALONEWEEKDAYS: ['недјеља', 'понедељак', 'уторак', 'сриједа', 'четвртак', 'петак', 'субота'],
  SHORTWEEKDAYS: ['нед.', 'пон.', 'ут.', 'ср.', 'чет.', 'пет.', 'суб.'],
  STANDALONESHORTWEEKDAYS: ['нед.', 'пон.', 'ут.', 'ср.', 'чет.', 'пет.', 'суб.'],
  NARROWWEEKDAYS: ['н', 'п', 'у', 'с', 'ч', 'п', 'с'],
  STANDALONENARROWWEEKDAYS: ['н', 'п', 'у', 'с', 'ч', 'п', 'с'],
  SHORTQUARTERS: ['К1', 'К2', 'К3', 'К4'],
  QUARTERS: ['први квартал', 'други квартал', 'трећи квартал', 'четврти квартал'],
  AMPMS: ['прије подне', 'по подне'],
  DATEFORMATS: ['EEEE, dd. MMMM y.', 'dd. MMMM y.', 'dd.MM.y.', 'd.M.yy.'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale sr_Cyrl_ME.
 */
goog.i18n.DateTimeSymbols_sr_Cyrl_ME = {
  ERAS: ['п. н. е.', 'н. е.'],
  ERANAMES: ['прије нове ере', 'нове ере'],
  NARROWMONTHS: ['ј', 'ф', 'м', 'а', 'м', 'ј', 'ј', 'а', 'с', 'о', 'н', 'д'],
  STANDALONENARROWMONTHS: ['ј', 'ф', 'м', 'а', 'м', 'ј', 'ј', 'а', 'с', 'о', 'н', 'д'],
  MONTHS: ['јануар', 'фебруар', 'март', 'април', 'мај', 'јун', 'јул', 'август', 'септембар', 'октобар', 'новембар', 'децембар'],
  STANDALONEMONTHS: ['јануар', 'фебруар', 'март', 'април', 'мај', 'јун', 'јул', 'август', 'септембар', 'октобар', 'новембар', 'децембар'],
  SHORTMONTHS: ['јан.', 'феб.', 'март', 'апр.', 'мај', 'јун', 'јул', 'авг.', 'септ.', 'окт.', 'нов.', 'дец.'],
  STANDALONESHORTMONTHS: ['јан.', 'феб.', 'март', 'апр.', 'мај', 'јун', 'јул', 'авг.', 'септ.', 'окт.', 'нов.', 'дец.'],
  WEEKDAYS: ['недјеља', 'понедељак', 'уторак', 'сриједа', 'четвртак', 'петак', 'субота'],
  STANDALONEWEEKDAYS: ['недјеља', 'понедељак', 'уторак', 'сриједа', 'четвртак', 'петак', 'субота'],
  SHORTWEEKDAYS: ['нед.', 'пон.', 'ут.', 'ср.', 'чет.', 'пет.', 'суб.'],
  STANDALONESHORTWEEKDAYS: ['нед.', 'пон.', 'ут.', 'ср.', 'чет.', 'пет.', 'суб.'],
  NARROWWEEKDAYS: ['н', 'п', 'у', 'с', 'ч', 'п', 'с'],
  STANDALONENARROWWEEKDAYS: ['н', 'п', 'у', 'с', 'ч', 'п', 'с'],
  SHORTQUARTERS: ['К1', 'К2', 'К3', 'К4'],
  QUARTERS: ['први квартал', 'други квартал', 'трећи квартал', 'четврти квартал'],
  AMPMS: ['прије подне', 'по подне'],
  DATEFORMATS: ['EEEE, dd. MMMM y.', 'dd. MMMM y.', 'dd.MM.y.', 'd.M.yy.'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale sr_Cyrl_RS.
 */
goog.i18n.DateTimeSymbols_sr_Cyrl_RS = goog.i18n.DateTimeSymbols_sr;


/**
 * Date/time formatting symbols for locale sr_Cyrl_XK.
 */
goog.i18n.DateTimeSymbols_sr_Cyrl_XK = {
  ERAS: ['п. н. е.', 'н. е.'],
  ERANAMES: ['пре нове ере', 'нове ере'],
  NARROWMONTHS: ['ј', 'ф', 'м', 'а', 'м', 'ј', 'ј', 'а', 'с', 'о', 'н', 'д'],
  STANDALONENARROWMONTHS: ['ј', 'ф', 'м', 'а', 'м', 'ј', 'ј', 'а', 'с', 'о', 'н', 'д'],
  MONTHS: ['јануар', 'фебруар', 'март', 'април', 'мај', 'јун', 'јул', 'август', 'септембар', 'октобар', 'новембар', 'децембар'],
  STANDALONEMONTHS: ['јануар', 'фебруар', 'март', 'април', 'мај', 'јун', 'јул', 'август', 'септембар', 'октобар', 'новембар', 'децембар'],
  SHORTMONTHS: ['јан.', 'феб.', 'март', 'апр.', 'мај', 'јун', 'јул', 'авг.', 'септ.', 'окт.', 'нов.', 'дец.'],
  STANDALONESHORTMONTHS: ['јан.', 'феб.', 'март', 'апр.', 'мај', 'јун', 'јул', 'авг.', 'септ.', 'окт.', 'нов.', 'дец.'],
  WEEKDAYS: ['недеља', 'понедељак', 'уторак', 'среда', 'четвртак', 'петак', 'субота'],
  STANDALONEWEEKDAYS: ['недеља', 'понедељак', 'уторак', 'среда', 'четвртак', 'петак', 'субота'],
  SHORTWEEKDAYS: ['нед.', 'пон.', 'ут.', 'ср.', 'чет.', 'пет.', 'суб.'],
  STANDALONESHORTWEEKDAYS: ['нед.', 'пон.', 'ут.', 'ср.', 'чет.', 'пет.', 'суб.'],
  NARROWWEEKDAYS: ['н', 'п', 'у', 'с', 'ч', 'п', 'с'],
  STANDALONENARROWWEEKDAYS: ['н', 'п', 'у', 'с', 'ч', 'п', 'с'],
  SHORTQUARTERS: ['К1', 'К2', 'К3', 'К4'],
  QUARTERS: ['први квартал', 'други квартал', 'трећи квартал', 'четврти квартал'],
  AMPMS: ['пре подне', 'по подне'],
  DATEFORMATS: ['EEEE, dd. MMMM y.', 'dd. MMMM y.', 'dd.MM.y.', 'd.M.yy.'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale sr_Latn_BA.
 */
goog.i18n.DateTimeSymbols_sr_Latn_BA = {
  ERAS: ['p. n. e.', 'n. e.'],
  ERANAMES: ['prije nove ere', 'nove ere'],
  NARROWMONTHS: ['j', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  STANDALONENARROWMONTHS: ['j', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  MONTHS: ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'],
  STANDALONEMONTHS: ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'],
  SHORTMONTHS: ['jan.', 'feb.', 'mart', 'apr.', 'maj', 'jun', 'jul', 'avg.', 'sept.', 'okt.', 'nov.', 'dec.'],
  STANDALONESHORTMONTHS: ['jan.', 'feb.', 'mart', 'apr.', 'maj', 'jun', 'jul', 'avg.', 'sept.', 'okt.', 'nov.', 'dec.'],
  WEEKDAYS: ['nedjelja', 'ponedeljak', 'utorak', 'srijeda', 'četvrtak', 'petak', 'subota'],
  STANDALONEWEEKDAYS: ['nedjelja', 'ponedeljak', 'utorak', 'srijeda', 'četvrtak', 'petak', 'subota'],
  SHORTWEEKDAYS: ['ned.', 'pon.', 'ut.', 'sr.', 'čet.', 'pet.', 'sub.'],
  STANDALONESHORTWEEKDAYS: ['ned.', 'pon.', 'ut.', 'sr.', 'čet.', 'pet.', 'sub.'],
  NARROWWEEKDAYS: ['n', 'p', 'u', 's', 'č', 'p', 's'],
  STANDALONENARROWWEEKDAYS: ['n', 'p', 'u', 's', 'č', 'p', 's'],
  SHORTQUARTERS: ['K1', 'K2', 'K3', 'K4'],
  QUARTERS: ['prvi kvartal', 'drugi kvartal', 'treći kvartal', 'četvrti kvartal'],
  AMPMS: ['prije podne', 'po podne'],
  DATEFORMATS: ['EEEE, dd. MMMM y.', 'dd. MMMM y.', 'dd.MM.y.', 'd.M.yy.'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale sr_Latn_ME.
 */
goog.i18n.DateTimeSymbols_sr_Latn_ME = {
  ERAS: ['p. n. e.', 'n. e.'],
  ERANAMES: ['prije nove ere', 'nove ere'],
  NARROWMONTHS: ['j', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  STANDALONENARROWMONTHS: ['j', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  MONTHS: ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'],
  STANDALONEMONTHS: ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'],
  SHORTMONTHS: ['jan.', 'feb.', 'mart', 'apr.', 'maj', 'jun', 'jul', 'avg.', 'sept.', 'okt.', 'nov.', 'dec.'],
  STANDALONESHORTMONTHS: ['jan.', 'feb.', 'mart', 'apr.', 'maj', 'jun', 'jul', 'avg.', 'sept.', 'okt.', 'nov.', 'dec.'],
  WEEKDAYS: ['nedjelja', 'ponedeljak', 'utorak', 'srijeda', 'četvrtak', 'petak', 'subota'],
  STANDALONEWEEKDAYS: ['nedjelja', 'ponedeljak', 'utorak', 'srijeda', 'četvrtak', 'petak', 'subota'],
  SHORTWEEKDAYS: ['ned.', 'pon.', 'ut.', 'sr.', 'čet.', 'pet.', 'sub.'],
  STANDALONESHORTWEEKDAYS: ['ned.', 'pon.', 'ut.', 'sr.', 'čet.', 'pet.', 'sub.'],
  NARROWWEEKDAYS: ['n', 'p', 'u', 's', 'č', 'p', 's'],
  STANDALONENARROWWEEKDAYS: ['n', 'p', 'u', 's', 'č', 'p', 's'],
  SHORTQUARTERS: ['K1', 'K2', 'K3', 'K4'],
  QUARTERS: ['prvi kvartal', 'drugi kvartal', 'treći kvartal', 'četvrti kvartal'],
  AMPMS: ['prije podne', 'po podne'],
  DATEFORMATS: ['EEEE, dd. MMMM y.', 'dd. MMMM y.', 'dd.MM.y.', 'd.M.yy.'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale sr_Latn_RS.
 */
goog.i18n.DateTimeSymbols_sr_Latn_RS = {
  ERAS: ['p. n. e.', 'n. e.'],
  ERANAMES: ['pre nove ere', 'nove ere'],
  NARROWMONTHS: ['j', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  STANDALONENARROWMONTHS: ['j', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  MONTHS: ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'],
  STANDALONEMONTHS: ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'],
  SHORTMONTHS: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'avg', 'sep', 'okt', 'nov', 'dec'],
  STANDALONESHORTMONTHS: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'avg', 'sep', 'okt', 'nov', 'dec'],
  WEEKDAYS: ['nedelja', 'ponedeljak', 'utorak', 'sreda', 'četvrtak', 'petak', 'subota'],
  STANDALONEWEEKDAYS: ['nedelja', 'ponedeljak', 'utorak', 'sreda', 'četvrtak', 'petak', 'subota'],
  SHORTWEEKDAYS: ['ned', 'pon', 'uto', 'sre', 'čet', 'pet', 'sub'],
  STANDALONESHORTWEEKDAYS: ['ned', 'pon', 'uto', 'sre', 'čet', 'pet', 'sub'],
  NARROWWEEKDAYS: ['n', 'p', 'u', 's', 'č', 'p', 's'],
  STANDALONENARROWWEEKDAYS: ['n', 'p', 'u', 's', 'č', 'p', 's'],
  SHORTQUARTERS: ['K1', 'K2', 'K3', 'K4'],
  QUARTERS: ['prvi kvartal', 'drugi kvartal', 'treći kvartal', 'četvrti kvartal'],
  AMPMS: ['pre podne', 'po podne'],
  DATEFORMATS: ['EEEE, dd. MMMM y.', 'dd. MMMM y.', 'dd.MM.y.', 'd.M.yy.'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale sr_Latn_XK.
 */
goog.i18n.DateTimeSymbols_sr_Latn_XK = {
  ERAS: ['p. n. e.', 'n. e.'],
  ERANAMES: ['pre nove ere', 'nove ere'],
  NARROWMONTHS: ['j', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  STANDALONENARROWMONTHS: ['j', 'f', 'm', 'a', 'm', 'j', 'j', 'a', 's', 'o', 'n', 'd'],
  MONTHS: ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'],
  STANDALONEMONTHS: ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'],
  SHORTMONTHS: ['jan.', 'feb.', 'mart', 'apr.', 'maj', 'jun', 'jul', 'avg.', 'sept.', 'okt.', 'nov.', 'dec.'],
  STANDALONESHORTMONTHS: ['jan.', 'feb.', 'mart', 'apr.', 'maj', 'jun', 'jul', 'avg.', 'sept.', 'okt.', 'nov.', 'dec.'],
  WEEKDAYS: ['nedelja', 'ponedeljak', 'utorak', 'sreda', 'četvrtak', 'petak', 'subota'],
  STANDALONEWEEKDAYS: ['nedelja', 'ponedeljak', 'utorak', 'sreda', 'četvrtak', 'petak', 'subota'],
  SHORTWEEKDAYS: ['ned.', 'pon.', 'ut.', 'sr.', 'čet.', 'pet.', 'sub.'],
  STANDALONESHORTWEEKDAYS: ['ned.', 'pon.', 'ut.', 'sr.', 'čet.', 'pet.', 'sub.'],
  NARROWWEEKDAYS: ['n', 'p', 'u', 's', 'č', 'p', 's'],
  STANDALONENARROWWEEKDAYS: ['n', 'p', 'u', 's', 'č', 'p', 's'],
  SHORTQUARTERS: ['K1', 'K2', 'K3', 'K4'],
  QUARTERS: ['prvi kvartal', 'drugi kvartal', 'treći kvartal', 'četvrti kvartal'],
  AMPMS: ['pre podne', 'po podne'],
  DATEFORMATS: ['EEEE, dd. MMMM y.', 'dd. MMMM y.', 'dd.MM.y.', 'd.M.yy.'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale sv_AX.
 */
goog.i18n.DateTimeSymbols_sv_AX = goog.i18n.DateTimeSymbols_sv;


/**
 * Date/time formatting symbols for locale sv_FI.
 */
goog.i18n.DateTimeSymbols_sv_FI = {
  ERAS: ['f.Kr.', 'e.Kr.'],
  ERANAMES: ['före Kristus', 'efter Kristus'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'],
  STANDALONEMONTHS: ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'],
  SHORTMONTHS: ['jan.', 'feb.', 'mars', 'apr.', 'maj', 'juni', 'juli', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.'],
  STANDALONESHORTMONTHS: ['jan.', 'feb.', 'mars', 'apr.', 'maj', 'juni', 'juli', 'aug.', 'sep.', 'okt.', 'nov.', 'dec.'],
  WEEKDAYS: ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'],
  STANDALONEWEEKDAYS: ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'],
  SHORTWEEKDAYS: ['sön', 'mån', 'tis', 'ons', 'tors', 'fre', 'lör'],
  STANDALONESHORTWEEKDAYS: ['sön', 'mån', 'tis', 'ons', 'tors', 'fre', 'lör'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'O', 'T', 'F', 'L'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'O', 'T', 'F', 'L'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1:a kvartalet', '2:a kvartalet', '3:e kvartalet', '4:e kvartalet'],
  AMPMS: ['fm', 'em'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'dd-MM-y'],
  TIMEFORMATS: ['\'kl\'. HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale sv_SE.
 */
goog.i18n.DateTimeSymbols_sv_SE = goog.i18n.DateTimeSymbols_sv;


/**
 * Date/time formatting symbols for locale sw_CD.
 */
goog.i18n.DateTimeSymbols_sw_CD = goog.i18n.DateTimeSymbols_sw;


/**
 * Date/time formatting symbols for locale sw_KE.
 */
goog.i18n.DateTimeSymbols_sw_KE = {
  ERAS: ['KK', 'BK'],
  ERANAMES: ['Kabla ya Kristo', 'Baada ya Kristo'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['Januari', 'Februari', 'Machi', 'Aprili', 'Mei', 'Juni', 'Julai', 'Agosti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba'],
  STANDALONEMONTHS: ['Januari', 'Februari', 'Machi', 'Aprili', 'Mei', 'Juni', 'Julai', 'Agosti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Des'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Des'],
  WEEKDAYS: ['Jumapili', 'Jumatatu', 'Jumanne', 'Jumatano', 'Alhamisi', 'Ijumaa', 'Jumamosi'],
  STANDALONEWEEKDAYS: ['Jumapili', 'Jumatatu', 'Jumanne', 'Jumatano', 'Alhamisi', 'Ijumaa', 'Jumamosi'],
  SHORTWEEKDAYS: ['Jumapili', 'Jumatatu', 'Jumanne', 'Jumatano', 'Alhamisi', 'Ijumaa', 'Jumamosi'],
  STANDALONESHORTWEEKDAYS: ['Jumapili', 'Jumatatu', 'Jumanne', 'Jumatano', 'Alhamisi', 'Ijumaa', 'Jumamosi'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Robo ya 1', 'Robo ya 2', 'Robo ya 3', 'Robo ya 4'],
  QUARTERS: ['Robo ya 1', 'Robo ya 2', 'Robo ya 3', 'Robo ya 4'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} \'saa\' {0}', '{1} \'saa\' {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale sw_TZ.
 */
goog.i18n.DateTimeSymbols_sw_TZ = goog.i18n.DateTimeSymbols_sw;


/**
 * Date/time formatting symbols for locale sw_UG.
 */
goog.i18n.DateTimeSymbols_sw_UG = goog.i18n.DateTimeSymbols_sw;


/**
 * Date/time formatting symbols for locale ta_IN.
 */
goog.i18n.DateTimeSymbols_ta_IN = goog.i18n.DateTimeSymbols_ta;


/**
 * Date/time formatting symbols for locale ta_LK.
 */
goog.i18n.DateTimeSymbols_ta_LK = {
  ERAS: ['கி.மு.', 'கி.பி.'],
  ERANAMES: ['கிறிஸ்துவுக்கு முன்', 'அன்னோ டோமினி'],
  NARROWMONTHS: ['ஜ', 'பி', 'மா', 'ஏ', 'மே', 'ஜூ', 'ஜூ', 'ஆ', 'செ', 'அ', 'ந', 'டி'],
  STANDALONENARROWMONTHS: ['ஜ', 'பி', 'மா', 'ஏ', 'மே', 'ஜூ', 'ஜூ', 'ஆ', 'செ', 'அ', 'ந', 'டி'],
  MONTHS: ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'],
  STANDALONEMONTHS: ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'],
  SHORTMONTHS: ['ஜன.', 'பிப்.', 'மார்.', 'ஏப்.', 'மே', 'ஜூன்', 'ஜூலை', 'ஆக.', 'செப்.', 'அக்.', 'நவ.', 'டிச.'],
  STANDALONESHORTMONTHS: ['ஜன.', 'பிப்.', 'மார்.', 'ஏப்.', 'மே', 'ஜூன்', 'ஜூலை', 'ஆக.', 'செப்.', 'அக்.', 'நவ.', 'டிச.'],
  WEEKDAYS: ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'],
  STANDALONEWEEKDAYS: ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'],
  SHORTWEEKDAYS: ['ஞாயி.', 'திங்.', 'செவ்.', 'புத.', 'வியா.', 'வெள்.', 'சனி'],
  STANDALONESHORTWEEKDAYS: ['ஞாயி.', 'திங்.', 'செவ்.', 'புத.', 'வியா.', 'வெள்.', 'சனி'],
  NARROWWEEKDAYS: ['ஞா', 'தி', 'செ', 'பு', 'வி', 'வெ', 'ச'],
  STANDALONENARROWWEEKDAYS: ['ஞா', 'தி', 'செ', 'பு', 'வி', 'வெ', 'ச'],
  SHORTQUARTERS: ['காலா.1', 'காலா.2', 'காலா.3', 'காலா.4'],
  QUARTERS: ['ஒன்றாம் காலாண்டு', 'இரண்டாம் காலாண்டு', 'மூன்றாம் காலாண்டு', 'நான்காம் காலாண்டு'],
  AMPMS: ['முற்பகல்', 'பிற்பகல்'],
  DATEFORMATS: ['EEEE, d MMMM, y', 'd MMMM, y', 'd MMM, y', 'd/M/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} ’அன்று’ {0}', '{1} ’அன்று’ {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale ta_MY.
 */
goog.i18n.DateTimeSymbols_ta_MY = {
  ERAS: ['கி.மு.', 'கி.பி.'],
  ERANAMES: ['கிறிஸ்துவுக்கு முன்', 'அன்னோ டோமினி'],
  NARROWMONTHS: ['ஜ', 'பி', 'மா', 'ஏ', 'மே', 'ஜூ', 'ஜூ', 'ஆ', 'செ', 'அ', 'ந', 'டி'],
  STANDALONENARROWMONTHS: ['ஜ', 'பி', 'மா', 'ஏ', 'மே', 'ஜூ', 'ஜூ', 'ஆ', 'செ', 'அ', 'ந', 'டி'],
  MONTHS: ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'],
  STANDALONEMONTHS: ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'],
  SHORTMONTHS: ['ஜன.', 'பிப்.', 'மார்.', 'ஏப்.', 'மே', 'ஜூன்', 'ஜூலை', 'ஆக.', 'செப்.', 'அக்.', 'நவ.', 'டிச.'],
  STANDALONESHORTMONTHS: ['ஜன.', 'பிப்.', 'மார்.', 'ஏப்.', 'மே', 'ஜூன்', 'ஜூலை', 'ஆக.', 'செப்.', 'அக்.', 'நவ.', 'டிச.'],
  WEEKDAYS: ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'],
  STANDALONEWEEKDAYS: ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'],
  SHORTWEEKDAYS: ['ஞாயி.', 'திங்.', 'செவ்.', 'புத.', 'வியா.', 'வெள்.', 'சனி'],
  STANDALONESHORTWEEKDAYS: ['ஞாயி.', 'திங்.', 'செவ்.', 'புத.', 'வியா.', 'வெள்.', 'சனி'],
  NARROWWEEKDAYS: ['ஞா', 'தி', 'செ', 'பு', 'வி', 'வெ', 'ச'],
  STANDALONENARROWWEEKDAYS: ['ஞா', 'தி', 'செ', 'பு', 'வி', 'வெ', 'ச'],
  SHORTQUARTERS: ['காலா.1', 'காலா.2', 'காலா.3', 'காலா.4'],
  QUARTERS: ['ஒன்றாம் காலாண்டு', 'இரண்டாம் காலாண்டு', 'மூன்றாம் காலாண்டு', 'நான்காம் காலாண்டு'],
  AMPMS: ['முற்பகல்', 'பிற்பகல்'],
  DATEFORMATS: ['EEEE, d MMMM, y', 'd MMMM, y', 'd MMM, y', 'd/M/yy'],
  TIMEFORMATS: ['a h:mm:ss zzzz', 'a h:mm:ss z', 'a h:mm:ss', 'a h:mm'],
  DATETIMEFORMATS: ['{1} ’அன்று’ {0}', '{1} ’அன்று’ {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale ta_SG.
 */
goog.i18n.DateTimeSymbols_ta_SG = {
  ERAS: ['கி.மு.', 'கி.பி.'],
  ERANAMES: ['கிறிஸ்துவுக்கு முன்', 'அன்னோ டோமினி'],
  NARROWMONTHS: ['ஜ', 'பி', 'மா', 'ஏ', 'மே', 'ஜூ', 'ஜூ', 'ஆ', 'செ', 'அ', 'ந', 'டி'],
  STANDALONENARROWMONTHS: ['ஜ', 'பி', 'மா', 'ஏ', 'மே', 'ஜூ', 'ஜூ', 'ஆ', 'செ', 'அ', 'ந', 'டி'],
  MONTHS: ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'],
  STANDALONEMONTHS: ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'],
  SHORTMONTHS: ['ஜன.', 'பிப்.', 'மார்.', 'ஏப்.', 'மே', 'ஜூன்', 'ஜூலை', 'ஆக.', 'செப்.', 'அக்.', 'நவ.', 'டிச.'],
  STANDALONESHORTMONTHS: ['ஜன.', 'பிப்.', 'மார்.', 'ஏப்.', 'மே', 'ஜூன்', 'ஜூலை', 'ஆக.', 'செப்.', 'அக்.', 'நவ.', 'டிச.'],
  WEEKDAYS: ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'],
  STANDALONEWEEKDAYS: ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'],
  SHORTWEEKDAYS: ['ஞாயி.', 'திங்.', 'செவ்.', 'புத.', 'வியா.', 'வெள்.', 'சனி'],
  STANDALONESHORTWEEKDAYS: ['ஞாயி.', 'திங்.', 'செவ்.', 'புத.', 'வியா.', 'வெள்.', 'சனி'],
  NARROWWEEKDAYS: ['ஞா', 'தி', 'செ', 'பு', 'வி', 'வெ', 'ச'],
  STANDALONENARROWWEEKDAYS: ['ஞா', 'தி', 'செ', 'பு', 'வி', 'வெ', 'ச'],
  SHORTQUARTERS: ['காலா.1', 'காலா.2', 'காலா.3', 'காலா.4'],
  QUARTERS: ['ஒன்றாம் காலாண்டு', 'இரண்டாம் காலாண்டு', 'மூன்றாம் காலாண்டு', 'நான்காம் காலாண்டு'],
  AMPMS: ['முற்பகல்', 'பிற்பகல்'],
  DATEFORMATS: ['EEEE, d MMMM, y', 'd MMMM, y', 'd MMM, y', 'd/M/yy'],
  TIMEFORMATS: ['a h:mm:ss zzzz', 'a h:mm:ss z', 'a h:mm:ss', 'a h:mm'],
  DATETIMEFORMATS: ['{1} ’அன்று’ {0}', '{1} ’அன்று’ {0}', '{1}, {0}', '{1}, {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale te_IN.
 */
goog.i18n.DateTimeSymbols_te_IN = goog.i18n.DateTimeSymbols_te;


/**
 * Date/time formatting symbols for locale teo.
 */
goog.i18n.DateTimeSymbols_teo = {
  ERAS: ['KK', 'BK'],
  ERANAMES: ['Kabla ya Christo', 'Baada ya Christo'],
  NARROWMONTHS: ['R', 'M', 'K', 'D', 'M', 'M', 'J', 'P', 'S', 'T', 'L', 'P'],
  STANDALONENARROWMONTHS: ['R', 'M', 'K', 'D', 'M', 'M', 'J', 'P', 'S', 'T', 'L', 'P'],
  MONTHS: ['Orara', 'Omuk', 'Okwamg’', 'Odung’el', 'Omaruk', 'Omodok’king’ol', 'Ojola', 'Opedel', 'Osokosokoma', 'Otibar', 'Olabor', 'Opoo'],
  STANDALONEMONTHS: ['Orara', 'Omuk', 'Okwamg’', 'Odung’el', 'Omaruk', 'Omodok’king’ol', 'Ojola', 'Opedel', 'Osokosokoma', 'Otibar', 'Olabor', 'Opoo'],
  SHORTMONTHS: ['Rar', 'Muk', 'Kwa', 'Dun', 'Mar', 'Mod', 'Jol', 'Ped', 'Sok', 'Tib', 'Lab', 'Poo'],
  STANDALONESHORTMONTHS: ['Rar', 'Muk', 'Kwa', 'Dun', 'Mar', 'Mod', 'Jol', 'Ped', 'Sok', 'Tib', 'Lab', 'Poo'],
  WEEKDAYS: ['Nakaejuma', 'Nakaebarasa', 'Nakaare', 'Nakauni', 'Nakaung’on', 'Nakakany', 'Nakasabiti'],
  STANDALONEWEEKDAYS: ['Nakaejuma', 'Nakaebarasa', 'Nakaare', 'Nakauni', 'Nakaung’on', 'Nakakany', 'Nakasabiti'],
  SHORTWEEKDAYS: ['Jum', 'Bar', 'Aar', 'Uni', 'Ung', 'Kan', 'Sab'],
  STANDALONESHORTWEEKDAYS: ['Jum', 'Bar', 'Aar', 'Uni', 'Ung', 'Kan', 'Sab'],
  NARROWWEEKDAYS: ['J', 'B', 'A', 'U', 'U', 'K', 'S'],
  STANDALONENARROWWEEKDAYS: ['J', 'B', 'A', 'U', 'U', 'K', 'S'],
  SHORTQUARTERS: ['K1', 'K2', 'K3', 'K4'],
  QUARTERS: ['Akwota abe', 'Akwota Aane', 'Akwota auni', 'Akwota Aung’on'],
  AMPMS: ['Taparachu', 'Ebongi'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale teo_KE.
 */
goog.i18n.DateTimeSymbols_teo_KE = {
  ERAS: ['KK', 'BK'],
  ERANAMES: ['Kabla ya Christo', 'Baada ya Christo'],
  NARROWMONTHS: ['R', 'M', 'K', 'D', 'M', 'M', 'J', 'P', 'S', 'T', 'L', 'P'],
  STANDALONENARROWMONTHS: ['R', 'M', 'K', 'D', 'M', 'M', 'J', 'P', 'S', 'T', 'L', 'P'],
  MONTHS: ['Orara', 'Omuk', 'Okwamg’', 'Odung’el', 'Omaruk', 'Omodok’king’ol', 'Ojola', 'Opedel', 'Osokosokoma', 'Otibar', 'Olabor', 'Opoo'],
  STANDALONEMONTHS: ['Orara', 'Omuk', 'Okwamg’', 'Odung’el', 'Omaruk', 'Omodok’king’ol', 'Ojola', 'Opedel', 'Osokosokoma', 'Otibar', 'Olabor', 'Opoo'],
  SHORTMONTHS: ['Rar', 'Muk', 'Kwa', 'Dun', 'Mar', 'Mod', 'Jol', 'Ped', 'Sok', 'Tib', 'Lab', 'Poo'],
  STANDALONESHORTMONTHS: ['Rar', 'Muk', 'Kwa', 'Dun', 'Mar', 'Mod', 'Jol', 'Ped', 'Sok', 'Tib', 'Lab', 'Poo'],
  WEEKDAYS: ['Nakaejuma', 'Nakaebarasa', 'Nakaare', 'Nakauni', 'Nakaung’on', 'Nakakany', 'Nakasabiti'],
  STANDALONEWEEKDAYS: ['Nakaejuma', 'Nakaebarasa', 'Nakaare', 'Nakauni', 'Nakaung’on', 'Nakakany', 'Nakasabiti'],
  SHORTWEEKDAYS: ['Jum', 'Bar', 'Aar', 'Uni', 'Ung', 'Kan', 'Sab'],
  STANDALONESHORTWEEKDAYS: ['Jum', 'Bar', 'Aar', 'Uni', 'Ung', 'Kan', 'Sab'],
  NARROWWEEKDAYS: ['J', 'B', 'A', 'U', 'U', 'K', 'S'],
  STANDALONENARROWWEEKDAYS: ['J', 'B', 'A', 'U', 'U', 'K', 'S'],
  SHORTQUARTERS: ['K1', 'K2', 'K3', 'K4'],
  QUARTERS: ['Akwota abe', 'Akwota Aane', 'Akwota auni', 'Akwota Aung’on'],
  AMPMS: ['Taparachu', 'Ebongi'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale teo_UG.
 */
goog.i18n.DateTimeSymbols_teo_UG = goog.i18n.DateTimeSymbols_teo;


/**
 * Date/time formatting symbols for locale th_TH.
 */
goog.i18n.DateTimeSymbols_th_TH = goog.i18n.DateTimeSymbols_th;


/**
 * Date/time formatting symbols for locale ti.
 */
goog.i18n.DateTimeSymbols_ti = {
  ERAS: ['ዓ/ዓ', 'ዓ/ም'],
  ERANAMES: ['ዓ/ዓ', 'ዓመተ ምህረት'],
  NARROWMONTHS: ['ጥ', 'ለ', 'መ', 'ሚ', 'ግ', 'ሰ', 'ሓ', 'ነ', 'መ', 'ጥ', 'ሕ', 'ታ'],
  STANDALONENARROWMONTHS: ['ጥ', 'ለ', 'መ', 'ሚ', 'ግ', 'ሰ', 'ሓ', 'ነ', 'መ', 'ጥ', 'ሕ', 'ታ'],
  MONTHS: ['ጥሪ', 'ለካቲት', 'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰነ', 'ሓምለ', 'ነሓሰ', 'መስከረም', 'ጥቅምቲ', 'ሕዳር', 'ታሕሳስ'],
  STANDALONEMONTHS: ['ጥሪ', 'ለካቲት', 'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰነ', 'ሓምለ', 'ነሓሰ', 'መስከረም', 'ጥቅምቲ', 'ሕዳር', 'ታሕሳስ'],
  SHORTMONTHS: ['ጥሪ', 'ለካ', 'መጋ', 'ሚያ', 'ግን', 'ሰነ', 'ሓም', 'ነሓ', 'መስ', 'ጥቅ', 'ሕዳ', 'ታሕ'],
  STANDALONESHORTMONTHS: ['ጥሪ', 'ለካ', 'መጋ', 'ሚያ', 'ግን', 'ሰነ', 'ሓም', 'ነሓ', 'መስ', 'ጥቅ', 'ሕዳ', 'ታሕ'],
  WEEKDAYS: ['ሰንበት', 'ሰኑይ', 'ሠሉስ', 'ረቡዕ', 'ኃሙስ', 'ዓርቢ', 'ቀዳም'],
  STANDALONEWEEKDAYS: ['ሰንበት', 'ሰኑይ', 'ሰሉስ', 'ረቡዕ', 'ሓሙስ', 'ዓርቢ', 'ቀዳም'],
  SHORTWEEKDAYS: ['ሰን', 'ሰኑ', 'ሰሉ', 'ረቡ', 'ሓሙ', 'ዓር', 'ቀዳ'],
  STANDALONESHORTWEEKDAYS: ['ሰን', 'ሰኑ', 'ሰሉ', 'ረቡ', 'ሓሙ', 'ዓር', 'ቀዳ'],
  NARROWWEEKDAYS: ['ሰ', 'ሰ', 'ሰ', 'ረ', 'ሓ', 'ዓ', 'ቀ'],
  STANDALONENARROWWEEKDAYS: ['ሰ', 'ሰ', 'ሠ', 'ረ', 'ሓ', 'ዓ', 'ቀ'],
  SHORTQUARTERS: ['ር1', 'ር2', 'ር3', 'ር4'],
  QUARTERS: ['ቀዳማይ ርብዒ', 'ካልኣይ ርብዒ', 'ሳልሳይ ርብዒ', 'ራብዓይ ርብዒ'],
  AMPMS: ['ንጉሆ ሰዓተ', 'ድሕር ሰዓት'],
  DATEFORMATS: ['EEEE፣ dd MMMM መዓልቲ y G', 'dd MMMM y', 'dd-MMM-y', 'dd/MM/yy'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale ti_ER.
 */
goog.i18n.DateTimeSymbols_ti_ER = {
  ERAS: ['ዓ/ዓ', 'ዓ/ም'],
  ERANAMES: ['ዓመተ ዓለም', 'ዓመተ ምህረት'],
  NARROWMONTHS: ['ጥ', 'ለ', 'መ', 'ሚ', 'ግ', 'ሰ', 'ሓ', 'ነ', 'መ', 'ጥ', 'ሕ', 'ታ'],
  STANDALONENARROWMONTHS: ['ጥ', 'ለ', 'መ', 'ሚ', 'ግ', 'ሰ', 'ሓ', 'ነ', 'መ', 'ጥ', 'ሕ', 'ታ'],
  MONTHS: ['ጥሪ', 'ለካቲት', 'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰነ', 'ሓምለ', 'ነሓሰ', 'መስከረም', 'ጥቅምቲ', 'ሕዳር', 'ታሕሳስ'],
  STANDALONEMONTHS: ['ጥሪ', 'ለካቲት', 'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰነ', 'ሓምለ', 'ነሓሰ', 'መስከረም', 'ጥቅምቲ', 'ሕዳር', 'ታሕሳስ'],
  SHORTMONTHS: ['ጥሪ', 'ለካ', 'መጋ', 'ሚያ', 'ግን', 'ሰነ', 'ሓም', 'ነሓ', 'መስ', 'ጥቅ', 'ሕዳ', 'ታሕ'],
  STANDALONESHORTMONTHS: ['ጥሪ', 'ለካ', 'መጋ', 'ሚያ', 'ግን', 'ሰነ', 'ሓም', 'ነሓ', 'መስ', 'ጥቅ', 'ሕዳ', 'ታሕ'],
  WEEKDAYS: ['ሰንበት', 'ሰኑይ', 'ሠሉስ', 'ረቡዕ', 'ኃሙስ', 'ዓርቢ', 'ቀዳም'],
  STANDALONEWEEKDAYS: ['ሰንበት', 'ሰኑይ', 'ሰሉስ', 'ረቡዕ', 'ሓሙስ', 'ዓርቢ', 'ቀዳም'],
  SHORTWEEKDAYS: ['ሰን', 'ሰኑ', 'ሰሉ', 'ረቡ', 'ሓሙ', 'ዓር', 'ቀዳ'],
  STANDALONESHORTWEEKDAYS: ['ሰን', 'ሰኑ', 'ሰሉ', 'ረቡ', 'ሓሙ', 'ዓር', 'ቀዳ'],
  NARROWWEEKDAYS: ['ሰ', 'ሰ', 'ሰ', 'ረ', 'ሓ', 'ዓ', 'ቀ'],
  STANDALONENARROWWEEKDAYS: ['ሰ', 'ሰ', 'ሰ', 'ረ', 'ሓ', 'ዓ', 'ቀ'],
  SHORTQUARTERS: ['ር1', 'ር2', 'ር3', 'ር4'],
  QUARTERS: ['ቀዳማይ ርብዒ', 'ካልኣይ ርብዒ', 'ሳልሳይ ርብዒ', 'ራብዓይ ርብዒ'],
  AMPMS: ['ንጉሆ ሰዓተ', 'ድሕር ሰዓት'],
  DATEFORMATS: ['EEEE፣ dd MMMM መዓልቲ y G', 'dd MMMM y', 'dd-MMM-y', 'dd/MM/yy'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale ti_ET.
 */
goog.i18n.DateTimeSymbols_ti_ET = goog.i18n.DateTimeSymbols_ti;


/**
 * Date/time formatting symbols for locale to.
 */
goog.i18n.DateTimeSymbols_to = {
  ERAS: ['KM', 'TS'],
  ERANAMES: ['ki muʻa', 'taʻu ʻo Sīsū'],
  NARROWMONTHS: ['S', 'F', 'M', 'E', 'M', 'S', 'S', 'A', 'S', 'O', 'N', 'T'],
  STANDALONENARROWMONTHS: ['S', 'F', 'M', 'E', 'M', 'S', 'S', 'A', 'S', 'O', 'N', 'T'],
  MONTHS: ['Sānuali', 'Fēpueli', 'Maʻasi', 'ʻEpeleli', 'Mē', 'Sune', 'Siulai', 'ʻAokosi', 'Sepitema', 'ʻOkatopa', 'Nōvema', 'Tīsema'],
  STANDALONEMONTHS: ['Sānuali', 'Fēpueli', 'Maʻasi', 'ʻEpeleli', 'Mē', 'Sune', 'Siulai', 'ʻAokosi', 'Sepitema', 'ʻOkatopa', 'Nōvema', 'Tīsema'],
  SHORTMONTHS: ['Sān', 'Fēp', 'Maʻa', 'ʻEpe', 'Mē', 'Sun', 'Siu', 'ʻAok', 'Sep', 'ʻOka', 'Nōv', 'Tīs'],
  STANDALONESHORTMONTHS: ['Sān', 'Fēp', 'Maʻa', 'ʻEpe', 'Mē', 'Sun', 'Siu', 'ʻAok', 'Sep', 'ʻOka', 'Nōv', 'Tīs'],
  WEEKDAYS: ['Sāpate', 'Mōnite', 'Tūsite', 'Pulelulu', 'Tuʻapulelulu', 'Falaite', 'Tokonaki'],
  STANDALONEWEEKDAYS: ['Sāpate', 'Mōnite', 'Tūsite', 'Pulelulu', 'Tuʻapulelulu', 'Falaite', 'Tokonaki'],
  SHORTWEEKDAYS: ['Sāp', 'Mōn', 'Tūs', 'Pul', 'Tuʻa', 'Fal', 'Tok'],
  STANDALONESHORTWEEKDAYS: ['Sāp', 'Mōn', 'Tūs', 'Pul', 'Tuʻa', 'Fal', 'Tok'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'P', 'T', 'F', 'T'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'P', 'T', 'F', 'T'],
  SHORTQUARTERS: ['K1', 'K2', 'K3', 'K4'],
  QUARTERS: ['kuata ʻuluaki', 'kuata ua', 'kuata tolu', 'kuata fā'],
  AMPMS: ['hengihengi', 'efiafi'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'd/M/yy'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1}, {0}', '{1}, {0}', '{1}, {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale to_TO.
 */
goog.i18n.DateTimeSymbols_to_TO = goog.i18n.DateTimeSymbols_to;


/**
 * Date/time formatting symbols for locale tr_CY.
 */
goog.i18n.DateTimeSymbols_tr_CY = {
  ERAS: ['MÖ', 'MS'],
  ERANAMES: ['Milattan Önce', 'Milattan Sonra'],
  NARROWMONTHS: ['O', 'Ş', 'M', 'N', 'M', 'H', 'T', 'A', 'E', 'E', 'K', 'A'],
  STANDALONENARROWMONTHS: ['O', 'Ş', 'M', 'N', 'M', 'H', 'T', 'A', 'E', 'E', 'K', 'A'],
  MONTHS: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
  STANDALONEMONTHS: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
  SHORTMONTHS: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
  STANDALONESHORTMONTHS: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
  WEEKDAYS: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
  STANDALONEWEEKDAYS: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
  SHORTWEEKDAYS: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
  STANDALONESHORTWEEKDAYS: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
  NARROWWEEKDAYS: ['P', 'P', 'S', 'Ç', 'P', 'C', 'C'],
  STANDALONENARROWWEEKDAYS: ['P', 'P', 'S', 'Ç', 'P', 'C', 'C'],
  SHORTQUARTERS: ['Ç1', 'Ç2', 'Ç3', 'Ç4'],
  QUARTERS: ['1. çeyrek', '2. çeyrek', '3. çeyrek', '4. çeyrek'],
  AMPMS: ['ÖÖ', 'ÖS'],
  DATEFORMATS: ['d MMMM y EEEE', 'd MMMM y', 'd MMM y', 'd.MM.y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale tr_TR.
 */
goog.i18n.DateTimeSymbols_tr_TR = goog.i18n.DateTimeSymbols_tr;


/**
 * Date/time formatting symbols for locale twq.
 */
goog.i18n.DateTimeSymbols_twq = {
  ERAS: ['IJ', 'IZ'],
  ERANAMES: ['Isaa jine', 'Isaa zamanoo'],
  NARROWMONTHS: ['Ž', 'F', 'M', 'A', 'M', 'Ž', 'Ž', 'U', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['Ž', 'F', 'M', 'A', 'M', 'Ž', 'Ž', 'U', 'S', 'O', 'N', 'D'],
  MONTHS: ['Žanwiye', 'Feewiriye', 'Marsi', 'Awiril', 'Me', 'Žuweŋ', 'Žuyye', 'Ut', 'Sektanbur', 'Oktoobur', 'Noowanbur', 'Deesanbur'],
  STANDALONEMONTHS: ['Žanwiye', 'Feewiriye', 'Marsi', 'Awiril', 'Me', 'Žuweŋ', 'Žuyye', 'Ut', 'Sektanbur', 'Oktoobur', 'Noowanbur', 'Deesanbur'],
  SHORTMONTHS: ['Žan', 'Fee', 'Mar', 'Awi', 'Me', 'Žuw', 'Žuy', 'Ut', 'Sek', 'Okt', 'Noo', 'Dee'],
  STANDALONESHORTMONTHS: ['Žan', 'Fee', 'Mar', 'Awi', 'Me', 'Žuw', 'Žuy', 'Ut', 'Sek', 'Okt', 'Noo', 'Dee'],
  WEEKDAYS: ['Alhadi', 'Atinni', 'Atalaata', 'Alarba', 'Alhamiisa', 'Alzuma', 'Asibti'],
  STANDALONEWEEKDAYS: ['Alhadi', 'Atinni', 'Atalaata', 'Alarba', 'Alhamiisa', 'Alzuma', 'Asibti'],
  SHORTWEEKDAYS: ['Alh', 'Ati', 'Ata', 'Ala', 'Alm', 'Alz', 'Asi'],
  STANDALONESHORTWEEKDAYS: ['Alh', 'Ati', 'Ata', 'Ala', 'Alm', 'Alz', 'Asi'],
  NARROWWEEKDAYS: ['H', 'T', 'T', 'L', 'L', 'L', 'S'],
  STANDALONENARROWWEEKDAYS: ['H', 'T', 'T', 'L', 'L', 'L', 'S'],
  SHORTQUARTERS: ['A1', 'A2', 'A3', 'A4'],
  QUARTERS: ['Arrubu 1', 'Arrubu 2', 'Arrubu 3', 'Arrubu 4'],
  AMPMS: ['Subbaahi', 'Zaarikay b'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'd/M/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale twq_NE.
 */
goog.i18n.DateTimeSymbols_twq_NE = goog.i18n.DateTimeSymbols_twq;


/**
 * Date/time formatting symbols for locale tzm.
 */
goog.i18n.DateTimeSymbols_tzm = {
  ERAS: ['ZƐ', 'ḌƐ'],
  ERANAMES: ['Zdat Ɛisa (TAƔ)', 'Ḍeffir Ɛisa (TAƔ)'],
  NARROWMONTHS: ['Y', 'Y', 'M', 'I', 'M', 'Y', 'Y', 'Ɣ', 'C', 'K', 'N', 'D'],
  STANDALONENARROWMONTHS: ['Y', 'Y', 'M', 'I', 'M', 'Y', 'Y', 'Ɣ', 'C', 'K', 'N', 'D'],
  MONTHS: ['Yennayer', 'Yebrayer', 'Mars', 'Ibrir', 'Mayyu', 'Yunyu', 'Yulyuz', 'Ɣuct', 'Cutanbir', 'Kṭuber', 'Nwanbir', 'Dujanbir'],
  STANDALONEMONTHS: ['Yennayer', 'Yebrayer', 'Mars', 'Ibrir', 'Mayyu', 'Yunyu', 'Yulyuz', 'Ɣuct', 'Cutanbir', 'Kṭuber', 'Nwanbir', 'Dujanbir'],
  SHORTMONTHS: ['Yen', 'Yeb', 'Mar', 'Ibr', 'May', 'Yun', 'Yul', 'Ɣuc', 'Cut', 'Kṭu', 'Nwa', 'Duj'],
  STANDALONESHORTMONTHS: ['Yen', 'Yeb', 'Mar', 'Ibr', 'May', 'Yun', 'Yul', 'Ɣuc', 'Cut', 'Kṭu', 'Nwa', 'Duj'],
  WEEKDAYS: ['Asamas', 'Aynas', 'Asinas', 'Akras', 'Akwas', 'Asimwas', 'Asiḍyas'],
  STANDALONEWEEKDAYS: ['Asamas', 'Aynas', 'Asinas', 'Akras', 'Akwas', 'Asimwas', 'Asiḍyas'],
  SHORTWEEKDAYS: ['Asa', 'Ayn', 'Asn', 'Akr', 'Akw', 'Asm', 'Asḍ'],
  STANDALONESHORTWEEKDAYS: ['Asa', 'Ayn', 'Asn', 'Akr', 'Akw', 'Asm', 'Asḍ'],
  NARROWWEEKDAYS: ['A', 'A', 'A', 'A', 'A', 'A', 'A'],
  STANDALONENARROWWEEKDAYS: ['A', 'A', 'A', 'A', 'A', 'A', 'A'],
  SHORTQUARTERS: ['IA1', 'IA2', 'IA3', 'IA4'],
  QUARTERS: ['Imir adamsan 1', 'Imir adamsan 2', 'Imir adamsan 3', 'Imir adamsan 4'],
  AMPMS: ['Zdat azal', 'Ḍeffir aza'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 5,
  WEEKENDRANGE: [4, 5],
  FIRSTWEEKCUTOFFDAY: 4
};


/**
 * Date/time formatting symbols for locale tzm_MA.
 */
goog.i18n.DateTimeSymbols_tzm_MA = goog.i18n.DateTimeSymbols_tzm;


/**
 * Date/time formatting symbols for locale ug.
 */
goog.i18n.DateTimeSymbols_ug = {
  ERAS: ['BCE', 'مىلادىيە'],
  ERANAMES: ['مىلادىيەدىن بۇرۇن', 'مىلادىيە'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['يانۋار', 'فېۋرال', 'مارت', 'ئاپرېل', 'ماي', 'ئىيۇن', 'ئىيۇل', 'ئاۋغۇست', 'سېنتەبىر', 'ئۆكتەبىر', 'نويابىر', 'دېكابىر'],
  STANDALONEMONTHS: ['يانۋار', 'فېۋرال', 'مارت', 'ئاپرېل', 'ماي', 'ئىيۇن', 'ئىيۇل', 'ئاۋغۇست', 'سېنتەبىر', 'ئۆكتەبىر', 'نويابىر', 'دېكابىر'],
  SHORTMONTHS: ['يانۋار', 'فېۋرال', 'مارت', 'ئاپرېل', 'ماي', 'ئىيۇن', 'ئىيۇل', 'ئاۋغۇست', 'سېنتەبىر', 'ئۆكتەبىر', 'نويابىر', 'دېكابىر'],
  STANDALONESHORTMONTHS: ['يانۋار', 'فېۋرال', 'مارت', 'ئاپرېل', 'ماي', 'ئىيۇن', 'ئىيۇل', 'ئاۋغۇست', 'سېنتەبىر', 'ئۆكتەبىر', 'نويابىر', 'دېكابىر'],
  WEEKDAYS: ['يەكشەنبە', 'دۈشەنبە', 'سەيشەنبە', 'چارشەنبە', 'پەيشەنبە', 'جۈمە', 'شەنبە'],
  STANDALONEWEEKDAYS: ['يەكشەنبە', 'دۈشەنبە', 'سەيشەنبە', 'چارشەنبە', 'پەيشەنبە', 'جۈمە', 'شەنبە'],
  SHORTWEEKDAYS: ['يە', 'دۈ', 'سە', 'چا', 'پە', 'جۈ', 'شە'],
  STANDALONESHORTWEEKDAYS: ['يە', 'دۈ', 'سە', 'چا', 'پە', 'جۈ', 'شە'],
  NARROWWEEKDAYS: ['ي', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
  STANDALONENARROWWEEKDAYS: ['ي', 'د', 'س', 'چ', 'پ', 'ج', 'ش'],
  SHORTQUARTERS: ['1-پەسىل', '2-پەسىل', '3-پەسىل', '4-پەسىل'],
  QUARTERS: ['بىرىنچى پەسىل', 'ئىككىنچى پەسىل', 'ئۈچىنچى پەسىل', 'تۆتىنچى پەسىل'],
  AMPMS: ['چۈشتىن بۇرۇن', 'چۈشتىن كېيىن'],
  DATEFORMATS: ['y d-MMMM، EEEE', 'd-MMMM، y', 'd-MMM، y', 'y-MM-dd'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1}، {0}', '{1}، {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale ug_CN.
 */
goog.i18n.DateTimeSymbols_ug_CN = goog.i18n.DateTimeSymbols_ug;


/**
 * Date/time formatting symbols for locale uk_UA.
 */
goog.i18n.DateTimeSymbols_uk_UA = goog.i18n.DateTimeSymbols_uk;


/**
 * Date/time formatting symbols for locale ur_IN.
 */
goog.i18n.DateTimeSymbols_ur_IN = {
  ZERODIGIT: 0x06F0,
  ERAS: ['قبل مسیح', 'عیسوی'],
  ERANAMES: ['قبل مسیح', 'عیسوی'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
  STANDALONEMONTHS: ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
  SHORTMONTHS: ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
  STANDALONESHORTMONTHS: ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
  WEEKDAYS: ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'],
  STANDALONEWEEKDAYS: ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'],
  SHORTWEEKDAYS: ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'],
  STANDALONESHORTWEEKDAYS: ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['پہلی سہ ماہی', 'دوسری سہ ماہی', 'تیسری سہ ماہی', 'چوتهی سہ ماہی'],
  QUARTERS: ['پہلی سہ ماہی', 'دوسری سہ ماہی', 'تیسری سہ ماہی', 'چوتهی سہ ماہی'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE، d MMMM، y', 'd MMMM، y', 'y MMM d', 'd/M/yy'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [6, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale ur_PK.
 */
goog.i18n.DateTimeSymbols_ur_PK = goog.i18n.DateTimeSymbols_ur;


/**
 * Date/time formatting symbols for locale uz_Arab.
 */
goog.i18n.DateTimeSymbols_uz_Arab = {
  ZERODIGIT: 0x06F0,
  ERAS: ['BCE', 'CE'],
  ERANAMES: ['BCE', 'CE'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['جنوری', 'فبروری', 'مارچ', 'اپریل', 'می', 'جون', 'جولای', 'اگست', 'سپتمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
  STANDALONEMONTHS: ['جنوری', 'فبروری', 'مارچ', 'اپریل', 'می', 'جون', 'جولای', 'اگست', 'سپتمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
  SHORTMONTHS: ['جنو', 'فبر', 'مار', 'اپر', 'می', 'جون', 'جول', 'اگس', 'سپت', 'اکت', 'نوم', 'دسم'],
  STANDALONESHORTMONTHS: ['جنو', 'فبر', 'مار', 'اپر', 'می', 'جون', 'جول', 'اگس', 'سپت', 'اکت', 'نوم', 'دسم'],
  WEEKDAYS: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
  STANDALONEWEEKDAYS: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
  SHORTWEEKDAYS: ['ی.', 'د.', 'س.', 'چ.', 'پ.', 'ج.', 'ش.'],
  STANDALONESHORTWEEKDAYS: ['ی.', 'د.', 'س.', 'چ.', 'پ.', 'ج.', 'ش.'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['y MMMM d, EEEE', 'y MMMM d', 'y MMM d', 'y-MM-dd'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 5,
  WEEKENDRANGE: [3, 4],
  FIRSTWEEKCUTOFFDAY: 4
};


/**
 * Date/time formatting symbols for locale uz_Arab_AF.
 */
goog.i18n.DateTimeSymbols_uz_Arab_AF = {
  ZERODIGIT: 0x06F0,
  ERAS: ['BCE', 'CE'],
  ERANAMES: ['BCE', 'CE'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['جنوری', 'فبروری', 'مارچ', 'اپریل', 'می', 'جون', 'جولای', 'اگست', 'سپتمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
  STANDALONEMONTHS: ['جنوری', 'فبروری', 'مارچ', 'اپریل', 'می', 'جون', 'جولای', 'اگست', 'سپتمبر', 'اکتوبر', 'نومبر', 'دسمبر'],
  SHORTMONTHS: ['جنو', 'فبر', 'مار', 'اپر', 'می', 'جون', 'جول', 'اگس', 'سپت', 'اکت', 'نوم', 'دسم'],
  STANDALONESHORTMONTHS: ['جنو', 'فبر', 'مار', 'اپر', 'می', 'جون', 'جول', 'اگس', 'سپت', 'اکت', 'نوم', 'دسم'],
  WEEKDAYS: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
  STANDALONEWEEKDAYS: ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'],
  SHORTWEEKDAYS: ['ی.', 'د.', 'س.', 'چ.', 'پ.', 'ج.', 'ش.'],
  STANDALONESHORTWEEKDAYS: ['ی.', 'د.', 'س.', 'چ.', 'پ.', 'ج.', 'ش.'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['y MMMM d, EEEE', 'y MMMM d', 'y MMM d', 'y-MM-dd'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 5,
  WEEKENDRANGE: [3, 4],
  FIRSTWEEKCUTOFFDAY: 4
};


/**
 * Date/time formatting symbols for locale uz_Cyrl.
 */
goog.i18n.DateTimeSymbols_uz_Cyrl = {
  ERAS: ['м.а.', 'милодий'],
  ERANAMES: ['милоддан аввалги', 'милодий'],
  NARROWMONTHS: ['Я', 'Ф', 'М', 'А', 'М', 'И', 'И', 'А', 'С', 'О', 'Н', 'Д'],
  STANDALONENARROWMONTHS: ['Я', 'Ф', 'М', 'А', 'М', 'И', 'И', 'А', 'С', 'О', 'Н', 'Д'],
  MONTHS: ['январ', 'феврал', 'март', 'апрел', 'май', 'июн', 'июл', 'август', 'сентябр', 'октябр', 'ноябр', 'декабр'],
  STANDALONEMONTHS: ['Январ', 'Феврал', 'Март', 'Апрел', 'Май', 'Июн', 'Июл', 'Август', 'Сентябр', 'Октябр', 'Ноябр', 'Декабр'],
  SHORTMONTHS: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
  STANDALONESHORTMONTHS: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  WEEKDAYS: ['якшанба', 'душанба', 'сешанба', 'чоршанба', 'пайшанба', 'жума', 'шанба'],
  STANDALONEWEEKDAYS: ['Якшанба', 'Душанба', 'Сешанба', 'Чоршанба', 'Пайшанба', 'Жума', 'Шанба'],
  SHORTWEEKDAYS: ['якш', 'душ', 'сеш', 'чор', 'пай', 'жум', 'шан'],
  STANDALONESHORTWEEKDAYS: ['Якш', 'Душ', 'Сеш', 'Чор', 'Пай', 'Жум', 'Шан'],
  NARROWWEEKDAYS: ['Я', 'Д', 'С', 'Ч', 'П', 'Ж', 'Ш'],
  STANDALONENARROWWEEKDAYS: ['Я', 'Д', 'С', 'Ч', 'П', 'Ж', 'Ш'],
  SHORTQUARTERS: ['1-ч', '2-ч', '3-ч', '4-ч'],
  QUARTERS: ['1-чорак', '2-чорак', '3-чорак', '4-чорак'],
  AMPMS: ['ТО', 'ТК'],
  DATEFORMATS: ['EEEE, dd MMMM, y', 'd MMMM, y', 'd MMM, y', 'dd/MM/yy'],
  TIMEFORMATS: ['HH:mm:ss (zzzz)', 'HH:mm:ss (z)', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale uz_Cyrl_UZ.
 */
goog.i18n.DateTimeSymbols_uz_Cyrl_UZ = {
  ERAS: ['м.а.', 'милодий'],
  ERANAMES: ['милоддан аввалги', 'милодий'],
  NARROWMONTHS: ['Я', 'Ф', 'М', 'А', 'М', 'И', 'И', 'А', 'С', 'О', 'Н', 'Д'],
  STANDALONENARROWMONTHS: ['Я', 'Ф', 'М', 'А', 'М', 'И', 'И', 'А', 'С', 'О', 'Н', 'Д'],
  MONTHS: ['январ', 'феврал', 'март', 'апрел', 'май', 'июн', 'июл', 'август', 'сентябр', 'октябр', 'ноябр', 'декабр'],
  STANDALONEMONTHS: ['Январ', 'Феврал', 'Март', 'Апрел', 'Май', 'Июн', 'Июл', 'Август', 'Сентябр', 'Октябр', 'Ноябр', 'Декабр'],
  SHORTMONTHS: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
  STANDALONESHORTMONTHS: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  WEEKDAYS: ['якшанба', 'душанба', 'сешанба', 'чоршанба', 'пайшанба', 'жума', 'шанба'],
  STANDALONEWEEKDAYS: ['Якшанба', 'Душанба', 'Сешанба', 'Чоршанба', 'Пайшанба', 'Жума', 'Шанба'],
  SHORTWEEKDAYS: ['якш', 'душ', 'сеш', 'чор', 'пай', 'жум', 'шан'],
  STANDALONESHORTWEEKDAYS: ['Якш', 'Душ', 'Сеш', 'Чор', 'Пай', 'Жум', 'Шан'],
  NARROWWEEKDAYS: ['Я', 'Д', 'С', 'Ч', 'П', 'Ж', 'Ш'],
  STANDALONENARROWWEEKDAYS: ['Я', 'Д', 'С', 'Ч', 'П', 'Ж', 'Ш'],
  SHORTQUARTERS: ['1-ч', '2-ч', '3-ч', '4-ч'],
  QUARTERS: ['1-чорак', '2-чорак', '3-чорак', '4-чорак'],
  AMPMS: ['ТО', 'ТК'],
  DATEFORMATS: ['EEEE, dd MMMM, y', 'd MMMM, y', 'd MMM, y', 'dd/MM/yy'],
  TIMEFORMATS: ['HH:mm:ss (zzzz)', 'HH:mm:ss (z)', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale uz_Latn.
 */
goog.i18n.DateTimeSymbols_uz_Latn = goog.i18n.DateTimeSymbols_uz;


/**
 * Date/time formatting symbols for locale uz_Latn_UZ.
 */
goog.i18n.DateTimeSymbols_uz_Latn_UZ = goog.i18n.DateTimeSymbols_uz;


/**
 * Date/time formatting symbols for locale vai.
 */
goog.i18n.DateTimeSymbols_vai = {
  ERAS: ['BCE', 'CE'],
  ERANAMES: ['BCE', 'CE'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['ꖨꕪꖃ ꔞꕮ', 'ꕒꕡꖝꖕ', 'ꕾꖺ', 'ꖢꖕ', 'ꖑꕱ', '6', '7', 'ꗛꔕ', 'ꕢꕌ', 'ꕭꖃ', 'ꔞꘋꕔꕿ ꕸꖃꗏ', 'ꖨꕪꕱ ꗏꕮ'],
  STANDALONEMONTHS: ['ꖨꕪꖃ ꔞꕮ', 'ꕒꕡꖝꖕ', 'ꕾꖺ', 'ꖢꖕ', 'ꖑꕱ', '6', '7', 'ꗛꔕ', 'ꕢꕌ', 'ꕭꖃ', 'ꔞꘋꕔꕿ ꕸꖃꗏ', 'ꖨꕪꕱ ꗏꕮ'],
  SHORTMONTHS: ['ꖨꕪꖃ ꔞꕮ', 'ꕒꕡꖝꖕ', 'ꕾꖺ', 'ꖢꖕ', 'ꖑꕱ', '6', '7', 'ꗛꔕ', 'ꕢꕌ', 'ꕭꖃ', 'ꔞꘋꕔꕿ ꕸꖃꗏ', 'ꖨꕪꕱ ꗏꕮ'],
  STANDALONESHORTMONTHS: ['ꖨꕪꖃ ꔞꕮ', 'ꕒꕡꖝꖕ', 'ꕾꖺ', 'ꖢꖕ', 'ꖑꕱ', '6', '7', 'ꗛꔕ', 'ꕢꕌ', 'ꕭꖃ', 'ꔞꘋꕔꕿ ꕸꖃꗏ', 'ꖨꕪꕱ ꗏꕮ'],
  WEEKDAYS: ['ꕞꕌꔵ', 'ꗳꗡꘉ', 'ꕚꕞꕚ', 'ꕉꕞꕒ', 'ꕉꔤꕆꕢ', 'ꕉꔤꕀꕮ', 'ꔻꔬꔳ'],
  STANDALONEWEEKDAYS: ['ꕞꕌꔵ', 'ꗳꗡꘉ', 'ꕚꕞꕚ', 'ꕉꕞꕒ', 'ꕉꔤꕆꕢ', 'ꕉꔤꕀꕮ', 'ꔻꔬꔳ'],
  SHORTWEEKDAYS: ['ꕞꕌꔵ', 'ꗳꗡꘉ', 'ꕚꕞꕚ', 'ꕉꕞꕒ', 'ꕉꔤꕆꕢ', 'ꕉꔤꕀꕮ', 'ꔻꔬꔳ'],
  STANDALONESHORTWEEKDAYS: ['ꕞꕌꔵ', 'ꗳꗡꘉ', 'ꕚꕞꕚ', 'ꕉꕞꕒ', 'ꕉꔤꕆꕢ', 'ꕉꔤꕀꕮ', 'ꔻꔬꔳ'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale vai_Latn.
 */
goog.i18n.DateTimeSymbols_vai_Latn = {
  ERAS: ['BCE', 'CE'],
  ERANAMES: ['BCE', 'CE'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['luukao kemã', 'ɓandaɓu', 'vɔɔ', 'fulu', 'goo', '6', '7', 'kɔnde', 'saah', 'galo', 'kenpkato ɓololɔ', 'luukao lɔma'],
  STANDALONEMONTHS: ['luukao kemã', 'ɓandaɓu', 'vɔɔ', 'fulu', 'goo', '6', '7', 'kɔnde', 'saah', 'galo', 'kenpkato ɓololɔ', 'luukao lɔma'],
  SHORTMONTHS: ['luukao kemã', 'ɓandaɓu', 'vɔɔ', 'fulu', 'goo', '6', '7', 'kɔnde', 'saah', 'galo', 'kenpkato ɓololɔ', 'luukao lɔma'],
  STANDALONESHORTMONTHS: ['luukao kemã', 'ɓandaɓu', 'vɔɔ', 'fulu', 'goo', '6', '7', 'kɔnde', 'saah', 'galo', 'kenpkato ɓololɔ', 'luukao lɔma'],
  WEEKDAYS: ['lahadi', 'tɛɛnɛɛ', 'talata', 'alaba', 'aimisa', 'aijima', 'siɓiti'],
  STANDALONEWEEKDAYS: ['lahadi', 'tɛɛnɛɛ', 'talata', 'alaba', 'aimisa', 'aijima', 'siɓiti'],
  SHORTWEEKDAYS: ['lahadi', 'tɛɛnɛɛ', 'talata', 'alaba', 'aimisa', 'aijima', 'siɓiti'],
  STANDALONESHORTWEEKDAYS: ['lahadi', 'tɛɛnɛɛ', 'talata', 'alaba', 'aimisa', 'aijima', 'siɓiti'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale vai_Latn_LR.
 */
goog.i18n.DateTimeSymbols_vai_Latn_LR = {
  ERAS: ['BCE', 'CE'],
  ERANAMES: ['BCE', 'CE'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['luukao kemã', 'ɓandaɓu', 'vɔɔ', 'fulu', 'goo', '6', '7', 'kɔnde', 'saah', 'galo', 'kenpkato ɓololɔ', 'luukao lɔma'],
  STANDALONEMONTHS: ['luukao kemã', 'ɓandaɓu', 'vɔɔ', 'fulu', 'goo', '6', '7', 'kɔnde', 'saah', 'galo', 'kenpkato ɓololɔ', 'luukao lɔma'],
  SHORTMONTHS: ['luukao kemã', 'ɓandaɓu', 'vɔɔ', 'fulu', 'goo', '6', '7', 'kɔnde', 'saah', 'galo', 'kenpkato ɓololɔ', 'luukao lɔma'],
  STANDALONESHORTMONTHS: ['luukao kemã', 'ɓandaɓu', 'vɔɔ', 'fulu', 'goo', '6', '7', 'kɔnde', 'saah', 'galo', 'kenpkato ɓololɔ', 'luukao lɔma'],
  WEEKDAYS: ['lahadi', 'tɛɛnɛɛ', 'talata', 'alaba', 'aimisa', 'aijima', 'siɓiti'],
  STANDALONEWEEKDAYS: ['lahadi', 'tɛɛnɛɛ', 'talata', 'alaba', 'aimisa', 'aijima', 'siɓiti'],
  SHORTWEEKDAYS: ['lahadi', 'tɛɛnɛɛ', 'talata', 'alaba', 'aimisa', 'aijima', 'siɓiti'],
  STANDALONESHORTWEEKDAYS: ['lahadi', 'tɛɛnɛɛ', 'talata', 'alaba', 'aimisa', 'aijima', 'siɓiti'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['h:mm:ss a zzzz', 'h:mm:ss a z', 'h:mm:ss a', 'h:mm a'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale vai_Vaii.
 */
goog.i18n.DateTimeSymbols_vai_Vaii = goog.i18n.DateTimeSymbols_vai;


/**
 * Date/time formatting symbols for locale vai_Vaii_LR.
 */
goog.i18n.DateTimeSymbols_vai_Vaii_LR = goog.i18n.DateTimeSymbols_vai;


/**
 * Date/time formatting symbols for locale vi_VN.
 */
goog.i18n.DateTimeSymbols_vi_VN = goog.i18n.DateTimeSymbols_vi;


/**
 * Date/time formatting symbols for locale vun.
 */
goog.i18n.DateTimeSymbols_vun = {
  ERAS: ['KK', 'BK'],
  ERANAMES: ['Kabla ya Kristu', 'Baada ya Kristu'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['Januari', 'Februari', 'Machi', 'Aprilyi', 'Mei', 'Junyi', 'Julyai', 'Agusti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba'],
  STANDALONEMONTHS: ['Januari', 'Februari', 'Machi', 'Aprilyi', 'Mei', 'Junyi', 'Julyai', 'Agusti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Des'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ago', 'Sep', 'Okt', 'Nov', 'Des'],
  WEEKDAYS: ['Jumapilyi', 'Jumatatuu', 'Jumanne', 'Jumatanu', 'Alhamisi', 'Ijumaa', 'Jumamosi'],
  STANDALONEWEEKDAYS: ['Jumapilyi', 'Jumatatuu', 'Jumanne', 'Jumatanu', 'Alhamisi', 'Ijumaa', 'Jumamosi'],
  SHORTWEEKDAYS: ['Jpi', 'Jtt', 'Jnn', 'Jtn', 'Alh', 'Iju', 'Jmo'],
  STANDALONESHORTWEEKDAYS: ['Jpi', 'Jtt', 'Jnn', 'Jtn', 'Alh', 'Iju', 'Jmo'],
  NARROWWEEKDAYS: ['J', 'J', 'J', 'J', 'A', 'I', 'J'],
  STANDALONENARROWWEEKDAYS: ['J', 'J', 'J', 'J', 'A', 'I', 'J'],
  SHORTQUARTERS: ['R1', 'R2', 'R3', 'R4'],
  QUARTERS: ['Robo 1', 'Robo 2', 'Robo 3', 'Robo 4'],
  AMPMS: ['utuko', 'kyiukonyi'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale vun_TZ.
 */
goog.i18n.DateTimeSymbols_vun_TZ = goog.i18n.DateTimeSymbols_vun;


/**
 * Date/time formatting symbols for locale wae.
 */
goog.i18n.DateTimeSymbols_wae = {
  ERAS: ['v. Chr.', 'n. Chr'],
  ERANAMES: ['v. Chr.', 'n. Chr'],
  NARROWMONTHS: ['J', 'H', 'M', 'A', 'M', 'B', 'H', 'Ö', 'H', 'W', 'W', 'C'],
  STANDALONENARROWMONTHS: ['J', 'H', 'M', 'A', 'M', 'B', 'H', 'Ö', 'H', 'W', 'W', 'C'],
  MONTHS: ['Jenner', 'Hornig', 'Märze', 'Abrille', 'Meije', 'Bráčet', 'Heiwet', 'Öigšte', 'Herbštmánet', 'Wímánet', 'Wintermánet', 'Chrištmánet'],
  STANDALONEMONTHS: ['Jenner', 'Hornig', 'Märze', 'Abrille', 'Meije', 'Bráčet', 'Heiwet', 'Öigšte', 'Herbštmánet', 'Wímánet', 'Wintermánet', 'Chrištmánet'],
  SHORTMONTHS: ['Jen', 'Hor', 'Mär', 'Abr', 'Mei', 'Brá', 'Hei', 'Öig', 'Her', 'Wím', 'Win', 'Chr'],
  STANDALONESHORTMONTHS: ['Jen', 'Hor', 'Mär', 'Abr', 'Mei', 'Brá', 'Hei', 'Öig', 'Her', 'Wím', 'Win', 'Chr'],
  WEEKDAYS: ['Sunntag', 'Mäntag', 'Zištag', 'Mittwuč', 'Fróntag', 'Fritag', 'Samštag'],
  STANDALONEWEEKDAYS: ['Sunntag', 'Mäntag', 'Zištag', 'Mittwuč', 'Fróntag', 'Fritag', 'Samštag'],
  SHORTWEEKDAYS: ['Sun', 'Män', 'Ziš', 'Mit', 'Fró', 'Fri', 'Sam'],
  STANDALONESHORTWEEKDAYS: ['Sun', 'Män', 'Ziš', 'Mit', 'Fró', 'Fri', 'Sam'],
  NARROWWEEKDAYS: ['S', 'M', 'Z', 'M', 'F', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'Z', 'M', 'F', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['1. quartal', '2. quartal', '3. quartal', '4. quartal'],
  AMPMS: ['AM', 'PM'],
  DATEFORMATS: ['EEEE, d. MMMM y', 'd. MMMM y', 'd. MMM y', 'y-MM-dd'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 3
};


/**
 * Date/time formatting symbols for locale wae_CH.
 */
goog.i18n.DateTimeSymbols_wae_CH = goog.i18n.DateTimeSymbols_wae;


/**
 * Date/time formatting symbols for locale xog.
 */
goog.i18n.DateTimeSymbols_xog = {
  ERAS: ['AZ', 'AF'],
  ERANAMES: ['Kulisto nga azilawo', 'Kulisto nga affile'],
  NARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  STANDALONENARROWMONTHS: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  MONTHS: ['Janwaliyo', 'Febwaliyo', 'Marisi', 'Apuli', 'Maayi', 'Juuni', 'Julaayi', 'Agusito', 'Sebuttemba', 'Okitobba', 'Novemba', 'Desemba'],
  STANDALONEMONTHS: ['Janwaliyo', 'Febwaliyo', 'Marisi', 'Apuli', 'Maayi', 'Juuni', 'Julaayi', 'Agusito', 'Sebuttemba', 'Okitobba', 'Novemba', 'Desemba'],
  SHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apu', 'Maa', 'Juu', 'Jul', 'Agu', 'Seb', 'Oki', 'Nov', 'Des'],
  STANDALONESHORTMONTHS: ['Jan', 'Feb', 'Mar', 'Apu', 'Maa', 'Juu', 'Jul', 'Agu', 'Seb', 'Oki', 'Nov', 'Des'],
  WEEKDAYS: ['Sabiiti', 'Balaza', 'Owokubili', 'Owokusatu', 'Olokuna', 'Olokutaanu', 'Olomukaaga'],
  STANDALONEWEEKDAYS: ['Sabiiti', 'Balaza', 'Owokubili', 'Owokusatu', 'Olokuna', 'Olokutaanu', 'Olomukaaga'],
  SHORTWEEKDAYS: ['Sabi', 'Bala', 'Kubi', 'Kusa', 'Kuna', 'Kuta', 'Muka'],
  STANDALONESHORTWEEKDAYS: ['Sabi', 'Bala', 'Kubi', 'Kusa', 'Kuna', 'Kuta', 'Muka'],
  NARROWWEEKDAYS: ['S', 'B', 'B', 'S', 'K', 'K', 'M'],
  STANDALONENARROWWEEKDAYS: ['S', 'B', 'B', 'S', 'K', 'K', 'M'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Ebisera ebyomwaka ebisoka', 'Ebisera ebyomwaka ebyokubiri', 'Ebisera ebyomwaka ebyokusatu', 'Ebisera ebyomwaka ebyokuna'],
  AMPMS: ['Munkyo', 'Eigulo'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale xog_UG.
 */
goog.i18n.DateTimeSymbols_xog_UG = goog.i18n.DateTimeSymbols_xog;


/**
 * Date/time formatting symbols for locale yav.
 */
goog.i18n.DateTimeSymbols_yav = {
  ERAS: ['k.Y.', '+J.C.'],
  ERANAMES: ['katikupíen Yésuse', 'ékélémkúnupíén n'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['pikítíkítie, oólí ú kutúan', 'siɛyɛ́, oóli ú kándíɛ', 'ɔnsúmbɔl, oóli ú kátátúɛ', 'mesiŋ, oóli ú kénie', 'ensil, oóli ú kátánuɛ', 'ɔsɔn', 'efute', 'pisuyú', 'imɛŋ i puɔs', 'imɛŋ i putúk,oóli ú kátíɛ', 'makandikɛ', 'pilɔndɔ́'],
  STANDALONEMONTHS: ['pikítíkítie, oólí ú kutúan', 'siɛyɛ́, oóli ú kándíɛ', 'ɔnsúmbɔl, oóli ú kátátúɛ', 'mesiŋ, oóli ú kénie', 'ensil, oóli ú kátánuɛ', 'ɔsɔn', 'efute', 'pisuyú', 'imɛŋ i puɔs', 'imɛŋ i putúk,oóli ú kátíɛ', 'makandikɛ', 'pilɔndɔ́'],
  SHORTMONTHS: ['o.1', 'o.2', 'o.3', 'o.4', 'o.5', 'o.6', 'o.7', 'o.8', 'o.9', 'o.10', 'o.11', 'o.12'],
  STANDALONESHORTMONTHS: ['o.1', 'o.2', 'o.3', 'o.4', 'o.5', 'o.6', 'o.7', 'o.8', 'o.9', 'o.10', 'o.11', 'o.12'],
  WEEKDAYS: ['sɔ́ndiɛ', 'móndie', 'muányáŋmóndie', 'metúkpíápɛ', 'kúpélimetúkpiapɛ', 'feléte', 'séselé'],
  STANDALONEWEEKDAYS: ['sɔ́ndiɛ', 'móndie', 'muányáŋmóndie', 'metúkpíápɛ', 'kúpélimetúkpiapɛ', 'feléte', 'séselé'],
  SHORTWEEKDAYS: ['sd', 'md', 'mw', 'et', 'kl', 'fl', 'ss'],
  STANDALONESHORTWEEKDAYS: ['sd', 'md', 'mw', 'et', 'kl', 'fl', 'ss'],
  NARROWWEEKDAYS: ['s', 'm', 'm', 'e', 'k', 'f', 's'],
  STANDALONENARROWWEEKDAYS: ['s', 'm', 'm', 'e', 'k', 'f', 's'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['ndátúɛ 1', 'ndátúɛ 2', 'ndátúɛ 3', 'ndátúɛ 4'],
  AMPMS: ['kiɛmɛ́ɛm', 'kisɛ́ndɛ'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM y', 'd/M/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale yav_CM.
 */
goog.i18n.DateTimeSymbols_yav_CM = goog.i18n.DateTimeSymbols_yav;


/**
 * Date/time formatting symbols for locale yi.
 */
goog.i18n.DateTimeSymbols_yi = {
  ERAS: ['BCE', 'CE'],
  ERANAMES: ['BCE', 'CE'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['יאַנואַר', 'פֿעברואַר', 'מערץ', 'אַפּריל', 'מיי', 'יוני', 'יולי', 'אויגוסט', 'סעפּטעמבער', 'אקטאבער', 'נאוועמבער', 'דעצעמבער'],
  STANDALONEMONTHS: ['יאַנואַר', 'פֿעברואַר', 'מערץ', 'אַפּריל', 'מיי', 'יוני', 'יולי', 'אויגוסט', 'סעפּטעמבער', 'אקטאבער', 'נאוועמבער', 'דעצעמבער'],
  SHORTMONTHS: ['יאַנואַר', 'פֿעברואַר', 'מערץ', 'אַפּריל', 'מיי', 'יוני', 'יולי', 'אויגוסט', 'סעפּטעמבער', 'אקטאבער', 'נאוועמבער', 'דעצעמבער'],
  STANDALONESHORTMONTHS: ['יאַנ', 'פֿעב', 'מערץ', 'אַפּר', 'מיי', 'יוני', 'יולי', 'אויג', 'סעפּ', 'אקט', 'נאוו', 'דעצ'],
  WEEKDAYS: ['זונטיק', 'מאָנטיק', 'דינסטיק', 'מיטוואך', 'דאנערשטיק', 'פֿרײַטיק', 'שבת'],
  STANDALONEWEEKDAYS: ['זונטיק', 'מאָנטיק', 'דינסטיק', 'מיטוואך', 'דאנערשטיק', 'פֿרײַטיק', 'שבת'],
  SHORTWEEKDAYS: ['זונטיק', 'מאָנטיק', 'דינסטיק', 'מיטוואך', 'דאנערשטיק', 'פֿרײַטיק', 'שבת'],
  STANDALONESHORTWEEKDAYS: ['זונטיק', 'מאָנטיק', 'דינסטיק', 'מיטוואך', 'דאנערשטיק', 'פֿרײַטיק', 'שבת'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  AMPMS: ['פֿאַרמיטאָג', 'נאָכמיטאָג'],
  DATEFORMATS: ['EEEE, dטן MMMM y', 'dטן MMMM y', 'dטן MMM y', 'dd/MM/yy'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1}, {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale yi_001.
 */
goog.i18n.DateTimeSymbols_yi_001 = goog.i18n.DateTimeSymbols_yi;


/**
 * Date/time formatting symbols for locale yo.
 */
goog.i18n.DateTimeSymbols_yo = {
  ERAS: ['BCE', 'LK'],
  ERANAMES: ['Saju Kristi', 'Lehin Kristi'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['Oṣù Ṣẹ́rẹ́', 'Oṣù Èrèlè', 'Oṣù Ẹrẹ̀nà', 'Oṣù Ìgbé', 'Oṣù Ẹ̀bibi', 'Oṣù Òkúdu', 'Oṣù Agẹmọ', 'Oṣù Ògún', 'Oṣù Owewe', 'Oṣù Ọ̀wàrà', 'Oṣù Bélú', 'Oṣù Ọ̀pẹ̀'],
  STANDALONEMONTHS: ['Oṣù Ṣẹ́rẹ́', 'Oṣù Èrèlè', 'Oṣù Ẹrẹ̀nà', 'Oṣù Ìgbé', 'Oṣù Ẹ̀bibi', 'Oṣù Òkúdu', 'Oṣù Agẹmọ', 'Oṣù Ògún', 'Oṣù Owewe', 'Oṣù Ọ̀wàrà', 'Oṣù Bélú', 'Oṣù Ọ̀pẹ̀'],
  SHORTMONTHS: ['Ṣẹ́rẹ́', 'Èrèlè', 'Ẹrẹ̀nà', 'Ìgbé', 'Ẹ̀bibi', 'Òkúdu', 'Agẹmọ', 'Ògún', 'Owewe', 'Ọ̀wàrà', 'Bélú', 'Ọ̀pẹ̀'],
  STANDALONESHORTMONTHS: ['Ṣẹ́rẹ́', 'Èrèlè', 'Ẹrẹ̀nà', 'Ìgbé', 'Ẹ̀bibi', 'Òkúdu', 'Agẹmọ', 'Ògún', 'Owewe', 'Ọ̀wàrà', 'Bélú', 'Ọ̀pẹ̀'],
  WEEKDAYS: ['Ọjọ́ Àìkú', 'Ọjọ́ Ajé', 'Ọjọ́ Ìsẹ́gun', 'Ọjọ́rú', 'Ọjọ́bọ', 'Ọjọ́ Ẹtì', 'Ọjọ́ Àbámẹ́ta'],
  STANDALONEWEEKDAYS: ['Ọjọ́ Àìkú', 'Ọjọ́ Ajé', 'Ọjọ́ Ìsẹ́gun', 'Ọjọ́rú', 'Ọjọ́bọ', 'Ọjọ́ Ẹtì', 'Ọjọ́ Àbámẹ́ta'],
  SHORTWEEKDAYS: ['Àìkú', 'Ajé', 'Ìsẹ́gun', 'Ọjọ́rú', 'Ọjọ́bọ', 'Ẹtì', 'Àbámẹ́ta'],
  STANDALONESHORTWEEKDAYS: ['Àìkú', 'Ajé', 'Ìsẹ́gun', 'Ọjọ́rú', 'Ọjọ́bọ', 'Ẹtì', 'Àbámẹ́ta'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['K1', 'K2', 'K3', 'K4'],
  QUARTERS: ['Kọ́tà Kínní', 'Kọ́tà Kejì', 'Kọ́à Keta', 'Kọ́tà Kẹrin'],
  AMPMS: ['Àárọ̀', 'Ọ̀sán'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale yo_BJ.
 */
goog.i18n.DateTimeSymbols_yo_BJ = {
  ERAS: ['BCE', 'LK'],
  ERANAMES: ['Saju Kristi', 'Lehin Kristi'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['Oshù Shɛ́rɛ́', 'Oshù Èrèlè', 'Oshù Ɛrɛ̀nà', 'Oshù Ìgbé', 'Oshù Ɛ̀bibi', 'Oshù Òkúdu', 'Oshù Agɛmɔ', 'Oshù Ògún', 'Oshù Owewe', 'Oshù Ɔ̀wàrà', 'Oshù Bélú', 'Oshù Ɔ̀pɛ̀'],
  STANDALONEMONTHS: ['Oshù Shɛ́rɛ́', 'Oshù Èrèlè', 'Oshù Ɛrɛ̀nà', 'Oshù Ìgbé', 'Oshù Ɛ̀bibi', 'Oshù Òkúdu', 'Oshù Agɛmɔ', 'Oshù Ògún', 'Oshù Owewe', 'Oshù Ɔ̀wàrà', 'Oshù Bélú', 'Oshù Ɔ̀pɛ̀'],
  SHORTMONTHS: ['Shɛ́rɛ́', 'Èrèlè', 'Ɛrɛ̀nà', 'Ìgbé', 'Ɛ̀bibi', 'Òkúdu', 'Agɛmɔ', 'Ògún', 'Owewe', 'Ɔ̀wàrà', 'Bélú', 'Ɔ̀pɛ̀'],
  STANDALONESHORTMONTHS: ['Shɛ́rɛ́', 'Èrèlè', 'Ɛrɛ̀nà', 'Ìgbé', 'Ɛ̀bibi', 'Òkúdu', 'Agɛmɔ', 'Ògún', 'Owewe', 'Ɔ̀wàrà', 'Bélú', 'Ɔ̀pɛ̀'],
  WEEKDAYS: ['Ɔjɔ́ Àìkú', 'Ɔjɔ́ Ajé', 'Ɔjɔ́ Ìsɛ́gun', 'Ɔjɔ́rú', 'Ɔjɔ́bɔ', 'Ɔjɔ́ Ɛtì', 'Ɔjɔ́ Àbámɛ́ta'],
  STANDALONEWEEKDAYS: ['Ɔjɔ́ Àìkú', 'Ɔjɔ́ Ajé', 'Ɔjɔ́ Ìsɛ́gun', 'Ɔjɔ́rú', 'Ɔjɔ́bɔ', 'Ɔjɔ́ Ɛtì', 'Ɔjɔ́ Àbámɛ́ta'],
  SHORTWEEKDAYS: ['Àìkú', 'Ajé', 'Ìsɛ́gun', 'Ɔjɔ́rú', 'Ɔjɔ́bɔ', 'Ɛtì', 'Àbámɛ́ta'],
  STANDALONESHORTWEEKDAYS: ['Àìkú', 'Ajé', 'Ìsɛ́gun', 'Ɔjɔ́rú', 'Ɔjɔ́bɔ', 'Ɛtì', 'Àbámɛ́ta'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['K1', 'K2', 'K3', 'K4'],
  QUARTERS: ['Kɔ́tà Kínní', 'Kɔ́tà Kejì', 'Kɔ́à Keta', 'Kɔ́tà Kɛrin'],
  AMPMS: ['Àárɔ̀', 'Ɔ̀sán'],
  DATEFORMATS: ['EEEE, d MMMM y', 'd MMMM y', 'd MMM y', 'dd/MM/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 0,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 6
};


/**
 * Date/time formatting symbols for locale yo_NG.
 */
goog.i18n.DateTimeSymbols_yo_NG = goog.i18n.DateTimeSymbols_yo;


/**
 * Date/time formatting symbols for locale yue.
 */
goog.i18n.DateTimeSymbols_yue = {
  ERAS: ['西元前', '西元'],
  ERANAMES: ['西元前', '西元'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  STANDALONEMONTHS: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  SHORTMONTHS: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  STANDALONESHORTMONTHS: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  WEEKDAYS: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  STANDALONEWEEKDAYS: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  SHORTWEEKDAYS: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
  STANDALONESHORTWEEKDAYS: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
  NARROWWEEKDAYS: ['日', '一', '二', '三', '四', '五', '六'],
  STANDALONENARROWWEEKDAYS: ['日', '一', '二', '三', '四', '五', '六'],
  SHORTQUARTERS: ['第1季', '第2季', '第3季', '第4季'],
  QUARTERS: ['第1季', '第2季', '第3季', '第4季'],
  AMPMS: ['上午', '下午'],
  DATEFORMATS: ['y年M月d日 EEEE', 'y年M月d日', 'y年M月d日', 'y/M/d'],
  TIMEFORMATS: ['ah:mm:ss [zzzz]', 'ah:mm:ss [z]', 'ah:mm:ss', 'ah:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale yue_HK.
 */
goog.i18n.DateTimeSymbols_yue_HK = goog.i18n.DateTimeSymbols_yue;


/**
 * Date/time formatting symbols for locale zgh.
 */
goog.i18n.DateTimeSymbols_zgh = {
  ERAS: ['ⴷⴰⵄ', 'ⴷⴼⵄ'],
  ERANAMES: ['ⴷⴰⵜ ⵏ ⵄⵉⵙⴰ', 'ⴷⴼⴼⵉⵔ ⵏ ⵄⵉⵙⴰ'],
  NARROWMONTHS: ['ⵉ', 'ⴱ', 'ⵎ', 'ⵉ', 'ⵎ', 'ⵢ', 'ⵢ', 'ⵖ', 'ⵛ', 'ⴽ', 'ⵏ', 'ⴷ'],
  STANDALONENARROWMONTHS: ['ⵉ', 'ⴱ', 'ⵎ', 'ⵉ', 'ⵎ', 'ⵢ', 'ⵢ', 'ⵖ', 'ⵛ', 'ⴽ', 'ⵏ', 'ⴷ'],
  MONTHS: ['ⵉⵏⵏⴰⵢⵔ', 'ⴱⵕⴰⵢⵕ', 'ⵎⴰⵕⵚ', 'ⵉⴱⵔⵉⵔ', 'ⵎⴰⵢⵢⵓ', 'ⵢⵓⵏⵢⵓ', 'ⵢⵓⵍⵢⵓⵣ', 'ⵖⵓⵛⵜ', 'ⵛⵓⵜⴰⵏⴱⵉⵔ', 'ⴽⵜⵓⴱⵔ', 'ⵏⵓⵡⴰⵏⴱⵉⵔ', 'ⴷⵓⵊⴰⵏⴱⵉⵔ'],
  STANDALONEMONTHS: ['ⵉⵏⵏⴰⵢⵔ', 'ⴱⵕⴰⵢⵕ', 'ⵎⴰⵕⵚ', 'ⵉⴱⵔⵉⵔ', 'ⵎⴰⵢⵢⵓ', 'ⵢⵓⵏⵢⵓ', 'ⵢⵓⵍⵢⵓⵣ', 'ⵖⵓⵛⵜ', 'ⵛⵓⵜⴰⵏⴱⵉⵔ', 'ⴽⵜⵓⴱⵔ', 'ⵏⵓⵡⴰⵏⴱⵉⵔ', 'ⴷⵓⵊⴰⵏⴱⵉⵔ'],
  SHORTMONTHS: ['ⵉⵏⵏ', 'ⴱⵕⴰ', 'ⵎⴰⵕ', 'ⵉⴱⵔ', 'ⵎⴰⵢ', 'ⵢⵓⵏ', 'ⵢⵓⵍ', 'ⵖⵓⵛ', 'ⵛⵓⵜ', 'ⴽⵜⵓ', 'ⵏⵓⵡ', 'ⴷⵓⵊ'],
  STANDALONESHORTMONTHS: ['ⵉⵏⵏ', 'ⴱⵕⴰ', 'ⵎⴰⵕ', 'ⵉⴱⵔ', 'ⵎⴰⵢ', 'ⵢⵓⵏ', 'ⵢⵓⵍ', 'ⵖⵓⵛ', 'ⵛⵓⵜ', 'ⴽⵜⵓ', 'ⵏⵓⵡ', 'ⴷⵓⵊ'],
  WEEKDAYS: ['ⴰⵙⴰⵎⴰⵙ', 'ⴰⵢⵏⴰⵙ', 'ⴰⵙⵉⵏⴰⵙ', 'ⴰⴽⵕⴰⵙ', 'ⴰⴽⵡⴰⵙ', 'ⴰⵙⵉⵎⵡⴰⵙ', 'ⴰⵙⵉⴹⵢⴰⵙ'],
  STANDALONEWEEKDAYS: ['ⴰⵙⴰⵎⴰⵙ', 'ⴰⵢⵏⴰⵙ', 'ⴰⵙⵉⵏⴰⵙ', 'ⴰⴽⵕⴰⵙ', 'ⴰⴽⵡⴰⵙ', 'ⴰⵙⵉⵎⵡⴰⵙ', 'ⴰⵙⵉⴹⵢⴰⵙ'],
  SHORTWEEKDAYS: ['ⴰⵙⴰ', 'ⴰⵢⵏ', 'ⴰⵙⵉ', 'ⴰⴽⵕ', 'ⴰⴽⵡ', 'ⴰⵙⵉⵎ', 'ⴰⵙⵉⴹ'],
  STANDALONESHORTWEEKDAYS: ['ⴰⵙⴰ', 'ⴰⵢⵏ', 'ⴰⵙⵉ', 'ⴰⴽⵕ', 'ⴰⴽⵡ', 'ⴰⵙⵉⵎ', 'ⴰⵙⵉⴹ'],
  NARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  STANDALONENARROWWEEKDAYS: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  SHORTQUARTERS: ['ⴰⴽ 1', 'ⴰⴽ 2', 'ⴰⴽ 3', 'ⴰⴽ 4'],
  QUARTERS: ['ⴰⴽⵕⴰⴹⵢⵓⵔ 1', 'ⴰⴽⵕⴰⴹⵢⵓⵔ 2', 'ⴰⴽⵕⴰⴹⵢⵓⵔ 3', 'ⴰⴽⵕⴰⴹⵢⵓⵔ 4'],
  AMPMS: ['ⵜⵉⴼⴰⵡⵜ', 'ⵜⴰⴷⴳⴳⵯⴰⵜ'],
  DATEFORMATS: ['EEEE d MMMM y', 'd MMMM y', 'd MMM, y', 'd/M/y'],
  TIMEFORMATS: ['HH:mm:ss zzzz', 'HH:mm:ss z', 'HH:mm:ss', 'HH:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 5,
  WEEKENDRANGE: [4, 5],
  FIRSTWEEKCUTOFFDAY: 4
};


/**
 * Date/time formatting symbols for locale zgh_MA.
 */
goog.i18n.DateTimeSymbols_zgh_MA = goog.i18n.DateTimeSymbols_zgh;


/**
 * Date/time formatting symbols for locale zh_Hans.
 */
goog.i18n.DateTimeSymbols_zh_Hans = goog.i18n.DateTimeSymbols_zh;


/**
 * Date/time formatting symbols for locale zh_Hans_CN.
 */
goog.i18n.DateTimeSymbols_zh_Hans_CN = goog.i18n.DateTimeSymbols_zh;


/**
 * Date/time formatting symbols for locale zh_Hans_HK.
 */
goog.i18n.DateTimeSymbols_zh_Hans_HK = {
  ERAS: ['公元前', '公元'],
  ERANAMES: ['公元前', '公元'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  STANDALONEMONTHS: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  SHORTMONTHS: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  STANDALONESHORTMONTHS: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  WEEKDAYS: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  STANDALONEWEEKDAYS: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  SHORTWEEKDAYS: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  STANDALONESHORTWEEKDAYS: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  NARROWWEEKDAYS: ['日', '一', '二', '三', '四', '五', '六'],
  STANDALONENARROWWEEKDAYS: ['日', '一', '二', '三', '四', '五', '六'],
  SHORTQUARTERS: ['1季度', '2季度', '3季度', '4季度'],
  QUARTERS: ['第一季度', '第二季度', '第三季度', '第四季度'],
  AMPMS: ['上午', '下午'],
  DATEFORMATS: ['y年M月d日EEEE', 'y年M月d日', 'y年M月d日', 'd/M/yy'],
  TIMEFORMATS: ['zzzz ah:mm:ss', 'z ah:mm:ss', 'ah:mm:ss', 'ah:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale zh_Hans_MO.
 */
goog.i18n.DateTimeSymbols_zh_Hans_MO = {
  ERAS: ['公元前', '公元'],
  ERANAMES: ['公元前', '公元'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  STANDALONEMONTHS: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  SHORTMONTHS: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  STANDALONESHORTMONTHS: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  WEEKDAYS: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  STANDALONEWEEKDAYS: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  SHORTWEEKDAYS: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  STANDALONESHORTWEEKDAYS: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  NARROWWEEKDAYS: ['日', '一', '二', '三', '四', '五', '六'],
  STANDALONENARROWWEEKDAYS: ['日', '一', '二', '三', '四', '五', '六'],
  SHORTQUARTERS: ['1季度', '2季度', '3季度', '4季度'],
  QUARTERS: ['第一季度', '第二季度', '第三季度', '第四季度'],
  AMPMS: ['上午', '下午'],
  DATEFORMATS: ['y年M月d日EEEE', 'y年M月d日', 'y年M月d日', 'd/M/yy'],
  TIMEFORMATS: ['zzzz ah:mm:ss', 'z ah:mm:ss', 'ah:mm:ss', 'ah:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale zh_Hans_SG.
 */
goog.i18n.DateTimeSymbols_zh_Hans_SG = {
  ERAS: ['公元前', '公元'],
  ERANAMES: ['公元前', '公元'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  STANDALONEMONTHS: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  SHORTMONTHS: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  STANDALONESHORTMONTHS: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  WEEKDAYS: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  STANDALONEWEEKDAYS: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  SHORTWEEKDAYS: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  STANDALONESHORTWEEKDAYS: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  NARROWWEEKDAYS: ['日', '一', '二', '三', '四', '五', '六'],
  STANDALONENARROWWEEKDAYS: ['日', '一', '二', '三', '四', '五', '六'],
  SHORTQUARTERS: ['1季度', '2季度', '3季度', '4季度'],
  QUARTERS: ['第一季度', '第二季度', '第三季度', '第四季度'],
  AMPMS: ['上午', '下午'],
  DATEFORMATS: ['y年M月d日EEEE', 'y年M月d日', 'y年M月d日', 'dd/MM/yy'],
  TIMEFORMATS: ['zzzz ah:mm:ss', 'z ah:mm:ss', 'ah:mm:ss', 'ah:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale zh_Hant.
 */
goog.i18n.DateTimeSymbols_zh_Hant = {
  ERAS: ['西元前', '西元'],
  ERANAMES: ['西元前', '西元'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  STANDALONEMONTHS: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  SHORTMONTHS: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  STANDALONESHORTMONTHS: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  WEEKDAYS: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  STANDALONEWEEKDAYS: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  SHORTWEEKDAYS: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
  STANDALONESHORTWEEKDAYS: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
  NARROWWEEKDAYS: ['日', '一', '二', '三', '四', '五', '六'],
  STANDALONENARROWWEEKDAYS: ['日', '一', '二', '三', '四', '五', '六'],
  SHORTQUARTERS: ['1季', '2季', '3季', '4季'],
  QUARTERS: ['第1季', '第2季', '第3季', '第4季'],
  AMPMS: ['上午', '下午'],
  DATEFORMATS: ['y年M月d日 EEEE', 'y年M月d日', 'y年M月d日', 'y/M/d'],
  TIMEFORMATS: ['ah:mm:ss [zzzz]', 'ah:mm:ss [z]', 'ah:mm:ss', 'ah:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale zh_Hant_HK.
 */
goog.i18n.DateTimeSymbols_zh_Hant_HK = {
  ERAS: ['公元前', '公元'],
  ERANAMES: ['公元前', '公元'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  STANDALONEMONTHS: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  SHORTMONTHS: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  STANDALONESHORTMONTHS: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  WEEKDAYS: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  STANDALONEWEEKDAYS: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  SHORTWEEKDAYS: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
  STANDALONESHORTWEEKDAYS: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
  NARROWWEEKDAYS: ['日', '一', '二', '三', '四', '五', '六'],
  STANDALONENARROWWEEKDAYS: ['日', '一', '二', '三', '四', '五', '六'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['第1季度', '第2季度', '第3季度', '第4季度'],
  AMPMS: ['上午', '下午'],
  DATEFORMATS: ['y年M月d日EEEE', 'y年M月d日', 'y年M月d日', 'd/M/y'],
  TIMEFORMATS: ['ah:mm:ss [zzzz]', 'ah:mm:ss [z]', 'ah:mm:ss', 'ah:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale zh_Hant_MO.
 */
goog.i18n.DateTimeSymbols_zh_Hant_MO = {
  ERAS: ['公元前', '公元'],
  ERANAMES: ['公元前', '公元'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  STANDALONEMONTHS: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  SHORTMONTHS: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  STANDALONESHORTMONTHS: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  WEEKDAYS: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  STANDALONEWEEKDAYS: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  SHORTWEEKDAYS: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
  STANDALONESHORTWEEKDAYS: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
  NARROWWEEKDAYS: ['日', '一', '二', '三', '四', '五', '六'],
  STANDALONENARROWWEEKDAYS: ['日', '一', '二', '三', '四', '五', '六'],
  SHORTQUARTERS: ['Q1', 'Q2', 'Q3', 'Q4'],
  QUARTERS: ['第1季度', '第2季度', '第3季度', '第4季度'],
  AMPMS: ['上午', '下午'],
  DATEFORMATS: ['y年M月d日EEEE', 'y年M月d日', 'y年M月d日', 'd/M/y'],
  TIMEFORMATS: ['ah:mm:ss [zzzz]', 'ah:mm:ss [z]', 'ah:mm:ss', 'ah:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale zh_Hant_TW.
 */
goog.i18n.DateTimeSymbols_zh_Hant_TW = {
  ERAS: ['西元前', '西元'],
  ERANAMES: ['西元前', '西元'],
  NARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  STANDALONENARROWMONTHS: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  MONTHS: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  STANDALONEMONTHS: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  SHORTMONTHS: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  STANDALONESHORTMONTHS: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  WEEKDAYS: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  STANDALONEWEEKDAYS: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  SHORTWEEKDAYS: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
  STANDALONESHORTWEEKDAYS: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
  NARROWWEEKDAYS: ['日', '一', '二', '三', '四', '五', '六'],
  STANDALONENARROWWEEKDAYS: ['日', '一', '二', '三', '四', '五', '六'],
  SHORTQUARTERS: ['1季', '2季', '3季', '4季'],
  QUARTERS: ['第1季', '第2季', '第3季', '第4季'],
  AMPMS: ['上午', '下午'],
  DATEFORMATS: ['y年M月d日 EEEE', 'y年M月d日', 'y年M月d日', 'y/M/d'],
  TIMEFORMATS: ['ah:mm:ss [zzzz]', 'ah:mm:ss [z]', 'ah:mm:ss', 'ah:mm'],
  DATETIMEFORMATS: ['{1} {0}', '{1} {0}', '{1} {0}', '{1} {0}'],
  FIRSTDAYOFWEEK: 6,
  WEEKENDRANGE: [5, 6],
  FIRSTWEEKCUTOFFDAY: 5
};


/**
 * Date/time formatting symbols for locale zu_ZA.
 */
goog.i18n.DateTimeSymbols_zu_ZA = goog.i18n.DateTimeSymbols_zu;


/**
 * Selected date/time formatting symbols by locale.
 */
if (goog.LOCALE == 'af_NA' || goog.LOCALE == 'af-NA') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_af_NA;
}

if (goog.LOCALE == 'af_ZA' || goog.LOCALE == 'af-ZA') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_af_ZA;
}

if (goog.LOCALE == 'agq') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_agq;
}

if (goog.LOCALE == 'agq_CM' || goog.LOCALE == 'agq-CM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_agq_CM;
}

if (goog.LOCALE == 'ak') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ak;
}

if (goog.LOCALE == 'ak_GH' || goog.LOCALE == 'ak-GH') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ak_GH;
}

if (goog.LOCALE == 'am_ET' || goog.LOCALE == 'am-ET') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_am_ET;
}

if (goog.LOCALE == 'ar_001' || goog.LOCALE == 'ar-001') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ar_001;
}

if (goog.LOCALE == 'ar_AE' || goog.LOCALE == 'ar-AE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ar_AE;
}

if (goog.LOCALE == 'ar_BH' || goog.LOCALE == 'ar-BH') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ar_BH;
}

if (goog.LOCALE == 'ar_DJ' || goog.LOCALE == 'ar-DJ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ar_DJ;
}

if (goog.LOCALE == 'ar_EG' || goog.LOCALE == 'ar-EG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ar_EG;
}

if (goog.LOCALE == 'ar_EH' || goog.LOCALE == 'ar-EH') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ar_EH;
}

if (goog.LOCALE == 'ar_ER' || goog.LOCALE == 'ar-ER') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ar_ER;
}

if (goog.LOCALE == 'ar_IL' || goog.LOCALE == 'ar-IL') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ar_IL;
}

if (goog.LOCALE == 'ar_IQ' || goog.LOCALE == 'ar-IQ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ar_IQ;
}

if (goog.LOCALE == 'ar_JO' || goog.LOCALE == 'ar-JO') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ar_JO;
}

if (goog.LOCALE == 'ar_KM' || goog.LOCALE == 'ar-KM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ar_KM;
}

if (goog.LOCALE == 'ar_KW' || goog.LOCALE == 'ar-KW') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ar_KW;
}

if (goog.LOCALE == 'ar_LB' || goog.LOCALE == 'ar-LB') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ar_LB;
}

if (goog.LOCALE == 'ar_LY' || goog.LOCALE == 'ar-LY') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ar_LY;
}

if (goog.LOCALE == 'ar_MA' || goog.LOCALE == 'ar-MA') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ar_MA;
}

if (goog.LOCALE == 'ar_MR' || goog.LOCALE == 'ar-MR') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ar_MR;
}

if (goog.LOCALE == 'ar_OM' || goog.LOCALE == 'ar-OM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ar_OM;
}

if (goog.LOCALE == 'ar_PS' || goog.LOCALE == 'ar-PS') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ar_PS;
}

if (goog.LOCALE == 'ar_QA' || goog.LOCALE == 'ar-QA') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ar_QA;
}

if (goog.LOCALE == 'ar_SA' || goog.LOCALE == 'ar-SA') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ar_SA;
}

if (goog.LOCALE == 'ar_SD' || goog.LOCALE == 'ar-SD') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ar_SD;
}

if (goog.LOCALE == 'ar_SO' || goog.LOCALE == 'ar-SO') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ar_SO;
}

if (goog.LOCALE == 'ar_SS' || goog.LOCALE == 'ar-SS') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ar_SS;
}

if (goog.LOCALE == 'ar_SY' || goog.LOCALE == 'ar-SY') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ar_SY;
}

if (goog.LOCALE == 'ar_TD' || goog.LOCALE == 'ar-TD') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ar_TD;
}

if (goog.LOCALE == 'ar_TN' || goog.LOCALE == 'ar-TN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ar_TN;
}

if (goog.LOCALE == 'ar_XB' || goog.LOCALE == 'ar-XB') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ar_XB;
}

if (goog.LOCALE == 'ar_YE' || goog.LOCALE == 'ar-YE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ar_YE;
}

if (goog.LOCALE == 'as') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_as;
}

if (goog.LOCALE == 'as_IN' || goog.LOCALE == 'as-IN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_as_IN;
}

if (goog.LOCALE == 'asa') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_asa;
}

if (goog.LOCALE == 'asa_TZ' || goog.LOCALE == 'asa-TZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_asa_TZ;
}

if (goog.LOCALE == 'ast') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ast;
}

if (goog.LOCALE == 'ast_ES' || goog.LOCALE == 'ast-ES') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ast_ES;
}

if (goog.LOCALE == 'az_Cyrl' || goog.LOCALE == 'az-Cyrl') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_az_Cyrl;
}

if (goog.LOCALE == 'az_Cyrl_AZ' || goog.LOCALE == 'az-Cyrl-AZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_az_Cyrl_AZ;
}

if (goog.LOCALE == 'az_Latn' || goog.LOCALE == 'az-Latn') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_az_Latn;
}

if (goog.LOCALE == 'az_Latn_AZ' || goog.LOCALE == 'az-Latn-AZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_az_Latn_AZ;
}

if (goog.LOCALE == 'bas') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_bas;
}

if (goog.LOCALE == 'bas_CM' || goog.LOCALE == 'bas-CM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_bas_CM;
}

if (goog.LOCALE == 'be_BY' || goog.LOCALE == 'be-BY') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_be_BY;
}

if (goog.LOCALE == 'bem') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_bem;
}

if (goog.LOCALE == 'bem_ZM' || goog.LOCALE == 'bem-ZM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_bem_ZM;
}

if (goog.LOCALE == 'bez') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_bez;
}

if (goog.LOCALE == 'bez_TZ' || goog.LOCALE == 'bez-TZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_bez_TZ;
}

if (goog.LOCALE == 'bg_BG' || goog.LOCALE == 'bg-BG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_bg_BG;
}

if (goog.LOCALE == 'bm') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_bm;
}

if (goog.LOCALE == 'bm_ML' || goog.LOCALE == 'bm-ML') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_bm_ML;
}

if (goog.LOCALE == 'bn_BD' || goog.LOCALE == 'bn-BD') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_bn_BD;
}

if (goog.LOCALE == 'bn_IN' || goog.LOCALE == 'bn-IN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_bn_IN;
}

if (goog.LOCALE == 'bo') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_bo;
}

if (goog.LOCALE == 'bo_CN' || goog.LOCALE == 'bo-CN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_bo_CN;
}

if (goog.LOCALE == 'bo_IN' || goog.LOCALE == 'bo-IN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_bo_IN;
}

if (goog.LOCALE == 'br_FR' || goog.LOCALE == 'br-FR') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_br_FR;
}

if (goog.LOCALE == 'brx') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_brx;
}

if (goog.LOCALE == 'brx_IN' || goog.LOCALE == 'brx-IN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_brx_IN;
}

if (goog.LOCALE == 'bs_Cyrl' || goog.LOCALE == 'bs-Cyrl') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_bs_Cyrl;
}

if (goog.LOCALE == 'bs_Cyrl_BA' || goog.LOCALE == 'bs-Cyrl-BA') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_bs_Cyrl_BA;
}

if (goog.LOCALE == 'bs_Latn' || goog.LOCALE == 'bs-Latn') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_bs_Latn;
}

if (goog.LOCALE == 'bs_Latn_BA' || goog.LOCALE == 'bs-Latn-BA') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_bs_Latn_BA;
}

if (goog.LOCALE == 'ca_AD' || goog.LOCALE == 'ca-AD') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ca_AD;
}

if (goog.LOCALE == 'ca_ES' || goog.LOCALE == 'ca-ES') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ca_ES;
}

if (goog.LOCALE == 'ca_FR' || goog.LOCALE == 'ca-FR') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ca_FR;
}

if (goog.LOCALE == 'ca_IT' || goog.LOCALE == 'ca-IT') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ca_IT;
}

if (goog.LOCALE == 'ce') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ce;
}

if (goog.LOCALE == 'ce_RU' || goog.LOCALE == 'ce-RU') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ce_RU;
}

if (goog.LOCALE == 'cgg') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_cgg;
}

if (goog.LOCALE == 'cgg_UG' || goog.LOCALE == 'cgg-UG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_cgg_UG;
}

if (goog.LOCALE == 'chr_US' || goog.LOCALE == 'chr-US') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_chr_US;
}

if (goog.LOCALE == 'ckb') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ckb;
}

if (goog.LOCALE == 'ckb_IQ' || goog.LOCALE == 'ckb-IQ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ckb_IQ;
}

if (goog.LOCALE == 'ckb_IR' || goog.LOCALE == 'ckb-IR') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ckb_IR;
}

if (goog.LOCALE == 'cs_CZ' || goog.LOCALE == 'cs-CZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_cs_CZ;
}

if (goog.LOCALE == 'cy_GB' || goog.LOCALE == 'cy-GB') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_cy_GB;
}

if (goog.LOCALE == 'da_DK' || goog.LOCALE == 'da-DK') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_da_DK;
}

if (goog.LOCALE == 'da_GL' || goog.LOCALE == 'da-GL') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_da_GL;
}

if (goog.LOCALE == 'dav') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_dav;
}

if (goog.LOCALE == 'dav_KE' || goog.LOCALE == 'dav-KE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_dav_KE;
}

if (goog.LOCALE == 'de_BE' || goog.LOCALE == 'de-BE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_de_BE;
}

if (goog.LOCALE == 'de_DE' || goog.LOCALE == 'de-DE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_de_DE;
}

if (goog.LOCALE == 'de_IT' || goog.LOCALE == 'de-IT') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_de_IT;
}

if (goog.LOCALE == 'de_LI' || goog.LOCALE == 'de-LI') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_de_LI;
}

if (goog.LOCALE == 'de_LU' || goog.LOCALE == 'de-LU') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_de_LU;
}

if (goog.LOCALE == 'dje') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_dje;
}

if (goog.LOCALE == 'dje_NE' || goog.LOCALE == 'dje-NE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_dje_NE;
}

if (goog.LOCALE == 'dsb') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_dsb;
}

if (goog.LOCALE == 'dsb_DE' || goog.LOCALE == 'dsb-DE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_dsb_DE;
}

if (goog.LOCALE == 'dua') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_dua;
}

if (goog.LOCALE == 'dua_CM' || goog.LOCALE == 'dua-CM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_dua_CM;
}

if (goog.LOCALE == 'dyo') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_dyo;
}

if (goog.LOCALE == 'dyo_SN' || goog.LOCALE == 'dyo-SN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_dyo_SN;
}

if (goog.LOCALE == 'dz') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_dz;
}

if (goog.LOCALE == 'dz_BT' || goog.LOCALE == 'dz-BT') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_dz_BT;
}

if (goog.LOCALE == 'ebu') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ebu;
}

if (goog.LOCALE == 'ebu_KE' || goog.LOCALE == 'ebu-KE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ebu_KE;
}

if (goog.LOCALE == 'ee') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ee;
}

if (goog.LOCALE == 'ee_GH' || goog.LOCALE == 'ee-GH') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ee_GH;
}

if (goog.LOCALE == 'ee_TG' || goog.LOCALE == 'ee-TG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ee_TG;
}

if (goog.LOCALE == 'el_CY' || goog.LOCALE == 'el-CY') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_el_CY;
}

if (goog.LOCALE == 'el_GR' || goog.LOCALE == 'el-GR') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_el_GR;
}

if (goog.LOCALE == 'en_001' || goog.LOCALE == 'en-001') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_001;
}

if (goog.LOCALE == 'en_150' || goog.LOCALE == 'en-150') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_150;
}

if (goog.LOCALE == 'en_AG' || goog.LOCALE == 'en-AG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_AG;
}

if (goog.LOCALE == 'en_AI' || goog.LOCALE == 'en-AI') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_AI;
}

if (goog.LOCALE == 'en_AS' || goog.LOCALE == 'en-AS') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_AS;
}

if (goog.LOCALE == 'en_AT' || goog.LOCALE == 'en-AT') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_AT;
}

if (goog.LOCALE == 'en_BB' || goog.LOCALE == 'en-BB') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_BB;
}

if (goog.LOCALE == 'en_BE' || goog.LOCALE == 'en-BE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_BE;
}

if (goog.LOCALE == 'en_BI' || goog.LOCALE == 'en-BI') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_BI;
}

if (goog.LOCALE == 'en_BM' || goog.LOCALE == 'en-BM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_BM;
}

if (goog.LOCALE == 'en_BS' || goog.LOCALE == 'en-BS') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_BS;
}

if (goog.LOCALE == 'en_BW' || goog.LOCALE == 'en-BW') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_BW;
}

if (goog.LOCALE == 'en_BZ' || goog.LOCALE == 'en-BZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_BZ;
}

if (goog.LOCALE == 'en_CC' || goog.LOCALE == 'en-CC') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_CC;
}

if (goog.LOCALE == 'en_CH' || goog.LOCALE == 'en-CH') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_CH;
}

if (goog.LOCALE == 'en_CK' || goog.LOCALE == 'en-CK') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_CK;
}

if (goog.LOCALE == 'en_CM' || goog.LOCALE == 'en-CM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_CM;
}

if (goog.LOCALE == 'en_CX' || goog.LOCALE == 'en-CX') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_CX;
}

if (goog.LOCALE == 'en_CY' || goog.LOCALE == 'en-CY') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_CY;
}

if (goog.LOCALE == 'en_DE' || goog.LOCALE == 'en-DE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_DE;
}

if (goog.LOCALE == 'en_DG' || goog.LOCALE == 'en-DG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_DG;
}

if (goog.LOCALE == 'en_DK' || goog.LOCALE == 'en-DK') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_DK;
}

if (goog.LOCALE == 'en_DM' || goog.LOCALE == 'en-DM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_DM;
}

if (goog.LOCALE == 'en_ER' || goog.LOCALE == 'en-ER') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_ER;
}

if (goog.LOCALE == 'en_FI' || goog.LOCALE == 'en-FI') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_FI;
}

if (goog.LOCALE == 'en_FJ' || goog.LOCALE == 'en-FJ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_FJ;
}

if (goog.LOCALE == 'en_FK' || goog.LOCALE == 'en-FK') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_FK;
}

if (goog.LOCALE == 'en_FM' || goog.LOCALE == 'en-FM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_FM;
}

if (goog.LOCALE == 'en_GD' || goog.LOCALE == 'en-GD') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_GD;
}

if (goog.LOCALE == 'en_GG' || goog.LOCALE == 'en-GG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_GG;
}

if (goog.LOCALE == 'en_GH' || goog.LOCALE == 'en-GH') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_GH;
}

if (goog.LOCALE == 'en_GI' || goog.LOCALE == 'en-GI') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_GI;
}

if (goog.LOCALE == 'en_GM' || goog.LOCALE == 'en-GM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_GM;
}

if (goog.LOCALE == 'en_GU' || goog.LOCALE == 'en-GU') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_GU;
}

if (goog.LOCALE == 'en_GY' || goog.LOCALE == 'en-GY') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_GY;
}

if (goog.LOCALE == 'en_HK' || goog.LOCALE == 'en-HK') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_HK;
}

if (goog.LOCALE == 'en_IL' || goog.LOCALE == 'en-IL') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_IL;
}

if (goog.LOCALE == 'en_IM' || goog.LOCALE == 'en-IM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_IM;
}

if (goog.LOCALE == 'en_IO' || goog.LOCALE == 'en-IO') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_IO;
}

if (goog.LOCALE == 'en_JE' || goog.LOCALE == 'en-JE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_JE;
}

if (goog.LOCALE == 'en_JM' || goog.LOCALE == 'en-JM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_JM;
}

if (goog.LOCALE == 'en_KE' || goog.LOCALE == 'en-KE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_KE;
}

if (goog.LOCALE == 'en_KI' || goog.LOCALE == 'en-KI') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_KI;
}

if (goog.LOCALE == 'en_KN' || goog.LOCALE == 'en-KN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_KN;
}

if (goog.LOCALE == 'en_KY' || goog.LOCALE == 'en-KY') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_KY;
}

if (goog.LOCALE == 'en_LC' || goog.LOCALE == 'en-LC') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_LC;
}

if (goog.LOCALE == 'en_LR' || goog.LOCALE == 'en-LR') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_LR;
}

if (goog.LOCALE == 'en_LS' || goog.LOCALE == 'en-LS') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_LS;
}

if (goog.LOCALE == 'en_MG' || goog.LOCALE == 'en-MG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_MG;
}

if (goog.LOCALE == 'en_MH' || goog.LOCALE == 'en-MH') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_MH;
}

if (goog.LOCALE == 'en_MO' || goog.LOCALE == 'en-MO') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_MO;
}

if (goog.LOCALE == 'en_MP' || goog.LOCALE == 'en-MP') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_MP;
}

if (goog.LOCALE == 'en_MS' || goog.LOCALE == 'en-MS') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_MS;
}

if (goog.LOCALE == 'en_MT' || goog.LOCALE == 'en-MT') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_MT;
}

if (goog.LOCALE == 'en_MU' || goog.LOCALE == 'en-MU') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_MU;
}

if (goog.LOCALE == 'en_MW' || goog.LOCALE == 'en-MW') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_MW;
}

if (goog.LOCALE == 'en_MY' || goog.LOCALE == 'en-MY') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_MY;
}

if (goog.LOCALE == 'en_NA' || goog.LOCALE == 'en-NA') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_NA;
}

if (goog.LOCALE == 'en_NF' || goog.LOCALE == 'en-NF') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_NF;
}

if (goog.LOCALE == 'en_NG' || goog.LOCALE == 'en-NG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_NG;
}

if (goog.LOCALE == 'en_NL' || goog.LOCALE == 'en-NL') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_NL;
}

if (goog.LOCALE == 'en_NR' || goog.LOCALE == 'en-NR') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_NR;
}

if (goog.LOCALE == 'en_NU' || goog.LOCALE == 'en-NU') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_NU;
}

if (goog.LOCALE == 'en_NZ' || goog.LOCALE == 'en-NZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_NZ;
}

if (goog.LOCALE == 'en_PG' || goog.LOCALE == 'en-PG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_PG;
}

if (goog.LOCALE == 'en_PH' || goog.LOCALE == 'en-PH') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_PH;
}

if (goog.LOCALE == 'en_PK' || goog.LOCALE == 'en-PK') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_PK;
}

if (goog.LOCALE == 'en_PN' || goog.LOCALE == 'en-PN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_PN;
}

if (goog.LOCALE == 'en_PR' || goog.LOCALE == 'en-PR') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_PR;
}

if (goog.LOCALE == 'en_PW' || goog.LOCALE == 'en-PW') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_PW;
}

if (goog.LOCALE == 'en_RW' || goog.LOCALE == 'en-RW') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_RW;
}

if (goog.LOCALE == 'en_SB' || goog.LOCALE == 'en-SB') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_SB;
}

if (goog.LOCALE == 'en_SC' || goog.LOCALE == 'en-SC') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_SC;
}

if (goog.LOCALE == 'en_SD' || goog.LOCALE == 'en-SD') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_SD;
}

if (goog.LOCALE == 'en_SE' || goog.LOCALE == 'en-SE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_SE;
}

if (goog.LOCALE == 'en_SH' || goog.LOCALE == 'en-SH') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_SH;
}

if (goog.LOCALE == 'en_SI' || goog.LOCALE == 'en-SI') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_SI;
}

if (goog.LOCALE == 'en_SL' || goog.LOCALE == 'en-SL') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_SL;
}

if (goog.LOCALE == 'en_SS' || goog.LOCALE == 'en-SS') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_SS;
}

if (goog.LOCALE == 'en_SX' || goog.LOCALE == 'en-SX') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_SX;
}

if (goog.LOCALE == 'en_SZ' || goog.LOCALE == 'en-SZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_SZ;
}

if (goog.LOCALE == 'en_TC' || goog.LOCALE == 'en-TC') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_TC;
}

if (goog.LOCALE == 'en_TK' || goog.LOCALE == 'en-TK') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_TK;
}

if (goog.LOCALE == 'en_TO' || goog.LOCALE == 'en-TO') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_TO;
}

if (goog.LOCALE == 'en_TT' || goog.LOCALE == 'en-TT') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_TT;
}

if (goog.LOCALE == 'en_TV' || goog.LOCALE == 'en-TV') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_TV;
}

if (goog.LOCALE == 'en_TZ' || goog.LOCALE == 'en-TZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_TZ;
}

if (goog.LOCALE == 'en_UG' || goog.LOCALE == 'en-UG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_UG;
}

if (goog.LOCALE == 'en_UM' || goog.LOCALE == 'en-UM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_UM;
}

if (goog.LOCALE == 'en_US_POSIX' || goog.LOCALE == 'en-US-POSIX') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_US_POSIX;
}

if (goog.LOCALE == 'en_VC' || goog.LOCALE == 'en-VC') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_VC;
}

if (goog.LOCALE == 'en_VG' || goog.LOCALE == 'en-VG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_VG;
}

if (goog.LOCALE == 'en_VI' || goog.LOCALE == 'en-VI') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_VI;
}

if (goog.LOCALE == 'en_VU' || goog.LOCALE == 'en-VU') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_VU;
}

if (goog.LOCALE == 'en_WS' || goog.LOCALE == 'en-WS') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_WS;
}

if (goog.LOCALE == 'en_XA' || goog.LOCALE == 'en-XA') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_XA;
}

if (goog.LOCALE == 'en_ZM' || goog.LOCALE == 'en-ZM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_ZM;
}

if (goog.LOCALE == 'en_ZW' || goog.LOCALE == 'en-ZW') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_en_ZW;
}

if (goog.LOCALE == 'eo') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_eo;
}

if (goog.LOCALE == 'es_AR' || goog.LOCALE == 'es-AR') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_es_AR;
}

if (goog.LOCALE == 'es_BO' || goog.LOCALE == 'es-BO') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_es_BO;
}

if (goog.LOCALE == 'es_BR' || goog.LOCALE == 'es-BR') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_es_BR;
}

if (goog.LOCALE == 'es_BZ' || goog.LOCALE == 'es-BZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_es_BZ;
}

if (goog.LOCALE == 'es_CL' || goog.LOCALE == 'es-CL') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_es_CL;
}

if (goog.LOCALE == 'es_CO' || goog.LOCALE == 'es-CO') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_es_CO;
}

if (goog.LOCALE == 'es_CR' || goog.LOCALE == 'es-CR') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_es_CR;
}

if (goog.LOCALE == 'es_CU' || goog.LOCALE == 'es-CU') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_es_CU;
}

if (goog.LOCALE == 'es_DO' || goog.LOCALE == 'es-DO') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_es_DO;
}

if (goog.LOCALE == 'es_EA' || goog.LOCALE == 'es-EA') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_es_EA;
}

if (goog.LOCALE == 'es_EC' || goog.LOCALE == 'es-EC') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_es_EC;
}

if (goog.LOCALE == 'es_GQ' || goog.LOCALE == 'es-GQ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_es_GQ;
}

if (goog.LOCALE == 'es_GT' || goog.LOCALE == 'es-GT') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_es_GT;
}

if (goog.LOCALE == 'es_HN' || goog.LOCALE == 'es-HN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_es_HN;
}

if (goog.LOCALE == 'es_IC' || goog.LOCALE == 'es-IC') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_es_IC;
}

if (goog.LOCALE == 'es_NI' || goog.LOCALE == 'es-NI') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_es_NI;
}

if (goog.LOCALE == 'es_PA' || goog.LOCALE == 'es-PA') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_es_PA;
}

if (goog.LOCALE == 'es_PE' || goog.LOCALE == 'es-PE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_es_PE;
}

if (goog.LOCALE == 'es_PH' || goog.LOCALE == 'es-PH') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_es_PH;
}

if (goog.LOCALE == 'es_PR' || goog.LOCALE == 'es-PR') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_es_PR;
}

if (goog.LOCALE == 'es_PY' || goog.LOCALE == 'es-PY') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_es_PY;
}

if (goog.LOCALE == 'es_SV' || goog.LOCALE == 'es-SV') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_es_SV;
}

if (goog.LOCALE == 'es_UY' || goog.LOCALE == 'es-UY') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_es_UY;
}

if (goog.LOCALE == 'es_VE' || goog.LOCALE == 'es-VE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_es_VE;
}

if (goog.LOCALE == 'et_EE' || goog.LOCALE == 'et-EE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_et_EE;
}

if (goog.LOCALE == 'eu_ES' || goog.LOCALE == 'eu-ES') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_eu_ES;
}

if (goog.LOCALE == 'ewo') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ewo;
}

if (goog.LOCALE == 'ewo_CM' || goog.LOCALE == 'ewo-CM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ewo_CM;
}

if (goog.LOCALE == 'fa_AF' || goog.LOCALE == 'fa-AF') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fa_AF;
}

if (goog.LOCALE == 'fa_IR' || goog.LOCALE == 'fa-IR') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fa_IR;
}

if (goog.LOCALE == 'ff') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ff;
}

if (goog.LOCALE == 'ff_CM' || goog.LOCALE == 'ff-CM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ff_CM;
}

if (goog.LOCALE == 'ff_GN' || goog.LOCALE == 'ff-GN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ff_GN;
}

if (goog.LOCALE == 'ff_MR' || goog.LOCALE == 'ff-MR') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ff_MR;
}

if (goog.LOCALE == 'ff_SN' || goog.LOCALE == 'ff-SN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ff_SN;
}

if (goog.LOCALE == 'fi_FI' || goog.LOCALE == 'fi-FI') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fi_FI;
}

if (goog.LOCALE == 'fil_PH' || goog.LOCALE == 'fil-PH') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fil_PH;
}

if (goog.LOCALE == 'fo') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fo;
}

if (goog.LOCALE == 'fo_DK' || goog.LOCALE == 'fo-DK') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fo_DK;
}

if (goog.LOCALE == 'fo_FO' || goog.LOCALE == 'fo-FO') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fo_FO;
}

if (goog.LOCALE == 'fr_BE' || goog.LOCALE == 'fr-BE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_BE;
}

if (goog.LOCALE == 'fr_BF' || goog.LOCALE == 'fr-BF') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_BF;
}

if (goog.LOCALE == 'fr_BI' || goog.LOCALE == 'fr-BI') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_BI;
}

if (goog.LOCALE == 'fr_BJ' || goog.LOCALE == 'fr-BJ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_BJ;
}

if (goog.LOCALE == 'fr_BL' || goog.LOCALE == 'fr-BL') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_BL;
}

if (goog.LOCALE == 'fr_CD' || goog.LOCALE == 'fr-CD') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_CD;
}

if (goog.LOCALE == 'fr_CF' || goog.LOCALE == 'fr-CF') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_CF;
}

if (goog.LOCALE == 'fr_CG' || goog.LOCALE == 'fr-CG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_CG;
}

if (goog.LOCALE == 'fr_CH' || goog.LOCALE == 'fr-CH') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_CH;
}

if (goog.LOCALE == 'fr_CI' || goog.LOCALE == 'fr-CI') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_CI;
}

if (goog.LOCALE == 'fr_CM' || goog.LOCALE == 'fr-CM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_CM;
}

if (goog.LOCALE == 'fr_DJ' || goog.LOCALE == 'fr-DJ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_DJ;
}

if (goog.LOCALE == 'fr_DZ' || goog.LOCALE == 'fr-DZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_DZ;
}

if (goog.LOCALE == 'fr_FR' || goog.LOCALE == 'fr-FR') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_FR;
}

if (goog.LOCALE == 'fr_GA' || goog.LOCALE == 'fr-GA') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_GA;
}

if (goog.LOCALE == 'fr_GF' || goog.LOCALE == 'fr-GF') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_GF;
}

if (goog.LOCALE == 'fr_GN' || goog.LOCALE == 'fr-GN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_GN;
}

if (goog.LOCALE == 'fr_GP' || goog.LOCALE == 'fr-GP') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_GP;
}

if (goog.LOCALE == 'fr_GQ' || goog.LOCALE == 'fr-GQ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_GQ;
}

if (goog.LOCALE == 'fr_HT' || goog.LOCALE == 'fr-HT') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_HT;
}

if (goog.LOCALE == 'fr_KM' || goog.LOCALE == 'fr-KM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_KM;
}

if (goog.LOCALE == 'fr_LU' || goog.LOCALE == 'fr-LU') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_LU;
}

if (goog.LOCALE == 'fr_MA' || goog.LOCALE == 'fr-MA') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_MA;
}

if (goog.LOCALE == 'fr_MC' || goog.LOCALE == 'fr-MC') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_MC;
}

if (goog.LOCALE == 'fr_MF' || goog.LOCALE == 'fr-MF') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_MF;
}

if (goog.LOCALE == 'fr_MG' || goog.LOCALE == 'fr-MG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_MG;
}

if (goog.LOCALE == 'fr_ML' || goog.LOCALE == 'fr-ML') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_ML;
}

if (goog.LOCALE == 'fr_MQ' || goog.LOCALE == 'fr-MQ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_MQ;
}

if (goog.LOCALE == 'fr_MR' || goog.LOCALE == 'fr-MR') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_MR;
}

if (goog.LOCALE == 'fr_MU' || goog.LOCALE == 'fr-MU') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_MU;
}

if (goog.LOCALE == 'fr_NC' || goog.LOCALE == 'fr-NC') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_NC;
}

if (goog.LOCALE == 'fr_NE' || goog.LOCALE == 'fr-NE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_NE;
}

if (goog.LOCALE == 'fr_PF' || goog.LOCALE == 'fr-PF') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_PF;
}

if (goog.LOCALE == 'fr_PM' || goog.LOCALE == 'fr-PM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_PM;
}

if (goog.LOCALE == 'fr_RE' || goog.LOCALE == 'fr-RE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_RE;
}

if (goog.LOCALE == 'fr_RW' || goog.LOCALE == 'fr-RW') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_RW;
}

if (goog.LOCALE == 'fr_SC' || goog.LOCALE == 'fr-SC') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_SC;
}

if (goog.LOCALE == 'fr_SN' || goog.LOCALE == 'fr-SN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_SN;
}

if (goog.LOCALE == 'fr_SY' || goog.LOCALE == 'fr-SY') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_SY;
}

if (goog.LOCALE == 'fr_TD' || goog.LOCALE == 'fr-TD') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_TD;
}

if (goog.LOCALE == 'fr_TG' || goog.LOCALE == 'fr-TG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_TG;
}

if (goog.LOCALE == 'fr_TN' || goog.LOCALE == 'fr-TN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_TN;
}

if (goog.LOCALE == 'fr_VU' || goog.LOCALE == 'fr-VU') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_VU;
}

if (goog.LOCALE == 'fr_WF' || goog.LOCALE == 'fr-WF') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_WF;
}

if (goog.LOCALE == 'fr_YT' || goog.LOCALE == 'fr-YT') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fr_YT;
}

if (goog.LOCALE == 'fur') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fur;
}

if (goog.LOCALE == 'fur_IT' || goog.LOCALE == 'fur-IT') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fur_IT;
}

if (goog.LOCALE == 'fy') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fy;
}

if (goog.LOCALE == 'fy_NL' || goog.LOCALE == 'fy-NL') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_fy_NL;
}

if (goog.LOCALE == 'ga_IE' || goog.LOCALE == 'ga-IE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ga_IE;
}

if (goog.LOCALE == 'gd') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_gd;
}

if (goog.LOCALE == 'gd_GB' || goog.LOCALE == 'gd-GB') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_gd_GB;
}

if (goog.LOCALE == 'gl_ES' || goog.LOCALE == 'gl-ES') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_gl_ES;
}

if (goog.LOCALE == 'gsw_CH' || goog.LOCALE == 'gsw-CH') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_gsw_CH;
}

if (goog.LOCALE == 'gsw_FR' || goog.LOCALE == 'gsw-FR') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_gsw_FR;
}

if (goog.LOCALE == 'gsw_LI' || goog.LOCALE == 'gsw-LI') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_gsw_LI;
}

if (goog.LOCALE == 'gu_IN' || goog.LOCALE == 'gu-IN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_gu_IN;
}

if (goog.LOCALE == 'guz') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_guz;
}

if (goog.LOCALE == 'guz_KE' || goog.LOCALE == 'guz-KE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_guz_KE;
}

if (goog.LOCALE == 'gv') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_gv;
}

if (goog.LOCALE == 'gv_IM' || goog.LOCALE == 'gv-IM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_gv_IM;
}

if (goog.LOCALE == 'ha') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ha;
}

if (goog.LOCALE == 'ha_GH' || goog.LOCALE == 'ha-GH') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ha_GH;
}

if (goog.LOCALE == 'ha_NE' || goog.LOCALE == 'ha-NE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ha_NE;
}

if (goog.LOCALE == 'ha_NG' || goog.LOCALE == 'ha-NG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ha_NG;
}

if (goog.LOCALE == 'haw_US' || goog.LOCALE == 'haw-US') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_haw_US;
}

if (goog.LOCALE == 'he_IL' || goog.LOCALE == 'he-IL') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_he_IL;
}

if (goog.LOCALE == 'hi_IN' || goog.LOCALE == 'hi-IN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_hi_IN;
}

if (goog.LOCALE == 'hr_BA' || goog.LOCALE == 'hr-BA') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_hr_BA;
}

if (goog.LOCALE == 'hr_HR' || goog.LOCALE == 'hr-HR') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_hr_HR;
}

if (goog.LOCALE == 'hsb') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_hsb;
}

if (goog.LOCALE == 'hsb_DE' || goog.LOCALE == 'hsb-DE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_hsb_DE;
}

if (goog.LOCALE == 'hu_HU' || goog.LOCALE == 'hu-HU') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_hu_HU;
}

if (goog.LOCALE == 'hy_AM' || goog.LOCALE == 'hy-AM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_hy_AM;
}

if (goog.LOCALE == 'id_ID' || goog.LOCALE == 'id-ID') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_id_ID;
}

if (goog.LOCALE == 'ig') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ig;
}

if (goog.LOCALE == 'ig_NG' || goog.LOCALE == 'ig-NG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ig_NG;
}

if (goog.LOCALE == 'ii') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ii;
}

if (goog.LOCALE == 'ii_CN' || goog.LOCALE == 'ii-CN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ii_CN;
}

if (goog.LOCALE == 'is_IS' || goog.LOCALE == 'is-IS') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_is_IS;
}

if (goog.LOCALE == 'it_CH' || goog.LOCALE == 'it-CH') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_it_CH;
}

if (goog.LOCALE == 'it_IT' || goog.LOCALE == 'it-IT') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_it_IT;
}

if (goog.LOCALE == 'it_SM' || goog.LOCALE == 'it-SM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_it_SM;
}

if (goog.LOCALE == 'it_VA' || goog.LOCALE == 'it-VA') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_it_VA;
}

if (goog.LOCALE == 'ja_JP' || goog.LOCALE == 'ja-JP') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ja_JP;
}

if (goog.LOCALE == 'jgo') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_jgo;
}

if (goog.LOCALE == 'jgo_CM' || goog.LOCALE == 'jgo-CM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_jgo_CM;
}

if (goog.LOCALE == 'jmc') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_jmc;
}

if (goog.LOCALE == 'jmc_TZ' || goog.LOCALE == 'jmc-TZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_jmc_TZ;
}

if (goog.LOCALE == 'ka_GE' || goog.LOCALE == 'ka-GE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ka_GE;
}

if (goog.LOCALE == 'kab') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_kab;
}

if (goog.LOCALE == 'kab_DZ' || goog.LOCALE == 'kab-DZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_kab_DZ;
}

if (goog.LOCALE == 'kam') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_kam;
}

if (goog.LOCALE == 'kam_KE' || goog.LOCALE == 'kam-KE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_kam_KE;
}

if (goog.LOCALE == 'kde') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_kde;
}

if (goog.LOCALE == 'kde_TZ' || goog.LOCALE == 'kde-TZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_kde_TZ;
}

if (goog.LOCALE == 'kea') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_kea;
}

if (goog.LOCALE == 'kea_CV' || goog.LOCALE == 'kea-CV') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_kea_CV;
}

if (goog.LOCALE == 'khq') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_khq;
}

if (goog.LOCALE == 'khq_ML' || goog.LOCALE == 'khq-ML') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_khq_ML;
}

if (goog.LOCALE == 'ki') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ki;
}

if (goog.LOCALE == 'ki_KE' || goog.LOCALE == 'ki-KE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ki_KE;
}

if (goog.LOCALE == 'kk_KZ' || goog.LOCALE == 'kk-KZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_kk_KZ;
}

if (goog.LOCALE == 'kkj') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_kkj;
}

if (goog.LOCALE == 'kkj_CM' || goog.LOCALE == 'kkj-CM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_kkj_CM;
}

if (goog.LOCALE == 'kl') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_kl;
}

if (goog.LOCALE == 'kl_GL' || goog.LOCALE == 'kl-GL') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_kl_GL;
}

if (goog.LOCALE == 'kln') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_kln;
}

if (goog.LOCALE == 'kln_KE' || goog.LOCALE == 'kln-KE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_kln_KE;
}

if (goog.LOCALE == 'km_KH' || goog.LOCALE == 'km-KH') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_km_KH;
}

if (goog.LOCALE == 'kn_IN' || goog.LOCALE == 'kn-IN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_kn_IN;
}

if (goog.LOCALE == 'ko_KP' || goog.LOCALE == 'ko-KP') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ko_KP;
}

if (goog.LOCALE == 'ko_KR' || goog.LOCALE == 'ko-KR') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ko_KR;
}

if (goog.LOCALE == 'kok') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_kok;
}

if (goog.LOCALE == 'kok_IN' || goog.LOCALE == 'kok-IN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_kok_IN;
}

if (goog.LOCALE == 'ks') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ks;
}

if (goog.LOCALE == 'ks_IN' || goog.LOCALE == 'ks-IN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ks_IN;
}

if (goog.LOCALE == 'ksb') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ksb;
}

if (goog.LOCALE == 'ksb_TZ' || goog.LOCALE == 'ksb-TZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ksb_TZ;
}

if (goog.LOCALE == 'ksf') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ksf;
}

if (goog.LOCALE == 'ksf_CM' || goog.LOCALE == 'ksf-CM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ksf_CM;
}

if (goog.LOCALE == 'ksh') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ksh;
}

if (goog.LOCALE == 'ksh_DE' || goog.LOCALE == 'ksh-DE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ksh_DE;
}

if (goog.LOCALE == 'kw') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_kw;
}

if (goog.LOCALE == 'kw_GB' || goog.LOCALE == 'kw-GB') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_kw_GB;
}

if (goog.LOCALE == 'ky_KG' || goog.LOCALE == 'ky-KG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ky_KG;
}

if (goog.LOCALE == 'lag') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_lag;
}

if (goog.LOCALE == 'lag_TZ' || goog.LOCALE == 'lag-TZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_lag_TZ;
}

if (goog.LOCALE == 'lb') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_lb;
}

if (goog.LOCALE == 'lb_LU' || goog.LOCALE == 'lb-LU') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_lb_LU;
}

if (goog.LOCALE == 'lg') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_lg;
}

if (goog.LOCALE == 'lg_UG' || goog.LOCALE == 'lg-UG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_lg_UG;
}

if (goog.LOCALE == 'lkt') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_lkt;
}

if (goog.LOCALE == 'lkt_US' || goog.LOCALE == 'lkt-US') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_lkt_US;
}

if (goog.LOCALE == 'ln_AO' || goog.LOCALE == 'ln-AO') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ln_AO;
}

if (goog.LOCALE == 'ln_CD' || goog.LOCALE == 'ln-CD') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ln_CD;
}

if (goog.LOCALE == 'ln_CF' || goog.LOCALE == 'ln-CF') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ln_CF;
}

if (goog.LOCALE == 'ln_CG' || goog.LOCALE == 'ln-CG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ln_CG;
}

if (goog.LOCALE == 'lo_LA' || goog.LOCALE == 'lo-LA') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_lo_LA;
}

if (goog.LOCALE == 'lrc') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_lrc;
}

if (goog.LOCALE == 'lrc_IQ' || goog.LOCALE == 'lrc-IQ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_lrc_IQ;
}

if (goog.LOCALE == 'lrc_IR' || goog.LOCALE == 'lrc-IR') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_lrc_IR;
}

if (goog.LOCALE == 'lt_LT' || goog.LOCALE == 'lt-LT') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_lt_LT;
}

if (goog.LOCALE == 'lu') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_lu;
}

if (goog.LOCALE == 'lu_CD' || goog.LOCALE == 'lu-CD') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_lu_CD;
}

if (goog.LOCALE == 'luo') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_luo;
}

if (goog.LOCALE == 'luo_KE' || goog.LOCALE == 'luo-KE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_luo_KE;
}

if (goog.LOCALE == 'luy') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_luy;
}

if (goog.LOCALE == 'luy_KE' || goog.LOCALE == 'luy-KE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_luy_KE;
}

if (goog.LOCALE == 'lv_LV' || goog.LOCALE == 'lv-LV') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_lv_LV;
}

if (goog.LOCALE == 'mas') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_mas;
}

if (goog.LOCALE == 'mas_KE' || goog.LOCALE == 'mas-KE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_mas_KE;
}

if (goog.LOCALE == 'mas_TZ' || goog.LOCALE == 'mas-TZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_mas_TZ;
}

if (goog.LOCALE == 'mer') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_mer;
}

if (goog.LOCALE == 'mer_KE' || goog.LOCALE == 'mer-KE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_mer_KE;
}

if (goog.LOCALE == 'mfe') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_mfe;
}

if (goog.LOCALE == 'mfe_MU' || goog.LOCALE == 'mfe-MU') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_mfe_MU;
}

if (goog.LOCALE == 'mg') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_mg;
}

if (goog.LOCALE == 'mg_MG' || goog.LOCALE == 'mg-MG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_mg_MG;
}

if (goog.LOCALE == 'mgh') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_mgh;
}

if (goog.LOCALE == 'mgh_MZ' || goog.LOCALE == 'mgh-MZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_mgh_MZ;
}

if (goog.LOCALE == 'mgo') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_mgo;
}

if (goog.LOCALE == 'mgo_CM' || goog.LOCALE == 'mgo-CM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_mgo_CM;
}

if (goog.LOCALE == 'mk_MK' || goog.LOCALE == 'mk-MK') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_mk_MK;
}

if (goog.LOCALE == 'ml_IN' || goog.LOCALE == 'ml-IN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ml_IN;
}

if (goog.LOCALE == 'mn_MN' || goog.LOCALE == 'mn-MN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_mn_MN;
}

if (goog.LOCALE == 'mr_IN' || goog.LOCALE == 'mr-IN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_mr_IN;
}

if (goog.LOCALE == 'ms_BN' || goog.LOCALE == 'ms-BN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ms_BN;
}

if (goog.LOCALE == 'ms_MY' || goog.LOCALE == 'ms-MY') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ms_MY;
}

if (goog.LOCALE == 'ms_SG' || goog.LOCALE == 'ms-SG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ms_SG;
}

if (goog.LOCALE == 'mt_MT' || goog.LOCALE == 'mt-MT') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_mt_MT;
}

if (goog.LOCALE == 'mua') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_mua;
}

if (goog.LOCALE == 'mua_CM' || goog.LOCALE == 'mua-CM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_mua_CM;
}

if (goog.LOCALE == 'my_MM' || goog.LOCALE == 'my-MM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_my_MM;
}

if (goog.LOCALE == 'mzn') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_mzn;
}

if (goog.LOCALE == 'mzn_IR' || goog.LOCALE == 'mzn-IR') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_mzn_IR;
}

if (goog.LOCALE == 'naq') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_naq;
}

if (goog.LOCALE == 'naq_NA' || goog.LOCALE == 'naq-NA') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_naq_NA;
}

if (goog.LOCALE == 'nb_NO' || goog.LOCALE == 'nb-NO') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_nb_NO;
}

if (goog.LOCALE == 'nb_SJ' || goog.LOCALE == 'nb-SJ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_nb_SJ;
}

if (goog.LOCALE == 'nd') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_nd;
}

if (goog.LOCALE == 'nd_ZW' || goog.LOCALE == 'nd-ZW') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_nd_ZW;
}

if (goog.LOCALE == 'nds') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_nds;
}

if (goog.LOCALE == 'nds_DE' || goog.LOCALE == 'nds-DE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_nds_DE;
}

if (goog.LOCALE == 'nds_NL' || goog.LOCALE == 'nds-NL') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_nds_NL;
}

if (goog.LOCALE == 'ne_IN' || goog.LOCALE == 'ne-IN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ne_IN;
}

if (goog.LOCALE == 'ne_NP' || goog.LOCALE == 'ne-NP') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ne_NP;
}

if (goog.LOCALE == 'nl_AW' || goog.LOCALE == 'nl-AW') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_nl_AW;
}

if (goog.LOCALE == 'nl_BE' || goog.LOCALE == 'nl-BE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_nl_BE;
}

if (goog.LOCALE == 'nl_BQ' || goog.LOCALE == 'nl-BQ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_nl_BQ;
}

if (goog.LOCALE == 'nl_CW' || goog.LOCALE == 'nl-CW') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_nl_CW;
}

if (goog.LOCALE == 'nl_NL' || goog.LOCALE == 'nl-NL') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_nl_NL;
}

if (goog.LOCALE == 'nl_SR' || goog.LOCALE == 'nl-SR') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_nl_SR;
}

if (goog.LOCALE == 'nl_SX' || goog.LOCALE == 'nl-SX') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_nl_SX;
}

if (goog.LOCALE == 'nmg') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_nmg;
}

if (goog.LOCALE == 'nmg_CM' || goog.LOCALE == 'nmg-CM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_nmg_CM;
}

if (goog.LOCALE == 'nn') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_nn;
}

if (goog.LOCALE == 'nn_NO' || goog.LOCALE == 'nn-NO') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_nn_NO;
}

if (goog.LOCALE == 'nnh') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_nnh;
}

if (goog.LOCALE == 'nnh_CM' || goog.LOCALE == 'nnh-CM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_nnh_CM;
}

if (goog.LOCALE == 'nus') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_nus;
}

if (goog.LOCALE == 'nus_SS' || goog.LOCALE == 'nus-SS') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_nus_SS;
}

if (goog.LOCALE == 'nyn') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_nyn;
}

if (goog.LOCALE == 'nyn_UG' || goog.LOCALE == 'nyn-UG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_nyn_UG;
}

if (goog.LOCALE == 'om') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_om;
}

if (goog.LOCALE == 'om_ET' || goog.LOCALE == 'om-ET') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_om_ET;
}

if (goog.LOCALE == 'om_KE' || goog.LOCALE == 'om-KE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_om_KE;
}

if (goog.LOCALE == 'or_IN' || goog.LOCALE == 'or-IN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_or_IN;
}

if (goog.LOCALE == 'os') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_os;
}

if (goog.LOCALE == 'os_GE' || goog.LOCALE == 'os-GE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_os_GE;
}

if (goog.LOCALE == 'os_RU' || goog.LOCALE == 'os-RU') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_os_RU;
}

if (goog.LOCALE == 'pa_Arab' || goog.LOCALE == 'pa-Arab') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_pa_Arab;
}

if (goog.LOCALE == 'pa_Arab_PK' || goog.LOCALE == 'pa-Arab-PK') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_pa_Arab_PK;
}

if (goog.LOCALE == 'pa_Guru' || goog.LOCALE == 'pa-Guru') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_pa_Guru;
}

if (goog.LOCALE == 'pa_Guru_IN' || goog.LOCALE == 'pa-Guru-IN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_pa_Guru_IN;
}

if (goog.LOCALE == 'pl_PL' || goog.LOCALE == 'pl-PL') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_pl_PL;
}

if (goog.LOCALE == 'ps') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ps;
}

if (goog.LOCALE == 'ps_AF' || goog.LOCALE == 'ps-AF') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ps_AF;
}

if (goog.LOCALE == 'pt_AO' || goog.LOCALE == 'pt-AO') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_pt_AO;
}

if (goog.LOCALE == 'pt_CH' || goog.LOCALE == 'pt-CH') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_pt_CH;
}

if (goog.LOCALE == 'pt_CV' || goog.LOCALE == 'pt-CV') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_pt_CV;
}

if (goog.LOCALE == 'pt_GQ' || goog.LOCALE == 'pt-GQ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_pt_GQ;
}

if (goog.LOCALE == 'pt_GW' || goog.LOCALE == 'pt-GW') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_pt_GW;
}

if (goog.LOCALE == 'pt_LU' || goog.LOCALE == 'pt-LU') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_pt_LU;
}

if (goog.LOCALE == 'pt_MO' || goog.LOCALE == 'pt-MO') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_pt_MO;
}

if (goog.LOCALE == 'pt_MZ' || goog.LOCALE == 'pt-MZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_pt_MZ;
}

if (goog.LOCALE == 'pt_ST' || goog.LOCALE == 'pt-ST') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_pt_ST;
}

if (goog.LOCALE == 'pt_TL' || goog.LOCALE == 'pt-TL') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_pt_TL;
}

if (goog.LOCALE == 'qu') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_qu;
}

if (goog.LOCALE == 'qu_BO' || goog.LOCALE == 'qu-BO') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_qu_BO;
}

if (goog.LOCALE == 'qu_EC' || goog.LOCALE == 'qu-EC') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_qu_EC;
}

if (goog.LOCALE == 'qu_PE' || goog.LOCALE == 'qu-PE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_qu_PE;
}

if (goog.LOCALE == 'rm') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_rm;
}

if (goog.LOCALE == 'rm_CH' || goog.LOCALE == 'rm-CH') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_rm_CH;
}

if (goog.LOCALE == 'rn') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_rn;
}

if (goog.LOCALE == 'rn_BI' || goog.LOCALE == 'rn-BI') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_rn_BI;
}

if (goog.LOCALE == 'ro_MD' || goog.LOCALE == 'ro-MD') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ro_MD;
}

if (goog.LOCALE == 'ro_RO' || goog.LOCALE == 'ro-RO') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ro_RO;
}

if (goog.LOCALE == 'rof') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_rof;
}

if (goog.LOCALE == 'rof_TZ' || goog.LOCALE == 'rof-TZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_rof_TZ;
}

if (goog.LOCALE == 'ru_BY' || goog.LOCALE == 'ru-BY') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ru_BY;
}

if (goog.LOCALE == 'ru_KG' || goog.LOCALE == 'ru-KG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ru_KG;
}

if (goog.LOCALE == 'ru_KZ' || goog.LOCALE == 'ru-KZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ru_KZ;
}

if (goog.LOCALE == 'ru_MD' || goog.LOCALE == 'ru-MD') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ru_MD;
}

if (goog.LOCALE == 'ru_RU' || goog.LOCALE == 'ru-RU') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ru_RU;
}

if (goog.LOCALE == 'ru_UA' || goog.LOCALE == 'ru-UA') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ru_UA;
}

if (goog.LOCALE == 'rw') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_rw;
}

if (goog.LOCALE == 'rw_RW' || goog.LOCALE == 'rw-RW') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_rw_RW;
}

if (goog.LOCALE == 'rwk') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_rwk;
}

if (goog.LOCALE == 'rwk_TZ' || goog.LOCALE == 'rwk-TZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_rwk_TZ;
}

if (goog.LOCALE == 'sah') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sah;
}

if (goog.LOCALE == 'sah_RU' || goog.LOCALE == 'sah-RU') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sah_RU;
}

if (goog.LOCALE == 'saq') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_saq;
}

if (goog.LOCALE == 'saq_KE' || goog.LOCALE == 'saq-KE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_saq_KE;
}

if (goog.LOCALE == 'sbp') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sbp;
}

if (goog.LOCALE == 'sbp_TZ' || goog.LOCALE == 'sbp-TZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sbp_TZ;
}

if (goog.LOCALE == 'se') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_se;
}

if (goog.LOCALE == 'se_FI' || goog.LOCALE == 'se-FI') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_se_FI;
}

if (goog.LOCALE == 'se_NO' || goog.LOCALE == 'se-NO') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_se_NO;
}

if (goog.LOCALE == 'se_SE' || goog.LOCALE == 'se-SE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_se_SE;
}

if (goog.LOCALE == 'seh') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_seh;
}

if (goog.LOCALE == 'seh_MZ' || goog.LOCALE == 'seh-MZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_seh_MZ;
}

if (goog.LOCALE == 'ses') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ses;
}

if (goog.LOCALE == 'ses_ML' || goog.LOCALE == 'ses-ML') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ses_ML;
}

if (goog.LOCALE == 'sg') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sg;
}

if (goog.LOCALE == 'sg_CF' || goog.LOCALE == 'sg-CF') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sg_CF;
}

if (goog.LOCALE == 'shi') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_shi;
}

if (goog.LOCALE == 'shi_Latn' || goog.LOCALE == 'shi-Latn') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_shi_Latn;
}

if (goog.LOCALE == 'shi_Latn_MA' || goog.LOCALE == 'shi-Latn-MA') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_shi_Latn_MA;
}

if (goog.LOCALE == 'shi_Tfng' || goog.LOCALE == 'shi-Tfng') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_shi_Tfng;
}

if (goog.LOCALE == 'shi_Tfng_MA' || goog.LOCALE == 'shi-Tfng-MA') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_shi_Tfng_MA;
}

if (goog.LOCALE == 'si_LK' || goog.LOCALE == 'si-LK') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_si_LK;
}

if (goog.LOCALE == 'sk_SK' || goog.LOCALE == 'sk-SK') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sk_SK;
}

if (goog.LOCALE == 'sl_SI' || goog.LOCALE == 'sl-SI') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sl_SI;
}

if (goog.LOCALE == 'smn') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_smn;
}

if (goog.LOCALE == 'smn_FI' || goog.LOCALE == 'smn-FI') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_smn_FI;
}

if (goog.LOCALE == 'sn') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sn;
}

if (goog.LOCALE == 'sn_ZW' || goog.LOCALE == 'sn-ZW') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sn_ZW;
}

if (goog.LOCALE == 'so') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_so;
}

if (goog.LOCALE == 'so_DJ' || goog.LOCALE == 'so-DJ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_so_DJ;
}

if (goog.LOCALE == 'so_ET' || goog.LOCALE == 'so-ET') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_so_ET;
}

if (goog.LOCALE == 'so_KE' || goog.LOCALE == 'so-KE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_so_KE;
}

if (goog.LOCALE == 'so_SO' || goog.LOCALE == 'so-SO') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_so_SO;
}

if (goog.LOCALE == 'sq_AL' || goog.LOCALE == 'sq-AL') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sq_AL;
}

if (goog.LOCALE == 'sq_MK' || goog.LOCALE == 'sq-MK') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sq_MK;
}

if (goog.LOCALE == 'sq_XK' || goog.LOCALE == 'sq-XK') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sq_XK;
}

if (goog.LOCALE == 'sr_Cyrl' || goog.LOCALE == 'sr-Cyrl') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sr_Cyrl;
}

if (goog.LOCALE == 'sr_Cyrl_BA' || goog.LOCALE == 'sr-Cyrl-BA') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sr_Cyrl_BA;
}

if (goog.LOCALE == 'sr_Cyrl_ME' || goog.LOCALE == 'sr-Cyrl-ME') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sr_Cyrl_ME;
}

if (goog.LOCALE == 'sr_Cyrl_RS' || goog.LOCALE == 'sr-Cyrl-RS') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sr_Cyrl_RS;
}

if (goog.LOCALE == 'sr_Cyrl_XK' || goog.LOCALE == 'sr-Cyrl-XK') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sr_Cyrl_XK;
}

if (goog.LOCALE == 'sr_Latn_BA' || goog.LOCALE == 'sr-Latn-BA') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sr_Latn_BA;
}

if (goog.LOCALE == 'sr_Latn_ME' || goog.LOCALE == 'sr-Latn-ME') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sr_Latn_ME;
}

if (goog.LOCALE == 'sr_Latn_RS' || goog.LOCALE == 'sr-Latn-RS') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sr_Latn_RS;
}

if (goog.LOCALE == 'sr_Latn_XK' || goog.LOCALE == 'sr-Latn-XK') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sr_Latn_XK;
}

if (goog.LOCALE == 'sv_AX' || goog.LOCALE == 'sv-AX') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sv_AX;
}

if (goog.LOCALE == 'sv_FI' || goog.LOCALE == 'sv-FI') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sv_FI;
}

if (goog.LOCALE == 'sv_SE' || goog.LOCALE == 'sv-SE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sv_SE;
}

if (goog.LOCALE == 'sw_CD' || goog.LOCALE == 'sw-CD') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sw_CD;
}

if (goog.LOCALE == 'sw_KE' || goog.LOCALE == 'sw-KE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sw_KE;
}

if (goog.LOCALE == 'sw_TZ' || goog.LOCALE == 'sw-TZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sw_TZ;
}

if (goog.LOCALE == 'sw_UG' || goog.LOCALE == 'sw-UG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_sw_UG;
}

if (goog.LOCALE == 'ta_IN' || goog.LOCALE == 'ta-IN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ta_IN;
}

if (goog.LOCALE == 'ta_LK' || goog.LOCALE == 'ta-LK') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ta_LK;
}

if (goog.LOCALE == 'ta_MY' || goog.LOCALE == 'ta-MY') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ta_MY;
}

if (goog.LOCALE == 'ta_SG' || goog.LOCALE == 'ta-SG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ta_SG;
}

if (goog.LOCALE == 'te_IN' || goog.LOCALE == 'te-IN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_te_IN;
}

if (goog.LOCALE == 'teo') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_teo;
}

if (goog.LOCALE == 'teo_KE' || goog.LOCALE == 'teo-KE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_teo_KE;
}

if (goog.LOCALE == 'teo_UG' || goog.LOCALE == 'teo-UG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_teo_UG;
}

if (goog.LOCALE == 'th_TH' || goog.LOCALE == 'th-TH') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_th_TH;
}

if (goog.LOCALE == 'ti') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ti;
}

if (goog.LOCALE == 'ti_ER' || goog.LOCALE == 'ti-ER') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ti_ER;
}

if (goog.LOCALE == 'ti_ET' || goog.LOCALE == 'ti-ET') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ti_ET;
}

if (goog.LOCALE == 'to') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_to;
}

if (goog.LOCALE == 'to_TO' || goog.LOCALE == 'to-TO') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_to_TO;
}

if (goog.LOCALE == 'tr_CY' || goog.LOCALE == 'tr-CY') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_tr_CY;
}

if (goog.LOCALE == 'tr_TR' || goog.LOCALE == 'tr-TR') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_tr_TR;
}

if (goog.LOCALE == 'twq') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_twq;
}

if (goog.LOCALE == 'twq_NE' || goog.LOCALE == 'twq-NE') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_twq_NE;
}

if (goog.LOCALE == 'tzm') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_tzm;
}

if (goog.LOCALE == 'tzm_MA' || goog.LOCALE == 'tzm-MA') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_tzm_MA;
}

if (goog.LOCALE == 'ug') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ug;
}

if (goog.LOCALE == 'ug_CN' || goog.LOCALE == 'ug-CN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ug_CN;
}

if (goog.LOCALE == 'uk_UA' || goog.LOCALE == 'uk-UA') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_uk_UA;
}

if (goog.LOCALE == 'ur_IN' || goog.LOCALE == 'ur-IN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ur_IN;
}

if (goog.LOCALE == 'ur_PK' || goog.LOCALE == 'ur-PK') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_ur_PK;
}

if (goog.LOCALE == 'uz_Arab' || goog.LOCALE == 'uz-Arab') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_uz_Arab;
}

if (goog.LOCALE == 'uz_Arab_AF' || goog.LOCALE == 'uz-Arab-AF') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_uz_Arab_AF;
}

if (goog.LOCALE == 'uz_Cyrl' || goog.LOCALE == 'uz-Cyrl') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_uz_Cyrl;
}

if (goog.LOCALE == 'uz_Cyrl_UZ' || goog.LOCALE == 'uz-Cyrl-UZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_uz_Cyrl_UZ;
}

if (goog.LOCALE == 'uz_Latn' || goog.LOCALE == 'uz-Latn') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_uz_Latn;
}

if (goog.LOCALE == 'uz_Latn_UZ' || goog.LOCALE == 'uz-Latn-UZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_uz_Latn_UZ;
}

if (goog.LOCALE == 'vai') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_vai;
}

if (goog.LOCALE == 'vai_Latn' || goog.LOCALE == 'vai-Latn') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_vai_Latn;
}

if (goog.LOCALE == 'vai_Latn_LR' || goog.LOCALE == 'vai-Latn-LR') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_vai_Latn_LR;
}

if (goog.LOCALE == 'vai_Vaii' || goog.LOCALE == 'vai-Vaii') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_vai_Vaii;
}

if (goog.LOCALE == 'vai_Vaii_LR' || goog.LOCALE == 'vai-Vaii-LR') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_vai_Vaii_LR;
}

if (goog.LOCALE == 'vi_VN' || goog.LOCALE == 'vi-VN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_vi_VN;
}

if (goog.LOCALE == 'vun') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_vun;
}

if (goog.LOCALE == 'vun_TZ' || goog.LOCALE == 'vun-TZ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_vun_TZ;
}

if (goog.LOCALE == 'wae') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_wae;
}

if (goog.LOCALE == 'wae_CH' || goog.LOCALE == 'wae-CH') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_wae_CH;
}

if (goog.LOCALE == 'xog') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_xog;
}

if (goog.LOCALE == 'xog_UG' || goog.LOCALE == 'xog-UG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_xog_UG;
}

if (goog.LOCALE == 'yav') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_yav;
}

if (goog.LOCALE == 'yav_CM' || goog.LOCALE == 'yav-CM') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_yav_CM;
}

if (goog.LOCALE == 'yi') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_yi;
}

if (goog.LOCALE == 'yi_001' || goog.LOCALE == 'yi-001') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_yi_001;
}

if (goog.LOCALE == 'yo') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_yo;
}

if (goog.LOCALE == 'yo_BJ' || goog.LOCALE == 'yo-BJ') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_yo_BJ;
}

if (goog.LOCALE == 'yo_NG' || goog.LOCALE == 'yo-NG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_yo_NG;
}

if (goog.LOCALE == 'yue') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_yue;
}

if (goog.LOCALE == 'yue_HK' || goog.LOCALE == 'yue-HK') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_yue_HK;
}

if (goog.LOCALE == 'zgh') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_zgh;
}

if (goog.LOCALE == 'zgh_MA' || goog.LOCALE == 'zgh-MA') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_zgh_MA;
}

if (goog.LOCALE == 'zh_Hans' || goog.LOCALE == 'zh-Hans') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_zh_Hans;
}

if (goog.LOCALE == 'zh_Hans_CN' || goog.LOCALE == 'zh-Hans-CN') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_zh_Hans_CN;
}

if (goog.LOCALE == 'zh_Hans_HK' || goog.LOCALE == 'zh-Hans-HK') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_zh_Hans_HK;
}

if (goog.LOCALE == 'zh_Hans_MO' || goog.LOCALE == 'zh-Hans-MO') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_zh_Hans_MO;
}

if (goog.LOCALE == 'zh_Hans_SG' || goog.LOCALE == 'zh-Hans-SG') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_zh_Hans_SG;
}

if (goog.LOCALE == 'zh_Hant' || goog.LOCALE == 'zh-Hant') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_zh_Hant;
}

if (goog.LOCALE == 'zh_Hant_HK' || goog.LOCALE == 'zh-Hant-HK') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_zh_Hant_HK;
}

if (goog.LOCALE == 'zh_Hant_MO' || goog.LOCALE == 'zh-Hant-MO') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_zh_Hant_MO;
}

if (goog.LOCALE == 'zh_Hant_TW' || goog.LOCALE == 'zh-Hant-TW') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_zh_Hant_TW;
}

if (goog.LOCALE == 'zu_ZA' || goog.LOCALE == 'zu-ZA') {
  goog.i18n.DateTimeSymbols = goog.i18n.DateTimeSymbols_zu_ZA;
}
