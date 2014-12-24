'use strict';


/**
 * @ngdoc directive
 * @name ngList
 *
 * @description
 * Text input that converts between a delimited string and an array of strings. The default
 * delimiter is a comma followed by a space - equivalent to `ng-list=", "`. You can specify a custom
 * delimiter as the value of the `ngList` attribute - for example, `ng-list=" | "`.
 *
 * The behaviour of the directive is affected by the use of the `ngTrim` attribute.
 * * If `ngTrim` is set to `"false"` then whitespace around both the separator and each
 *   list item is respected. This implies that the user of the directive is responsible for
 *   dealing with whitespace but also allows you to use whitespace as a delimiter, such as a
 *   tab or newline character.
 * * Otherwise whitespace around the delimiter is ignored when splitting (although it is respected
 *   when joining the list items back together) and whitespace around each list item is stripped
 *   before it is added to the model.
 *
 * ### Example with Validation
 *
 * <example name="ngList-directive" module="listExample">
 *   <file name="app.js">
 *      angular.module('listExample', [])
 *        .controller('ExampleController', ['$scope', function($scope) {
 *          $scope.names = ['morpheus', 'neo', 'trinity'];
 *        }]);
 *   </file>
 *   <file name="index.html">
 *    <form name="myForm" ng-controller="ExampleController">
 *      List: <input name="namesInput" ng-model="names" ng-list required>
 *      <span class="error" ng-show="myForm.namesInput.$error.required">
 *        Required!</span>
 *      <br>
 *      <tt>names = {{names}}</tt><br/>
 *      <tt>myForm.namesInput.$valid = {{myForm.namesInput.$valid}}</tt><br/>
 *      <tt>myForm.namesInput.$error = {{myForm.namesInput.$error}}</tt><br/>
 *      <tt>myForm.$valid = {{myForm.$valid}}</tt><br/>
 *      <tt>myForm.$error.required = {{!!myForm.$error.required}}</tt><br/>
 *     </form>
 *   </file>
 *   <file name="protractor.js" type="protractor">
 *     var listInput = element(by.model('names'));
 *     var names = element(by.exactBinding('names'));
 *     var valid = element(by.binding('myForm.namesInput.$valid'));
 *     var error = element(by.css('span.error'));
 *
 *     it('should initialize to model', function() {
 *       expect(names.getText()).toContain('["morpheus","neo","trinity"]');
 *       expect(valid.getText()).toContain('true');
 *       expect(error.getCssValue('display')).toBe('none');
 *     });
 *
 *     it('should be invalid if empty', function() {
 *       listInput.clear();
 *       listInput.sendKeys('');
 *
 *       expect(names.getText()).toContain('');
 *       expect(valid.getText()).toContain('false');
 *       expect(error.getCssValue('display')).not.toBe('none');
 *     });
 *   </file>
 * </example>
 *
 * ### Example - splitting on whitespace
 * <example name="ngList-directive-newlines">
 *   <file name="index.html">
 *    <textarea ng-model="list" ng-list="&#10;" ng-trim="false"></textarea>
 *    <pre>{{ list | json }}</pre>
 *   </file>
 *   <file name="protractor.js" type="protractor">
 *     it("should split the text by newlines", function() {
 *       var listInput = element(by.model('list'));
 *       var output = element(by.binding('list | json'));
 *       listInput.sendKeys('abc\ndef\nghi');
 *       expect(output.getText()).toContain('[\n  "abc",\n  "def",\n  "ghi"\n]');
 *     });
 *   </file>
 * </example>
 *
 * @element input
 * @param {string=} ngList optional delimiter that should be used to split the value.
 */
var ngListDirective = function() {
  return {
    restrict: 'A',
    priority: 100,
    require: 'ngModel',
    link: function(scope, element, attr, ctrl) {
      // We want to control whitespace trimming so we use this convoluted approach
      // to access the ngList attribute, which doesn't pre-trim the attribute
      var ngList = element.attr(attr.$attr.ngList) || ', ';
      var trimValues = attr.ngTrim !== 'false';
      var separator = trimValues ? trim(ngList) : ngList;

      var parse = function(viewValue) {
        // If the viewValue is invalid (say required but empty) it will be `undefined`
        if (isUndefined(viewValue)) return;

        var list = [];

        if (viewValue) {
          forEach(viewValue.split(separator), function(value) {
            if (value) list.push(trimValues ? trim(value) : value);
          });
        }

        return list;
      };

      ctrl.$parsers.push(parse);
      ctrl.$formatters.push(function(value) {
        if (isArray(value)) {
          return value.join(ngList);
        }

        return undefined;
      });

      // Override the standard $isEmpty because an empty array means the input is empty.
      ctrl.$isEmpty = function(value) {
        return !value || !value.length;
      };
    }
  };
};
