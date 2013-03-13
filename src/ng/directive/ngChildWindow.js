'use strict';
/**
 * @ngdoc directive
 * @name ng.directive:ngChildWindow
 *
 * @description
 * The 'ngChildWindow' allows creation of external child windows that share the same
 * scope as the parent window.
 *
 * Note: When using 'createElement' in native JavaScript to create a new element for the child 
 * window, make sure not to use the parent 'window' object to create the element. Otherwise, it
 * will create the new DOM element under the context of the parent, and some browser such as IE
 * will not allow injection of DOM elements with different window context.
 *
 * @param {string} ngChildWindow angular expression evaluating to a URL of an html page or a
 * template html string.
 * @param {bool} toggle Toggles (close/open) the child-window.
 * @param {string} name value used in sepcifying the target attribute or the name of the
 * child window. 
 * If specified, a property with the same value will be injected into the scope containing the
 * child-window's window instance.
 * @param {string} [specs] a comma separated list of items. See native javascript
 * window.open() specs options.
 * @example
 *
 */

/**
 * @ngdoc event
 * @name ng.directive:ngChildWindow#childWindowLoaded
 * @eventOf ng.directive:ngChildWindow
 * @eventType broadcast on the current ngChildWindow scope
 * @description
 * This event get broadcast every time the ngChildWindow content is initalized and loaded.
 * The args passed with the event contains the childWindow's window instance.
 */
var ngChildWindowDirective = ['$compile', '$window', '$http', '$templateCache',
    function factory(c, $window, $http, $templateCache) {
        var ngChildWindow = {
            scope: false,
            terminal: true,
            compile: function (tElement, tAttrs, transclude) {
                return {
                    pre: function (scope, iElement, iAttrs, controller) {
                        var linker,
                            childWindow,
                            element = iElement,
                            testHTML = /\<.*\>.*<\/.*\>/i,
                        templateValue = scope.$eval(iAttrs.ngChildWindow),
                        isTemplateString = testHTML.test(templateValue);
                        var unbindCallback = function () {
                            /*If window is closed by the user, then we want to toggle false back
                                to the scope object.
                            */
                            var ngToggle = iAttrs.ngToggle,
                            i = ngToggle.lastIndexOf('.'),
                            root = scope;
                            if (i >= 0) {
                                root = scope.$eval(ngToggle.slice(0, i));
                                ngToggle = ngToggle.slice(i + 1);
                            }

                            root[ngToggle] = false;
                            if (!scope.$$phase) {
                                scope.$digest();
                            }
                        };
                        var initalizeChildWindowAsync = function () {
                            childWindow.onbeforeunload = unbindCallback;
                            $http.get(templateValue, { cache: $templateCache })
                            .then(function (response) {
                                angular.element(childWindow.document).contents()
                                    .html(response.data
                                    .replace(/(\<!.*\>|\<\/*html.*\>|\n|\r|\t|\s{2,})/igm, ''))
                                c(angular.element(childWindow.document).contents())(scope);
                                scope.$broadcast('childWindowLoaded', childWindow);
                            });
                            if (!scope.$$phase) {
                                scope.$digest();
                            }
                        };

                        var openWindow = function () {
                            if (isTemplateString) {
                                childWindow = $window.open(null, iAttrs.ngName
                                    || '_blank', iAttrs.specs, iAttrs.replace);
                                linker = c(angular.element(templateValue));

                                angular.element(childWindow.document.body).append(linker(scope));

                                scope.$broadcast('childWindowLoaded', childWindow);
                                childWindow.onbeforeunload = unbindCallback;
                            } else {
                                childWindow = $window.open(templateValue, iAttrs.name
                                    || '_blank', iAttrs.ngSpecs, iAttrs.replace);
                                childWindow.onload = initalizeChildWindowAsync;
                                /*Specail case for IE, otherwise window onload event won't get
                                called.*/
                                childWindow.onbeforeload = new initalizeChildWindowAsync();
                            }
                        };
                        var temp;
                        //Watch for toggle state of childWindow. 
                        scope.$watch(iAttrs.ngToggle, function (state) {
                            if (state) {
                                if (childWindow && !childWindow.closed) {
                                    return;
                                }
                                openWindow();
                            } else if (childWindow) {
                                childWindow.close();
                                angular.element(childWindow.document).contents().html('');
                                scope[iAttrs.ngName] = childWindow = undefined;

                            }
                            /*if name is given, then we set the instance of the childwindow
                            back to the scope.*/
                            if (iAttrs.ngName) {
                                scope[iAttrs.ngName] = childWindow;
                            }
                        });
                    }
                };
            }
        };
        return ngChildWindow;
    }];