'use strict';

/**
 * @ngdoc directive
 * @name ngPluralize
 * @restrict EA
 *
 * @description
 * `ngPluralize` is a directive that displays messages according to en-US localization rules.
 * These rules are bundled with angular.js, but can be overridden
 * (see {@link guide/i18n AngularJS i18n} dev guide). You configure ngPluralize directive
 * by specifying the mappings between
 * [plural categories](http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html)
 * and the strings to be displayed.
 *
 * # Plural categories and explicit number rules
 * There are two
 * [plural categories](http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html)
 * in AngularJS's default en-US locale: "one" and "other".
 *
 * While a plural category may match many numbers (for example, in en-US locale, "other" can match
 * any number that is not 1), an explicit number rule can only match one number. For example, the
 * explicit number rule for "3" matches the number 3. There are examples of plural categories
 * and explicit number rules throughout the rest of this documentation.
 *
 * # Configuring ngPluralize
 * You configure ngPluralize by providing 2 attributes: `count` and `when`.
 * You can also provide an optional attribute, `offset`.
 *
 * The value of the `count` attribute can be either a string or an {@link guide/expression
 * AngularJS expression}; these are evaluated on the current scope for its bound value.
 *
 * The `when` attribute specifies the mappings between plural categories and the actual
 * string to be displayed. The value of the attribute should be a JSON object.
 *
 * The following example shows how to configure ngPluralize:
 *
 * ```html
 * <ng-pluralize count="personCount"
                 when="{'0': 'Nobody is viewing.',
 *                      'one': '1 person is viewing.',
 *                      'other': '{} people are viewing.'}">
 * </ng-pluralize>
 *```
 *
 * In the example, `"0: Nobody is viewing."` is an explicit number rule. If you did not
 * specify this rule, 0 would be matched to the "other" category and "0 people are viewing"
 * would be shown instead of "Nobody is viewing". You can specify an explicit number rule for
 * other numbers, for example 12, so that instead of showing "12 people are viewing", you can
 * show "a dozen people are viewing".
 *
 * You can use a set of closed braces (`{}`) as a placeholder for the number that you want substituted
 * into pluralized strings. In the previous example, AngularJS will replace `{}` with
 * <span ng-non-bindable>`{{personCount}}`</span>. The closed braces `{}` is a placeholder
 * for <span ng-non-bindable>{{numberExpression}}</span>.
 *
 * If no rule is defined for a category, then an empty string is displayed and a warning is generated.
 * Note that some locales define more categories than `one` and `other`. For example, fr-fr defines `few` and `many`.
 *
 * # Configuring ngPluralize with offset
 * The `offset` attribute allows further customization of pluralized text, which can result in
 * a better user experience. For example, instead of the message "4 people are viewing this document",
 * you might display "John, Kate and 2 others are viewing this document".
 * The offset attribute allows you to offset a number by any desired value.
 * Let's take a look at an example:
 *
 * ```html
 * <ng-pluralize count="personCount" offset=2
 *               when="{'0': 'Nobody is viewing.',
 *                      '1': '{{person1}} is viewing.',
 *                      '2': '{{person1}} and {{person2}} are viewing.',
 *                      'one': '{{person1}}, {{person2}} and one other person are viewing.',
 *                      'other': '{{person1}}, {{person2}} and {} other people are viewing.'}">
 * </ng-pluralize>
 * ```
 *
 * Notice that we are still using two plural categories(one, other), but we added
 * three explicit number rules 0, 1 and 2.
 * When one person, perhaps John, views the document, "John is viewing" will be shown.
 * When three people view the document, no explicit number rule is found, so
 * an offset of 2 is taken off 3, and AngularJS uses 1 to decide the plural category.
 * In this case, plural category 'one' is matched and "John, Mary and one other person are viewing"
 * is shown.
 *
 * Note that when you specify offsets, you must provide explicit number rules for
 * numbers from 0 up to and including the offset. If you use an offset of 3, for example,
 * you must provide explicit number rules for 0, 1, 2 and 3. You must also provide plural strings for
 * plural categories "one" and "other".
 *
 * @param {string|expression} count The variable to be bound to.
 * @param {string} when The mapping between plural category to its corresponding strings.
 * @param {number=} offset Offset to deduct from the total number.
 *
 * @example
    <example module="pluralizeExample" name="ng-pluralize">
      <file name="index.html">
        <script>
          angular.module('pluralizeExample', [])
            .controller('ExampleController', ['$scope', function($scope) {
              $scope.person1 = 'Igor';
              $scope.person2 = 'Misko';
              $scope.personCount = 1;
            }]);
        </script>
        <div ng-controller="ExampleController">
          <label>Person 1:<input type="text" ng-model="person1" value="Igor" /></label><br/>
          <label>Person 2:<input type="text" ng-model="person2" value="Misko" /></label><br/>
          <label>Number of People:<input type="text" ng-model="personCount" value="1" /></label><br/>

          <!--- Example with simple pluralization rules for en locale --->
          Without Offset:
          <ng-pluralize count="personCount"
                        when="{'0': 'Nobody is viewing.',
                               'one': '1 person is viewing.',
                               'other': '{} people are viewing.'}">
          </ng-pluralize><br>

          <!--- Example with offset --->
          With Offset(2):
          <ng-pluralize count="personCount" offset=2
                        when="{'0': 'Nobody is viewing.',
                               '1': '{{person1}} is viewing.',
                               '2': '{{person1}} and {{person2}} are viewing.',
                               'one': '{{person1}}, {{person2}} and one other person are viewing.',
                               'other': '{{person1}}, {{person2}} and {} other people are viewing.'}">
          </ng-pluralize>
        </div>
      </file>
      <file name="protractor.js" type="protractor">
        it('should show correct pluralized string', function() {
          var withoutOffset = element.all(by.css('ng-pluralize')).get(0);
          var withOffset = element.all(by.css('ng-pluralize')).get(1);
          var countInput = element(by.model('personCount'));

          expect(withoutOffset.getText()).toEqual('1 person is viewing.');
          expect(withOffset.getText()).toEqual('Igor is viewing.');

          countInput.clear();
          countInput.sendKeys('0');

          expect(withoutOffset.getText()).toEqual('Nobody is viewing.');
          expect(withOffset.getText()).toEqual('Nobody is viewing.');

          countInput.clear();
          countInput.sendKeys('2');

          expect(withoutOffset.getText()).toEqual('2 people are viewing.');
          expect(withOffset.getText()).toEqual('Igor and Misko are viewing.');

          countInput.clear();
          countInput.sendKeys('3');

          expect(withoutOffset.getText()).toEqual('3 people are viewing.');
          expect(withOffset.getText()).toEqual('Igor, Misko and one other person are viewing.');

          countInput.clear();
          countInput.sendKeys('4');

          expect(withoutOffset.getText()).toEqual('4 people are viewing.');
          expect(withOffset.getText()).toEqual('Igor, Misko and 2 other people are viewing.');
        });
        it('should show data-bound names', function() {
          var withOffset = element.all(by.css('ng-pluralize')).get(1);
          var personCount = element(by.model('personCount'));
          var person1 = element(by.model('person1'));
          var person2 = element(by.model('person2'));
          personCount.clear();
          personCount.sendKeys('4');
          person1.clear();
          person1.sendKeys('Di');
          person2.clear();
          person2.sendKeys('Vojta');
          expect(withOffset.getText()).toEqual('Di, Vojta and 2 other people are viewing.');
        });
      </file>
    </example>
 */
var ngPluralizeDirective = ['$locale', '$interpolate', '$log', function($locale, $interpolate, $log) {
  var BRACE = /{}/g,
      IS_WHEN = /^when(Minus)?(.+)$/;

  return {
    link: function(scope, element, attr) {
      var numberExp = attr.count,
          whenExp = attr.$attr.when && element.attr(attr.$attr.when), // we have {{}} in attrs
          offset = attr.offset || 0,
          whens = scope.$eval(whenExp) || {},
          whensExpFns = {},
          startSymbol = $interpolate.startSymbol(),
          endSymbol = $interpolate.endSymbol(),
          braceReplacement = startSymbol + numberExp + '-' + offset + endSymbol,
          watchRemover = angular.noop,
          lastCount;

      forEach(attr, function(expression, attributeName) {
        var tmpMatch = IS_WHEN.exec(attributeName);
        if (tmpMatch) {
          var whenKey = (tmpMatch[1] ? '-' : '') + lowercase(tmpMatch[2]);
          whens[whenKey] = element.attr(attr.$attr[attributeName]);
        }
      });
      forEach(whens, function(expression, key) {
        whensExpFns[key] = $interpolate(expression.replace(BRACE, braceReplacement));

      });

      scope.$watch(numberExp, function ngPluralizeWatchAction(newVal) {
        var count = parseFloat(newVal);
        var countIsNaN = isNumberNaN(count);

        if (!countIsNaN && !(count in whens)) {
          // If an explicit number rule such as 1, 2, 3... is defined, just use it.
          // Otherwise, check it against pluralization rules in $locale service.
          count = $locale.pluralCat(count - offset);
        }

        // If both `count` and `lastCount` are NaN, we don't need to re-register a watch.
        // In JS `NaN !== NaN`, so we have to explicitly check.
        if ((count !== lastCount) && !(countIsNaN && isNumberNaN(lastCount))) {
          watchRemover();
          var whenExpFn = whensExpFns[count];
          if (isUndefined(whenExpFn)) {
            if (newVal != null) {
              $log.debug('ngPluralize: no rule defined for \'' + count + '\' in ' + whenExp);
            }
            watchRemover = noop;
            updateElementText();
          } else {
            watchRemover = scope.$watch(whenExpFn, updateElementText);
          }
          lastCount = count;
        }
      });

      function updateElementText(newText) {
        element.text(newText || '');
      }
    }
  };
}];
