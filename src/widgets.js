'use strict';

/**
 * @ngdoc overview
 * @name angular.widget
 * @description
 *
 * An angular widget can be either a custom attribute that modifies an existing DOM element or an
 * entirely new DOM element.
 *
 * During html compilation, widgets are processed after {@link angular.markup markup}, but before
 * {@link angular.directive directives}.
 *
 * Following is the list of built-in angular widgets:
 *
 * * {@link angular.widget.@ng:non-bindable ng:non-bindable} - Blocks angular from processing an
 *   HTML element.
 * * {@link angular.widget.@ng:repeat ng:repeat} - Creates and manages a collection of cloned HTML
 *   elements.
 * * {@link angular.inputType HTML input elements} - Standard HTML input elements data-bound by
 *   angular.
 * * {@link angular.widget.ng:view ng:view} - Works with $route to "include" partial templates
 * * {@link angular.widget.ng:switch ng:switch} - Conditionally changes DOM structure
 * * {@link angular.widget.ng:include ng:include} - Includes an external HTML fragment
 *
 * For more information about angular widgets, see {@link guide/dev_guide.compiler.widgets
 * Understanding Angular Widgets} in the angular Developer Guide.
 */

/**
 * @ngdoc widget
 * @name angular.widget.ng:include
 *
 * @description
 * Fetches, compiles and includes an external HTML fragment.
 *
 * Keep in mind that Same Origin Policy applies to included resources
 * (e.g. ng:include won't work for file:// access).
 *
 * @param {string} src angular expression evaluating to URL. If the source is a string constant,
 *                 make sure you wrap it in quotes, e.g. `src="'myPartialTemplate.html'"`.
 * @param {Scope=} [scope=new_child_scope] optional expression which evaluates to an
 *                 instance of angular.module.ng.$rootScope.Scope to set the HTML fragment to.
 * @param {string=} onload Expression to evaluate when a new partial is loaded.
 *
 * @param {string=} autoscroll Whether `ng:include` should call {@link angular.module.ng.$anchorScroll
 *                  $anchorScroll} to scroll the viewport after the content is loaded.
 *
 *                  - If the attribute is not set, disable scrolling.
 *                  - If the attribute is set without value, enable scrolling.
 *                  - Otherwise enable scrolling only if the expression evaluates to truthy value.
 *
 * @example
    <doc:example>
      <doc:source jsfiddle="false">
       <script>
         function Ctrl($scope) {
           $scope.templates =
             [ { name: 'template1.html', url: 'examples/ng-include/template1.html'}
             , { name: 'template2.html', url: 'examples/ng-include/template2.html'} ];
           $scope.template = $scope.templates[0];
         }
       </script>
       <div ng:controller="Ctrl">
         <select ng:model="template" ng:options="t.name for t in templates">
          <option value="">(blank)</option>
         </select>
         url of the template: <tt><a href="{{template.url}}">{{template.url}}</a></tt>
         <hr/>
         <div class="ng-include" src="template.url"></div>
       </div>
      </doc:source>
      <doc:scenario>
        it('should load template1.html', function() {
         expect(element('.doc-example-live .ng-include').text()).
           toBe('Content of template1.html\n');
        });
        it('should load template2.html', function() {
         select('template').option('1');
         expect(element('.doc-example-live .ng-include').text()).
           toBe('Content of template2.html\n');
        });
        it('should change to blank', function() {
         select('template').option('');
         expect(element('.doc-example-live .ng-include').text()).toEqual('');
        });
      </doc:scenario>
    </doc:example>
 */
var ngIncludeDirective = ['$http', '$templateCache', '$anchorScroll', '$compile',
                  function($http,   $templateCache,   $anchorScroll,   $compile) {
  return {
    compile: function(element, attr) {
      var srcExp = attr.src,
          scopeExp = attr.scope || '',
          onloadExp = attr.onload || '', //workaround for jquery bug #7537
          autoScrollExp = attr.autoscroll;
      if (!element[0]['ng:compiled']) {
        element[0]['ng:compiled'] = true;
        return function(scope, element, attr){
          var changeCounter = 0,
              childScope;

          function incrementChange() { changeCounter++;}
          scope.$watch(srcExp, incrementChange);
          scope.$watch(function() {
            var includeScope = scope.$eval(scopeExp);
            if (includeScope) return includeScope.$id;
          }, incrementChange);
          scope.$watch(function() {return changeCounter;}, function(newChangeCounter) {
             var src = scope.$eval(srcExp),
                 useScope = scope.$eval(scopeExp);

            function clearContent() {
              // if this callback is still desired
              if (newChangeCounter === changeCounter) {
                if (childScope) childScope.$destroy();
                childScope = null;
                element.html('');
              }
            }

             if (src) {
               $http.get(src, {cache: $templateCache}).success(function(response) {
                 // if this callback is still desired
                 if (newChangeCounter === changeCounter) {
                   element.html(response);
                   if (childScope) childScope.$destroy();
                   childScope = useScope ? useScope : scope.$new();
                   $compile(element)(childScope);
                   if (isDefined(autoScrollExp) && (!autoScrollExp || scope.$eval(autoScrollExp))) {
                     $anchorScroll();
                   }
                   scope.$eval(onloadExp);
                 }
               }).error(clearContent);
             } else {
               clearContent();
             }
          });
        };
      }
    }
  }
}];

/**
 * @ngdoc widget
 * @name angular.widget.ng:switch
 *
 * @description
 * Conditionally change the DOM structure.
 *
 * @usageContent
 * <any ng:switch-when="matchValue1">...</any>
 *   <any ng:switch-when="matchValue2">...</any>
 *   ...
 *   <any ng:switch-default>...</any>
 *
 * @param {*} on expression to match against <tt>ng:switch-when</tt>.
 * @paramDescription
 * On child elments add:
 *
 * * `ng:switch-when`: the case statement to match against. If match then this
 *   case will be displayed.
 * * `ng:switch-default`: the default case when no other casses match.
 *
 * @example
    <doc:example>
      <doc:source>
        <script>
          function Ctrl($scope) {
            $scope.items = ['settings', 'home', 'other'];
            $scope.selection = $scope.items[0];
          }
        </script>
        <div ng:controller="Ctrl">
          <select ng:model="selection" ng:options="item for item in items">
          </select>
          <tt>selection={{selection}}</tt>
          <hr/>
          <ng:switch on="selection" >
            <div ng:switch-when="settings">Settings Div</div>
            <span ng:switch-when="home">Home Span</span>
            <span ng:switch-default>default</span>
          </ng:switch>
        </div>
      </doc:source>
      <doc:scenario>
        it('should start in settings', function() {
         expect(element('.doc-example-live ng\\:switch').text()).toEqual('Settings Div');
        });
        it('should change to home', function() {
         select('selection').option('home');
         expect(element('.doc-example-live ng\\:switch').text()).toEqual('Home Span');
        });
        it('should select deafault', function() {
         select('selection').option('other');
         expect(element('.doc-example-live ng\\:switch').text()).toEqual('default');
        });
      </doc:scenario>
    </doc:example>
 */
var ngSwitchDirective = ['$compile', function($compile){
  return {
    compile: function(element, attr) {
      var watchExpr = attr.on,
        changeExpr = attr.change,
        casesTemplate = {},
        defaultCaseTemplate,
        children = element.children(),
        length = children.length,
        child,
        when;

      if (!watchExpr) throw new Error("Missing 'on' attribute.");
      while(length--) {
        child = jqLite(children[length]);
        // this needs to be here for IE
        child.remove();
        // TODO(misko): this attr reading is not normilized
        when = child.attr('ng:switch-when');
        if (isString(when)) {
          casesTemplate[when] = $compile(child);
          // TODO(misko): this attr reading is not normilized
        } else if (isString(child.attr('ng:switch-default'))) {
          defaultCaseTemplate = $compile(child);
        }
      }
      children = null; // release memory;
      element.html('');

      return function(scope, element, attr){
        var changeCounter = 0;
        var childScope;
        var selectedTemplate;

        scope.$watch(watchExpr, function(value) {
          element.html('');
          if ((selectedTemplate = casesTemplate[value] || defaultCaseTemplate)) {
            changeCounter++;
            if (childScope) childScope.$destroy();
            childScope = scope.$new();
            childScope.$eval(changeExpr);
          }
        });

        scope.$watch(function() {return changeCounter;}, function() {
          element.html('');
          if (selectedTemplate) {
            selectedTemplate(childScope, function(caseElement) {
              element.append(caseElement);
            });
          }
        });
      };
    }
  };
}];


/*
 * Modifies the default behavior of html A tag, so that the default action is prevented when href
 * attribute is empty.
 *
 * The reasoning for this change is to allow easy creation of action links with ng:click without
 * changing the location or causing page reloads, e.g.:
 * <a href="" ng:click="model.$save()">Save</a>
 */
var htmlAnchorDirective = valueFn({
  restrict: 'E',
  compile: function(element, attr) {
    // turn <a href ng:click="..">link</a> into a link in IE
    // but only if it doesn't have name attribute, in which case it's an anchor
    if (!attr.href) {
      attr.$set('href', '');
    }

    return function(scope, element) {
      element.bind('click', function(event){
        // if we have no href url, then don't navigate anywhere.
        if (!element.attr('href')) {
          event.preventDefault();
        }
      });
    }
  }
});


/**
 * @ngdoc widget
 * @name angular.widget.@ng:repeat
 *
 * @description
 * The `ng:repeat` widget instantiates a template once per item from a collection. Each template
 * instance gets its own scope, where the given loop variable is set to the current collection item,
 * and `$index` is set to the item index or key.
 *
 * Special properties are exposed on the local scope of each template instance, including:
 *
 *   * `$index` – `{number}` – iterator offset of the repeated element (0..length-1)
 *   * `$position` – `{string}` – position of the repeated element in the iterator. One of:
 *        * `'first'`,
 *        * `'middle'`
 *        * `'last'`
 *
 * Note: Although `ng:repeat` looks like a directive, it is actually an attribute widget.
 *
 * @element ANY
 * @param {string} repeat_expression The expression indicating how to enumerate a collection. Two
 *   formats are currently supported:
 *
 *   * `variable in expression` – where variable is the user defined loop variable and `expression`
 *     is a scope expression giving the collection to enumerate.
 *
 *     For example: `track in cd.tracks`.
 *
 *   * `(key, value) in expression` – where `key` and `value` can be any user defined identifiers,
 *     and `expression` is the scope expression giving the collection to enumerate.
 *
 *     For example: `(name, age) in {'adam':10, 'amalie':12}`.
 *
 * @example
 * This example initializes the scope to a list of names and
 * then uses `ng:repeat` to display every person:
    <doc:example>
      <doc:source>
        <div ng:init="friends = [{name:'John', age:25}, {name:'Mary', age:28}]">
          I have {{friends.length}} friends. They are:
          <ul>
            <li ng:repeat="friend in friends">
              [{{$index + 1}}] {{friend.name}} who is {{friend.age}} years old.
            </li>
          </ul>
        </div>
      </doc:source>
      <doc:scenario>
         it('should check ng:repeat', function() {
           var r = using('.doc-example-live').repeater('ul li');
           expect(r.count()).toBe(2);
           expect(r.row(0)).toEqual(["1","John","25"]);
           expect(r.row(1)).toEqual(["2","Mary","28"]);
         });
      </doc:scenario>
    </doc:example>
 */
var ngRepeatDirective = ['$compile', function($compile) {
  return {
    priority: 1000,
    terminal: true,
    compile: function(element, attr) {
      var expression = attr.ngRepeat;
      attr.$set(attr.$attr.ngRepeat);
      element.replaceWith(jqLite('<!-- ng:repeat: ' + expression + ' -->'));
      var linker = $compile(element);
      return function(scope, iterStartElement, attr){
        var match = expression.match(/^\s*(.+)\s+in\s+(.*)\s*$/),
          lhs, rhs, valueIdent, keyIdent;
        if (! match) {
          throw Error("Expected ng:repeat in form of '_item_ in _collection_' but got '" +
            expression + "'.");
        }
        lhs = match[1];
        rhs = match[2];
        match = lhs.match(/^([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\)$/);
        if (!match) {
          throw Error("'item' in 'item in collection' should be identifier or (key, value) but got '" +
            keyValue + "'.");
        }
        valueIdent = match[3] || match[1];
        keyIdent = match[2];

        // Store a list of elements from previous run. This is a hash where key is the item from the
        // iterator, and the value is an array of objects with following properties.
        //   - scope: bound scope
        //   - element: previous element.
        //   - index: position
        // We need an array of these objects since the same object can be returned from the iterator.
        // We expect this to be a rare case.
        var lastOrder = new HashQueueMap();
        scope.$watch(function(scope){
          var index, length,
              collection = scope.$eval(rhs),
              collectionLength = size(collection, true),
              childScope,
              // Same as lastOrder but it has the current state. It will become the
              // lastOrder on the next iteration.
              nextOrder = new HashQueueMap(),
              key, value, // key/value of iteration
              array, last,       // last object information {scope, element, index}
              cursor = iterStartElement;     // current position of the node

          if (!isArray(collection)) {
            // if object, extract keys, sort them and use to determine order of iteration over obj props
            array = [];
            for(key in collection) {
              if (collection.hasOwnProperty(key) && key.charAt(0) != '$') {
                array.push(key);
              }
            }
            array.sort();
          } else {
            array = collection || [];
          }

          // we are not using forEach for perf reasons (trying to avoid #call)
          for (index = 0, length = array.length; index < length; index++) {
            key = (collection === array) ? index : array[index];
            value = collection[key];
            last = lastOrder.shift(value);
            if (last) {
              // if we have already seen this object, then we need to reuse the
              // associated scope/element
              childScope = last.scope;
              nextOrder.push(value, last);

              if (index === last.index) {
                // do nothing
                cursor = last.element;
              } else {
                // existing item which got moved
                last.index = index;
                // This may be a noop, if the element is next, but I don't know of a good way to
                // figure this out,  since it would require extra DOM access, so let's just hope that
                // the browsers realizes that it is noop, and treats it as such.
                cursor.after(last.element);
                cursor = last.element;
              }
            } else {
              // new item which we don't know about
              childScope = scope.$new();
            }

            childScope[valueIdent] = value;
            if (keyIdent) childScope[keyIdent] = key;
            childScope.$index = index;
            childScope.$position = index === 0 ?
                'first' :
                (index == collectionLength - 1 ? 'last' : 'middle');

            if (!last) {
              linker(childScope, function(clone){
                cursor.after(clone);
                last = {
                    scope: childScope,
                    element: (cursor = clone),
                    index: index
                  };
                nextOrder.push(value, last);
              });
            }
          }

          //shrink children
          for (key in lastOrder) {
            if (lastOrder.hasOwnProperty(key)) {
              array = lastOrder[key];
              while(array.length) {
                value = array.pop();
                value.element.remove();
                value.scope.$destroy();
              }
            }
          }

          lastOrder = nextOrder;
        });
      };
    }
  };
}];


/**
 * @ngdoc widget
 * @name angular.widget.@ng:non-bindable
 *
 * @description
 * Sometimes it is necessary to write code which looks like bindings but which should be left alone
 * by angular. Use `ng:non-bindable` to make angular ignore a chunk of HTML.
 *
 * Note: `ng:non-bindable` looks like a directive, but is actually an attribute widget.
 *
 * @element ANY
 *
 * @example
 * In this example there are two location where a simple binding (`{{}}`) is present, but the one
 * wrapped in `ng:non-bindable` is left alone.
 *
 * @example
    <doc:example>
      <doc:source>
        <div>Normal: {{1 + 2}}</div>
        <div ng:non-bindable>Ignored: {{1 + 2}}</div>
      </doc:source>
      <doc:scenario>
       it('should check ng:non-bindable', function() {
         expect(using('.doc-example-live').binding('1 + 2')).toBe('3');
         expect(using('.doc-example-live').element('div:last').text()).
           toMatch(/1 \+ 2/);
       });
      </doc:scenario>
    </doc:example>
 */
var ngNonBindableDirective = valueFn({ terminal: true });


/**
 * @ngdoc widget
 * @name angular.widget.ng:view
 *
 * @description
 * # Overview
 * `ng:view` is a widget that complements the {@link angular.module.ng.$route $route} service by
 * including the rendered template of the current route into the main layout (`index.html`) file.
 * Every time the current route changes, the included view changes with it according to the
 * configuration of the `$route` service.
 *
 * This widget provides functionality similar to {@link angular.widget.ng:include ng:include} when
 * used like this:
 *
 *     <ng:include src="$route.current.template" scope="$route.current.scope"></ng:include>
 *
 *
 * # Advantages
 * Compared to `ng:include`, `ng:view` offers these advantages:
 *
 * - shorter syntax
 * - more efficient execution
 * - doesn't require `$route` service to be available on the root scope
 *
 *
 * @example
    <doc:example>
      <doc:source jsfiddle="false">
         <script>
           function MyCtrl($route) {
             $route.when('/overview',
               { controller: OverviewCtrl,
                 template: 'partials/guide/dev_guide.overview.html'});
             $route.when('/bootstrap',
               { controller: BootstrapCtrl,
                 template: 'partials/guide/dev_guide.bootstrap.auto_bootstrap.html'});
           };
           MyCtrl.$inject = ['$route'];

           function BootstrapCtrl() {}
           function OverviewCtrl() {}
         </script>
         <div ng:controller="MyCtrl">
           <a href="overview">overview</a> |
           <a href="bootstrap">bootstrap</a> |
           <a href="undefined">undefined</a>

           <br/>

           The view is included below:
           <hr/>
           <ng:view></ng:view>
         </div>
      </doc:source>
      <doc:scenario>
        it('should load templates', function() {
          element('.doc-example-live a:contains(overview)').click();
          expect(element('.doc-example-live ng\\:view').text()).toMatch(/Developer Guide: Overview/);

          element('.doc-example-live a:contains(bootstrap)').click();
          expect(element('.doc-example-live ng\\:view').text()).toMatch(/Developer Guide: Initializing Angular: Automatic Initialization/);
        });
      </doc:scenario>
    </doc:example>
 */
var ngViewDirective = ['$http', '$templateCache', '$route', '$anchorScroll', '$compile',
               function($http,   $templateCache,   $route,   $anchorScroll,   $compile) {
  return {
    compile: function(element, attr) {
      if (!element[0]['ng:compiled']) {
        element[0]['ng:compiled'] = true;

        return function(scope, element, attrs) {
          var changeCounter = 0;

          scope.$on('$afterRouteChange', function() {
            changeCounter++;
          });

          scope.$watch(function() {return changeCounter;}, function(newChangeCounter) {
            var template = $route.current && $route.current.template;

            function clearContent() {
              // ignore callback if another route change occured since
              if (newChangeCounter == changeCounter) {
                element.html('');
              }
            }

            if (template) {
              $http.get(template, {cache: $templateCache}).success(function(response) {
                // ignore callback if another route change occured since
                if (newChangeCounter == changeCounter) {
                  element.html(response);
                  $compile(element)($route.current.scope);
                  $anchorScroll();
                }
              }).error(clearContent);
            } else {
              clearContent();
            }
          });
        };
      }
    }
  };
}];


/**
 * @ngdoc widget
 * @name angular.widget.ng:pluralize
 *
 * @description
 * # Overview
 * ng:pluralize is a widget that displays messages according to en-US localization rules.
 * These rules are bundled with angular.js and the rules can be overridden
 * (see {@link guide/dev_guide.i18n Angular i18n} dev guide). You configure ng:pluralize by
 * specifying the mappings between
 * {@link http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
 * plural categories} and the strings to be displayed.
 *
 * # Plural categories and explicit number rules
 * There are two
 * {@link http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
 * plural categories} in Angular's default en-US locale: "one" and "other".
 *
 * While a pural category may match many numbers (for example, in en-US locale, "other" can match
 * any number that is not 1), an explicit number rule can only match one number. For example, the
 * explicit number rule for "3" matches the number 3. You will see the use of plural categories
 * and explicit number rules throughout later parts of this documentation.
 *
 * # Configuring ng:pluralize
 * You configure ng:pluralize by providing 2 attributes: `count` and `when`.
 * You can also provide an optional attribute, `offset`.
 *
 * The value of the `count` attribute can be either a string or an {@link guide/dev_guide.expressions
 * Angular expression}; these are evaluated on the current scope for its binded value.
 *
 * The `when` attribute specifies the mappings between plural categories and the actual
 * string to be displayed. The value of the attribute should be a JSON object so that Angular
 * can interpret it correctly.
 *
 * The following example shows how to configure ng:pluralize:
 *
 * <pre>
 * <ng:pluralize count="personCount"
                 when="{'0': 'Nobody is viewing.',
 *                      'one': '1 person is viewing.',
 *                      'other': '{} people are viewing.'}">
 * </ng:pluralize>
 *</pre>
 *
 * In the example, `"0: Nobody is viewing."` is an explicit number rule. If you did not
 * specify this rule, 0 would be matched to the "other" category and "0 people are viewing"
 * would be shown instead of "Nobody is viewing". You can specify an explicit number rule for
 * other numbers, for example 12, so that instead of showing "12 people are viewing", you can
 * show "a dozen people are viewing".
 *
 * You can use a set of closed braces(`{}`) as a placeholder for the number that you want substituted
 * into pluralized strings. In the previous example, Angular will replace `{}` with
 * <span ng:non-bindable>`{{personCount}}`</span>. The closed braces `{}` is a placeholder
 * for <span ng:non-bindable>{{numberExpression}}</span>.
 *
 * # Configuring ng:pluralize with offset
 * The `offset` attribute allows further customization of pluralized text, which can result in
 * a better user experience. For example, instead of the message "4 people are viewing this document",
 * you might display "John, Kate and 2 others are viewing this document".
 * The offset attribute allows you to offset a number by any desired value.
 * Let's take a look at an example:
 *
 * <pre>
 * <ng:pluralize count="personCount" offset=2
 *               when="{'0': 'Nobody is viewing.',
 *                      '1': '{{person1}} is viewing.',
 *                      '2': '{{person1}} and {{person2}} are viewing.',
 *                      'one': '{{person1}}, {{person2}} and one other person are viewing.',
 *                      'other': '{{person1}}, {{person2}} and {} other people are viewing.'}">
 * </ng:pluralize>
 * </pre>
 *
 * Notice that we are still using two plural categories(one, other), but we added
 * three explicit number rules 0, 1 and 2.
 * When one person, perhaps John, views the document, "John is viewing" will be shown.
 * When three people view the document, no explicit number rule is found, so
 * an offset of 2 is taken off 3, and Angular uses 1 to decide the plural category.
 * In this case, plural category 'one' is matched and "John, Marry and one other person are viewing"
 * is shown.
 *
 * Note that when you specify offsets, you must provide explicit number rules for
 * numbers from 0 up to and including the offset. If you use an offset of 3, for example,
 * you must provide explicit number rules for 0, 1, 2 and 3. You must also provide plural strings for
 * plural categories "one" and "other".
 *
 * @param {string|expression} count The variable to be bounded to.
 * @param {string} when The mapping between plural category to its correspoding strings.
 * @param {number=} offset Offset to deduct from the total number.
 *
 * @example
    <doc:example>
      <doc:source>
        <script>
          function Ctrl($scope) {
            $scope.person1 = 'Igor';
            $scope.person2 = 'Misko';
            $scope.personCount = 1;
          }
        </script>
        <div ng:controller="Ctrl">
          Person 1:<input type="text" ng:model="person1" value="Igor" /><br/>
          Person 2:<input type="text" ng:model="person2" value="Misko" /><br/>
          Number of People:<input type="text" ng:model="personCount" value="1" /><br/>

          <!--- Example with simple pluralization rules for en locale --->
          Without Offset:
          <ng-pluralize count="personCount"
                        when="{'0': 'Nobody is viewing.',
                               'one': '1 person is viewing.',
                               'other': '{} people are viewing.'}">
          </ng-pluralize><br>

          <!--- Example with offset --->
          With Offset(2):
          <ng-pluralize count="personCount" offset=2
                        when="{'0': 'Nobody is viewing.',
                               '1': '{{person1}} is viewing.',
                               '2': '{{person1}} and {{person2}} are viewing.',
                               'one': '{{person1}}, {{person2}} and one other person are viewing.',
                               'other': '{{person1}}, {{person2}} and {} other people are viewing.'}">
          </ng-pluralize>
        </div>
      </doc:source>
      <doc:scenario>
        it('should show correct pluralized string', function() {
          expect(element('.doc-example-live ng-pluralize:first').text()).
                                             toBe('1 person is viewing.');
          expect(element('.doc-example-live ng-pluralize:last').text()).
                                                toBe('Igor is viewing.');

          using('.doc-example-live').input('personCount').enter('0');
          expect(element('.doc-example-live ng-pluralize:first').text()).
                                               toBe('Nobody is viewing.');
          expect(element('.doc-example-live ng-pluralize:last').text()).
                                              toBe('Nobody is viewing.');

          using('.doc-example-live').input('personCount').enter('2');
          expect(element('.doc-example-live ng-pluralize:first').text()).
                                            toBe('2 people are viewing.');
          expect(element('.doc-example-live ng-pluralize:last').text()).
                              toBe('Igor and Misko are viewing.');

          using('.doc-example-live').input('personCount').enter('3');
          expect(element('.doc-example-live ng-pluralize:first').text()).
                                            toBe('3 people are viewing.');
          expect(element('.doc-example-live ng-pluralize:last').text()).
                              toBe('Igor, Misko and one other person are viewing.');

          using('.doc-example-live').input('personCount').enter('4');
          expect(element('.doc-example-live ng-pluralize:first').text()).
                                            toBe('4 people are viewing.');
          expect(element('.doc-example-live ng-pluralize:last').text()).
                              toBe('Igor, Misko and 2 other people are viewing.');
        });

        it('should show data-binded names', function() {
          using('.doc-example-live').input('personCount').enter('4');
          expect(element('.doc-example-live ng-pluralize:last').text()).
              toBe('Igor, Misko and 2 other people are viewing.');

          using('.doc-example-live').input('person1').enter('Di');
          using('.doc-example-live').input('person2').enter('Vojta');
          expect(element('.doc-example-live ng-pluralize:last').text()).
              toBe('Di, Vojta and 2 other people are viewing.');
        });
      </doc:scenario>
    </doc:example>
 */
var ngPluralizeDirective = ['$locale', '$interpolate', function($locale, $interpolate) {
  var BRACE = /{}/g;
  return function(scope, element, attr) {
    var numberExp = attr.count,
        whenExp = attr.when,
        offset = attr.offset || 0,
        whens = scope.$eval(whenExp),
        whensExpFns = {};

    forEach(whens, function(expression, key) {
      whensExpFns[key] =
        $interpolate(expression.replace(BRACE, '{{' + numberExp + '-' + offset + '}}'));
    });

    scope.$watch(function() {
      var value = parseFloat(scope.$eval(numberExp));

      if (!isNaN(value)) {
        //if explicit number rule such as 1, 2, 3... is defined, just use it. Otherwise,
        //check it against pluralization rules in $locale service
        if (!whens[value]) value = $locale.pluralCat(value - offset);
         return whensExpFns[value](scope, element, true);
      } else {
        return '';
      }
    }, function(newVal) {
      element.text(newVal);
    });
  };
}];


var scriptTemplateLoader = ['$templateCache', function($templateCache) {
  return {
    compile: function(element, attr) {
      if (attr.type == 'text/ng-template') {
        var templateUrl = attr.id;
        $templateCache.put(templateUrl, element.text());
      }
    }
  };
}];
