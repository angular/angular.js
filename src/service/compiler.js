'use strict';

/**
 * @ngdoc function
 * @name angular.module.ng.$compile
 * @function
 *
 * @description
 * Compiles a piece of HTML string or DOM into a template and produces a template function, which
 * can then be used to link {@link angular.module.ng.$rootScope.Scope scope} and the template together.
 *
 * The compilation is a process of walking the DOM tree and trying to match DOM elements to
 * {@link angular.module.ng.$compileProvider.directive directives}. For each match it
 * executes corresponding template function and collects the
 * instance functions into a single template function which is then returned.
 *
 * The template function can then be used once to produce the view or as it is the case with
 * {@link angular.module.ng.$compileProvider.directive.ng-repeat repeater} many-times, in which
 * case each call results in a view that is a DOM clone of the original template.
 *
 <doc:example module="compile">
   <doc:source>
    <script>
      // declare a new module, and inject the $compileProvider
      angular.module('compile', [], function($compileProvider) {
        // configure new 'compile' directive by passing a directive
        // factory function. The factory function injects the '$compile'
        $compileProvider.directive('compile', function($compile) {
          // directive factory creates a link function
          return function(scope, element, attrs) {
            scope.$watch(
              function(scope) {
                 // watch the 'compile' expression for changes
                return scope.$eval(attrs.compile);
              },
              function(value) {
                // when the 'compile' expression changes
                // assign it into the current DOM
                element.html(value);

                // compile the new DOM and link it to the current
                // scope.
                // NOTE: we only compile .childNodes so that
                // we don't get into infinite loop compiling ourselves
                $compile(element.contents())(scope);
              }
            );
          };
        })
      });

      function Ctrl($scope) {
        $scope.name = 'Angular';
        $scope.html = 'Hello {{name}}';
      }
    </script>
    <div ng-controller="Ctrl">
      <input ng-model="name"> <br>
      <textarea ng-model="html"></textarea> <br>
      <div compile="html"></div>
    </div>
   </doc:source>
   <doc:scenario>
     it('should auto compile', function() {
       expect(element('div[compile]').text()).toBe('Hello Angular');
       input('html').enter('{{name}}!');
       expect(element('div[compile]').text()).toBe('Angular!');
     });
   </doc:scenario>
 </doc:example>

 *
 *
 * @param {string|DOMElement} element Element or HTML string to compile into a template function.
 * @param {function(angular.Scope[, cloneAttachFn]} transclude function available to directives.
 * @param {number} maxPriority only apply directives lower then given priority (Only effects the
 *                 root element(s), not their children)
 * @returns {function(scope[, cloneAttachFn])} a link function which is used to bind template
 * (a DOM element/tree) to a scope. Where:
 *
 *  * `scope` - A {@link angular.module.ng.$rootScope.Scope Scope} to bind to.
 *  * `cloneAttachFn` - If `cloneAttachFn` is provided, then the link function will clone the
 *               `template` and call the `cloneAttachFn` function allowing the caller to attach the
 *               cloned elements to the DOM document at the appropriate place. The `cloneAttachFn` is
 *               called as: <br> `cloneAttachFn(clonedElement, scope)` where:
 *
 *      * `clonedElement` - is a clone of the original `element` passed into the compiler.
 *      * `scope` - is the current scope with which the linking function is working with.
 *
 * Calling the linking function returns the element of the template. It is either the original element
 * passed in, or the clone of the element if the `cloneAttachFn` is provided.
 *
 * After linking the view is not updateh until after a call to $digest which typically is done by
 * Angular automatically.
 *
 * If you need access to the bound view, there are two ways to do it:
 *
 * - If you are not asking the linking function to clone the template, create the DOM element(s)
 *   before you send them to the compiler and keep this reference around.
 *   <pre>
 *     var element = $compile('<p>{{total}}</p>')(scope);
 *   </pre>
 *
 * - if on the other hand, you need the element to be cloned, the view reference from the original
 *   example would not point to the clone, but rather to the original template that was cloned. In
 *   this case, you can access the clone via the cloneAttachFn:
 *   <pre>
 *     var templateHTML = angular.element('<p>{{total}}</p>'),
 *         scope = ....;
 *
 *     var clonedElement = $compile(templateHTML)(scope, function(clonedElement, scope) {
 *       //attach the clone to DOM document at the right place
 *     });
 *
 *     //now we have reference to the cloned DOM via `clone`
 *   </pre>
 *
 *
 * For information on how the compiler works, see the
 * {@link guide/dev_guide.compiler Angular HTML Compiler} section of the Developer Guide.
 */


$CompileProvider.$inject = ['$provide'];
function $CompileProvider($provide) {
  var hasDirectives = {},
      Suffix = 'Directive',
      COMMENT_DIRECTIVE_REGEXP = /^\s*directive\:\s*([\d\w\-_]+)\s+(.*)$/,
      CLASS_DIRECTIVE_REGEXP = /(([\d\w\-_]+)(?:\:([^;]+))?;?)/,
      CONTENT_REGEXP = /\<\<content\>\>/i,
      HAS_ROOT_ELEMENT = /^\<[\s\S]*\>$/,
      SIDE_EFFECT_ATTRS = {};

  forEach('src,href,multiple,selected,checked,disabled,readonly,required'.split(','), function(name) {
    SIDE_EFFECT_ATTRS[name] = name;
    SIDE_EFFECT_ATTRS[directiveNormalize('ng_' + name)] = name;
  });


  this.directive = function registerDirective(name, directiveFactory) {
    if (isString(name)) {
      assertArg(directiveFactory, 'directive');
      if (!hasDirectives.hasOwnProperty(name)) {
        hasDirectives[name] = [];
        $provide.factory(name + Suffix, ['$injector', '$exceptionHandler',
          function($injector, $exceptionHandler) {
            var directives = [];
            forEach(hasDirectives[name], function(directiveFactory) {
              try {
                var directive = $injector.invoke(directiveFactory);
                if (isFunction(directive)) {
                  directive = { compile: valueFn(directive) };
                } else if (!directive.compile && directive.link) {
                  directive.compile = valueFn(directive.link);
                }
                directive.priority = directive.priority || 0;
                directive.name = directive.name || name;
                directive.require = directive.require || (directive.controller && directive.name);
                directive.restrict = directive.restrict || 'A';
                directives.push(directive);
              } catch (e) {
                $exceptionHandler(e);
              }
            });
            return directives;
          }]);
      }
      hasDirectives[name].push(directiveFactory);
    } else {
      forEach(name, reverseParams(registerDirective));
    }
    return this;
  };


  this.$get = [
            '$injector', '$interpolate', '$exceptionHandler', '$http', '$templateCache', '$parse',
            '$controller',
    function($injector,   $interpolate,   $exceptionHandler,   $http,   $templateCache,   $parse,
             $controller) {

    var LOCAL_MODE = {
      attribute: function(localName, mode, parentScope, scope, attr) {
        scope[localName] = attr[localName];
      },

      evaluate: function(localName, mode, parentScope, scope, attr) {
        scope[localName] = parentScope.$eval(attr[localName]);
      },

      bind: function(localName, mode, parentScope, scope, attr) {
        var getter = $interpolate(attr[localName]);
        scope.$watch(
          function() { return getter(parentScope); },
          function(v) { scope[localName] = v; }
        );
      },

      accessor: function(localName, mode, parentScope, scope, attr) {
        var getter = noop,
            setter = noop,
            exp = attr[localName];

        if (exp) {
          getter = $parse(exp);
          setter = getter.assign || function() {
            throw Error("Expression '" + exp + "' not assignable.");
          };
        }

        scope[localName] = function(value) {
          return arguments.length ? setter(parentScope, value) : getter(parentScope);
        };
      },

      expression: function(localName, mode, parentScope, scope, attr) {
        scope[localName] = function(locals) {
          $parse(attr[localName])(parentScope, locals);
        };
      }
    };

    return compile;

    //================================

    function compile(templateElement, transcludeFn, maxPriority) {
      if (!(templateElement instanceof jqLite)) {
        // jquery always rewraps, where as we need to preserve the original selector so that we can modify it.
        templateElement = jqLite(templateElement);
      }
      // We can not compile top level text elements since text nodes can be merged and we will
      // not be able to attach scope data to them, so we will wrap them in <span>
      forEach(templateElement, function(node, index){
        if (node.nodeType == 3 /* text node */) {
          templateElement[index] = jqLite(node).wrap('<span>').parent()[0];
        }
      });
      var linkingFn = compileNodes(templateElement, transcludeFn, templateElement, maxPriority);
      return function(scope, cloneConnectFn){
        assertArg(scope, 'scope');
        // important!!: we must call our jqLite.clone() since the jQuery one is trying to be smart
        // and sometimes changes the structure of the DOM.
        var element = cloneConnectFn
          ? JQLitePrototype.clone.call(templateElement) // IMPORTANT!!!
          : templateElement;
        safeAddClass(element.data('$scope', scope), 'ng-scope');
        if (cloneConnectFn) cloneConnectFn(element, scope);
        if (linkingFn) linkingFn(scope, element, element);
        return element;
      };
    }

    function wrongMode(localName, mode) {
      throw Error("Unsupported '" + mode + "' for '" + localName + "'.");
    }

    function safeAddClass(element, className) {
      try {
        element.addClass(className);
      } catch(e) {
        // ignore, since it means that we are trying to set class on
        // SVG element, where class name is read-only.
      }
    }

    /**
     * Compile function matches each node in nodeList against the directives. Once all directives
     * for a particular node are collected their compile functions are executed. The compile
     * functions return values - the linking functions - are combined into a composite linking
     * function, which is the a linking function for the node.
     *
     * @param {NodeList} nodeList an array of nodes to compile
     * @param {function(angular.Scope[, cloneAttachFn]} transcludeFn A linking function, where the
     *        scope argument is auto-generated to the new child of the transcluded parent scope.
     * @param {DOMElement=} rootElement If the nodeList is the root of the compilation tree then the
     *        rootElement must be set the jqLite collection of the compile root. This is
     *        needed so that the jqLite collection items can be replaced with widgets.
     * @param {number=} max directive priority
     * @returns {?function} A composite linking function of all of the matched directives or null.
     */
    function compileNodes(nodeList, transcludeFn, rootElement, maxPriority) {
     var linkingFns = [],
         directiveLinkingFn, childLinkingFn, directives, attrs, linkingFnFound;

     for(var i = 0, ii = nodeList.length; i < ii; i++) {
       attrs = {
         $attr: {},
         $normalize: directiveNormalize,
         $set: attrSetter,
         $observe: interpolatedAttrObserve,
         $observers: {}
       };
       // we must always refer to nodeList[i] since the nodes can be replaced underneath us.
       directives = collectDirectives(nodeList[i], [], attrs, maxPriority);

       directiveLinkingFn = (directives.length)
           ? applyDirectivesToNode(directives, nodeList[i], attrs, transcludeFn, rootElement)
           : null;

       childLinkingFn = (directiveLinkingFn && directiveLinkingFn.terminal)
           ? null
           : compileNodes(nodeList[i].childNodes,
                directiveLinkingFn ? directiveLinkingFn.transclude : transcludeFn);

       linkingFns.push(directiveLinkingFn);
       linkingFns.push(childLinkingFn);
       linkingFnFound = (linkingFnFound || directiveLinkingFn || childLinkingFn);
     }

     // return a linking function if we have found anything, null otherwise
     return linkingFnFound ? linkingFn : null;

     /* nodesetLinkingFn */ function linkingFn(scope, nodeList, rootElement, boundTranscludeFn) {
       if (linkingFns.length != nodeList.length * 2) {
         throw Error('Template changed structure!');
       }

       var childLinkingFn, directiveLinkingFn, node, childScope, childTransclusionFn;

       for(var i=0, n=0, ii=linkingFns.length; i<ii; n++) {
         node = nodeList[n];
         directiveLinkingFn = /* directiveLinkingFn */ linkingFns[i++];
         childLinkingFn = /* nodesetLinkingFn */ linkingFns[i++];

         if (directiveLinkingFn) {
           if (directiveLinkingFn.scope && !rootElement) {
             childScope = scope.$new(isObject(directiveLinkingFn.scope));
             jqLite(node).data('$scope', childScope);
           } else {
             childScope = scope;
           }
           childTransclusionFn = directiveLinkingFn.transclude;
           if (childTransclusionFn || (!boundTranscludeFn && transcludeFn)) {
             directiveLinkingFn(childLinkingFn, childScope, node, rootElement,
                 (function(transcludeFn) {
                   return function(cloneFn) {
                     var transcludeScope = scope.$new();

                     return transcludeFn(transcludeScope, cloneFn).
                         bind('$destroy', bind(transcludeScope, transcludeScope.$destroy));
                    };
                  })(childTransclusionFn || transcludeFn)
             );
           } else {
             directiveLinkingFn(childLinkingFn, childScope, node, undefined, boundTranscludeFn);
           }
         } else if (childLinkingFn) {
           childLinkingFn(scope, node.childNodes, undefined, boundTranscludeFn);
         }
       }
     }
   }


    /**
     * Looks for directives on the given node ands them to the directive collection which is sorted.
     *
     * @param node node to search
     * @param directives an array to which the directives are added to. This array is sorted before
     *        the function returns.
     * @param attrs the shared attrs object which is used to populate the normalized attributes.
     * @param {number=} max directive priority
     */
    function collectDirectives(node, directives, attrs, maxPriority) {
      var nodeType = node.nodeType,
          attrsMap = attrs.$attr,
          match,
          className;

      switch(nodeType) {
        case 1: /* Element */
          // use the node name: <directive>
          addDirective(directives,
              directiveNormalize(nodeName_(node).toLowerCase()), 'E', maxPriority);

          // iterate over the attributes
          for (var attr, name, nName, value, nAttrs = node.attributes,
                   j = 0, jj = nAttrs && nAttrs.length; j < jj; j++) {
            attr = nAttrs[j];
            if (attr.specified) {
              name = attr.name;
              nName = directiveNormalize(name.toLowerCase());
              attrsMap[nName] = name;
              attrs[nName] = value = trim((msie && name == 'href')
                ? decodeURIComponent(node.getAttribute(name, 2))
                : attr.value);
              if (isBooleanAttr(node, nName)) {
                attrs[nName] = true; // presence means true
              }
              addAttrInterpolateDirective(node, directives, value, nName)
              addDirective(directives, nName, 'A', maxPriority);
            }
          }

          // use class as directive
          className = node.className;
          if (isString(className)) {
            while (match = CLASS_DIRECTIVE_REGEXP.exec(className)) {
              nName = directiveNormalize(match[2]);
              if (addDirective(directives, nName, 'C', maxPriority)) {
                attrs[nName] = trim(match[3]);
              }
              className = className.substr(match.index + match[0].length);
            }
          }
          break;
        case 3: /* Text Node */
          addTextInterpolateDirective(directives, node.nodeValue);
          break;
        case 8: /* Comment */
          match = COMMENT_DIRECTIVE_REGEXP.exec(node.nodeValue);
          if (match) {
            nName = directiveNormalize(match[1]);
            if (addDirective(directives, nName, 'M', maxPriority)) {
              attrs[nName] = trim(match[2]);
            }
          }
          break;
      }

      directives.sort(byPriority);
      return directives;
    }


    /**
     * Once the directives have been collected their compile functions is executed. This method
     * is responsible for inlining directive templates as well as terminating the application
     * of the directives if the terminal directive has been reached..
     *
     * @param {Array} directives Array of collected directives to execute their compile function.
     *        this needs to be pre-sorted by priority order.
     * @param {Node} templateNode The raw DOM node to apply the compile functions to
     * @param {Object} templateAttrs The shared attribute function
     * @param {function(angular.Scope[, cloneAttachFn]} transcludeFn A linking function, where the
     *        scope argument is auto-generated to the new child of the transcluded parent scope.
     * @param {DOMElement} rootElement If we are working on the root of the compile tree then this
     *        argument has the root jqLite array so that we can replace widgets on it.
     * @returns linkingFn
     */
    function applyDirectivesToNode(directives, templateNode, templateAttrs, transcludeFn, rootElement) {
      var terminalPriority = -Number.MAX_VALUE,
          preLinkingFns = [],
          postLinkingFns = [],
          newScopeDirective = null,
          newIsolatedScopeDirective = null,
          templateDirective = null,
          delayedLinkingFn = null,
          element = templateAttrs.$element = jqLite(templateNode),
          directive,
          directiveName,
          template,
          transcludeDirective,
          childTranscludeFn = transcludeFn,
          controllerDirectives,
          linkingFn,
          directiveValue;

      // executes all directives on the current element
      for(var i = 0, ii = directives.length; i < ii; i++) {
        directive = directives[i];
        template = undefined;

        if (terminalPriority > directive.priority) {
          break; // prevent further processing of directives
        }

        if (directiveValue = directive.scope) {
          assertNoDuplicate('isolated scope', newIsolatedScopeDirective, directive, element);
          if (isObject(directiveValue)) {
            safeAddClass(element, 'ng-isolate-scope');
            newIsolatedScopeDirective = directive;
          }
          safeAddClass(element, 'ng-scope');
          newScopeDirective = newScopeDirective || directive;
        }

        directiveName = directive.name;

        if (directiveValue = directive.controller) {
          controllerDirectives = controllerDirectives || {};
          assertNoDuplicate("'" + directiveName + "' controller",
              controllerDirectives[directiveName], directive, element);
          controllerDirectives[directiveName] = directive;
        }

        if (directiveValue = directive.transclude) {
          assertNoDuplicate('transclusion', transcludeDirective, directive, element);
          transcludeDirective = directive;
          terminalPriority = directive.priority;
          if (directiveValue == 'element') {
            template = jqLite(templateNode);
            templateNode = (element = templateAttrs.$element = jqLite(
                '<!-- ' + directiveName + ': ' + templateAttrs[directiveName]  + ' -->'))[0];
            replaceWith(rootElement, jqLite(template[0]), templateNode);
            childTranscludeFn = compile(template, transcludeFn, terminalPriority);
          } else {
            template = jqLite(JQLiteClone(templateNode));
            element.html(''); // clear contents
            childTranscludeFn = compile(template.contents(), transcludeFn);
          }
        }

        if (directiveValue = directive.template) {
          assertNoDuplicate('template', templateDirective, directive, element);
          templateDirective = directive;

          // include the contents of the original element into the template and replace the element
          var content = directiveValue.replace(CONTENT_REGEXP, element.html());
          templateNode = jqLite(content)[0];
          if (directive.replace) {
            replaceWith(rootElement, element, templateNode);

            var newTemplateAttrs = {$attr: {}};

            // combine directives from the original node and from the template:
            // - take the array of directives for this element
            // - split it into two parts, those that were already applied and those that weren't
            // - collect directives from the template, add them to the second group and sort them
            // - append the second group with new directives to the first group
            directives = directives.concat(
                collectDirectives(
                    templateNode,
                    directives.splice(i + 1, directives.length - (i + 1)),
                    newTemplateAttrs
                )
            );
            mergeTemplateAttributes(templateAttrs, newTemplateAttrs);

            ii = directives.length;
          } else {
            element.html(content);
          }
        }

        if (directive.templateUrl) {
          assertNoDuplicate('template', templateDirective, directive, element);
          templateDirective = directive;
          delayedLinkingFn = compileTemplateUrl(directives.splice(i, directives.length - i),
              /* directiveLinkingFn */ compositeLinkFn, element, templateAttrs, rootElement,
              directive.replace, childTranscludeFn);
          ii = directives.length;
        } else if (directive.compile) {
          try {
            linkingFn = directive.compile(element, templateAttrs, childTranscludeFn);
            if (isFunction(linkingFn)) {
              addLinkingFns(null, linkingFn);
            } else if (linkingFn) {
              addLinkingFns(linkingFn.pre, linkingFn.post);
            }
          } catch (e) {
            $exceptionHandler(e, startingTag(element));
          }
        }

        if (directive.terminal) {
          compositeLinkFn.terminal = true;
          terminalPriority = Math.max(terminalPriority, directive.priority);
        }

      }

      linkingFn = delayedLinkingFn || compositeLinkFn;
      linkingFn.scope = newScopeDirective && newScopeDirective.scope;
      linkingFn.transclude = transcludeDirective && childTranscludeFn;

      // if we have templateUrl, then we have to delay linking
      return linkingFn;

      ////////////////////

      function addLinkingFns(pre, post) {
        if (pre) {
          pre.require = directive.require;
          preLinkingFns.push(pre);
        }
        if (post) {
          post.require = directive.require;
          postLinkingFns.push(post);
        }
      }


      function getControllers(require, element) {
        var value, retrievalMethod = 'data', optional = false;
        if (isString(require)) {
          while((value = require.charAt(0)) == '^' || value == '?') {
            require = require.substr(1);
            if (value == '^') {
              retrievalMethod = 'inheritedData';
            }
            optional = optional || value == '?';
          }
          value = element[retrievalMethod]('$' + require + 'Controller');
          if (!value && !optional) {
            throw Error("No controller: " + require);
          }
          return value;
        } else if (isArray(require)) {
          value = [];
          forEach(require, function(require) {
            value.push(getControllers(require, element));
          });
        }
        return value;
      }


      /* directiveLinkingFn */
      function compositeLinkFn(/* nodesetLinkingFn */ childLinkingFn,
                               scope, linkNode, rootElement, boundTranscludeFn) {
        var attrs, element, i, ii, linkingFn, controller;

        if (templateNode === linkNode) {
          attrs = templateAttrs;
        } else {
          attrs = shallowCopy(templateAttrs);
          attrs.$element = jqLite(linkNode);
        }
        element = attrs.$element;

        if (newScopeDirective && isObject(newScopeDirective.scope)) {
          forEach(newScopeDirective.scope, function(mode, name) {
            (LOCAL_MODE[mode] || wrongMode)(name, mode,
                scope.$parent || scope, scope, attrs);
          });
        }

        if (controllerDirectives) {
          forEach(controllerDirectives, function(directive) {
            var locals = {
              $scope: scope,
              $element: element,
              $attrs: attrs,
              $transclude: boundTranscludeFn
            };


            forEach(directive.inject || {}, function(mode, name) {
              (LOCAL_MODE[mode] || wrongMode)(name, mode,
                  newScopeDirective ? scope.$parent || scope : scope, locals, attrs);
            });

            controller = directive.controller;
            if (controller == '@') {
              controller = attrs[directive.name];
            }

            element.data(
                '$' + directive.name + 'Controller',
                $controller(controller, locals));
          });
        }

        // PRELINKING
        for(i = 0, ii = preLinkingFns.length; i < ii; i++) {
          try {
            linkingFn = preLinkingFns[i];
            linkingFn(scope, element, attrs,
                linkingFn.require && getControllers(linkingFn.require, element));
          } catch (e) {
            $exceptionHandler(e, startingTag(element));
          }
        }

        // RECURSION
        childLinkingFn && childLinkingFn(scope, linkNode.childNodes, undefined, boundTranscludeFn);

        // POSTLINKING
        for(i = 0, ii = postLinkingFns.length; i < ii; i++) {
          try {
            linkingFn = postLinkingFns[i];
            linkingFn(scope, element, attrs,
                linkingFn.require && getControllers(linkingFn.require, element));
          } catch (e) {
            $exceptionHandler(e, startingTag(element));
          }
        }
      }
    }


    /**
     * looks up the directive and decorates it with exception handling and proper parameters. We
     * call this the boundDirective.
     *
     * @param {string} name name of the directive to look up.
     * @param {string} location The directive must be found in specific format.
     *   String containing any of theses characters:
     *
     *   * `E`: element name
     *   * `A': attribute
     *   * `C`: class
     *   * `M`: comment
     * @returns true if directive was added.
     */
    function addDirective(tDirectives, name, location, maxPriority) {
      var match = false;
      if (hasDirectives.hasOwnProperty(name)) {
        for(var directive, directives = $injector.get(name + Suffix),
            i=0, ii = directives.length; i<ii; i++) {
          try {
            directive = directives[i];
            if ( (maxPriority === undefined || maxPriority > directive.priority) &&
                 directive.restrict.indexOf(location) != -1) {
              tDirectives.push(directive);
              match = true;
            }
          } catch(e) { $exceptionHandler(e); }
        }
      }
      return match;
    }


    /**
     * When the element is replaced with HTML template then the new attributes
     * on the template need to be merged with the existing attributes in the DOM.
     * The desired effect is to have both of the attributes present.
     *
     * @param {object} dst destination attributes (original DOM)
     * @param {object} src source attributes (from the directive template)
     */
    function mergeTemplateAttributes(dst, src) {
      var srcAttr = src.$attr,
          dstAttr = dst.$attr,
          element = dst.$element;
      // reapply the old attributes to the new element
      forEach(dst, function(value, key) {
        if (key.charAt(0) != '$') {
          if (src[key]) {
            value += (key === 'style' ? ';' : ' ') + src[key];
          }
          dst.$set(key, value, srcAttr[key]);
        }
      });
      // copy the new attributes on the old attrs object
      forEach(src, function(value, key) {
        if (key == 'class') {
          safeAddClass(element, value);
        } else if (key == 'style') {
          element.attr('style', element.attr('style') + ';' + value);
        } else if (key.charAt(0) != '$' && !dst.hasOwnProperty(key)) {
          dst[key] = value;
          dstAttr[key] = srcAttr[key];
        }
      });
    }


    function compileTemplateUrl(directives, /* directiveLinkingFn */ beforeWidgetLinkFn,
                                tElement, tAttrs, rootElement, replace, transcludeFn) {
      var linkQueue = [],
          afterWidgetLinkFn,
          afterWidgetChildrenLinkFn,
          originalWidgetNode = tElement[0],
          asyncWidgetDirective = directives.shift(),
          // The fact that we have to copy and patch the directive seems wrong!
          syncWidgetDirective = extend({}, asyncWidgetDirective, {templateUrl:null, transclude:null}),
          html = tElement.html();

      tElement.html('');

      $http.get(asyncWidgetDirective.templateUrl, {cache: $templateCache}).
        success(function(content) {
          content = trim(content).replace(CONTENT_REGEXP, html);
          if (replace && !content.match(HAS_ROOT_ELEMENT)) {
            throw Error('Template must have exactly one root element: ' + content);
          }

          var templateNode, tempTemplateAttrs;

          if (replace) {
            tempTemplateAttrs = {$attr: {}};
            templateNode = jqLite(content)[0];
            replaceWith(rootElement, tElement, templateNode);
            collectDirectives(tElement[0], directives, tempTemplateAttrs);
            mergeTemplateAttributes(tAttrs, tempTemplateAttrs);
          } else {
            templateNode = tElement[0];
            tElement.html(content);
          }

          directives.unshift(syncWidgetDirective);
          afterWidgetLinkFn = /* directiveLinkingFn */ applyDirectivesToNode(directives, tElement, tAttrs, transcludeFn);
          afterWidgetChildrenLinkFn = /* nodesetLinkingFn */ compileNodes(tElement.contents(), transcludeFn);


          while(linkQueue.length) {
            var controller = linkQueue.pop(),
                linkRootElement = linkQueue.pop(),
                cLinkNode = linkQueue.pop(),
                scope = linkQueue.pop(),
                node = templateNode;

            if (cLinkNode !== originalWidgetNode) {
              // it was cloned therefore we have to clone as well.
              node = JQLiteClone(templateNode);
              replaceWith(linkRootElement, jqLite(cLinkNode), node);
            }
            afterWidgetLinkFn(function() {
              beforeWidgetLinkFn(afterWidgetChildrenLinkFn, scope, node, rootElement, controller);
            }, scope, node, rootElement, controller);
          }
          linkQueue = null;
        }).
        error(function(response, code, headers, config) {
          throw Error('Failed to load template: ' + config.url);
        });

      return /* directiveLinkingFn */ function(ignoreChildLinkingFn, scope, node, rootElement,
                                               controller) {
        if (linkQueue) {
          linkQueue.push(scope);
          linkQueue.push(node);
          linkQueue.push(rootElement);
          linkQueue.push(controller);
        } else {
          afterWidgetLinkFn(function() {
            beforeWidgetLinkFn(afterWidgetChildrenLinkFn, scope, node, rootElement, controller);
          }, scope, node, rootElement, controller);
        }
      };
    }


    /**
     * Sorting function for bound directives.
     */
    function byPriority(a, b) {
      return b.priority - a.priority;
    }


    function assertNoDuplicate(what, previousDirective, directive, element) {
      if (previousDirective) {
        throw Error('Multiple directives [' + previousDirective.name + ', ' +
          directive.name + '] asking for ' + what + ' on: ' +  startingTag(element));
      }
    }


    function addTextInterpolateDirective(directives, text) {
      var interpolateFn = $interpolate(text, true);
      if (interpolateFn) {
        directives.push({
          priority: 0,
          compile: valueFn(function(scope, node) {
            var parent = node.parent(),
                bindings = parent.data('$binding') || [];
            bindings.push(interpolateFn);
            safeAddClass(parent.data('$binding', bindings), 'ng-binding');
            scope.$watch(interpolateFn, function(value) {
              node[0].nodeValue = value;
            });
          })
        });
      }
    }


    function addAttrInterpolateDirective(node, directives, value, name) {
      var interpolateFn = $interpolate(value, true),
          realName = SIDE_EFFECT_ATTRS[name],
          specialAttrDir = (realName && (realName !== name));

      realName = realName || name;

      if (specialAttrDir && isBooleanAttr(node, name)) {
        value = true;
      }

      // no interpolation found and we are not a side-effect attr -> ignore
      if (!interpolateFn && !specialAttrDir) {
        return;
      }

      directives.push({
        priority: 100,
        compile: function(element, attr) {
          if (interpolateFn) {
            return function(scope, element, attr) {
              if (name === 'class') {
                // we need to interpolate classes again, in the case the element was replaced
                // and therefore the two class attrs got merged - we want to interpolate the result
                interpolateFn = $interpolate(attr[name], true);
              }

              // we define observers array only for interpolated attrs
              // and ignore observers for non interpolated attrs to save some memory
              attr.$observers[realName] = [];
              attr[realName] = undefined;
              scope.$watch(interpolateFn, function(value) {
                attr.$set(realName, value);
              });
            };
          } else {
            attr.$set(realName, value);
          }
        }
      });
    }


    /**
     * This is a special jqLite.replaceWith, which can replace items which
     * have no parents, provided that the containing jqLite collection is provided.
     *
     * @param {JqLite=} rootElement The root of the compile tree. Used so that we can replace nodes
     *    in the root of the tree.
     * @param {JqLite} element The jqLite element which we are going to replace. We keep the shell,
     *    but replace its DOM node reference.
     * @param {Node} newNode The new DOM node.
     */
    function replaceWith(rootElement, element, newNode) {
      var oldNode = element[0],
          parent = oldNode.parentNode,
          i, ii;

      if (rootElement) {
        for(i = 0, ii = rootElement.length; i<ii; i++) {
          if (rootElement[i] == oldNode) {
            rootElement[i] = newNode;
          }
        }
      }
      if (parent) {
        parent.replaceChild(newNode, oldNode);
      }
      element[0] = newNode;
    }


    /**
     * Set a normalized attribute on the element in a way such that all directives
     * can share the attribute. This function properly handles boolean attributes.
     * @param {string} key Normalized key. (ie ngAttribute)
     * @param {string|boolean} value The value to set. If `null` attribute will be deleted.
     * @param {string=} attrName Optional none normalized name. Defaults to key.
     */
    function attrSetter(key, value, attrName) {
      var booleanKey = isBooleanAttr(this.$element[0], key.toLowerCase());

      if (booleanKey) {
        value = toBoolean(value);
        this.$element.prop(key, value);
        this[key] = value;
        attrName = key = booleanKey;
        value = value ? booleanKey : undefined;
      } else {
        this[key] = value;
      }

      // translate normalized key to actual key
      if (attrName) {
        this.$attr[key] = attrName;
      } else {
        attrName = this.$attr[key];
        if (!attrName) {
          this.$attr[key] = attrName = snake_case(key, '-');
        }
      }

      if (value === null || value === undefined) {
        this.$element.removeAttr(attrName);
      } else {
        this.$element.attr(attrName, value);
      }

      // fire observers
      forEach(this.$observers[key], function(fn) {
        try {
          fn(value);
        } catch (e) {
          $exceptionHandler(e);
        }
      });
    }


    /**
     * Observe an interpolated attribute.
     * The observer will never be called, if given attribute is not interpolated.
     *
     * @param {string} key Normalized key. (ie ngAttribute) .
     * @param {function(*)} fn Function that will be called whenever the attribute value changes.
     */
    function interpolatedAttrObserve(key, fn) {
      // keep only observers for interpolated attrs
      if (this.$observers[key]) {
        this.$observers[key].push(fn);
      }
    }
  }];
}

var PREFIX_REGEXP = /^(x[\:\-_]|data[\:\-_])/i;
/**
 * Converts all accepted directives format into proper directive name.
 * All of these will become 'myDirective':
 *   my:DiRective
 *   my-directive
 *   x-my-directive
 *   data-my:directive
 *
 * Also there is special case for Moz prefix starting with upper case letter.
 * @param name Name to normalize
 */
function directiveNormalize(name) {
  return camelCase(name.replace(PREFIX_REGEXP, ''));
}



/**
 * Closure compiler type information
 */

function nodesetLinkingFn(
  /* angular.Scope */ scope,
  /* NodeList */ nodeList,
  /* Element */ rootElement,
  /* function(Function) */ boundTranscludeFn
){}

function directiveLinkingFn(
  /* nodesetLinkingFn */ nodesetLinkingFn,
  /* angular.Scope */ scope,
  /* Node */ node,
  /* Element */ rootElement,
  /* function(Function) */ boundTranscludeFn
){}
