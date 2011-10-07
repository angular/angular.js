'use strict';

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$route
 * @requires $location
 * @requires $routeParams
 *
 * @property {Object} current Reference to the current route definition.
 * @property {Array.<Object>} routes Array of all configured routes.
 *
 * @description
 * Watches `$location.url()` and tries to map the path to an existing route
 * definition. It is used for deep-linking URLs to controllers and views (HTML partials).
 *
 * The `$route` service is typically used in conjunction with {@link angular.widget.ng:view ng:view}
 * widget and the {@link angular.service.$routeParams $routeParams} service.
 *
 * @example
   This example shows how changing the URL hash causes the <tt>$route</tt>
   to match a route against the URL, and the <tt>[[ng:include]]</tt> pulls in the partial.

    <doc:example>
      <doc:source jsfiddle="false">
        <script>
          function MainCntl($route, $routeParams, $location) {
            this.$route = $route;
            this.$location = $location;
            this.$routeParams = $routeParams;

            $route.when('/Book/:bookId', {template: 'examples/book.html', controller: BookCntl});
            $route.when('/Book/:bookId/ch/:chapterId', {template: 'examples/chapter.html', controller: ChapterCntl});
          }

          function BookCntl($routeParams) {
            this.name = "BookCntl";
            this.params = $routeParams;
          }

          function ChapterCntl($routeParams) {
            this.name = "ChapterCntl";
            this.params = $routeParams;
          }
        </script>

        <div ng:controller="MainCntl">
          Choose:
          <a href="#/Book/Moby">Moby</a> |
          <a href="#/Book/Moby/ch/1">Moby: Ch1</a> |
          <a href="#/Book/Gatsby">Gatsby</a> |
          <a href="#/Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a><br/>
          <pre>$location.path() = {{$location.path()}}</pre>
          <pre>$route.current.template = {{$route.current.template}}</pre>
          <pre>$route.current.params = {{$route.current.params}}</pre>
          <pre>$route.current.scope.name = {{$route.current.scope.name}}</pre>
          <pre>$routeParams = {{$routeParams}}</pre>
          <hr />
          <ng:view></ng:view>
        </div>
      </doc:source>
      <doc:scenario>
      </doc:scenario>
    </doc:example>
 */
angularServiceInject('$route', function($location, $routeParams) {
  /**
   * @workInProgress
   * @ngdoc event
   * @name angular.service.$route#$beforeRouteChange
   * @eventOf angular.service.$route
   * @eventType broadcast on root scope
   * @description
   * Broadcasted before a route change.
   *
   * @param {Route} next Future route information.
   * @param {Route} current Current route information.
   *
   * The `Route` object extends the route definition with the following properties.
   *
   *    * `scope` - The instance of the route controller.
   *    * `params` - The current {@link angular.service.$routeParams params}.
   *
   */

  /**
   * @workInProgress
   * @ngdoc event
   * @name angular.service.$route#$afterRouteChange
   * @eventOf angular.service.$route
   * @eventType broadcast on root scope
   * @description
   * Broadcasted after a route change.
   *
   * @param {Route} current Current route information.
   * @param {Route} previous Previous route information.
   *
   * The `Route` object extends the route definition with the following properties.
   *
   *    * `scope` - The instance of the route controller.
   *    * `params` - The current {@link angular.service.$routeParams params}.
   *
   */

  /**
   * @workInProgress
   * @ngdoc event
   * @name angular.service.$route#$routeUpdate
   * @eventOf angular.service.$route
   * @eventType emit on the current route scope
   * @description
   *
   * The `reloadOnSearch` property has been set to false, and we are reusing the same
   * instance of the Controller.
   */

  var routes = {},
      matcher = switchRouteMatcher,
      parentScope = this,
      rootScope = this,
      dirty = 0,
      forceReload = false,
      $route = {
        routes: routes,

        /**
         * @workInProgress
         * @ngdoc method
         * @name angular.service.$route#parent
         * @methodOf angular.service.$route
         *
         * @param {Scope} [scope=rootScope] Scope to be used as parent for newly created
         *    `$route.current.scope` scopes.
         *
         * @description
         * Sets a scope to be used as the parent scope for scopes created on route change. If not
         * set, defaults to the root scope.
         */
        parent: function(scope) {
          if (scope) parentScope = scope;
        },

        /**
         * @workInProgress
         * @ngdoc method
         * @name angular.service.$route#when
         * @methodOf angular.service.$route
         *
         * @param {string} path Route path (matched against `$location.hash`)
         * @param {Object} route Mapping information to be assigned to `$route.current` on route
         *    match.
         *
         *    Object properties:
         *
         *    - `controller` – `{function()=}` – Controller fn that should be associated with newly
         *      created scope.
         *    - `template` – `{string=}` – path to an html template that should be used by
         *      {@link angular.widget.ng:view ng:view} or
         *      {@link angular.widget.ng:include ng:include} widgets.
         *    - `redirectTo` – {(string|function())=} – value to update
         *      {@link angular.service.$location $location} path with and trigger route redirection.
         *
         *      If `redirectTo` is a function, it will be called with the following parameters:
         *
         *      - `{Object.<string>}` - route parameters extracted from the current
         *        `$location.path()` by applying the current route template.
         *      - `{string}` - current `$location.path()`
         *      - `{Object}` - current `$location.search()`
         *
         *      The custom `redirectTo` function is expected to return a string which will be used
         *      to update `$location.path()` and `$location.search()`.
         *
         *    - `[reloadOnSearch=true]` - {boolean=} - reload route when only $location.search()
         *    changes.
         *
         *      If the option is set to false and url in the browser changes, then
         *      $routeUpdate event is emited on the current route scope. You can use this event to
         *      react to {@link angular.service.$routeParams} changes:
         *
         *            function MyCtrl($route, $routeParams) {
         *              this.$on('$routeUpdate', function() {
         *                // do stuff with $routeParams
         *              });
         *            }
         *
         * @returns {Object} route object
         *
         * @description
         * Adds a new route definition to the `$route` service.
         */
        when: function(path, route) {
          var routeDef = routes[path];
          if (!routeDef) routeDef = routes[path] = {reloadOnSearch: true};
          if (route) extend(routeDef, route); // TODO(im): what the heck? merge two route definitions?
          dirty++;
          return routeDef;
        },

        /**
         * @workInProgress
         * @ngdoc method
         * @name angular.service.$route#otherwise
         * @methodOf angular.service.$route
         *
         * @description
         * Sets route definition that will be used on route change when no other route definition
         * is matched.
         *
         * @param {Object} params Mapping information to be assigned to `$route.current`.
         */
        otherwise: function(params) {
          $route.when(null, params);
        },

        /**
         * @workInProgress
         * @ngdoc method
         * @name angular.service.$route#reload
         * @methodOf angular.service.$route
         *
         * @description
         * Causes `$route` service to reload (and recreate the `$route.current` scope) upon the next
         * eval even if {@link angular.service.$location $location} hasn't changed.
         */
        reload: function() {
          dirty++;
          forceReload = true;
        }
      };

  this.$watch(function() { return dirty + $location.url(); }, updateRoute);

  return $route;

  /////////////////////////////////////////////////////

  function switchRouteMatcher(on, when) {
    // TODO(i): this code is convoluted and inefficient, we should construct the route matching
    //   regex only once and then reuse it
    var regex = '^' + when.replace(/([\.\\\(\)\^\$])/g, "\\$1") + '$',
        params = [],
        dst = {};
    forEach(when.split(/\W/), function(param) {
      if (param) {
        var paramRegExp = new RegExp(":" + param + "([\\W])");
        if (regex.match(paramRegExp)) {
          regex = regex.replace(paramRegExp, "([^\\/]*)$1");
          params.push(param);
        }
      }
    });
    var match = on.match(new RegExp(regex));
    if (match) {
      forEach(params, function(name, index) {
        dst[name] = match[index + 1];
      });
    }
    return match ? dst : null;
  }

  function updateRoute() {
    var next = parseRoute(),
        last = $route.current,
        Controller;

    if (next && last && next.$route === last.$route
        && equals(next.pathParams, last.pathParams) && !next.reloadOnSearch && !forceReload) {
      $route.current = next;
      copy(next.params, $routeParams);
      last.scope && last.scope.$emit('$routeUpdate');
    } else {
      forceReload = false;
      rootScope.$broadcast('$beforeRouteChange', next, last);
      last && last.scope && last.scope.$destroy();
      $route.current = next;
      if (next) {
        if (next.redirectTo) {
          if (isString(next.redirectTo)) {
            $location.path(interpolate(next.redirectTo, next.params)).search(next.params)
                     .replace();
          } else {
            $location.url(next.redirectTo(next.pathParams, $location.path(), $location.search()))
                     .replace();
          }
        } else {
          copy(next.params, $routeParams);
          (Controller = next.controller) && inferInjectionArgs(Controller);
          next.scope = parentScope.$new(Controller);
        }
      }
      rootScope.$broadcast('$afterRouteChange', next, last);
    }
  }


  /**
   * @returns the current active route, by matching it against the URL
   */
  function parseRoute() {
    // Match a route
    var params, match;
    forEach(routes, function(route, path) {
      if (!match && (params = matcher($location.path(), path))) {
        match = inherit(route, {
          params: extend({}, $location.search(), params),
          pathParams: params});
        match.$route = route;
      }
    });
    // No route matched; fallback to "otherwise" route
    return match || routes[null] && inherit(routes[null], {params: {}, pathParams:{}});
  }

  /**
   * @returns interpolation of the redirect path with the parametrs
   */
  function interpolate(string, params) {
    var result = [];
    forEach((string||'').split(':'), function(segment, i) {
      if (i == 0) {
        result.push(segment);
      } else {
        var segmentMatch = segment.match(/(\w+)(.*)/);
        var key = segmentMatch[1];
        result.push(params[key]);
        result.push(segmentMatch[2] || '');
        delete params[key];
      }
    });
    return result.join('');
  }


}, ['$location', '$routeParams']);
