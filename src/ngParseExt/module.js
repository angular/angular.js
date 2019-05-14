'use strict';

/* eslint-disable new-cap */

/**
 * @ngdoc module
 * @name ngParseExt
 * @packageName angular-parse-ext
 *
 * @description
 *
 * The `ngParseExt` module provides functionality to allow Unicode characters in
 * identifiers inside AngularJS expressions.
 *
 * This module allows any identifier that follows the ES6 identifier naming convention
 * to be used as an identifier in an AngularJS expression. ES6 delegates some of the identifier
 * rules definition to Unicode, this module uses the ES6 and Unicode 8.0 identifiers convention.
 *
 * <div class="alert alert-warning">
 * You cannot use Unicode characters for variable names in the {@link ngRepeat} or {@link ngOptions}
 * expressions (e.g. `ng-repeat="f in поля"`), because even with `ngParseExt` included, these
 * special expressions are not parsed by the {@link $parse} service.
 * </div>
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
  }])
  .info({ angularVersion: '"NG_VERSION_FULL"' });
