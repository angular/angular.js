'use strict';

/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng:init
 *
 * @description
 * The `ng:init` attribute specifies initialization tasks to be executed
 *  before the template enters execution mode during bootstrap.
 *
 * @element ANY
 * @param {expression} expression {@link guide/dev_guide.expressions Expression} to eval.
 *
 * @example
   <doc:example>
     <doc:source>
    <div ng:init="greeting='Hello'; person='World'">
      {{greeting}} {{person}}!
    </div>
     </doc:source>
     <doc:scenario>
       it('should check greeting', function() {
         expect(binding('greeting')).toBe('Hello');
         expect(binding('person')).toBe('World');
       });
     </doc:scenario>
   </doc:example>
 */
var ngInitDirective = valueFn({
  compile: function() {
    return {
      pre: function(scope, element, attrs) {
        scope.$eval(attrs.ngInit);
      }
    }
  }
});

/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng:controller
 *
 * @description
 * The `ng:controller` directive assigns behavior to a scope. This is a key aspect of how angular
 * supports the principles behind the Model-View-Controller design pattern.
 *
 * MVC components in angular:
 *
 * * Model — The Model is data in scope properties; scopes are attached to the DOM.
 * * View — The template (HTML with data bindings) is rendered into the View.
 * * Controller — The `ng:controller` directive specifies a Controller class; the class has
 *   methods that typically express the business logic behind the application.
 *
 * Note that an alternative way to define controllers is via the `{@link angular.module.ng.$route}`
 * service.
 *
 * @element ANY
 * @param {expression} expression Name of a globally accessible constructor function or an
 *     {@link guide/dev_guide.expressions expression} that on the current scope evaluates to a
 *     constructor function.
 *
 * @example
 * Here is a simple form for editing user contact information. Adding, removing, clearing, and
 * greeting are methods declared on the controller (see source tab). These methods can
 * easily be called from the angular markup. Notice that the scope becomes the `this` for the
 * controller's instance. This allows for easy access to the view data from the controller. Also
 * notice that any changes to the data are automatically reflected in the View without the need
 * for a manual update.
   <doc:example>
     <doc:source>
      <script type="text/javascript">
        function SettingsController($scope) {
          $scope.name = "John Smith";
          $scope.contacts = [
            {type:'phone', value:'408 555 1212'},
            {type:'email', value:'john.smith@example.org'} ];

          $scope.greet = function() {
           alert(this.name);
          };

          $scope.addContact = function() {
           this.contacts.push({type:'email', value:'yourname@example.org'});
          };

          $scope.removeContact = function(contactToRemove) {
           var index = this.contacts.indexOf(contactToRemove);
           this.contacts.splice(index, 1);
          };

          $scope.clearContact = function(contact) {
           contact.type = 'phone';
           contact.value = '';
          };
        }
      </script>
      <div ng:controller="SettingsController">
        Name: <input type="text" ng:model="name"/>
        [ <a href="" ng:click="greet()">greet</a> ]<br/>
        Contact:
        <ul>
          <li ng:repeat="contact in contacts">
            <select ng:model="contact.type">
               <option>phone</option>
               <option>email</option>
            </select>
            <input type="text" ng:model="contact.value"/>
            [ <a href="" ng:click="clearContact(contact)">clear</a>
            | <a href="" ng:click="removeContact(contact)">X</a> ]
          </li>
          <li>[ <a href="" ng:click="addContact()">add</a> ]</li>
       </ul>
      </div>
     </doc:source>
     <doc:scenario>
       it('should check controller', function() {
         expect(element('.doc-example-live div>:input').val()).toBe('John Smith');
         expect(element('.doc-example-live li:nth-child(1) input').val())
           .toBe('408 555 1212');
         expect(element('.doc-example-live li:nth-child(2) input').val())
           .toBe('john.smith@example.org');

         element('.doc-example-live li:first a:contains("clear")').click();
         expect(element('.doc-example-live li:first input').val()).toBe('');

         element('.doc-example-live li:last a:contains("add")').click();
         expect(element('.doc-example-live li:nth-child(3) input').val())
           .toBe('yourname@example.org');
       });
     </doc:scenario>
   </doc:example>
 */
var ngControllerDirective = ['$controller', '$window', function($controller, $window) {
  return {
    scope: true,
    compile: function() {
      return {
        pre: function(scope, element, attr) {
          var expression = attr.ngController,
              Controller = getter(scope, expression, true) || getter($window, expression, true);

          assertArgFn(Controller, expression);
          $controller(Controller, scope);
        }
      };
    }
  }
}];



/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng:bind
 *
 * @description
 * The `ng:bind` attribute tells Angular to replace the text content of the specified HTML element
 * with the value of a given expression, and to update the text content when the value of that
 * expression changes.
 *
 * Typically, you don't use `ng:bind` directly, but instead you use the double curly markup like
 * `{{ expression }}` and let the Angular compiler transform it to
 * `<span ng:bind="expression"></span>` when the template is compiled.
 *
 * @element ANY
 * @param {expression} expression {@link guide/dev_guide.expressions Expression} to evaluate.
 *
 * @example
 * Enter a name in the Live Preview text box; the greeting below the text box changes instantly.
   <doc:example>
     <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.name = 'Whirled';
         }
       </script>
       <div ng:controller="Ctrl">
         Enter name: <input type="text" ng:model="name"> <br/>
         Hello <span ng:bind="name"></span>!
       </div>
     </doc:source>
     <doc:scenario>
       it('should check ng:bind', function() {
         expect(using('.doc-example-live').binding('name')).toBe('Whirled');
         using('.doc-example-live').input('name').enter('world');
         expect(using('.doc-example-live').binding('name')).toBe('world');
       });
     </doc:scenario>
   </doc:example>
 */
var ngBindDirective = valueFn(function(scope, element, attr) {
  element.addClass('ng-binding').data('$binding', attr.ngBind);
  scope.$watch(attr.ngBind, function(value) {
    element.text(value == undefined ? '' : value);
  });
});

var ngBindHtmlUnsafeDirective = valueFn(function(scope, element, attr) {
  element.addClass('ng-binding').data('$binding', attr.ngBindHtmlUnsafe);
  scope.$watch(attr.ngBindHtmlUnsafe, function(value) {
    element.html(value == undefined ? '' : value);
  });
});

var ngBindHtmlDirective = ['$sanitize', function($sanitize) {
  return function(scope, element, attr) {
    element.addClass('ng-binding').data('$binding', attr.ngBindHtml);
    scope.$watch(attr.ngBindHtml, function(value) {
      if (value = $sanitize(value)) {
        element.html(value);
      }
    });
  }
}];


/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng:bind-template
 *
 * @description
 * The `ng:bind-template` attribute specifies that the element
 * text should be replaced with the template in ng:bind-template.
 * Unlike ng:bind the ng:bind-template can contain multiple `{{` `}}`
 * expressions. (This is required since some HTML elements
 * can not have SPAN elements such as TITLE, or OPTION to name a few.)
 *
 * @element ANY
 * @param {string} template of form
 *   <tt>{{</tt> <tt>expression</tt> <tt>}}</tt> to eval.
 *
 * @example
 * Try it here: enter text in text box and watch the greeting change.
   <doc:example>
     <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.salutation = 'Hello';
           $scope.name = 'World';
         }
       </script>
       <div ng:controller="Ctrl">
        Salutation: <input type="text" ng:model="salutation"><br/>
        Name: <input type="text" ng:model="name"><br/>
        <pre ng:bind-template="{{salutation}} {{name}}!"></pre>
       </div>
     </doc:source>
     <doc:scenario>
       it('should check ng:bind', function() {
         expect(using('.doc-example-live').binding('salutation')).
           toBe('Hello');
         expect(using('.doc-example-live').binding('name')).
           toBe('World');
         using('.doc-example-live').input('salutation').enter('Greetings');
         using('.doc-example-live').input('name').enter('user');
         expect(using('.doc-example-live').binding('salutation')).
           toBe('Greetings');
         expect(using('.doc-example-live').binding('name')).
           toBe('user');
       });
     </doc:scenario>
   </doc:example>
 */
var ngBindTemplateDirective = ['$interpolate', function($interpolate) {
  return function(scope, element, attr) {
    var interpolateFn = $interpolate(attr.ngBindTemplate);
    element.addClass('ng-binding').data('$binding', interpolateFn);
    scope.$watch(interpolateFn, function(value) {
      element.text(value);
    });
  }
}];

/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng:bind-attr
 *
 * @description
 * The `ng:bind-attr` attribute specifies that a
 * {@link guide/dev_guide.templates.databinding databinding}  should be created between a particular
 * element attribute and a given expression. Unlike `ng:bind`, the `ng:bind-attr` contains one or
 * more JSON key value pairs; each pair specifies an attribute and the
 * {@link guide/dev_guide.expressions expression} to which it will be mapped.
 *
 * Instead of writing `ng:bind-attr` statements in your HTML, you can use double-curly markup to
 * specify an <tt ng:non-bindable>{{expression}}</tt> for the value of an attribute.
 * At compile time, the attribute is translated into an
 * `<span ng:bind-attr="{attr:expression}"></span>`.
 *
 * The following HTML snippet shows how to specify `ng:bind-attr`:
 * <pre>
 *   <a ng:bind-attr='{"href":"http://www.google.com/search?q={{query}}"}'>Google</a>
 * </pre>
 *
 * This is cumbersome, so as we mentioned using double-curly markup is a prefered way of creating
 * this binding:
 * <pre>
 *   <a href="http://www.google.com/search?q={{query}}">Google</a>
 * </pre>
 *
 * During compilation, the template with attribute markup gets translated to the ng:bind-attr form
 * mentioned above.
 *
 * _Note_: You might want to consider using {@link angular.module.ng.$compileProvider.directive.ng:href ng:href} instead of
 * `href` if the binding is present in the main application template (`index.html`) and you want to
 * make sure that a user is not capable of clicking on raw/uncompiled link.
 *
 *
 * @element ANY
 * @param {string} attribute_json one or more JSON key-value pairs representing
 *    the attributes to replace with expressions. Each key matches an attribute
 *    which needs to be replaced. Each value is a text template of
 *    the attribute with the embedded
 *    <tt ng:non-bindable>{{expression}}</tt>s. Any number of
 *    key-value pairs can be specified.
 *
 * @example
 * Enter a search string in the Live Preview text box and then click "Google". The search executes instantly.
   <doc:example>
     <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.query = 'AngularJS';
         }
       </script>
       <div ng:controller="Ctrl">
        Google for:
        <input type="text" ng:model="query"/>
        <a ng:bind-attr='{"href":"http://www.google.com/search?q={{query}}"}'>
          Google
        </a> (ng:bind-attr) |
        <a href="http://www.google.com/search?q={{query}}">Google</a>
        (curly binding in attribute val)
       </div>
     </doc:source>
     <doc:scenario>
       it('should check ng:bind-attr', function() {
         expect(using('.doc-example-live').element('a').attr('href')).
           toBe('http://www.google.com/search?q=AngularJS');
         using('.doc-example-live').input('query').enter('google');
         expect(using('.doc-example-live').element('a').attr('href')).
           toBe('http://www.google.com/search?q=google');
       });
     </doc:scenario>
   </doc:example>
 */

var ngBindAttrDirective = ['$interpolate', function($interpolate) {
  return function(scope, element, attr) {
    var lastValue = {};
    var interpolateFns = {};
    scope.$watch(function() {
      var values = scope.$eval(attr.ngBindAttr);
      for(var key in values) {
        var exp = values[key],
            fn = (interpolateFns[exp] ||
              (interpolateFns[values[key]] = $interpolate(exp))),
            value = fn(scope);
        if (lastValue[key] !== value) {
          attr.$set(key, lastValue[key] = value);
        }
      }
    });
  }
}];


/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng:click
 *
 * @description
 * The ng:click allows you to specify custom behavior when
 * element is clicked.
 *
 * @element ANY
 * @param {expression} expression {@link guide/dev_guide.expressions Expression} to evaluate upon
 * click.
 *
 * @example
   <doc:example>
     <doc:source>
      <button ng:click="count = count + 1" ng:init="count=0">
        Increment
      </button>
      count: {{count}}
     </doc:source>
     <doc:scenario>
       it('should check ng:click', function() {
         expect(binding('count')).toBe('0');
         element('.doc-example-live :button').click();
         expect(binding('count')).toBe('1');
       });
     </doc:scenario>
   </doc:example>
 */
/*
 * A directive that allows creation of custom onclick handlers that are defined as angular
 * expressions and are compiled and executed within the current scope.
 *
 * Events that are handled via these handler are always configured not to propagate further.
 *
 * TODO: maybe we should consider allowing users to control event propagation in the future.
 */
var ngEventDirectives = {};
forEach(
  'click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave'.split(' '),
  function(name) {
    var directiveName = directiveNormalize('ng-' + name);
    ngEventDirectives[directiveName] = valueFn(function(scope, element, attr) {
      element.bind(lowercase(name), function(event) {
        scope.$apply(attr[directiveName]);
        event.stopPropagation();
      });
    });
  }
);

/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng:dblclick
 *
 * @description
 * The ng:dblclick allows you to specify custom behavior on dblclick event.
 *
 * @element ANY
 * @param {expression} expression {@link guide/dev_guide.expressions Expression} to evaluate upon
 * dblclick.
 *
 * @example
 * See {@link angular.module.ng.$compileProvider.directive.ng:click ng:click}
 */


/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng:mousedown
 *
 * @description
 * The ng:mousedown allows you to specify custom behavior on mousedown event.
 *
 * @element ANY
 * @param {expression} expression {@link guide/dev_guide.expressions Expression} to evaluate upon
 * mousedown.
 *
 * @example
 * See {@link angular.module.ng.$compileProvider.directive.ng:click ng:click}
 */


/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng:mouseup
 *
 * @description
 * Specify custom behavior on mouseup event.
 *
 * @element ANY
 * @param {expression} expression {@link guide/dev_guide.expressions Expression} to evaluate upon
 * mouseup.
 *
 * @example
 * See {@link angular.module.ng.$compileProvider.directive.ng:click ng:click}
 */

/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng:mouseover
 *
 * @description
 * Specify custom behavior on mouseover event.
 *
 * @element ANY
 * @param {expression} expression {@link guide/dev_guide.expressions Expression} to evaluate upon
 * mouseover.
 *
 * @example
 * See {@link angular.module.ng.$compileProvider.directive.ng:click ng:click}
 */


/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng:mouseenter
 *
 * @description
 * Specify custom behavior on mouseenter event.
 *
 * @element ANY
 * @param {expression} expression {@link guide/dev_guide.expressions Expression} to evaluate upon
 * mouseenter.
 *
 * @example
 * See {@link angular.module.ng.$compileProvider.directive.ng:click ng:click}
 */


/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng:mouseleave
 *
 * @description
 * Specify custom behavior on mouseleave event.
 *
 * @element ANY
 * @param {expression} expression {@link guide/dev_guide.expressions Expression} to evaluate upon
 * mouseleave.
 *
 * @example
 * See {@link angular.module.ng.$compileProvider.directive.ng:click ng:click}
 */


/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng:mousemove
 *
 * @description
 * Specify custom behavior on mousemove event.
 *
 * @element ANY
 * @param {expression} expression {@link guide/dev_guide.expressions Expression} to evaluate upon
 * mousemove.
 *
 * @example
 * See {@link angular.module.ng.$compileProvider.directive.ng:click ng:click}
 */


/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng:submit
 *
 * @description
 * Enables binding angular expressions to onsubmit events.
 *
 * Additionally it prevents the default action (which for form means sending the request to the
 * server and reloading the current page).
 *
 * @element form
 * @param {expression} expression {@link guide/dev_guide.expressions Expression} to eval.
 *
 * @example
   <doc:example>
     <doc:source>
      <script>
        function Ctrl($scope) {
          $scope.list = [];
          $scope.text = 'hello';
          $scope.submit = function() {
            if (this.text) {
              this.list.push(this.text);
              this.text = '';
            }
          };
        }
      </script>
      <form ng:submit="submit()" ng:controller="Ctrl">
        Enter text and hit enter:
        <input type="text" ng:model="text" name="text" />
        <input type="submit" id="submit" value="Submit" />
        <pre>list={{list}}</pre>
      </form>
     </doc:source>
     <doc:scenario>
       it('should check ng:submit', function() {
         expect(binding('list')).toBe('[]');
         element('.doc-example-live #submit').click();
         expect(binding('list')).toBe('["hello"]');
         expect(input('text').val()).toBe('');
       });
       it('should ignore empty strings', function() {
         expect(binding('list')).toBe('[]');
         element('.doc-example-live #submit').click();
         element('.doc-example-live #submit').click();
         expect(binding('list')).toBe('["hello"]');
       });
     </doc:scenario>
   </doc:example>
 */
var ngSubmitDirective = valueFn(function(scope, element, attrs) {
  element.bind('submit', function() {
    scope.$apply(attrs.ngSubmit);
  });
});


function classDirective(name, selector) {
  name = 'ngClass' + name;
  return valueFn(function(scope, element, attr) {
    scope.$watch(attr[name], function(newVal, oldVal) {
      if (selector === true || scope.$index % 2 === selector) {
        if (oldVal && (newVal !== oldVal)) {
           if (isObject(oldVal) && !isArray(oldVal))
             oldVal = map(oldVal, function(v, k) { if (v) return k });
           element.removeClass(isArray(oldVal) ? oldVal.join(' ') : oldVal);
         }
         if (isObject(newVal) && !isArray(newVal))
            newVal = map(newVal, function(v, k) { if (v) return k });
         if (newVal) element.addClass(isArray(newVal) ? newVal.join(' ') : newVal);      }
    });
  });
}

/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng:class
 *
 * @description
 * The `ng:class` allows you to set CSS class on HTML element dynamically by databinding an
 * expression that represents all classes to be added.
 *
 * The directive won't add duplicate classes if a particular class was already set.
 *
 * When the expression changes, the previously added classes are removed and only then the classes
 * new classes are added.
 *
 * @element ANY
 * @param {expression} expression {@link guide/dev_guide.expressions Expression} to eval. The result
 *   of the evaluation can be a string representing space delimited class
 *   names, an array, or a map of class names to boolean values.
 *
 * @example
   <doc:example>
     <doc:source>
      <input type="button" value="set" ng:click="myVar='ng-input-indicator-wait'">
      <input type="button" value="clear" ng:click="myVar=''">
      <br>
      <span ng:class="myVar">Sample Text &nbsp;&nbsp;&nbsp;&nbsp;</span>
     </doc:source>
     <doc:scenario>
       it('should check ng:class', function() {
         expect(element('.doc-example-live span').prop('className')).not().
           toMatch(/ng-input-indicator-wait/);

         using('.doc-example-live').element(':button:first').click();

         expect(element('.doc-example-live span').prop('className')).
           toMatch(/ng-input-indicator-wait/);

         using('.doc-example-live').element(':button:last').click();

         expect(element('.doc-example-live span').prop('className')).not().
           toMatch(/ng-input-indicator-wait/);
       });
     </doc:scenario>
   </doc:example>
 */
var ngClassDirective = classDirective('', true);

/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng:class-odd
 *
 * @description
 * The `ng:class-odd` and `ng:class-even` works exactly as
 * {@link angular.module.ng.$compileProvider.directive.ng:class ng:class}, except it works in conjunction with `ng:repeat` and
 * takes affect only on odd (even) rows.
 *
 * This directive can be applied only within a scope of an
 * {@link angular.module.ng.$compileProvider.directive.ng:repeat ng:repeat}.
 *
 * @element ANY
 * @param {expression} expression {@link guide/dev_guide.expressions Expression} to eval. The result
 *   of the evaluation can be a string representing space delimited class names or an array.
 *
 * @example
   <doc:example>
     <doc:source>
        <ol ng:init="names=['John', 'Mary', 'Cate', 'Suz']">
          <li ng:repeat="name in names">
           <span ng:class-odd="'ng-format-negative'"
                 ng:class-even="'ng-input-indicator-wait'">
             {{name}} &nbsp; &nbsp; &nbsp;
           </span>
          </li>
        </ol>
     </doc:source>
     <doc:scenario>
       it('should check ng:class-odd and ng:class-even', function() {
         expect(element('.doc-example-live li:first span').prop('className')).
           toMatch(/ng-format-negative/);
         expect(element('.doc-example-live li:last span').prop('className')).
           toMatch(/ng-input-indicator-wait/);
       });
     </doc:scenario>
   </doc:example>
 */
var ngClassOddDirective = classDirective('Odd', 0);

/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng:class-even
 *
 * @description
 * The `ng:class-odd` and `ng:class-even` works exactly as
 * {@link angular.module.ng.$compileProvider.directive.ng:class ng:class}, except it works in conjunction with `ng:repeat` and
 * takes affect only on odd (even) rows.
 *
 * This directive can be applied only within a scope of an
 * {@link angular.module.ng.$compileProvider.directive.ng:repeat ng:repeat}.
 *
 * @element ANY
 * @param {expression} expression {@link guide/dev_guide.expressions Expression} to eval. The result
 *   of the evaluation can be a string representing space delimited class names or an array.
 *
 * @example
   <doc:example>
     <doc:source>
        <ol ng:init="names=['John', 'Mary', 'Cate', 'Suz']">
          <li ng:repeat="name in names">
           <span ng:class-odd="'odd'" ng:class-even="'even'">
             {{name}} &nbsp; &nbsp; &nbsp;
           </span>
          </li>
        </ol>
     </doc:source>
     <doc:scenario>
       it('should check ng:class-odd and ng:class-even', function() {
         expect(element('.doc-example-live li:first span').prop('className')).
           toMatch(/odd/);
         expect(element('.doc-example-live li:last span').prop('className')).
           toMatch(/even/);
       });
     </doc:scenario>
   </doc:example>
 */
var ngClassEvenDirective = classDirective('Even', 1);

/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng:show
 *
 * @description
 * The `ng:show` and `ng:hide` directives show or hide a portion of the DOM tree (HTML)
 * conditionally.
 *
 * @element ANY
 * @param {expression} expression If the {@link guide/dev_guide.expressions expression} is truthy
 *     then the element is shown or hidden respectively.
 *
 * @example
   <doc:example>
     <doc:source>
        Click me: <input type="checkbox" ng:model="checked"><br/>
        Show: <span ng:show="checked">I show up when your checkbox is checked.</span> <br/>
        Hide: <span ng:hide="checked">I hide when your checkbox is checked.</span>
     </doc:source>
     <doc:scenario>
       it('should check ng:show / ng:hide', function() {
         expect(element('.doc-example-live span:first:hidden').count()).toEqual(1);
         expect(element('.doc-example-live span:last:visible').count()).toEqual(1);

         input('checked').check();

         expect(element('.doc-example-live span:first:visible').count()).toEqual(1);
         expect(element('.doc-example-live span:last:hidden').count()).toEqual(1);
       });
     </doc:scenario>
   </doc:example>
 */
//TODO(misko): refactor to remove element from the DOM
var ngShowDirective = valueFn(function(scope, element, attr){
  scope.$watch(attr.ngShow, function(value){
    element.css('display', toBoolean(value) ? '' : 'none');
  });
});

/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng:hide
 *
 * @description
 * The `ng:hide` and `ng:show` directives hide or show a portion
 * of the HTML conditionally.
 *
 * @element ANY
 * @param {expression} expression If the {@link guide/dev_guide.expressions expression} truthy then
 *     the element is shown or hidden respectively.
 *
 * @example
   <doc:example>
     <doc:source>
        Click me: <input type="checkbox" ng:model="checked"><br/>
        Show: <span ng:show="checked">I show up when you checkbox is checked?</span> <br/>
        Hide: <span ng:hide="checked">I hide when you checkbox is checked?</span>
     </doc:source>
     <doc:scenario>
       it('should check ng:show / ng:hide', function() {
         expect(element('.doc-example-live span:first:hidden').count()).toEqual(1);
         expect(element('.doc-example-live span:last:visible').count()).toEqual(1);

         input('checked').check();

         expect(element('.doc-example-live span:first:visible').count()).toEqual(1);
         expect(element('.doc-example-live span:last:hidden').count()).toEqual(1);
       });
     </doc:scenario>
   </doc:example>
 */
//TODO(misko): refactor to remove element from the DOM
var ngHideDirective = valueFn(function(scope, element, attr){
  scope.$watch(attr.ngHide, function(value){
    element.css('display', toBoolean(value) ? 'none' : '');
  });
});

/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng:style
 *
 * @description
 * The ng:style allows you to set CSS style on an HTML element conditionally.
 *
 * @element ANY
 * @param {expression} expression {@link guide/dev_guide.expressions Expression} which evals to an
 *      object whose keys are CSS style names and values are corresponding values for those CSS
 *      keys.
 *
 * @example
   <doc:example>
     <doc:source>
        <input type="button" value="set" ng:click="myStyle={color:'red'}">
        <input type="button" value="clear" ng:click="myStyle={}">
        <br/>
        <span ng:style="myStyle">Sample Text</span>
        <pre>myStyle={{myStyle}}</pre>
     </doc:source>
     <doc:scenario>
       it('should check ng:style', function() {
         expect(element('.doc-example-live span').css('color')).toBe('rgb(0, 0, 0)');
         element('.doc-example-live :button[value=set]').click();
         expect(element('.doc-example-live span').css('color')).toBe('rgb(255, 0, 0)');
         element('.doc-example-live :button[value=clear]').click();
         expect(element('.doc-example-live span').css('color')).toBe('rgb(0, 0, 0)');
       });
     </doc:scenario>
   </doc:example>
 */
var ngStyleDirective = valueFn(function(scope, element, attr) {
  scope.$watch(attr.ngStyle, function(newStyles, oldStyles) {
    if (oldStyles && (newStyles !== oldStyles)) {
      forEach(oldStyles, function(val, style) { element.css(style, '');});
    }
    if (newStyles) element.css(newStyles);
  });
});


/**
 * @ngdoc directive
 * @name angular.module.ng.$compileProvider.directive.ng:cloak
 *
 * @description
 * The `ng:cloak` directive is used to prevent the Angular html template from being briefly
 * displayed by the browser in its raw (uncompiled) form while your application is loading. Use this
 * directive to avoid the undesirable flicker effect caused by the html template display.
 *
 * The directive can be applied to the `<body>` element, but typically a fine-grained application is
 * prefered in order to benefit from progressive rendering of the browser view.
 *
 * `ng:cloak` works in cooperation with a css rule that is embedded within `angular.js` and
 *  `angular.min.js` files. Following is the css rule:
 *
 * <pre>
 * [ng\:cloak], .ng-cloak {
 *   display: none;
 * }
 * </pre>
 *
 * When this css rule is loaded by the browser, all html elements (including their children) that
 * are tagged with the `ng:cloak` directive are hidden. When Angular comes across this directive
 * during the compilation of the template it deletes the `ng:cloak` element attribute, which
 * makes the compiled element visible.
 *
 * For the best result, `angular.js` script must be loaded in the head section of the html file;
 * alternatively, the css rule (above) must be included in the external stylesheet of the
 * application.
 *
 * Legacy browsers, like IE7, do not provide attribute selector support (added in CSS 2.1) so they
 * cannot match the `[ng\:cloak]` selector. To work around this limitation, you must add the css
 * class `ng-cloak` in addition to `ng:cloak` directive as shown in the example below.
 *
 * @element ANY
 *
 * @example
   <doc:example>
     <doc:source>
        <div id="template1" ng:cloak>{{ 'hello' }}</div>
        <div id="template2" ng:cloak class="ng-cloak">{{ 'hello IE7' }}</div>
     </doc:source>
     <doc:scenario>
       it('should remove the template directive and css class', function() {
         expect(element('.doc-example-live #template1').attr('ng:cloak')).
           not().toBeDefined();
         expect(element('.doc-example-live #template2').attr('ng:cloak')).
           not().toBeDefined();
       });
     </doc:scenario>
   </doc:example>
 *
 */
var ngCloakDirective = valueFn({
  compile: function(element, attr) {
    attr.$set(attr.$attr.ngCloak, undefined);
    element.removeClass('ng-cloak');
  }
});

function ngAttributeAliasDirective(propName, attrName) {
  ngAttributeAliasDirectives[directiveNormalize('ng-' + attrName)] = ['$interpolate', function($interpolate) {
    return function(scope, element, attr) {
      scope.$watch($interpolate(attr[directiveNormalize('ng-' + attrName)]), function(value) {
        attr.$set(attrName, value);
      });
    }
  }];
}
var ngAttributeAliasDirectives = {};
forEach(BOOLEAN_ATTR, ngAttributeAliasDirective);
ngAttributeAliasDirective(null, 'src');
