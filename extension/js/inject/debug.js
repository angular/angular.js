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
                watchers: {},
                timeline: [],
                watchExp: {},
                watchList: {}
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
                      var str = watchFnToHumanReadableString(arguments[0]);

                      debug.watchers[this.$id].push(str);
                      
                      
                      var w = arguments[0];
                      if (typeof w === 'function') {
                        arguments[0] = function () {
                          var start = window.performance.webkitNow();
                          var ret = w.apply(this, arguments);
                          var end = window.performance.webkitNow();
                          if (!debug.watchExp[str]) {
                            debug.watchExp[str] = {
                              time: 0,
                              calls: 0
                            };
                          }
                          debug.watchExp[str].time += (end - start);
                          debug.watchExp[str].calls += 1;
                          return ret;
                        };
                      } else {
                        var thatScope = this;
                        arguments[0] = function () {
                          var start = window.performance.webkitNow();
                          var ret = thatScope.$eval(w);
                          var end = window.performance.webkitNow();
                          if (!debug.watchExp[str]) {
                            debug.watchExp[str] = {
                              time: 0,
                              calls: 0
                            };
                          }
                          debug.watchExp[str].time += (end - start);
                          debug.watchExp[str].calls += 1;
                          return ret;
                        };
                      }

                      var fn = arguments[1];
                      arguments[1] = function () {
                        var start = window.performance.webkitNow();
                        var ret = fn.apply(this, arguments);
                        var end = window.performance.webkitNow();
                        var str = fn.toString();
                        if (typeof debug.watchList[str] !== 'number') {
                          debug.watchList[str] = 0;
                          //debug.watchList[str].total = 0;
                        }
                        debug.watchList[str] += (end - start);
                        //debug.watchList[str].total += (end - start);
                        return ret;
                      };

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
                    var firstLog = 0;
                    // patch apply
                    var apply = $delegate.__proto__.$apply;
                    $delegate.__proto__.$apply = function (fn) {
                      var start = window.performance.webkitNow();
                      var ret = apply.apply(this, arguments);
                      var end = window.performance.webkitNow();
                      if (window.__ngDebug.timeline.length === 0) {
                        firstLog = start;
                      }
                      window.__ngDebug.timeline.push({
                        start: Math.round(start - firstLog),
                        end: Math.round(end - firstLog)
                      });
                      if (window.__ngDebug.log) {
                        if (fn) {
                          fn = 'fn () { ' + fn.toString().split('\n')[1].trim() + ' /* ... */ }';
                        } else {
                          fn = '$apply';
                        }
                        console.log(fn + '\t\t' + (end - start).toPrecision(4) + 'ms');
                      }

                      return ret;
                    };

                    return $delegate;
                  });

              });

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
