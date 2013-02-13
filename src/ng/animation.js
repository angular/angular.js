'use strict';

$AnimationProvider.$inject = ['$provide'];
function $AnimationProvider($provide) {
  var suffix = 'Animation';
  var register = function(name, factory) {
    $provide.factory(camelCase(name) + suffix, factory);
  };

  this.register = register;

  this.$get = function($injector) {
    return function animationGetter(name) {
      return $injector.get(camelCase(name) + suffix);
    }
  };

  register('noopEnter', function() {
    return function(node, parent, after) {
      after ? after.after(node) : parent.append(node);
    };
  });

  register('noopLeave', function() {
    return function(node, parent, after) {
      node.remove();
    };
  });

  register('noopMove', function() {
    return function(node, parent, after) {
      after ? after.after(node) : parent.append(node);
    };
  });
};
