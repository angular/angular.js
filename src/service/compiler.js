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
 * {@link angular.module.ng.$compileProvider.directive.ng:repeat repeater} many-times, in which
 * case each call results in a view that is a DOM clone of the original template.
 *
 <doc:example module="compile">
   <doc:source>
    <script>
      // declare a new module, and inject the $compileProvider
      angular.module.compile = function($compileProvider) {
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
              function(scope, value) {
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
      };

      function Ctrl() {
        this.name = 'Angular';
        this.html = 'Hello {{name}}';
      }
    </script>
    <div ng-controller="Ctrl">
      <input ng:model="name"> <br>
      <textarea ng:model="html"></textarea> <br>
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
 * It is important to understand that the returned scope is "linked" to the view DOM, but no linking
 * (instance) functions registered by {@link angular.directive directives} or
 * {@link angular.widget widgets} found in the template have been executed yet. This means that the
 * view is likely empty and doesn't contain any values that result from evaluation on the scope. To
 * bring the view to life, the scope needs to run through a $digest phase which typically is done by
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
 * Compiler Methods For Widgets and Directives:
 *
 * The following methods are available for use when you write your own widgets, directives,
 * and markup.
 *
 *
 * For information on how the compiler works, see the
 * {@link guide/dev_guide.compiler Angular HTML Compiler} section of the Developer Guide.
 */


$CompileProvider.$inject = ['$injector'];
function $CompileProvider($injector) {
  var directiveCache = {},
      directiveFactories = {},
      COMMENT_DIRECTIVE_REGEXP = /^\s*directive\:\s*([\d\w\-_]+)\s+(.*)$/,
      CLASS_DIRECTIVE_REGEXP = /(([\d\w\-_]+)(?:\:([^;]+))?;?)/,
      CONTENT_REGEXP = /\<\<content\>\>/i,
      SIDE_EFFECT_ATTRS = {};

  forEach('src,href,multiple,selected,checked,disabled,readonly,required'.split(','), function(name) {
    SIDE_EFFECT_ATTRS[name] = name;
    SIDE_EFFECT_ATTRS[camelCase('ng_' + name)] = name;
  });


  this.directive = function registerDirective(name, directive) {
    if (isString(name)) {
      assertArg(directive, 'directive');
      directiveCache[name] = false;
      directiveFactories[name] = function() {
        directive = $injector.invoke(null, directive);
        if (isFunction(directive)) {
          directive = { compile: valueFn(directive) };
        }
        directive.priority = directive.priority || 0;
        directive.name = name;
        directive.restrict = directive.restrict || 'EACM';
        return directiveCache[name] = directive;
      }
    } else {
      forEach(name, function(fn, name) {
        registerDirective(name, fn);
      });
    }
    return this;
  };


  this.$get = ['$interpolate', '$exceptionHandler',
       function($interpolate,   $exceptionHandler) {

    return function(templateElement) {
      templateElement = jqLite(templateElement);
      var linkingFn = compileNodes(templateElement);
      return function(scope, cloneConnectFn){
        assertArg(scope, 'scope');
        // important!!: we must call our jqLite.clone() since the jQuery one is trying to be smart
        // and sometimes changes the structure of the DOM.
        var element = cloneConnectFn
          ? JQLitePrototype.clone.call(templateElement) // IMPORTANT!!!
          : templateElement;
        element.data('$scope', scope);
        if (cloneConnectFn) cloneConnectFn(element, scope);
        if (linkingFn) linkingFn(scope, element, true);
        return element;
      };
    };

    //================================

    /**
     * Sorting function for bound directives.
     */
    function byPriority(a, b) {
      return b.priority - a.priority;
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
     * @returns bound directive function.
     */
    function addDirective(directives, name, location) {
      if (directiveFactories.hasOwnProperty(name)) {
        try {
          var directive =  directiveCache[name] ||
            (directiveCache[name] = directiveFactories[name]());
          if (directive.restrict.indexOf(location) != -1) {
            directives.push(directive);
            return directive;
          }
        } catch(e) { $exceptionHandler(e); }
      }
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
          dst.$set(key, value, srcAttr[key]);
        }
      });
      // copy the new attributes on the old attrs object
      forEach(src, function(value, key) {
        if (key == 'class') {
          element.addClass(value);
        } else if (key == 'style') {
          element.attr('style', element.attr('style') + ';' + value);
        } else if (key.charAt(0) != '$' && !dst.hasOwnProperty(key)) {
          dst[key] = value;
          dstAttr[key] = srcAttr[key];
        }
      });
    }

    /**
     * Once the directives have been collected they are sorted and then applied to the element
     * by priority order.
     *
     * @param {Array} directives Array of collected directives to execute their compile function
     * @param {Node} templateNode The raw DOM node to apply the compile functions to
     * @param {Object} templateAttrs The shared attribute function
     * @returns linkingFn
     */
    function applyDirectivesToNode(directives, templateNode, templateAttrs) {
      directives.sort(byPriority);
      var terminalPriority = -Number.MAX_VALUE,
          linkingFns = [],
          newScopeDirective = null,
          element = templateAttrs.$element = jqLite(templateNode),
          directive, templateDirectives, template, newTemplateAttrs;

      // executes all directives on the current element
      for(var i = 0, ii = directives.length; i < ii; i++) {
        try {
          directive = directives[i];
          if (directive.scope) {
            if (newScopeDirective) {
              throw Error('Multiple directives [' + newScopeDirective.name + ', ' +
                directive.name + '] asking for new scope on: ' +
                startingTag(element));
            }
            newScopeDirective = directive;
          }

          if ((template = directive.html)) {
            template = jqLite(template.replace(CONTENT_REGEXP, element.html()));
            // replace the element with the new element
            element.replaceWith(template);
            templateAttrs.$element = element = template;
            templateNode = element[0];

            newTemplateAttrs = {$attr: {}};
            templateDirectives = collectDirectives(templateNode, newTemplateAttrs);
            mergeTemplateAttributes(templateAttrs, newTemplateAttrs);

            // take the remaining directives of old element and append them to the new directives
            templateDirectives.concat(directives.splice(i + 1));
            // resort the new directives
            templateDirectives.sort(byPriority);
            // splice the sorted new directives into the current directive list
            directives = directives.concat(templateDirectives);
            ii = directives.length;
          }

          if (terminalPriority > directive.priority) {
            break; // prevent further processing of directives
          }

          if (directive.compile) {
            linkingFns.push(directive.compile(element, templateAttrs));
          }
        } catch (e) {
          $exceptionHandler(e, startingTag(element));
        }
        
        if (directive.terminal) {
          linkFn.terminal = true;
          terminalPriority = Math.max(terminalPriority, directive.priority);
        }
      }
      linkFn.scope = !!newScopeDirective;
      
      return linkFn;
      
      ////////////////////

      
      function linkFn(childLinkingFn, scope, linkNode) {
        var attrs, element, ii = linkingFns.length, linkingFn, i;
        
        if (templateNode === linkNode) {
          attrs = templateAttrs;
        } else {
          attrs = shallowCopy(templateAttrs);
          attrs.$element = jqLite(linkNode);
        }
        element = attrs.$element;

        // PRELINKING
        for(i = 0; i < ii; i++) {
          linkingFn = linkingFns[i];
          if (linkingFn) {
            linkingFn = linkingFn.pre;
            if (linkingFn) {
              try {
                linkingFn(scope, element, attrs);
              } catch (e) {
                $exceptionHandler(e, startingTag(element));
              }
            }
          }
        }

        childLinkingFn && childLinkingFn(scope, linkNode.childNodes);

        // POSTLINKING
        for(i = 0; i < ii; i++) {
          linkingFn = linkingFns[i];
          if (typeof linkingFn == 'object') {
            linkingFn = linkingFn.post;
          }
          if (linkingFn) {
            try {
              linkingFn(scope, element, attrs);
            } catch (e) {
              $exceptionHandler(e, startingTag(element));
            }
          }
        }
        return scope;
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
            parent.data('$binding', bindings).addClass('ng-binding');
            scope.$watch(interpolateFn, function(scope, value) {
              node[0].nodeValue = value;
            });
          })
        });
      }
    }

         
    function addAttrInterpolateDirective(directives, value, name) {
      var interpolateFn = $interpolate(value, true);
      if (SIDE_EFFECT_ATTRS[name]) {
        name = SIDE_EFFECT_ATTRS[name];
        if (BOOLEAN_ATTR[name]) {
          value = true;
        }
      } else if (!interpolateFn) {
        // we are not a side-effect attr, and we have no side-effects -> ignore
        return;
      }
      directives.push({
        priority: 100,
        compile: function(element, attr) {
          if (interpolateFn) {
            return function(scope, element, attr) {
              scope.$watch(interpolateFn, function(scope, value){
                attr.$set(name, value);
              });
            };
          } else {
            attr.$set(name, value);
          }
        }
      });
    }

         
    function collectDirectives(node, attrs) {
      var nodeType = node.nodeType,
          directives = [],
          attrsMap = attrs.$attr,
          match,
          className;

      switch(nodeType) {
        case 1: /* Element */
          // use the node name: <directive>
          addDirective(directives, camelCase(nodeName_(node).toLowerCase()), 'E');

          // iterate over the attributes
          for (var attr, name, nName, value, nAttrs = node.attributes,
                   j = 0, jj = nAttrs && nAttrs.length; j < jj; j++) {
            attr = nAttrs[j];
            name = attr.name;
            nName = camelCase(name.toLowerCase());
            attrsMap[nName] = name;
            attrs[nName] = value = trim((msie && name == 'href')
                ? decodeURIComponent(node.getAttribute(name, 2))
                : attr.value);
            if (BOOLEAN_ATTR[nName]) {
              attrs[nName] = true; // presence means true
            }
            addAttrInterpolateDirective(directives, value, nName);
            addDirective(directives, nName, 'A');
          }

          // use class as directive
          className = node.className;
          while (match = CLASS_DIRECTIVE_REGEXP.exec(className)) {
            nName = camelCase(match[2]);
            if (addDirective(directives, nName, 'C')) {
              attrs[nName] = trim(match[3]);
            }
            className = className.substr(match.index + match[0].length);
          }
          break;
        case 3: /* Text Node */
          addTextInterpolateDirective(directives, node.nodeValue);
          break;
        case 8: /* Comment */
          match = COMMENT_DIRECTIVE_REGEXP.exec(node.nodeValue);
          if (match) {
            nName = camelCase(match[1]);
            if (addDirective(directives, nName, 'M')) {
              attrs[nName] = trim(match[2]);
            }
          }
          break;
      }

      return directives;
    }

         
    /**
     * Compile function matches the nodeList against the directives, and then executes the
     * directive template function.
     * @param nodeList
     * @returns {?function} A composite linking function of all of the matched directives or null.
     */
    function compileNodes(nodeList) {
      var linkingFns = [],
          directiveLinkingFn, childLinkingFn, directives, attrs, linkingFnFound;

      for(var i = 0, ii = nodeList.length; i < ii; i++) {
        attrs = {
          $attr: {},
          $normalize: camelCase,
          $set: attrSetter
        },
        directives = collectDirectives(nodeList[i], attrs);

        directiveLinkingFn = (directives.length)
            ? applyDirectivesToNode(directives, nodeList[i], attrs)
            : null;

        childLinkingFn = (directiveLinkingFn && directiveLinkingFn.terminal)
            ? null
            : compileNodes(nodeList[i].childNodes);

        linkingFns.push(directiveLinkingFn);
        linkingFns.push(childLinkingFn);
        linkingFnFound = (linkingFnFound || directiveLinkingFn || childLinkingFn);
      }

      // return a linking function if we have found anything, null otherwise
      return linkingFnFound ? linkingFn : null;

      function linkingFn(scope, nodeList, rootElement) {
        if (linkingFns.length != nodeList.length * 2) {
          throw Error('Template changed structure!');
        }
        for(var childLinkingFn, directiveLinkingFn, node,
                i=0, n=0, ii=linkingFns.length; i<ii; n++) {
          node = nodeList[n];
          directiveLinkingFn = linkingFns[i++];
          childLinkingFn = linkingFns[i++];

          if (directiveLinkingFn) {
            if (directiveLinkingFn.scope && !rootElement) {
              jqLite(node).data('$scope', scope = scope.$new());
            }
            directiveLinkingFn(childLinkingFn, scope, node);
          } else if (childLinkingFn) {
            childLinkingFn(scope, node.childNodes);
          }
        }
      }
    }
  }];

  // =============================

  /**
   * Set a normalized attribute on the element in a way such that all directives
   * can share the attribute. This function properly handles boolean attributes.
   * @param {string} key Normalized key. (ie ngAttribute)
   * @param {string|boolean} value The value to set. If `null` attribute will be deleted.
   * @param {string=} attrName Optional none normalized name. Defaults to key.
   */
  function attrSetter(key, value, attrName) {
    var booleanKey = BOOLEAN_ATTR[key.toLowerCase()];
    
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
  }
}
