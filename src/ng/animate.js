'use strict';

var $AnimateProvider = function() {
  this.register = noop;
  this.$get = ['$timeout', function($timeout) {
    return {
      enter : function(element, parent, after, done) {
        var afterNode = after && after[after.length - 1];
        var parentNode = parent && parent[0] || afterNode && afterNode.parentNode;
        var afterNextSibling = afterNode && afterNode.nextSibling;
        forEach(element, function(node) {
          if (afterNextSibling) {
            parentNode.insertBefore(node, afterNextSibling);
          } else {
            parentNode.appendChild(node);
          }
        });
        $timeout(done || noop, 0, false);
      },
      leave : function(element, done) {
        element.remove();
        $timeout(done || noop, 0, false);
      },
      move : function(element, parent, after, done) {
        // Do not remove element before insert. Removing will cause data associated with the
        // element to be dropped. Insert will implicitly do the remove.
        this.enter(element, parent, after, done);
      },
      show : function(element, done) {
        element.removeClass('ng-hide');
        $timeout(done || noop, 0, false);
      },
      hide : function(element, done) {
        element.addClass('ng-hide');
        $timeout(done || noop, 0, false);
      },
      addClass : function(element, className, done) {
        className = isString(className) ?
                      className :
                      isArray(className) ? className.join(' ') : '';
        element.addClass(className);
        $timeout(done || noop, 0, false);
      },
      removeClass : function(element, className, done) {
        className = isString(className) ?
                      className :
                      isArray(className) ? className.join(' ') : '';
        element.removeClass(className);
        $timeout(done || noop, 0, false);
      },
      lookup : noop,
      enabled : noop
    };
  }];
};
