
var inject = function () {
  if (document.head) {

    document.head.insertBefore(
      (function () {
        var fn = function (window) {
          //alert('script');
          var patch = function () {
            if (window.angular && typeof window.angular.bootstrap === 'function') {

              // do not patch twice
              if (window.__ngDebug) {
                return;
              }
              //var bootstrap = window.angular.bootstrap;
              var debug = window.__ngDebug = {
                watchers: {}
              };
              var ng = angular.module('ng');
              ng.config(function ($provide) {


                $provide.decorator('$rootScope',
                  function ($delegate) {

                    var watchFnToHumanReadableString = function (fn) {
                      if (fn.exp) {
                        return fn.exp.trim();
                      } else if (fn.name) {
                        return fn.name.trim();
                      } else {
                        return fn.toString();
                      }
                    };

                    // patch registering watchers
                    var watch = $delegate.__proto__.$watch;
                    $delegate.__proto__.$watch = function() {
                      if (!debug.watchers[this.$id]) {
                        debug.watchers[this.$id] = [];
                      }
                      debug.watchers[this.$id].push(watchFnToHumanReadableString(arguments[0]));
                      return watch.apply(this, arguments);
                    };

                    // patch $destroy()
                    /*
                    var destroy = $delegate.__proto__.$destroy;
                    $delegate.__proto__.$destroy = function () {
                      if (debug.watchers[this.$id]) {
                        delete debug.watchers[this.$id];
                      }
                      return destroy.apply(this, arguments);
                    };
                    */

                    // patch apply
                    var apply = $delegate.__proto__.$apply;
                    $delegate.__proto__.$apply = function (fn) {
                      var start = window.performance.webkitNow();
                      var ret = apply.apply(this, arguments);
                      //console.log(arguments);
                      
                      //watchFnToHumanReadableString() + 
                      console.log('fn () { ' + fn.toString().split('\n')[1].trim() + ' /* ... */ }\t\t' + (window.performance.webkitNow() - start).toPrecision(4) + 'ms');
                      return ret;
                    };

                    return $delegate;
                  });

              });

              /*
              window.angular.bootstrap = function (arg1, arg2, arg3) {
                bootstrap(arg1, arg2, arg3);
              };
              */
              //console.log('patched');
            } else {
              setTimeout(patch, 1);
            }
          };

          patch();
        };

        var script = window.document.createElement('script');
        script.innerHTML = '(' + fn.toString() + '(window))';
        
        return script;
      }()),
      document.head.firstChild);

  } else {
    setTimeout(inject, 1);
  }
};

inject();
