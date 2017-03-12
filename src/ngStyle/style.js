'use strict';

var isArray = angular.isArray;
var isUndefined = angular.isUndefined;
var isString = angular.isString;
var forEach = angular.forEach;

var $styleMinErr = angular.$$minErr('ngStyle');

/**
 * @ngdoc module
 * @name ngStyle
 * @this
 *
 * @description
 *
 * # ngStyle
 *
 * The `ngStyle` module provides styles requset, styles caching and style management for
 * AngularJS apps. The module also provide new ability for components to add styles url or style text.
 *
 * ## Example
 * See {@link ngRoute.$route#example $route} for an example of configuring and using `ngRoute`.
 *
 *
 * <div doc-module-components="ngStyle"></div>
 */
var ngStyleModule = angular.module('ngStyle', []);

ngStyleModule.provider('$style', $StyleProvider);
ngStyleModule.provider('$styleRequest', $StyleRequestProvider);
ngStyleModule.provider('$styleCache', $StyleCacheProvider);
ngStyleModule.provider('$$styleComponent', $$StyleComponentProvider);

/**
 * @ngdoc provider
 * @name $StyleProvider
 * @this
 *
 * @description
 * Used to set or remove styles dynamicaly. the styles can be used via style urls or styles text
 *
 * ## Dependencies
 * Requires the {@link ngStyle `ngStyle`} module to be installed.
 */
function $StyleProvider() {

    this.$get = ['$exceptionHandler', '$styleRequest', '$q',
        function($exceptionHandler, $styleRequest, $q) {
            var activeRequests = {};

            return {
                /**
                 * @ngdoc method
                 * @name $StyleProvider#addStyleUrls
                 * @kind function
                 *
                 * @description
                 * Add the css styles, using path related to index.html, to the head.
                 *
                 * @param {string|Array} path one or more pathes strings to the css style.
                 *
                 * @returns {promise} A promise which will resolved once styles fetched
                 *  and added to the head. the promise return array of the style texts.
                 *
                 * ### Example
                 *   ```js
                 *
                 *     // using path
                 *     $style.addStyleUrls('./path/to/css/file.css').then(function(stylesArray){
                 *
                 *     });
                 *
                 *     // or using multiple pathes
                 *     $style.addStyleUrls(['./path/to/css/file1.css', './path/to/css/file2.css']).then(function(stylesArray){
                 *
                 *     });
                 *
                 *   ```
                 *
                 */
                addStyleUrls: addStyleUrls,
                loadStyleUrls: loadStyleUrls,
                /**
                 * @ngdoc method
                 * @name $StyleProvider#removeStyles
                 * @kind function
                 *
                 * @description
                 * Remove the css styles, using path related to index.html, to the head.
                 * note: the path is case sensitive
                 *
                 * @param {string|Array} path one or more pathes strings to the css style.
                 *
                 * ### Example
                 *   ```js
                 *     // use id
                 *     $style.removeStyles('myElementId');
                 *
                 *     // or you can use path
                 *     $style.removeStyles('./path/to/css/file.css');
                 *
                 *     // or you can use multiple pathes
                 *     $style.removeStyles(['./path/to/css/file1.css', './path/to/css/file2.css']);
                 *
                 *   ```
                 *
                 */
                removeStyles: removeStyles,
                /**
                 * @ngdoc method
                 * @name $StyleProvider#addStyles
                 * @kind function
                 *
                 * @description
                 * Add the css styles, using style text, to the head.
                 *
                 * @param {string} id An id for the new style element.
                 *
                 * @param {string} css Css text.
                 *
                 * ### Example
                 *   ```js
                 *     $style.addStyles('myElementId', '.element-example { background-color: red; }');
                 *   ```
                 */
                addStyles: addStyles
            };

            function getStyleElement(path) {
                return window.document.getElementById(path);
            }

            function addStyleUrls(path) {
                if (window.angular.$$csp().noInlineStyle) {
                    $exceptionHandler($styleMinErr('styleload', 'Failed to load style due to csp restriction'));
                    return $q.reject();
                }

                if (isString(path)) {
                    path = [path];
                }

                return loadStyleUrls(path).then(function(data) {
                    var styles = [], i, l, id, css;

                    for (i = 0, l = path.length; i < l; i++) {
                        id = path[i];
                        css = data[i];

                        if (isString(id) && isString(css) && !getStyleElement(id)) {
                            styles.push('<style type="text/css" id="' + id + '">' + css + '</style>');
                        }

                        delete activeRequests[id];
                    }

                    if (styles.length)
                        angular.element(window.document.head).append(styles.join(''));
                });
            }

            function loadStyleUrls(path) {
                var requests = [];

                if (isString(path)) {
                    path = [path];
                }

                if (isArray(path)) {
                    forEach(path, function(url) {
                        if (!activeRequests[url]) {
                            activeRequests[url] = $styleRequest(url);
                        }

                        requests.push(activeRequests[url]);
                    }, requests);

                    return $q.all(requests).finally(function() {
                        forEach(path, function(url) {
                            delete activeRequests[url];
                        }, requests);
                    });
                }

                return $q.reject();
            }

            function removeStyles(path) {
                var elements = [];

                if (isString(path)) {
                    path = [path];
                }
                forEach(path, function(url) {
                    elements.push(getStyleElement(url));
                });

                angular.element(elements).remove();
            }

            function addStyles(id, css) {
                if (window.angular.$$csp().noInlineStyle) {
                    $exceptionHandler($styleMinErr('styleload', 'Failed to load style due to csp restriction'));
                    return;
                }

                if (isString(id) && isString(css) && !getStyleElement(id)) {
                    angular.element(window.document.head).append('<style type="text/css" id="' + id + '">' + css + '</style>');
                }
            }
        }];

}

/**
 * @ngdoc provider
 * @name $StyleRequestProvider
 * @this
 *
 * @description
 * Used to configure the options passed to the {@link $http} service when making a style request.
 *
 * For example, it can be used for specifying the "Accept" header that is sent to the server, when
 * requesting a style.
 *
 * ## Dependencies
 * Requires the {@link ngStyle `ngStyle`} module to be installed.
 */
function $StyleRequestProvider() {

    var httpOptions = {};

    /**
     * @ngdoc method
     * @name $styleRequestProvider#httpOptions
     * @description
     * The options to be passed to the {@link $http} service when making the request.
     * You can use this to override options such as the "Accept" header for template requests.
     *
     * The {@link $styleRequest} will set the `cache`
     *
     * @param {string=} value new value for the {@link $http} options.
     * @returns {string|self} Returns the {@link $http} options when used as getter and self if used as setter.
     *
     */

    this.httpOptions = function(val) {
        if (val) {
            httpOptions = val;
            return this;
        }
        return httpOptions;
    };

    /**
     * @ngdoc service
     * @name $styleRequest
     *
     * @description
     * The `$styleRequest` downloads the provided style using
     * `$http` and, upon success, stores the contents inside of `$styleCache`. If the HTTP request
     * fails or the response data of the HTTP request is empty, a `$compile` error will be thrown (the
     * exception can be thwarted by setting the 2nd parameter of the function to true). Note that the
     * contents of `$styleCache` are trusted, so the call to `$sce.getTrustedUrl(styleUrl)` is omitted
     * when `styleUrl` is of type string and `$styleCache` has the matching entry.
     *
     * If you want to pass custom options to the `$http` service, such as setting the Accept header you
     * can configure this via {@link $templateRequestProvider#httpOptions}.
     *
     * @param {string|TrustedResourceUrl} styleUrl The HTTP request style URL
     * @param {boolean=} ignoreRequestError Whether or not to ignore the exception when the request fails or the template is empty
     *
     * @return {Promise} a promise for the HTTP response data of the given URL.
     *
     * @property {number} totalPendingRequests total amount of pending template requests being downloaded.
     */
    this.$get = ['$exceptionHandler', '$styleCache', '$http', '$q', '$sce',
        function($exceptionHandler, $styleCache, $http, $q, $sce) {

            function handleRequestFn(styleUrl, ignoreRequestError) {
                handleRequestFn.totalPendingRequests++;

                if (!isString(styleUrl) || isUndefined($styleCache.get(styleUrl))) {
                    styleUrl = $sce.getTrustedResourceUrl(styleUrl);
                }

                httpOptions.cache = $styleCache;
                httpOptions.transformResponse = null;

                return $http.get(styleUrl, httpOptions)
                    .finally(function() {
                        handleRequestFn.totalPendingRequests--;
                    })
                    .then(function(response) {
                        $styleCache.put(styleUrl, response.data);
                        return response.data;
                    }, handleError);

                function handleError(resp) {
                    if (!ignoreRequestError) {
                        resp = $styleMinErr('styleload',
                            'Failed to load style: {0} (HTTP status: {1} {2})',
                            styleUrl, resp.status, resp.statusText);

                        $exceptionHandler(resp);
                    }

                    return $q.reject(resp);
                }
            }

            handleRequestFn.totalPendingRequests = 0;

            return handleRequestFn;
        }
    ];
}

/**
 * @ngdoc service
 * @name $styleCache
 * @this
 *
 * @description
 * The first time a style is used, it is loaded in the style cache for quick retrieval. You
 * can load style directly into the cache in a `script` tag, or by consuming the
 * `$styleCache` service directly.
 *
 * Adding via the `$styleCache` service:
 *
 * ```js
 * var myApp = angular.module('myApp', []);
 * myApp.run(function($styleCache) {
 *   $styleCache.put('styleId.css', 'This is the content of the style');
 * });
 * ```
 *
 * To retrieve the style later, simply use it in your component:
 * ```js
 * myApp.component('myComponent', {
 *    styleUrls: 'styleId.css'
 * });
 * ```
 *
 * Or to retrieve multiple styles later, simply use it in your component:
 * ```js
 * myApp.component('myComponent', {
 *    styleUrls: ['styleId1.css', 'styleId2.css']
 * });
 * ```
 *
 * or get it via the `$styleCache` service:
 * ```js
 * $styleCache.get('styleId.css')
 * ```
 *
 * See {@link ng.$cacheFactory $cacheFactory}.
 *
 * ## Dependencies
 * Requires the {@link ngStyle `ngStyle`} module to be installed.
 */
function $StyleCacheProvider() {
    this.$get = ['$cacheFactory', function($cacheFactory) {
        return $cacheFactory('styles');
    }];
}

///
/// used by the applyDirectivesToNode function to add dynamicaly styles if decalared
/// on the component definition object using the styleUrls property or styles.
/// see component example to learn more
function $$StyleComponentProvider() {
    var shouldRemoveComponentsStyles = false;

    /**
     * @ngdoc method
     * @name $$StyleComponentProvider#shouldRemoveComponentsStyles
     * @description
     * The value passed should decide whether remove style when no component existing
     * anymore in the view or not.
     *
     * @param {bool=} value new value.
     * @returns {string|self} Returns the value when used as getter and self if used as setter.
     *
     */
    this.shouldRemoveComponentsStyles = function(val) {
        if (!isUndefined(val)) {
            shouldRemoveComponentsStyles = !!val;
            return this;
        }

        return shouldRemoveComponentsStyles;
    };



    this.$get = ['$style', '$q', '$exceptionHandler',
        function($style, $q, $exceptionHandler) {
            var componentStyles = {},
                stylesUsage = {};



            return {
                // register component styles once component initiated
                registerStyles: registerStyles,
                // register component with style urls once component initiated
                registerStyleUrls: registerStyleUrls,
                // load component style once component its linked
                loadStyles: loadStyles,
                // unload component style once component its destroyed
                unLoadStyles: unLoadStyles,
                //
                isRegistered: isRegistered
            };

            function registerStyleUrls(componentName, styleUrls) {
                if (isUndefined(styleUrls)) {
                    $exceptionHandler($styleMinErr('styleload', '{0} is missing styleUrls', componentName));
                    return;
                }

                if (isString(styleUrls)) {
                    styleUrls = [styleUrls];
                }

                if (!componentStyles[componentName]) {
                    componentStyles[componentName] = { counter: 0, styleUrls: styleUrls, styles: null };
                    $style.loadStyleUrls(styleUrls);
                }
            }

            function registerStyles(componentName, styles) {
                if (isUndefined(componentName)) {
                    $exceptionHandler($styleMinErr('styleload', 'component name is undifined'));
                    return;
                }

                if (!isString(styles)) {
                    $exceptionHandler($styleMinErr('styleload', 'styles should be plain text'));
                    return;
                }

                if (!componentStyles[componentName]) {
                    componentStyles[componentName] = { counter: 0, styleUrls: [], styles: styles };
                }
            }

            function loadStyles(componentName) {
                var shouldDoUrlLoading = false,
                    componentStyle = componentStyles[componentName];

                if (componentStyle && (shouldRemoveComponentsStyles || componentStyle.counter < 1)) {
                    if (componentStyle.counter === 0) {
                        if (isString(componentStyles[componentName].styles)) {
                            $style.addStyles(componentName, componentStyles[componentName].styles);
                        } else if (componentStyles[componentName].styleUrls.length > 0) {
                            setComponentLoader(componentName);
                            shouldDoUrlLoading = true;
                        }


                    }

                    componentStyle.counter++;
                    incrementUrls(componentStyle.styleUrls);

                    if (shouldDoUrlLoading) {
                        $style.addStyleUrls(componentStyle.styleUrls).finally(function() {
                            removeComponentLoader(componentName);
                        });
                    }
                }
            }

            function unLoadStyles(componentName) {
                var componentStyle = componentStyles[componentName];

                if (componentStyle && shouldRemoveComponentsStyles) {
                    componentStyle.counter--;

                    decrementUrls(componentStyle.styleUrls);
                    if (componentStyle.counter <= 0) {
                        if (componentStyle.styles) {
                            $style.removeStyles(componentName);
                        }
                    }
                }
            }

            function isRegistered(componentName) {
                return !!componentStyles[componentName];
            }

            // counter per url since same styles could be used by different components.
            // for each url styleUsage is incremented.
            function incrementUrls(urls) {
                if (isArray(urls)) {
                    forEach(urls, function(url) {
                        stylesUsage[url] = stylesUsage[url] || 0;
                        stylesUsage[url]++;
                    });
                }
            }

            // decrement counter per url. once the style is not in use we remove it.
            function decrementUrls(urls) {
                if (isArray(urls)) {
                    forEach(urls, function(url) {
                        if (stylesUsage[url]) {
                            stylesUsage[url]--;

                            if (shouldRemoveComponentsStyles && stylesUsage[url] === 0) {
                                $style.removeStyles(url);
                                delete stylesUsage[url];
                            }
                        }
                    });
                }
            }

            // since i didn't want to make huge changes in the applyDirectivesToNode method to
            // support async style i did that trick to hide the component till we will get the style response.
            function setComponentLoader(componentName) {
                var styleTag = '<style type="text/css" id="' + componentName + '-loader">' + componentNormalize(componentName) + ':{display:none !important;}</style>';
                return angular.element(window.document.head).append(styleTag);
            }

            // once the component styles are fetch or failed i am showing the component.
            function removeComponentLoader(componentName) {
                angular.element(window.document.head.querySelector('#' + componentName + '-loader')).remove();
            }

            // change the js component name to html tag name. for example `myCmp` will be `my-cmp`.
            function componentNormalize(name) {
                return name.replace(/([A-Z])/g, '-$1').toLowerCase();
            }
        }];
}
