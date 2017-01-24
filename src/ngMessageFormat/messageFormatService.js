'use strict';

// NOTE: ADVANCED_OPTIMIZATIONS mode.
//
// This file is compiled with Closure compiler's ADVANCED_OPTIMIZATIONS flag! Be wary of using
// constructs incompatible with that mode.

/* global $interpolateMinErr: true */
/* global isFunction: true */
/* global noop: true */
/* global toJson: true */
/* global MessageFormatParser: false */

/**
 * @ngdoc module
 * @name ngMessageFormat
 * @packageName angular-message-format
 *
 * @description
 *
 * ## What is  ngMessageFormat?
 *
 * The ngMessageFormat module extends the AngularJS {@link ng.$interpolate `$interpolate`} service
 * with a syntax for handling pluralization and gender specific messages, which is based on the
 * [ICU MessageFormat syntax][ICU].
 *
 * See [the design doc][ngMessageFormat doc] for more information.
 *
 * [ICU]: http://userguide.icu-project.org/formatparse/messages#TOC-MessageFormat
 * [ngMessageFormat doc]: https://docs.google.com/a/google.com/document/d/1pbtW2yvtmFBikfRrJd8VAsabiFkKezmYZ_PbgdjQOVU/edit
 *
 * ## Examples
 *
 * ### Gender
 *
 * This example uses the "select" keyword to specify the message based on gender.
 *
 * <example name="ngMessageFormat-example-gender" module="msgFmtExample" deps="angular-message-format.js">
 * <file name="index.html">
 *  <div ng-controller="AppController">
 *    Select Recipient:<br>
      <select ng-model="recipient" ng-options="person as person.name for person in recipients">
      </select>
      <p>{{recipient.gender, select,
                male {{{recipient.name}} unwrapped his gift. }
                female {{{recipient.name}} unwrapped her gift. }
                other {{{recipient.name}} unwrapped their gift. }
      }}</p>
 *  </div>
 * </file>
 * <file name="script.js">
 *   function Person(name, gender) {
 *     this.name = name;
 *     this.gender = gender;
 *   }
 *
 *   var alice   = new Person('Alice', 'female'),
 *       bob     = new Person('Bob', 'male'),
 *       ashley = new Person('Ashley', '');
 *
 *   angular.module('msgFmtExample', ['ngMessageFormat'])
 *     .controller('AppController', ['$scope', function($scope) {
 *         $scope.recipients = [alice, bob, ashley];
 *         $scope.recipient = $scope.recipients[0];
 *       }]);
 * </file>
 * </example>
 *
 * ### Plural
 *
 * This example shows how the "plural" keyword is used to account for a variable number of entities.
 * The "#" variable holds the current number and can be embedded in the message.
 *
 * Note that "=1" takes precedence over "one".
 *
 * The example also shows the "offset" keyword, which allows you to offset the value of the "#" variable.
 *
 * <example name="ngMessageFormat-example-plural" module="msgFmtExample" deps="angular-message-format.js">
 * <file name="index.html">
 *   <div ng-controller="AppController">
 *    <button ng-click="recipients.pop()" id="decreaseRecipients">decreaseRecipients</button><br>
 *    Select recipients:<br>
 *    <select multiple size=5 ng-model="recipients" ng-options="person as person.name for person in people">
 *    </select><br>
 *     <p>{{recipients.length, plural, offset:1
 *             =0    {{{sender.name}} gave no gifts (\#=#)}
 *             =1    {{{sender.name}} gave a gift to {{recipients[0].name}} (\#=#)}
 *             one   {{{sender.name}} gave {{recipients[0].name}} and one other person a gift (\#=#)}
 *             other {{{sender.name}} gave {{recipients[0].name}} and # other people a gift (\#=#)}
 *           }}</p>
 *   </div>
 * </file>
 *
 * <file name="script.js">
 *   function Person(name, gender) {
 *     this.name = name;
 *     this.gender = gender;
 *   }
 *
 *   var alice   = new Person('Alice', 'female'),
 *       bob     = new Person('Bob', 'male'),
 *       sarah     = new Person('Sarah', 'female'),
 *       harry   = new Person('Harry Potter', 'male'),
 *       ashley   = new Person('Ashley', '');
 *
 *   angular.module('msgFmtExample', ['ngMessageFormat'])
 *     .controller('AppController', ['$scope', function($scope) {
 *         $scope.people = [alice, bob, sarah, ashley];
 *         $scope.recipients = [alice, bob, sarah];
 *         $scope.sender = harry;
 *       }]);
 * </file>
 *
 * <file name="protractor.js" type="protractor">
 *   describe('MessageFormat plural', function() {
 *
 *     it('should pluralize initial values', function() {
 *       var messageElem = element(by.binding('recipients.length')),
 *           decreaseRecipientsBtn = element(by.id('decreaseRecipients'));
 *
 *       expect(messageElem.getText()).toEqual('Harry Potter gave Alice and 2 other people a gift (#=2)');
 *       decreaseRecipientsBtn.click();
 *       expect(messageElem.getText()).toEqual('Harry Potter gave Alice and one other person a gift (#=1)');
 *       decreaseRecipientsBtn.click();
 *       expect(messageElem.getText()).toEqual('Harry Potter gave a gift to Alice (#=0)');
 *       decreaseRecipientsBtn.click();
 *       expect(messageElem.getText()).toEqual('Harry Potter gave no gifts (#=-1)');
 *     });
 *   });
 * </file>
 * </example>
 *
 * ### Plural and Gender together
 *
 * This example shows how you can specify gender rules for specific plural matches - in this case,
 * =1 is special cased for gender.
 * <example name="ngMessageFormat-example-plural-gender" module="msgFmtExample" deps="angular-message-format.js">
 *   <file name="index.html">
 *     <div ng-controller="AppController">
       Select recipients:<br>
       <select multiple size=5 ng-model="recipients" ng-options="person as person.name for person in people">
       </select><br>
        <p>{{recipients.length, plural,
          =0 {{{sender.name}} has not given any gifts to anyone.}
          =1 {  {{recipients[0].gender, select,
                 female { {{sender.name}} gave {{recipients[0].name}} her gift.}
                 male { {{sender.name}} gave {{recipients[0].name}} his gift.}
                 other { {{sender.name}} gave {{recipients[0].name}} their gift.}
                }}
              }
          other {{{sender.name}} gave {{recipients.length}} people gifts.}
          }}</p>
      </file>
 *    <file name="script.js">
 *      function Person(name, gender) {
 *        this.name = name;
 *        this.gender = gender;
 *      }
 *
 *      var alice   = new Person('Alice', 'female'),
 *          bob     = new Person('Bob', 'male'),
 *          harry   = new Person('Harry Potter', 'male'),
 *          ashley   = new Person('Ashley', '');
 *
 *      angular.module('msgFmtExample', ['ngMessageFormat'])
 *        .controller('AppController', ['$scope', function($scope) {
 *            $scope.people = [alice, bob, ashley];
 *            $scope.recipients = [alice];
 *            $scope.sender = harry;
 *          }]);
 *    </file>
    </example>
 */

var $$MessageFormatFactory = ['$parse', '$locale', '$sce', '$exceptionHandler', function $$messageFormat(
                               $parse,   $locale,   $sce,   $exceptionHandler) {

  function getStringifier(trustedContext, allOrNothing, text) {
    return function stringifier(value) {
      try {
        value = trustedContext ? $sce['getTrusted'](trustedContext, value) : $sce['valueOf'](value);
        return allOrNothing && (value === undefined) ? value : $$stringify(value);
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
  if ($interpolate['startSymbol']() !== '{{' || $interpolate['endSymbol']() !== '}}') {
    throw $interpolateMinErr('nochgmustache', 'angular-message-format.js currently does not allow you to use custom start and end symbols for interpolation.');
  }
  var interpolate = $$messageFormat['interpolate'];
  interpolate['startSymbol'] = $interpolate['startSymbol'];
  interpolate['endSymbol'] = $interpolate['endSymbol'];
  return interpolate;
}];

var $interpolateMinErr;
var isFunction;
var noop;
var toJson;
var $$stringify;

var module = window['angular']['module']('ngMessageFormat', ['ng']);
module['factory']('$$messageFormat', $$MessageFormatFactory);
module['config'](['$provide', function($provide) {
  $interpolateMinErr = window['angular']['$interpolateMinErr'];
  isFunction = window['angular']['isFunction'];
  noop = window['angular']['noop'];
  toJson = window['angular']['toJson'];
  $$stringify = window['angular']['$$stringify'];

  $provide['decorator']('$interpolate', $$interpolateDecorator);
}]);
