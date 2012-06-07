
var inject = function () {
  if (document.head) {

    document.head.insertBefore(
      (function () {
        var fn = function (window) {
          //alert('script');
          var patch = function () {
            if (window.angular && typeof window.angular.bootstrap === 'function') {
                if (window.__ngDebug) {
                return;
              }
              var bootstrap = window.angular.bootstrap;
              var debug = window.__ngDebug = {
                watchers: {}
              };
              var ng = angular.module('ng');
              ng.config(function ($provide) {
                $provide.decorator('$rootScope',
                  function ($delegate) {
                    var watch = $delegate.__proto__.$watch;
                    $delegate.$watch = function() {
                      if (!debug.watchers[$delegate.$id]) {
                        debug.watchers[$delegate.$id] = [];
                      }
                      debug.watchers[$delegate.$id].push(arguments[0].toString());
                      watch.apply($delegate, arguments);
                    };

                    return $delegate;
                  });
              });

              /*
              window.angular.bootstrap = function (arg1, arg2, arg3) {
                bootstrap(arg1, arg2, arg3);
              };
              */
              console.log('patched');
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
