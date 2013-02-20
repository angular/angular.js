var ngChildWindowDirective = ['$compile', '$timeout', function factory(c, $timeout) {
    //Traversing through the object to find the value that we want. If fail, then return the original object.
    var setObjectValue = function (obj, columnName, value) {
        if (typeof obj != 'object' || typeof columnName != 'string')
            return;
        var args = columnName.split('.');
        var valOfInterest = args.splice(-1, 1)[0];
        var cObj = obj;
        for (var i = 0, len = args.length; i < len; i++) {
            cObj = cObj[args[i]];
            if (!cObj) {
                return;
            }
        }
        cObj[valOfInterest] = value;
    };
    var ngChildWindow = {
        scope: false,
        terminal: true,
        compile: function (tElement, tAttrs, transclude) {
            return {
                pre: function (scope, iElement, iAttrs, controller) {
                    var linker,
                        childWindow,
                        element = iElement,
                        loaded = false;

                    var openWindow = function () {
                        //create a childwindow with the specified html uri
                        if (iAttrs.ngUri) {
                            childWindow = $window.open(iAttrs.ngUri, iAttrs.name || '_blank', iAttrs.ngSpecs, iAttrs.ngReplace);
                            //otherwise, create a blank childwindow.  
                        } else {
                            childWindow = $window.open(null, iAttrs.ngName || '_blank', iAttrs.ngSpecs, iAttrs.ngReplace);
                        }
                        //Using native onload event because .ready() get fired too early without all dom elements initiated.
                        childWindow.onload = function () {
                            loaded = true;
                            //If user specified an html page, we will replace the body with the returned link object.
                            if (iAttrs.ngUri) {
                                linker = c($(childWindow.document).contents());
                                var angularContent = linker(scope);

                                var documentContent = angularContent.lenght > 1 ? $(angularContent[2]) : $(angularContent[1]);

                                //Note: since browsers won't allow replacing the entire html element, we have to replace the header and body separately.

                                //Replace header
                                $(childWindow.document).contents().find('head').replaceWith(documentContent.find('head'));
                                //Replace body
                                $(childWindow.document.body).replaceWith(documentContent.find('body'));
                            } else {
                                //Otherwise, we create a view using the template file path.
                                linker = c($(iAttrs.ngTemplate || '<div data-ng-include src="\'' + iAttrs.ngTemplateUri + '\'"></div>'));
                                $(childWindow.document.body).append(linker(controller || scope));

                                //inject title if user specified.
                                if (iAttrs.ngTitle) {
                                    if ($(childWindow.document.head.title).length === 0) {
                                        $(childWindow.document.head).append($('<title></title>').html(iAttrs.ngTitle));
                                        return;
                                    }
                                    $(childWindow.document.head.title).html(iAttrs.ngTitle);
                                }
                            }
                            //Properly digest any child scope (since $timeout automatically call digest, we do not have to explicitly call digest).
                            $timeout(function () {
                                //Notify any child scope of the childWindow object since any child scope will still be within the context of the parent window. 
                                scope.$broadcast('childWindowLoaded', childWindow);
                            });
                        };

                        $(childWindow).unload(function () {
                            if (!loaded) {
                                return;
                            }
                            var varName = $(element).attr('data-ng-toggle') || $(element).attr('ng-toggle');
                            setObjectValue(scope, varName, false);
                            childWindow = undefined;
                            loaded = false;
                        });
                    };
                    //Watch for toggle state of childWindow. 
                    scope.$watch(iAttrs.ngToggle, function (state) {
                        if (state) {
                            if (childWindow && !childWindow.closed) {
                                return;
                            }
                            openWindow();
                        } else if (childWindow) {
                            childWindow.close();
                        }
                        //if name is given, then we set the instance of the childwindow back to the scope.
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