////////////////////////////////////

if (typeof document.getAttribute == $undefined)
  document.getAttribute = function() {};

/**
 * @workInProgress
 * @ngdoc function
 * @name angular.lowercase
 * @function
 *
 * @description Converts string to lowercase
 * @param {string} string String to be lowercased.
 * @returns {string} Lowercased string.
 */
var lowercase = function (string){ return isString(string) ? string.toLowerCase() : string; };


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.uppercase
 * @function
 *
 * @description Converts string to uppercase.
 * @param {string} string String to be uppercased.
 * @returns {string} Uppercased string.
 */
var uppercase = function (string){ return isString(string) ? string.toUpperCase() : string; };


var manualLowercase = function (s) {
  return isString(s) ? s.replace(/[A-Z]/g,
      function (ch) {return fromCharCode(ch.charCodeAt(0) | 32); }) : s;
};
var manualUppercase = function (s) {
  return isString(s) ? s.replace(/[a-z]/g,
      function (ch) {return fromCharCode(ch.charCodeAt(0) & ~32); }) : s;
};


// String#toLowerCase and String#toUpperCase don't produce correct results in browsers with Turkish
// locale, for this reason we need to detect this case and redefine lowercase/uppercase methods with
// correct but slower alternatives.
if ('i' !== 'I'.toLowerCase()) {
  lowercase = manualLowercase;
  uppercase = manualUppercase;
}

function fromCharCode(code) { return String.fromCharCode(code); }


var _undefined        = undefined,
    _null             = null,
    $$element         = '$element',
    $$update          = '$update',
    $$scope           = '$scope',
    $$validate        = '$validate',
    $angular          = 'angular',
    $array            = 'array',
    $boolean          = 'boolean',
    $console          = 'console',
    $date             = 'date',
    $display          = 'display',
    $element          = 'element',
    $function         = 'function',
    $length           = 'length',
    $name             = 'name',
    $none             = 'none',
    $noop             = 'noop',
    $null             = 'null',
    $number           = 'number',
    $object           = 'object',
    $string           = 'string',
    $value            = 'value',
    $selected         = 'selected',
    $undefined        = 'undefined',
    NG_EXCEPTION      = 'ng-exception',
    NG_VALIDATION_ERROR = 'ng-validation-error',
    NOOP              = 'noop',
    PRIORITY_FIRST    = -99999,
    PRIORITY_WATCH    = -1000,
    PRIORITY_LAST     =  99999,
    PRIORITY          = {'FIRST': PRIORITY_FIRST, 'LAST': PRIORITY_LAST, 'WATCH':PRIORITY_WATCH},
    Error             = window.Error,
    jQuery            = window['jQuery'] || window['$'], // weirdness to make IE happy
    _                 = window['_'],
    /** holds major version number for IE or NaN for real browsers */
    msie              = parseInt((/msie (\d+)/.exec(lowercase(navigator.userAgent)) || [])[1], 10),

    /**
     * @workInProgress
     * @ngdoc function
     * @name angular.element
     * @function
     *
     * @description
     * Wraps a raw DOM element or HTML string as [jQuery](http://jquery.com) element.
     * `angular.element` is either an alias for [jQuery](http://api.jquery.com/jQuery/) function if
     * jQuery is loaded or a function that wraps the element or string in angular's jQuery lite
     * implementation.
     *
     * Real jQuery always takes precedence if it was loaded before angular.
     *
     * Angular's jQuery lite implementation is a tiny API-compatible subset of jQuery which allows
     * angular to manipulate DOM.  The functions implemented are usually just the basic versions of
     * them and might not support arguments and invocation styles.
     *
     * NOTE: All element references in angular are always wrapped with jQuery (lite) and are never
     * raw DOM references.
     *
     * Angular's jQuery lite implements these functions:
     *
     * - [addClass()](http://api.jquery.com/addClass/)
     * - [after()](http://api.jquery.com/after/)
     * - [append()](http://api.jquery.com/append/)
     * - [attr()](http://api.jquery.com/attr/)
     * - [bind()](http://api.jquery.com/bind/)
     * - [children()](http://api.jquery.com/children/)
     * - [clone()](http://api.jquery.com/clone/)
     * - [css()](http://api.jquery.com/css/)
     * - [data()](http://api.jquery.com/data/)
     * - [hasClass()](http://api.jquery.com/hasClass/)
     * - [parent()](http://api.jquery.com/parent/)
     * - [remove()](http://api.jquery.com/remove/)
     * - [removeAttr()](http://api.jquery.com/removeAttr/)
     * - [removeClass()](http://api.jquery.com/removeClass/)
     * - [removeData()](http://api.jquery.com/removeData/)
     * - [replaceWith()](http://api.jquery.com/replaceWith/)
     * - [text()](http://api.jquery.com/text/)
     * - [trigger()](http://api.jquery.com/trigger/)
     *
     * @param {string|DOMElement} element HTML string or DOMElement to be wrapped into jQuery.
     * @returns {Object} jQuery object.
     */
    jqLite            = jQuery || jqLiteWrap,
    slice             = Array.prototype.slice,
    push              = Array.prototype.push,
    error             = window[$console] ? bind(window[$console], window[$console]['error'] || noop) : noop,

    /**
     * @workInProgress
     * @ngdoc overview
     * @name angular
     * @namespace The exported angular namespace.
     */
    angular           = window[$angular]    || (window[$angular] = {}),
    angularTextMarkup = extensionMap(angular, 'markup'),
    angularAttrMarkup = extensionMap(angular, 'attrMarkup'),
    /**
     * @workInProgress
     * @ngdoc overview
     * @name angular.directive
     * @namespace Namespace for all directives.
     *
     * @description
     * A directive is an HTML attribute that you can use in an existing HTML element type or in a
     * DOM element type that you create as {@link angular.widget}, to modify that element's
     * properties. You can use any number of directives per element.
     * 
     * For example, you can add the ng:bind directive as an attribute of an HTML span element, as in
     * `<span ng:bind="1+2"></span>`. How does this work? The compiler passes the attribute value
     * `1+2` to the ng:bind extension, which in turn tells the {@link angular.scope} to watch that
     * expression and report changes. On any change it sets the span text to the expression value.
     * 
     * Here's how to define {@link angular.directive.ng:bind ng:bind}:
     * <pre>
        angular.directive('ng:bind', function(expression, compiledElement) {
          var compiler = this;
          return function(linkElement) {
            var currentScope = this;
            currentScope.$watch(expression, function(value) {
              linkElement.text(value);
            });
          };
        });
     * </pre>
     * 
     * # Directive vs. Attribute Widget
     * Both [attribute widgets](#!angular.widget) and directives can compile a DOM element
     * attribute. So why have two different ways to do the same thing? The answer is that order
     * matters, but we have no control over the order in which attributes are read. To solve this
     * we apply attribute widget before the directive.
     * 
     * For example, consider this piece of HTML, which uses the directives `ng:repeat`, `ng:init`,
     * and `ng:bind`:
     * <pre>
        <ul ng:init="people=['mike', 'mary']">
          <li ng:repeat="person in people" ng:init="a=a+1" ng:bind="person"></li>
        </ul>
     * </pre>
     * 
     * Notice that the order of execution matters here. We need to execute
     * {@link angular.directive.ng:repeat ng:repeat} before we run the
     * {@link angular.directive.ng:init ng:init} and `ng:bind` on the `<li/>;`. This is because we
     * want to run the `ng:init="a=a+1` and `ng:bind="person"` once for each person in people. We
     * could not have used directive to create this template because attributes are read in an
     * unspecified order and there is no way of guaranteeing that the repeater attribute would
     * execute first. Using the `ng:repeat` attribute directive ensures that we can transform the
     * DOM element into a template.
     * 
     * Widgets run before directives. Widgets may manipulate the DOM whereas directives are not
     * expected to do so, and so they run last.
     */
    angularDirective  = extensionMap(angular, 'directive'),

    /**
     * @workInProgress
     * @ngdoc overview
     * @name angular.widget
     * @namespace Namespace for all widgets.
     * @description
     * # Overview
     * Widgets allow you to create DOM elements that the browser doesn't 
     * already understand. You create the widget in your namespace and 
     * assign it behavior. You can only bind one widget per DOM element 
     * (unlike directives, in which you can use any number per DOM 
     * element). Widgets are expected to manipulate the DOM tree by 
     * adding new elements whereas directives are expected to only modify
     * element properties.
     * 
     * Widgets come in two flavors: element and attribute.
     * 
     * # Element Widget
     * Let's say we would like to create a new element type in the 
     * namespace `my` that can watch an expression and alert() the user 
     * with each new value.
     * 
     * <pre>
     * &lt;my:watch exp="name"/&gt;
     * </pre>
     * 
     * You can implement `my:watch` like this:
     * <pre>
     * angular.widget('my:watch', function(compileElement) {
     *   var compiler = this;
     *   var exp = compileElement.attr('exp');
     *   return function(linkElement) {
     *     var currentScope = this;
     *     currentScope.$watch(exp, function(value){
     *       alert(value);
     *     }};
     *   };
     * });
     * </pre>
     * 
     * # Attribute Widget
     * Let's implement the same widget, but this time as an attribute 
     * that can be added to any existing DOM element.
     * <pre>
     * &lt;div my-watch="name"&gt;text&lt;/div&gt;
     * </pre>
     * You can implement `my:watch` attribute like this:
     * <pre>
     * angular.widget('@my:watch', function(expression, compileElement) {
     *   var compiler = this;
     *   return function(linkElement) {
     *     var currentScope = this;
     *     currentScope.$watch(expression, function(value){
     *       alert(value);
     *     });
     *   };
     * });
     * </pre>
     * 
     * @example
     * <script>
     *   angular.widget('my:time', function(compileElement){
     *     compileElement.css('display', 'block');
     *     return function(linkElement){
     *       function update(){
     *         linkElement.text('Current time is: ' + new Date());
     *         setTimeout(update, 1000);
     *       }
     *       update();
     *     };
     *   });
     * </script>
     * <my:time></my:time>
     */
    angularWidget     = extensionMap(angular, 'widget', lowercase),
    
    /**
     * @workInProgress
     * @ngdoc overview
     * @name angular.validator
     * @namespace Namespace for all filters.
     * @description
     * # Overview
     * Validators are a standard way to check the user input against a specific criteria. For 
     * example, you might need to check that an input field contains a well-formed phone number.
     * 
     * # Syntax
     * Attach a validator on user input widgets using the `ng:validate` attribute.
     * 
     * <doc:example>
     *   <doc:source>
     *     Change me: &lt;input type="text" name="number" ng:validate="integer" value="123"&gt;
     *   </doc:source>
     *   <doc:scenario>
     *     it('should validate the default number string', function() {
     *       expect(element('input[name=number]').attr('class')).
     *          not().toMatch(/ng-validation-error/);
     *     });
     *     it('should not validate "foo"', function() {
     *       input('number').enter('foo');
     *       expect(element('input[name=number]').attr('class')).
     *          toMatch(/ng-validation-error/);
     *     });
     *   </doc:scenario>
     * </doc:example>
     * 
     *
     * # Writing your own Validators
     * Writing your own validator is easy. To make a function available as a 
     * validator, just define the JavaScript function on the `angular.validator` 
     * object. <angular/> passes in the input to validate as the first argument 
     * to your function. Any additional validator arguments are passed in as 
     * additional arguments to your function.
     * 
     * You can use these variables in the function:
     *
     * * `this` — The current scope.
     * * `this.$element` — The DOM element containing the binding. This allows the filter to manipulate
     *   the DOM in addition to transforming the input.
     *   
     * In this example we have written a upsTrackingNo validator. 
     * It marks the input text "valid" only when the user enters a well-formed 
     * UPS tracking number.
     *
     * @css ng-validation-error
     *   When validation fails, this css class is applied to the binding, making its borders red by
     *   default.
     * 
     * @example
     * <script>
     *  angular.validator('upsTrackingNo', function(input, format) {
     *    var regexp = new RegExp("^" + format.replace(/9/g, '\\d') + "$");
     *    return input.match(regexp)?"":"The format must match " + format;
     *  });
     * </script>
     * <input type="text" name="trackNo" size="40"
     *       ng:validate="upsTrackingNo:'1Z 999 999 99 9999 999 9'" 
     *       value="1Z 123 456 78 9012 345 6"/>
     *
     * @scenario
     * it('should validate correct UPS tracking number', function() {
     *   expect(element('input[name=trackNo]').attr('class')).
     *      not().toMatch(/ng-validation-error/);
     * });
     *
     * it('should not validate in correct UPS tracking number', function() {
     *   input('trackNo').enter('foo');
     *   expect(element('input[name=trackNo]').attr('class')).
     *      toMatch(/ng-validation-error/);
     * });
     *
     */
    angularValidator  = extensionMap(angular, 'validator'),

    /**
     * @workInProgress
     * @ngdoc overview
     * @name angular.filter
     * @namespace Namespace for all filters.
     * @description
     * # Overview
     * Filters are a standard way to format your data for display to the user. For example, you
     * might have the number 1234.5678 and would like to display it as US currency: $1,234.57.
     * Filters allow you to do just that. In addition to transforming the data, filters also modify
     * the DOM. This allows the filters to for example apply css styles to the filtered output if
     * certain conditions were met.
     *
     *
     * # Standard Filters
     *
     * The Angular framework provides a standard set of filters for common operations, including:
     * {@link angular.filter.currency currency}, {@link angular.filter.json json},
     * {@link angular.filter.number number}, and {@link angular.filter.html html}. You can also add
     * your own filters.
     *
     *
     * # Syntax
     *
     * Filters can be part of any {@link angular.scope} evaluation but are typically used with
     * {{bindings}}. Filters typically transform the data to a new data type, formating the data in
     * the process. Filters can be chained and take optional arguments. Here are few examples:
     *
     * * No filter: {{1234.5678}} => 1234.5678
     * * Number filter: {{1234.5678|number}} => 1,234.57. Notice the “,” and rounding to two
     *   significant digits.
     * * Filter with arguments: {{1234.5678|number:5}} => 1,234.56780. Filters can take optional
     *   arguments, separated by colons in a binding. To number, the argument “5” requests 5 digits
     *   to the right of the decimal point.
     *
     *
     * # Writing your own Filters
     *
     * Writing your own filter is very easy: just define a JavaScript function on `angular.filter`.
     * The framework passes in the input value as the first argument to your function. Any filter
     * arguments are passed in as additional function arguments.
     *
     * You can use these variables in the function:
     *
     * * `this` — The current scope.
     * * `this.$element` — The DOM element containing the binding. This allows the filter to manipulate
     *   the DOM in addition to transforming the input.
     *
     *
     * @exampleDescription
     *  The following example filter reverses a text string. In addition, it conditionally makes the
     *  text upper-case (to demonstrate optional arguments) and assigns color (to demonstrate DOM
     *  modification).
     *
     * @example
         <script type="text/javascript">
           angular.filter('reverse', function(input, uppercase, color) {
             var out = "";
             for (var i = 0; i < input.length; i++) {
               out = input.charAt(i) + out;
             }
             if (uppercase) {
               out = out.toUpperCase();
             }
             if (color) {
               this.$element.css('color', color);
             }
             return out;
           });
         </script>

         <input name="text" type="text" value="hello" /><br>
         No filter: {{text}}<br>
         Reverse: {{text|reverse}}<br>
         Reverse + uppercase: {{text|reverse:true}}<br>
         Reverse + uppercase + blue:  {{text|reverse:true:"blue"}}

     */
    angularFilter     = extensionMap(angular, 'filter'),
    /**
     * @workInProgress
     * @ngdoc overview
     * @name angular.formatter
     * @namespace Namespace for all formats.
     * @description
     * # Overview
     * The formatters are responsible for translating user readable text in an input widget to a
     * data model stored in an application.
     * 
     * # Writting your own Formatter
     * Writing your own formatter is easy. Just register a pair of JavaScript functions with 
     * `angular.formatter`. One function for parsing user input text to the stored form, 
     * and one for formatting the stored data to user-visible text.
     * 
     * Here is an example of a "reverse" formatter: The data is stored in uppercase and in 
     * reverse, while it is displayed in lower case and non-reversed. User edits are 
     * automatically parsed into the internal form and data changes are automatically 
     * formatted to the viewed form.
     * 
     * <pre>
     * function reverse(text) {
     *   var reversed = [];
     *   for (var i = 0; i < text.length; i++) {
     *     reversed.unshift(text.charAt(i));
     *   }
     *   return reversed.join('');
     * }
     * 
     * angular.formatter('reverse', {
     *   parse: function(value){
     *     return reverse(value||'').toUpperCase();
     *   },
     *   format: function(value){
     *     return reverse(value||'').toLowerCase();
     *   }
     * });
     * </pre>
     * 
     * @example
     * <script type="text/javascript">
     * function reverse(text) {
     *   var reversed = [];
     *   for (var i = 0; i < text.length; i++) {
     *     reversed.unshift(text.charAt(i));
     *   }
     *   return reversed.join('');
     * }
     * 
     * angular.formatter('reverse', {
     *   parse: function(value){
     *     return reverse(value||'').toUpperCase();
     *   },
     *   format: function(value){
     *     return reverse(value||'').toLowerCase();
     *   }
     * });
     * </script>
     *
     * Formatted: 
     * <input type="text" name="data" value="angular" ng:format="reverse"/>
     * <br/>
     * 
     * Stored: 
     * <input type="text" name="data"/><br/>
     * <pre>{{data}}</pre>
     *
     * 
     * @scenario
     * it('should store reverse', function(){
     *  expect(element('.doc-example input:first').val()).toEqual('angular');
     *  expect(element('.doc-example input:last').val()).toEqual('RALUGNA');
     *  
     *  this.addFutureAction('change to XYZ', function($window, $document, done){
     *    $document.elements('.doc-example input:last').val('XYZ').trigger('change');
     *    done();
     *  });
     *  expect(element('.doc-example input:first').val()).toEqual('zyx');
     * });
     */
    angularFormatter  = extensionMap(angular, 'formatter'),
    
    /**
     * @workInProgress
     * @ngdoc overview
     * @name angular.service
     * 
     * @description
     * # Overview
     * Services are substituable objects, which are wired together using dependency injection.
     * Each service could have dependencies (other services), which are passed in constructor.
     * Because JS is dynamicaly typed language, dependency injection can not use static types
     * to satisfy these dependencies, so each service must explicitely define its dependencies.
     * This is done by `$inject` property.
     * 
     * For now, life time of all services is the same as the life time of page.
     * 
     * 
     * # Built-in services
     * The Angular framework provides a standard set of services for common operations.
     * You can write your own services and rewrite these standard services as well.
     * Like other core angular variables, the built-in services always start with $.
     *
     *   * `angular.service.$browser`
     *   * `angular.service.$window`
     *   * `angular.service.$document`
     *   * `angular.service.$location`
     *   * `angular.service.$log`
     *   * `angular.service.$exceptionHandler`
     *   * `angular.service.$hover`
     *   * `angular.service.$invalidWidgets`
     *   * `angular.service.$route`
     *   * `angular.service.$xhr`
     *   * `angular.service.$xhr.error`
     *   * `angular.service.$xhr.bulk`
     *   * `angular.service.$xhr.cache`
     *   * `angular.service.$resource`
     *   * `angular.service.$cookies`
     *   * `angular.service.$cookieStore`
     * 
     * # Writing your own custom services
     * Angular provides only set of basic services, so you will probably need to write your custom
     * service very soon. To do so, you need to write a factory function and register this function
     * to angular's dependency injector. This factory function must return an object - your service
     * (it is not called with new operator).
     * 
     * **angular.service** has three parameters:
     * 
     *   - `{string} name` - Name of the service
     *   - `{function()} factory` - Factory function (called just once by DI)
     *   - `{Object} config` -  Hash of configuration (`$inject`, `$creation`)
     * 
     * If your service requires - depends on other services, you need to specify them 
     * in config hash - property $inject. This property is an array of strings (service names).
     * These dependencies will be passed as parameters to the factory function by DI.
     * This approach is very useful when testing, as you can inject mocks/stubs/dummies.
     * 
     * Here is an example of very simple service. This service requires $window service (it's
     * passed as a parameter to factory function) and it's just a function.
     * 
     * This service simple stores all notifications and after third one, it displays all of them by
     * window alert.
     * <pre>
       angular.service('notify', function(win) {
         var msgs = [];
         return function(msg) {
           msgs.push(msg);
           if (msgs.length == 3) {
             win.alert(msgs.join("\n"));
             msgs = [];
           }
         };
       }, {$inject: ['$window']});
     * </pre>
     *  
     * And here is a unit test for this service. We use Jasmine spy (mock) instead of real browser's alert.
     * <pre>
     * var mock, notify;
     *
     * beforeEach(function() {
     *   mock = {alert: jasmine.createSpy()};
     *   notify = angular.service('notify')(mock);
     * });
     *  
     * it('should not alert first two notifications', function() {
     *   notify('one');
     *   notify('two');
     *   expect(mock.alert).not.toHaveBeenCalled();
     * });
     *
     * it('should alert all after third notification', function() {
     *   notify('one');
     *   notify('two');
     *   notify('three');
     *   expect(mock.alert).toHaveBeenCalledWith("one\ntwo\nthree");
     * });
     *
     * it('should clear messages after alert', function() {
     *   notify('one');
     *   notify('two');
     *   notify('third');
     *   notify('more');
     *   notify('two');
     *   notify('third');
     *   expect(mock.alert.callCount).toEqual(2);
     *   expect(mock.alert.mostRecentCall.args).toEqual(["more\ntwo\nthird"]);
     * });
     * </pre>
     *
     * # Injecting services into controllers
     * Using services in a controllers is very similar to using service in other service.
     * Again, we will use dependency injection.
     * 
     * JavaScript is dynamic language, so DI is not able to figure out which services to inject by
     * static types (like in static typed languages). Therefore you must specify the service name
     * by the `$inject` property - it's an array that contains strings with names of services to be
     * injected. The name must match the id that service has been registered as with angular.
     * The order of the services in the array matters, because this order will be used when calling
     * the factory function with injected parameters. The names of parameters in factory function
     * don't matter, but by convention they match the service ids.
     * <pre>
     * function myController($loc, $log) {
     *   this.firstMethod = function() {
     *     // use $location service
     *     $loc.setHash();
     *   };
     *   this.secondMethod = function() {
     *     // use $log service
     *     $log.info('...');
     *   };
     * }
     * // which services to inject ?
     * myController.$inject = ['$location', '$log']; 
     * </pre>
     * 
     * @example
     * <script type="text/javascript">
     *  angular.service('notify', function(win) {
     *    var msgs = [];
     *    return function(msg) {
     *      msgs.push(msg);
     *      if (msgs.length == 3) {
     *        win.alert(msgs.join("\n"));
     *        msgs = [];
     *      }
     *    };
     *  }, {$inject: ['$window']});
     *  
     *  function myController(notifyService) {
     *    this.callNotify = function(msg) {
     *      notifyService(msg);
     *    };
     *  }
     *  
     *  myController.$inject = ['notify'];
     * </script>
     * 
     * <div ng:controller="myController">
     * <p>Let's try this simple notify service, injected into the controller...</p>
     * <input ng:init="message='test'" type="text" name="message" />
     * <button ng:click="callNotify(message);">NOTIFY</button>
     * </div>
     */
    angularService    = extensionMap(angular, 'service'),
    angularCallbacks  = extensionMap(angular, 'callbacks'),
    nodeName,
    rngScript         = /^(|.*\/)angular(-.*?)?(\.min)?.js(\?[^#]*)?(#(.*))?$/;

/**
 * @workInProgress
 * @ngdoc function
 * @name angular.foreach
 * @function
 *
 * @description
 * Invokes the `iterator` function once for each item in `obj` collection. The collection can either
 * be an object or an array. The `iterator` function is invoked with `iterator(value, key)`, where
 * `value` is the value of an object property or an array element and `key` is the object property
 * key or array element index. Optionally, `context` can be specified for the iterator function.
 *
   <pre>
     var values = {name: 'misko', gender: 'male'};
     var log = [];
     angular.foreach(values, function(value, key){
       this.push(key + ': ' + value);
     }, log);
     expect(log).toEqual(['name: misko', 'gender:male']);
   </pre>
 *
 * @param {Object|Array} obj Object to iterate over.
 * @param {function()} iterator Iterator function.
 * @param {Object} context Object to become context (`this`) for the iterator function.
 * @returns {Objet|Array} Reference to `obj`.
 */
function foreach(obj, iterator, context) {
  var key;
  if (obj) {
    if (isFunction(obj)){
      for (key in obj) {
        if (key != 'prototype' && key != $length && key != $name && obj.hasOwnProperty(key)) {
          iterator.call(context, obj[key], key);
        }
      }
    } else if (obj.forEach) {
      obj.forEach(iterator, context);
    } else if (isObject(obj) && isNumber(obj.length)) {
      for (key = 0; key < obj.length; key++)
        iterator.call(context, obj[key], key);
    } else {
      for (key in obj)
        iterator.call(context, obj[key], key);
    }
  }
  return obj;
}

function foreachSorted(obj, iterator, context) {
  var keys = [];
  for (var key in obj) keys.push(key);
  keys.sort();
  for ( var i = 0; i < keys.length; i++) {
    iterator.call(context, obj[keys[i]], keys[i]);
  }
  return keys;
}


function formatError(arg) {
  if (arg instanceof Error) {
    if (arg.stack) {
      arg = arg.stack;
    } else if (arg.sourceURL) {
      arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
    }
  }
  return arg;
}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.extend
 * @function
 *
 * @description
 * Extends the destination object `dst` by copying all of the properties from the `src` objects to
 * `dst`. You can specify multiple `src` objects.
 *
 * @param {Object} dst The destination object.
 * @param {...Object} src The source object(s).
 */
function extend(dst) {
  foreach(arguments, function(obj){
    if (obj !== dst) {
      foreach(obj, function(value, key){
        dst[key] = value;
      });
    }
  });
  return dst;
}


function inherit(parent, extra) {
  return extend(new (extend(function(){}, {prototype:parent}))(), extra);
}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.noop
 * @function
 *
 * @description
 * Empty function that performs no operation whatsoever. This function is useful when writing code
 * in the functional style.
   <pre>
     function foo(callback) {
       var result = calculateResult();
       (callback || angular.noop)(result);
     }
   </pre>
 */
function noop() {}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.identity
 * @function
 *
 * @description
 * A function that does nothing except for returning its first argument. This function is useful
 * when writing code in the functional style.
 *
   <pre>
     function transformer(transformationFn, value) {
       return (transformationFn || identity)(value);
     };
   </pre>
 */
function identity($) {return $;}


function valueFn(value) {return function(){ return value; };}


function extensionMap(angular, name, transform) {
  var extPoint;
  return angular[name] || (extPoint = angular[name] = function (name, fn, prop){
    name = (transform || identity)(name);
    if (isDefined(fn)) {
      if (isDefined(extPoint[name])) {
        foreach(extPoint[name], function(property, key) {
          if (key.charAt(0) == '$' && isUndefined(fn[key]))
            fn[key] = property;
        });
      }
      extPoint[name] = extend(fn, prop || {});
    }
    return extPoint[name];
  });
}

function jqLiteWrap(element) {
  // for some reasons the parentNode of an orphan looks like _null but its typeof is object.
  if (element) {
    if (isString(element)) {
      var div = document.createElement('div');
      div.innerHTML = element;
      element = new JQLite(div.childNodes);
    } else if (!(element instanceof JQLite) && isElement(element)) {
      element =  new JQLite(element);
    }
  }
  return element;
}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.isUndefined
 * @function
 *
 * @description
 * Checks if a reference is undefined.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is undefined.
 */
function isUndefined(value){ return typeof value == $undefined; }


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.isDefined
 * @function
 *
 * @description
 * Checks if a reference is defined.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is defined.
 */
function isDefined(value){ return typeof value != $undefined; }


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.isObject
 * @function
 *
 * @description
 * Checks if a reference is an `Object`. Unlike in JavaScript `null`s are not considered to be
 * objects.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is an `Object` but not `null`.
 */
function isObject(value){ return value!=_null && typeof value == $object;}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.isString
 * @function
 *
 * @description
 * Checks if a reference is a `String`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `String`.
 */
function isString(value){ return typeof value == $string;}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.isNumber
 * @function
 *
 * @description
 * Checks if a reference is a `Number`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Number`.
 */
function isNumber(value){ return typeof value == $number;}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.isDate
 * @function
 *
 * @description
 * Checks if a reference is defined.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Date`.
 */
function isDate(value){ return value instanceof Date; }


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.isArray
 * @function
 *
 * @description
 * Checks if a reference is an `Array`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is an `Array`.
 */
function isArray(value) { return value instanceof Array; }


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.isFunction
 * @function
 *
 * @description
 * Checks if a reference is a `Function`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Function`.
 */
function isFunction(value){ return typeof value == $function;}


function isBoolean(value) { return typeof value == $boolean;}
function isTextNode(node) { return nodeName(node) == '#text'; }
function trim(value) { return isString(value) ? value.replace(/^\s*/, '').replace(/\s*$/, '') : value; }
function isElement(node) {
  return node && (node.nodeName || node instanceof JQLite || (jQuery && node instanceof jQuery));
}

/**
 * HTML class which is the only class which can be used in ng:bind to inline HTML for security reasons.
 * @constructor
 * @param html raw (unsafe) html
 * @param {string=} option if set to 'usafe' then get method will return raw (unsafe/unsanitized) html
 */
function HTML(html, option) {
  this.html = html;
  this.get = lowercase(option) == 'unsafe' ?
    valueFn(html) :
    function htmlSanitize() {
      var buf = [];
      htmlParser(html, htmlSanitizeWriter(buf));
      return buf.join('');
    };
}

if (msie) {
  nodeName = function(element) {
    element = element.nodeName ? element : element[0];
    return (element.scopeName && element.scopeName != 'HTML' ) ? uppercase(element.scopeName + ':' + element.nodeName) : element.nodeName;
  };
} else {
  nodeName = function(element) {
    return element.nodeName ? element.nodeName : element[0].nodeName;
  };
}

function quickClone(element) {
  return jqLite(element[0].cloneNode(true));
}

function isVisible(element) {
  var rect = element[0].getBoundingClientRect(),
      width = (rect.width || (rect.right||0 - rect.left||0)),
      height = (rect.height || (rect.bottom||0 - rect.top||0));
  return width>0 && height>0;
}

function map(obj, iterator, context) {
  var results = [];
  foreach(obj, function(value, index, list) {
    results.push(iterator.call(context, value, index, list));
  });
  return results;
}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.Object.size
 * @function
 *
 * @description
 * Determines the number of elements in an array or number of properties of an object.
 *
 * Note: this function is used to augment the Object type in angular expressions. See
 * {@link angular.Object} for more info.
 *
 * @param {Object|Array} obj Object or array to inspect.
 * @returns {number} The size of `obj` or `0` if `obj` is not an object or array.
 *
 * @example
 * Number of items in array: {{ [1,2].$size() }}<br/>
 * Number of items in object: {{ {a:1, b:2, c:3}.$size() }}<br/>
 */
function size(obj) {
  var size = 0;
  if (obj) {
    if (isNumber(obj.length)) {
      return obj.length;
    } else if (isObject(obj)){
      for (key in obj)
        size++;
    }
  }
  return size;
}
function includes(array, obj) {
  for ( var i = 0; i < array.length; i++) {
    if (obj === array[i]) return true;
  }
  return false;
}

function indexOf(array, obj) {
  for ( var i = 0; i < array.length; i++) {
    if (obj === array[i]) return i;
  }
  return -1;
}

function isLeafNode (node) {
  if (node) {
    switch (node.nodeName) {
    case "OPTION":
    case "PRE":
    case "TITLE":
      return true;
    }
  }
  return false;
}

/**
 * @workInProgress
 * @ngdoc function
 * @name angular.Object.copy
 * @function
 *
 * @description
 * Creates a deep copy of `source`.
 *
 * If `destination` is not provided and `source` is an object or an array, a copy is created &
 * returned, otherwise the `source` is returned.
 *
 * If `destination` is provided, all of its properties will be deleted.
 *
 * If `source` is an object or an array, all of its members will be copied into the `destination`
 * object.
 *
 * Note: this function is used to augment the Object type in angular expressions. See
 * {@link angular.Object} for more info.
 *
 * @param {*} source The source to be used to make a copy.
 *                   Can be any type including primitives, `null` and `undefined`.
 * @param {(Object|Array)=} destination Optional destination into which the source is copied.
 * @returns {*} The copy or updated `destination` if `destination` was specified.
 *
 * @example
   Salutation: <input type="text" name="master.salutation" value="Hello" /><br/>
   Name: <input type="text" name="master.name" value="world"/><br/>
   <button ng:click="form = master.$copy()">copy</button>
   <hr/>

   Master is <span ng:hide="master.$equals(form)">NOT</span> same as form.

   <pre>master={{master}}</pre>
   <pre>form={{form}}</pre>
 */
function copy(source, destination){
  if (!destination) {
    destination = source;
    if (source) {
      if (isArray(source)) {
        destination = copy(source, []);
      } else if (isDate(source)) {
        destination = new Date(source.getTime());
      } else if (isObject(source)) {
        destination = copy(source, {});
      }
    }
  } else {
    if (isArray(source)) {
      while(destination.length) {
        destination.pop();
      }
      for ( var i = 0; i < source.length; i++) {
        destination.push(copy(source[i]));
      }
    } else {
      foreach(destination, function(value, key){
        delete destination[key];
      });
      for ( var key in source) {
        destination[key] = copy(source[key]);
      }
    }
  }
  return destination;
}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.Object.equals
 * @function
 *
 * @description
 * Determines if two objects or value are equivalent.
 *
 * To be equivalent, they must pass `==` comparison or be of the same type and have all their
 * properties pass `==` comparison.
 *
 * Supports values types, arrays and objects.
 *
 * For objects `function` properties and properties that start with `$` are not considered during
 * comparisons.
 *
 * Note: this function is used to augment the Object type in angular expressions. See
 * {@link angular.Object} for more info.
 *
 * @param {*} o1 Object or value to compare.
 * @param {*} o2 Object or value to compare.
 * @returns {boolean} True if arguments are equal.
 *
 * @example
   Salutation: <input type="text" name="master.salutation" value="Hello" /><br/>
   Name: <input type="text" name="master.name" value="world"/><br/>
   <button ng:click="form = master.$copy()">copy</button>
   <hr/>

   Master is <span ng:hide="master.$equals(form)">NOT</span> same as form.

   <pre>master={{master}}</pre>
   <pre>form={{form}}</pre>
 */
function equals(o1, o2) {
  if (o1 == o2) return true;
  var t1 = typeof o1, t2 = typeof o2, length, key, keySet;
  if (t1 == t2 && t1 == 'object') {
    if (o1 instanceof Array) {
      if ((length = o1.length) == o2.length) {
        for(key=0; key<length; key++) {
          if (!equals(o1[key], o2[key])) return false;
        }
        return true;
      }
    } else {
      keySet = {};
      for(key in o1) {
        if (key.charAt(0) !== '$' && !isFunction(o1[key]) && !equals(o1[key], o2[key])) return false;
        keySet[key] = true;
      }
      for(key in o2) {
        if (!keySet[key] && key.charAt(0) !== '$' && !isFunction(o2[key])) return false;
      }
      return true;
    }
  }
  return false;
}

function setHtml(node, html) {
  if (isLeafNode(node)) {
    if (msie) {
      node.innerText = html;
    } else {
      node.textContent = html;
    }
  } else {
    node.innerHTML = html;
  }
}

function isRenderableElement(element) {
  var name = element && element[0] && element[0].nodeName;
  return name && name.charAt(0) != '#' &&
    !includes(['TR', 'COL', 'COLGROUP', 'TBODY', 'THEAD', 'TFOOT'], name);
}
function elementError(element, type, error) {
  while (!isRenderableElement(element)) {
    element = element.parent() || jqLite(document.body);
  }
  if (element[0]['$NG_ERROR'] !== error) {
    element[0]['$NG_ERROR'] = error;
    if (error) {
      element.addClass(type);
      element.attr(type, error);
    } else {
      element.removeClass(type);
      element.removeAttr(type);
    }
  }
}

function concat(array1, array2, index) {
  return array1.concat(slice.call(array2, index, array2.length));
}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.bind
 * @function
 *
 * @description
 * Returns function which calls function `fn` bound to `self` (`self` becomes the `this` for `fn`).
 * Optional `args` can be supplied which are prebound to the function, also known as
 * [function currying](http://en.wikipedia.org/wiki/Currying).
 *
 * @param {Object} self Context in which `fn` should be evaluated in.
 * @param {function()} fn Function to be bound.
 * @param {(...*)=} args Optional arguments to be prebound to the `fn` function call.
 * @returns {function()} Function that wraps the `fn` with all the specified bindings.
 */
function bind(self, fn) {
  var curryArgs = arguments.length > 2 ? slice.call(arguments, 2, arguments.length) : [];
  if (typeof fn == $function) {
    return curryArgs.length ? function() {
      return arguments.length ? fn.apply(self, curryArgs.concat(slice.call(arguments, 0, arguments.length))) : fn.apply(self, curryArgs);
    }: function() {
      return arguments.length ? fn.apply(self, arguments) : fn.call(self);
    };
  } else {
    // in IE, native methods are not functions and so they can not be bound (but they don't need to be)
    return fn;
  }
}

function toBoolean(value) {
  if (value && value.length !== 0) {
    var v = lowercase("" + value);
    value = !(v == 'f' || v == '0' || v == 'false' || v == 'no' || v == 'n' || v == '[]');
  } else {
    value = false;
  }
  return value;
}

function merge(src, dst) {
  for ( var key in src) {
    var value = dst[key];
    var type = typeof value;
    if (type == $undefined) {
      dst[key] = fromJson(toJson(src[key]));
    } else if (type == 'object' && value.constructor != array &&
        key.substring(0, 1) != "$") {
      merge(src[key], value);
    }
  }
}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.compile
 * @function
 *
 * @description
 * Compiles a piece of HTML or DOM into a {@link angular.scope scope} object.
   <pre>
    var scope1 = angular.compile(window.document);
    scope1.$init();

    var scope2 = angular.compile('<div ng:click="clicked = true">click me</div>');
    scope2.$init();
   </pre>
 *
 * @param {string|DOMElement} element Element to compile.
 * @param {Object=} parentScope Scope to become the parent scope of the newly compiled scope.
 * @returns {Object} Compiled scope object.
 */
function compile(element, parentScope) {
  var compiler = new Compiler(angularTextMarkup, angularAttrMarkup, angularDirective, angularWidget),
      $element = jqLite(element);
  return compiler.compile($element)($element, parentScope);
}
/////////////////////////////////////////////////

/**
 * Parses an escaped url query string into key-value pairs.
 * @returns Object.<(string|boolean)>
 */
function parseKeyValue(/**string*/keyValue) {
  var obj = {}, key_value, key;
  foreach((keyValue || "").split('&'), function(keyValue){
    if (keyValue) {
      key_value = keyValue.split('=');
      key = unescape(key_value[0]);
      obj[key] = isDefined(key_value[1]) ? unescape(key_value[1]) : true;
    }
  });
  return obj;
}

function toKeyValue(obj) {
  var parts = [];
  foreach(obj, function(value, key) {
    parts.push(escape(key) + (value === true ? '' : '=' + escape(value)));
  });
  return parts.length ? parts.join('&') : '';
}

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:autobind
 * @element script
 *
 * @TODO ng:autobind is not a directive!! it should be documented as bootstrap parameter in a
 *     separate bootstrap section.
 * @TODO rename to ng:autobind to ng:autoboot
 *
 * @description
 * This section explains how to bootstrap your application with angular using either the angular
 * javascript file.
 *
 *
 * ## The angular distribution
 * Note that there are two versions of the angular javascript file that you can use:
 * 
 * * `angular.js` - the development version - this file is unobfuscated, uncompressed, and thus
 *    human-readable and useful when developing your angular applications.
 * * `angular.min.js` - the production version - this is a minified and obfuscated version of
 *    `angular.js`. You want to use this version when you want to load a smaller but functionally
 *    equivalent version of the code in your application. We use the Closure compiler to create this
 *    file.
 *     
 * 
 * ## Auto-bootstrap with `ng:autobind`
 * The simplest way to get an <angular/> application up and running is by inserting a script tag in
 * your HTML file that bootstraps the `http://code.angularjs.org/angular-x.x.x.min.js` code and uses
 * the special `ng:autobind` attribute, like in this snippet of HTML:
 * 
 * <pre>
    &lt;!doctype html&gt;
    &lt;html xmlns:ng="http://angularjs.org"&gt;
     &lt;head&gt;
      &lt;script type="text/javascript" src="http://code.angularjs.org/angular-0.9.3.min.js"
              ng:autobind&gt;&lt;/script&gt;
     &lt;/head&gt;
     &lt;body&gt;
       Hello {{'world'}}!
     &lt;/body&gt;
    &lt;/html&gt;
 * </pre>
 *
 * The `ng:autobind` attribute tells <angular/> to compile and manage the whole HTML document. The
 * compilation occurs in the page's `onLoad` handler. Note that you don't need to explicitly add an
 * `onLoad` event; auto bind mode takes care of all the magic for you.
 *
 *
 * ## Auto-bootstrap with `#autobind`
 * In rare cases when you can't define the `ng` namespace before the script tag (e.g. in some CMS
 * systems, etc), it is possible to auto-bootstrap angular by appending `#autobind` to the script
 * src URL, like in this snippet:
 *
 * <pre>
    &lt;!doctype html&gt;
    &lt;html&gt;
     &lt;head&gt;
      &lt;script type="text/javascript"
              src="http://code.angularjs.org/angular-0.9.3.min.js#autobind"&gt;&lt;/script&gt;
     &lt;/head&gt;
     &lt;body&gt;
       &lt;div xmlns:ng="http://angularjs.org"&gt;
         Hello {{'world'}}!
       &lt;/div&gt;
     &lt;/body&gt;
    &lt;/html&gt;
 * </pre>
 *
 * In this case it's the `#autobind` URL fragment that tells angular to auto-bootstrap.
 *
 *
 * ## Filename Restrictions for Auto-bootstrap
 * In order for us to find the auto-bootstrap script attribute or URL fragment, the value of the
 * `script` `src` attribute that loads angular script must match one of these naming
 * conventions:
 *
 * - `angular.js`
 * - `angular-min.js`
 * - `angular-x.x.x.js`
 * - `angular-x.x.x.min.js`
 * - `angular-x.x.x-xxxxxxxx.js` (dev snapshot)
 * - `angular-x.x.x-xxxxxxxx.min.js` (dev snapshot)
 * - `angular-bootstrap.js` (used for development of angular)
 *
 * Optionally, any of the filename format above can be prepended with relative or absolute URL that
 * ends with `/`.
 *
 *
 * ## Manual Bootstrap
 * Using auto-bootstrap is a handy way to start using <angular/>, but advanced users who want more
 * control over the initialization process might prefer to use manual bootstrap instead.
 * 
 * The best way to get started with manual bootstraping is to look at the magic behind `ng:autobind`
 * by writing out each step of the autobind process explicitly. Note that the following code is
 * equivalent to the code in the previous section.
 * 
 * <pre>
    &lt;!doctype html&gt;
    &lt;html xmlns:ng="http://angularjs.org"&gt;
     &lt;head&gt;
      &lt;script type="text/javascript" src="http://code.angularjs.org/angular-0.9.3.min.js"
              ng:autobind&gt;&lt;/script&gt;
      &lt;script type="text/javascript"&gt;
       (function(window, previousOnLoad){
         window.onload = function(){
          try { (previousOnLoad||angular.noop)(); } catch(e) {}
          angular.compile(window.document).$init();
         };
       })(window, window.onload);
      &lt;/script&gt;
     &lt;/head&gt;
     &lt;body&gt;
       Hello {{'World'}}!
     &lt;/body&gt;
    &lt;/html&gt;
 * </pre>
 * 
 * This is the sequence that your code should follow if you're bootstrapping angular on your own:
 * 
 * * After the page is loaded, find the root of the HTML template, which is typically the root of
 *   the document.
 * * Run the HTML compiler, which converts the templates into an executable, bi-directionally bound
 *   application.
 *
 *
 * ##XML Namespace
 * *IMPORTANT:* When using <angular/> you must declare the ng namespace using the xmlns tag. If you
 * don't declare the namespace, Internet Explorer does not render widgets properly.
 *    
 * <pre>
 * &lt;html xmlns:ng="http://angularjs.org"&gt;
 * </pre>
 *
 *
 * ## Create your own namespace
 * If you want to define your own widgets, you must create your own namespace and use that namespace
 * to form the fully qualified widget name. For example, you could map the alias `my` to your domain
 * and create a widget called my:widget. To create your own namespace, simply add another xmlsn tag
 * to your page, create an alias, and set it to your unique domain:
 * 
 * <pre>
 * &lt;html xmlns:ng="http://angularjs.org" xmlns:my="http://mydomain.com"&gt;
 * </pre>
 *
 *
 * ## Global Object
 * The <angular/> script creates a single global variable `angular` in the global namespace. All
 * APIs are bound to fields of this global object.
 * 
 */
function angularInit(config){
  if (config.autobind) {
    // TODO default to the source of angular.js
    var scope = compile(window.document, _null, {'$config':config}),
        $browser = scope.$inject('$browser');

    if (config.css)
      $browser.addCss(config.base_url + config.css);
    else if(msie<8)
      $browser.addJs(config.base_url + config.ie_compat, config.ie_compat_id);

    scope.$init();
  }
}

function angularJsConfig(document, config) {
  var scripts = document.getElementsByTagName("script"),
      match;
  config = extend({
    ie_compat_id: 'ng-ie-compat'
  }, config);
  for(var j = 0; j < scripts.length; j++) {
    match = (scripts[j].src || "").match(rngScript);
    if (match) {
      config.base_url = match[1];
      config.ie_compat = match[1] + 'angular-ie-compat' + (match[2] || '') + '.js';
      extend(config, parseKeyValue(match[6]));
      eachAttribute(jqLite(scripts[j]), function(value, name){
        if (/^ng:/.exec(name)) {
          name = name.substring(3).replace(/-/g, '_');
          if (name == 'autobind') value = true;
          config[name] = value;
        }
      });
    }
  }
  return config;
}
