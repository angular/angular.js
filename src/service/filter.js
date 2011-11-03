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
  $provide.filter('number', numberFilter);
  $provide.filter('date', dateFilter);
  $provide.filter('json', jsonFilter);
  $provide.filter('lowercase', lowercaseFilter);
  $provide.filter('uppercase', uppercaseFilter);
  $provide.filter('html', htmlFilter);
  $provide.filter('linky', linkyFilter);
}
