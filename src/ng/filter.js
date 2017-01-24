'use strict';

/* global currencyFilter: true,
 dateFilter: true,
 filterFilter: true,
 jsonFilter: true,
 limitToFilter: true,
 lowercaseFilter: true,
 numberFilter: true,
 orderByFilter: true,
 uppercaseFilter: true,
 */

/**
 * @ngdoc provider
 * @name $filterProvider
 * @description
 *
 * Filters are just functions which transform input to an output. However filters need to be
 * Dependency Injected. To achieve this a filter definition consists of a factory function which is
 * annotated with dependencies and is responsible for creating a filter function.
 *
 * <div class="alert alert-warning">
 * **Note:** Filter names must be valid AngularJS {@link expression} identifiers, such as `uppercase` or `orderBy`.
 * Names with special characters, such as hyphens and dots, are not allowed. If you wish to namespace
 * your filters, then you can use capitalization (`myappSubsectionFilterx`) or underscores
 * (`myapp_subsection_filterx`).
 * </div>
 *
 * ```js
 *   // Filter registration
 *   function MyModule($provide, $filterProvider) {
 *     // create a service to demonstrate injection (not always needed)
 *     $provide.value('greet', function(name){
 *       return 'Hello ' + name + '!';
 *     });
 *
 *     // register a filter factory which uses the
 *     // greet service to demonstrate DI.
 *     $filterProvider.register('greet', function(greet){
 *       // return the filter function which uses the greet service
 *       // to generate salutation
 *       return function(text) {
 *         // filters need to be forgiving so check input validity
 *         return text && greet(text) || text;
 *       };
 *     });
 *   }
 * ```
 *
 * The filter function is registered with the `$injector` under the filter name suffix with
 * `Filter`.
 *
 * ```js
 *   it('should be the same instance', inject(
 *     function($filterProvider) {
 *       $filterProvider.register('reverse', function(){
 *         return ...;
 *       });
 *     },
 *     function($filter, reverseFilter) {
 *       expect($filter('reverse')).toBe(reverseFilter);
 *     });
 * ```
 *
 *
 * For more information about how AngularJS filters work, and how to create your own filters, see
 * {@link guide/filter Filters} in the AngularJS Developer Guide.
 */

/**
 * @ngdoc service
 * @name $filter
 * @kind function
 * @description
 * Filters are used for formatting data displayed to the user.
 *
 * They can be used in view templates, controllers or services. AngularJS comes
 * with a collection of [built-in filters](api/ng/filter), but it is easy to
 * define your own as well.
 *
 * The general syntax in templates is as follows:
 *
 * ```html
 * {{ expression [| filter_name[:parameter_value] ... ] }}
 * ```
 *
 * @param {String} name Name of the filter function to retrieve
 * @return {Function} the filter function
 * @example
   <example name="$filter" module="filterExample">
     <file name="index.html">
       <div ng-controller="MainCtrl">
        <h3>{{ originalText }}</h3>
        <h3>{{ filteredText }}</h3>
       </div>
     </file>

     <file name="script.js">
      angular.module('filterExample', [])
      .controller('MainCtrl', function($scope, $filter) {
        $scope.originalText = 'hello';
        $scope.filteredText = $filter('uppercase')($scope.originalText);
      });
     </file>
   </example>
  */
$FilterProvider.$inject = ['$provide'];
/** @this */
function $FilterProvider($provide) {
  var suffix = 'Filter';

  /**
   * @ngdoc method
   * @name $filterProvider#register
   * @param {string|Object} name Name of the filter function, or an object map of filters where
   *    the keys are the filter names and the values are the filter factories.
   *
   *    <div class="alert alert-warning">
   *    **Note:** Filter names must be valid AngularJS {@link expression} identifiers, such as `uppercase` or `orderBy`.
   *    Names with special characters, such as hyphens and dots, are not allowed. If you wish to namespace
   *    your filters, then you can use capitalization (`myappSubsectionFilterx`) or underscores
   *    (`myapp_subsection_filterx`).
   *    </div>
    * @param {Function} factory If the first argument was a string, a factory function for the filter to be registered.
   * @returns {Object} Registered filter instance, or if a map of filters was provided then a map
   *    of the registered filter instances.
   */
  function register(name, factory) {
    if (isObject(name)) {
      var filters = {};
      forEach(name, function(filter, key) {
        filters[key] = register(key, filter);
      });
      return filters;
    } else {
      return $provide.factory(name + suffix, factory);
    }
  }
  this.register = register;

  this.$get = ['$injector', function($injector) {
    return function(name) {
      return $injector.get(name + suffix);
    };
  }];

  ////////////////////////////////////////

  /* global
    currencyFilter: false,
    dateFilter: false,
    filterFilter: false,
    jsonFilter: false,
    limitToFilter: false,
    lowercaseFilter: false,
    numberFilter: false,
    orderByFilter: false,
    uppercaseFilter: false
  */

  register('currency', currencyFilter);
  register('date', dateFilter);
  register('filter', filterFilter);
  register('json', jsonFilter);
  register('limitTo', limitToFilter);
  register('lowercase', lowercaseFilter);
  register('number', numberFilter);
  register('orderBy', orderByFilter);
  register('uppercase', uppercaseFilter);
}
