'use strict';

// NOTE: ADVANCED_OPTIMIZATIONS mode.
//
// This file is compiled with Closure compiler's ADVANCED_OPTIMIZATIONS flag! Be wary of using
// constructs incompatible with that mode.

/* global $interpolateMinErr: false */
/* global MessageFormatParser: false */
/* global stringify: false */

/**
 * @ngdoc service
 * @name $$messageFormat
 *
 * @description
 * Angular internal service to recognize MessageFormat extensions in interpolation expressions.
 * For more information, see:
 * https://docs.google.com/a/google.com/document/d/1pbtW2yvtmFBikfRrJd8VAsabiFkKezmYZ_PbgdjQOVU/edit
 *
 * ## Example
 *
 * <example name="ngMessageFormat-example" module="msgFmtExample" deps="angular-message-format.min.js">
 * <file name="index.html">
 *   <div ng-controller="AppController">
 *     <button ng-click="decreaseRecipients()" id="decreaseRecipients">decreaseRecipients</button><br>
 *     <span>{{recipients.length, plural, offset:1
 *             =0    {{{sender.name}} gave no gifts (\#=#)}
 *             =1    {{{sender.name}} gave one gift to {{recipients[0].name}} (\#=#)}
 *             one   {{{sender.name}} gave {{recipients[0].name}} and one other person a gift (\#=#)}
 *             other {{{sender.name}} gave {{recipients[0].name}} and # other people a gift (\#=#)}
 *           }}</span>
 *   </div>
 * </file>
 *
 * <file name="script.js">
 *   function Person(name, gender) {
 *     this.name = name;
 *     this.gender = gender;
 *   }
 *
 *   var alice   = new Person("Alice", "female"),
 *       bob     = new Person("Bob", "male"),
 *       charlie = new Person("Charlie", "male"),
 *       harry   = new Person("Harry Potter", "male");
 *
 *   angular.module('msgFmtExample', ['ngMessageFormat'])
 *     .controller('AppController', ['$scope', function($scope) {
 *         $scope.recipients = [alice, bob, charlie];
 *         $scope.sender = harry;
 *         $scope.decreaseRecipients = function() {
 *           --$scope.recipients.length;
 *         };
 *       }]);
 * </file>
 *
 * <file name="protractor.js" type="protractor">
 *   describe('MessageFormat plural', function() {
 *     it('should pluralize initial values', function() {
 *       var messageElem = element(by.binding('recipients.length')), decreaseRecipientsBtn = element(by.id('decreaseRecipients'));
 *       expect(messageElem.getText()).toEqual('Harry Potter gave Alice and 2 other people a gift (#=2)');
 *       decreaseRecipientsBtn.click();
 *       expect(messageElem.getText()).toEqual('Harry Potter gave Alice and one other person a gift (#=1)');
 *       decreaseRecipientsBtn.click();
 *       expect(messageElem.getText()).toEqual('Harry Potter gave one gift to Alice (#=0)');
 *       decreaseRecipientsBtn.click();
 *       expect(messageElem.getText()).toEqual('Harry Potter gave no gifts (#=-1)');
 *     });
 *   });
 * </file>
 * </example>
 */
var $$MessageFormatFactory = ['$parse', '$locale', '$sce', '$exceptionHandler', function $$messageFormat(
                   $parse,   $locale,   $sce,   $exceptionHandler) {

  function getStringifier(trustedContext, allOrNothing, text) {
    return function stringifier(value) {
      try {
        value = trustedContext ? $sce['getTrusted'](trustedContext, value) : $sce['valueOf'](value);
        return allOrNothing && (value === void 0) ? value : stringify(value);
      } catch (err) {
        $exceptionHandler($interpolateMinErr['interr'](text, err));
      }
    };
  }

  function interpolate(text, mustHaveExpression, trustedContext, allOrNothing) {
    var stringifier = getStringifier(trustedContext, allOrNothing, text);
    var parser = new MessageFormatParser(text, 0, $parse, $locale['pluralCat'], stringifier,
                                         mustHaveExpression, trustedContext, allOrNothing);
    parser.run(parser.ruleInterpolate);
    return parser.parsedFn;
  }

  return {
    'interpolate': interpolate
  };
}];

var $$interpolateDecorator = ['$$messageFormat', '$delegate', function $$interpolateDecorator($$messageFormat, $interpolate) {
  if ($interpolate['startSymbol']() != "{{" || $interpolate['endSymbol']() != "}}") {
    throw $interpolateMinErr('nochgmustache', 'angular-message-format.js currently does not allow you to use custom start and end symbols for interpolation.');
  }
  var interpolate = $$messageFormat['interpolate'];
  interpolate['startSymbol'] = $interpolate['startSymbol'];
  interpolate['endSymbol'] = $interpolate['endSymbol'];
  return interpolate;
}];


/**
 * @ngdoc module
 * @name ngMessageFormat
 * @packageName angular-message-format
 * @description
 */
var module = window['angular']['module']('ngMessageFormat', ['ng']);
module['factory']('$$messageFormat', $$MessageFormatFactory);
module['config'](['$provide', function($provide) {
  $provide['decorator']('$interpolate', $$interpolateDecorator);
}]);
