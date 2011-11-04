'use strict';

$FilterProvider.$inject = ['$provide'];
function $FilterProvider($provide) {
  var suffix = '$Filter';

  $provide.filter = function(name, factory) {
    return $provide.factory(name + suffix, factory);
  };

  this.$get = ['$injector', function($injector) {
    return function(name) {
      return $injector(name + suffix);
    }
  }];

  ////////////////////////////////////////

  $provide.filter('currency', currencyFilter);
  $provide.filter('date', dateFilter);
  $provide.filter('filter', filterFilter);
  $provide.filter('html', htmlFilter);
  $provide.filter('json', jsonFilter);
  $provide.filter('limitTo', limitToFilter);
  $provide.filter('linky', linkyFilter);
  $provide.filter('lowercase', lowercaseFilter);
  $provide.filter('number', numberFilter);
  $provide.filter('orderBy', orderByFilter);
  $provide.filter('uppercase', uppercaseFilter);
}
