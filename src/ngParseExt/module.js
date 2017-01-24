'use strict';

/* eslint-disable new-cap */

/**
 * @ngdoc module
 * @name ngParseExt
 * @packageName angular-parse-ext
 * @description
 *
 * # ngParseExt
 *
 * The `ngParseExt` module provides functionality to allow Unicode characters in
 * identifiers inside AngularJS expressions.
 *
 *
 * <div doc-module-components="ngParseExt"></div>
 *
 * This module allows the usage of any identifier that follows ES6 identifier naming convention
 * to be used as an identifier in an AngularJS expression. ES6 delegates some of the identifier
 * rules definition to Unicode, this module uses ES6 and Unicode 8.0 identifiers convention.
 *
 */

/* global angularParseExtModule: true,
  IDS_Y,
  IDC_Y
*/

function isValidIdentifierStart(ch, cp) {
  return ch === '$' ||
         ch === '_' ||
         IDS_Y(cp);
}

function isValidIdentifierContinue(ch, cp) {
  return ch === '$' ||
         ch === '_' ||
         cp === 0x200C || // <ZWNJ>
         cp === 0x200D || // <ZWJ>
         IDC_Y(cp);
}

angular.module('ngParseExt', [])
  .config(['$parseProvider', function($parseProvider) {
    $parseProvider.setIdentifierFns(isValidIdentifierStart, isValidIdentifierContinue);
  }]);
