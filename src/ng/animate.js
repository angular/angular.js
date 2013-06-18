'use strict';

var $AnimateProvider = function() {
  this.register = noop;
  this.$get = function() {
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
        (done || noop)();
      },
      leave : function(element, done) {
        element.remove();
        (done || noop)();
      },
      move : function(element, parent, after, done) {
        // Do not remove element before insert. Removing will cause data associated with the
        // element to be dropped. Insert will implicitly do the remove.
        this.enter(element, parent, after, done);
      },
      show : function(element, done) {
        element.removeClass('ng-hide');
        (done || noop)();
      },
      hide : function(element, done) {
        element.addClass('ng-hide');
        (done || noop)();
      },
      addClass : function(element, className, done) {
        className = isString(className) ?
                      className :
                      isArray(className) ? className.join(' ') : '';
        element.addClass(className);
        (done || noop)();
      },
      removeClass : function(element, className, done) {
        className = isString(className) ?
                      className :
                      isArray(className) ? className.join(' ') : '';
        element.removeClass(className);
        (done || noop)();
      },
      lookup : noop,
      enabled : noop
    };
  };
};
