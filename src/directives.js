/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:init
 *
 * @description
 * The `ng:init` attribute specifies initialization tasks to be executed
 *  before the template enters execution mode during bootstrap.
 *
 * @element ANY
 * @param {expression} expression {@link guide.expression Expression} to eval.
 *
 * @example
   <doc:example>
     <doc:source>
    <div ng:init="greeting='Hello'; person='World'">
      {{greeting}} {{person}}!
    </div>
     </doc:source>
     <doc:scenario>
       it('should check greeting', function(){
         expect(binding('greeting')).toBe('Hello');
         expect(binding('person')).toBe('World');
       });
     </doc:scenario>
   </doc:example>
 */
angularDirective("ng:init", function(expression){
  return function(element){
    this.$tryEval(expression, element);
  };
});

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.@ng:controller
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
 * Note that an alternative way to define controllers is via the `{@link angular.service.$route}`
 * service.
 *
 * @element ANY
 * @param {expression} expression Name of a globally accessible constructor function or an
 *     {@link guide.expression expression} that on the current scope evaluates to a constructor
 *     function.
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
        function SettingsController() {
          this.name = "John Smith";
          this.contacts = [
            {type:'phone', value:'408 555 1212'},
            {type:'email', value:'john.smith@example.org'} ];
        }
        SettingsController.prototype = {
         greet: function(){
           alert(this.name);
         },
         addContact: function(){
           this.contacts.push({type:'email', value:'yourname@example.org'});
         },
         removeContact: function(contactToRemove) {
           angular.Array.remove(this.contacts, contactToRemove);
         },
         clearContact: function(contact) {
           contact.type = 'phone';
           contact.value = '';
         }
        };
      </script>
      <div ng:controller="SettingsController">
        Name: <input type="text" name="name"/>
        [ <a href="" ng:click="greet()">greet</a> ]<br/>
        Contact:
        <ul>
          <li ng:repeat="contact in contacts">
            <select name="contact.type">
               <option>phone</option>
               <option>email</option>
            </select>
            <input type="text" name="contact.value"/>
            [ <a href="" ng:click="clearContact(contact)">clear</a>
            | <a href="" ng:click="removeContact(contact)">X</a> ]
          </li>
          <li>[ <a href="" ng:click="addContact()">add</a> ]</li>
       </ul>
      </div>
     </doc:source>
     <doc:scenario>
       it('should check controller', function(){
         expect(element('.doc-example-live div>:input').val()).toBe('John Smith');
         expect(element('.doc-example-live li[ng\\:repeat-index="0"] input').val()).toBe('408 555 1212');
         expect(element('.doc-example-live li[ng\\:repeat-index="1"] input').val()).toBe('john.smith@example.org');
         element('.doc-example-live li:first a:contains("clear")').click();
         expect(element('.doc-example-live li:first input').val()).toBe('');
         element('.doc-example-live li:last a:contains("add")').click();
         expect(element('.doc-example-live li[ng\\:repeat-index="2"] input').val()).toBe('yourname@example.org');
       });
     </doc:scenario>
   </doc:example>
 */
angularDirective("ng:controller", function(expression){
  this.scope(true);
  return function(element){
    var controller = getter(window, expression, true) || getter(this, expression, true);
    if (!controller)
      throw "Can not find '"+expression+"' controller.";
    if (!isFunction(controller))
      throw "Reference '"+expression+"' is not a class.";
    this.$become(controller);
  };
});

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:eval
 *
 * @description
 * The `ng:eval` allows you to execute a binding which has side effects
 * without displaying the result to the user.
 *
 * @element ANY
 * @param {expression} expression {@link guide.expression Expression} to eval.
 *
 * @example
 * Notice that `{{` `obj.multiplied = obj.a * obj.b` `}}` has a side effect of assigning
 * a value to `obj.multiplied` and displaying the result to the user. Sometimes,
 * however, it is desirable to execute a side effect without showing the value to
 * the user. In such a case `ng:eval` allows you to execute code without updating
 * the display.
   <doc:example>
     <doc:source>
       <input name="obj.a" value="6" >
         * <input name="obj.b" value="2">
         = {{obj.multiplied = obj.a * obj.b}} <br>
       <span ng:eval="obj.divide = obj.a / obj.b"></span>
       <span ng:eval="obj.updateCount = 1 + (obj.updateCount||0)">
       </span>
       <tt>obj.divide = {{obj.divide}}</tt><br>
       <tt>obj.updateCount = {{obj.updateCount}}</tt>
     </doc:source>
     <doc:scenario>
       it('should check eval', function(){
         expect(binding('obj.divide')).toBe('3');
         expect(binding('obj.updateCount')).toBe('2');
         input('obj.a').enter('12');
         expect(binding('obj.divide')).toBe('6');
         expect(binding('obj.updateCount')).toBe('3');
       });
     </doc:scenario>
   </doc:example>
 */
angularDirective("ng:eval", function(expression){
  return function(element){
    this.$onEval(expression, element);
  };
});

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:bind
 *
 * @description
 * The `ng:bind` attribute asks angular to replace the text content of this
 * HTML element with the value of the given expression, and to keep the text
 * content up to date when the expression's value changes. Usually you would
 * just write `{{ expression }}` and let angular compile it into
 * `<span ng:bind="expression"></span>` at bootstrap time.
 *
 * @element ANY
 * @param {expression} expression {@link guide.expression Expression} to eval.
 *
 * @example
 * You can try it right here: enter text in the text box and watch the greeting change.
   <doc:example>
     <doc:source>
       Enter name: <input type="text" name="name" value="Whirled"> <br>
       Hello <span ng:bind="name" />!
     </doc:source>
     <doc:scenario>
       it('should check ng:bind', function(){
         expect(using('.doc-example-live').binding('name')).toBe('Whirled');
         using('.doc-example-live').input('name').enter('world');
         expect(using('.doc-example-live').binding('name')).toBe('world');
       });
     </doc:scenario>
   </doc:example>
 */
angularDirective("ng:bind", function(expression, element){
  element.addClass('ng-binding');
  return function(element) {
    var lastValue = noop, lastError = noop;
    this.$onEval(function() {
      var error, value, html, isHtml, isDomElement,
          oldElement = this.hasOwnProperty($$element) ? this.$element : undefined;
      this.$element = element;
      value = this.$tryEval(expression, function(e){
        error = formatError(e);
      });
      this.$element = oldElement;
      // If we are HTML than save the raw HTML data so that we don't
      // recompute sanitization since it is expensive.
      // TODO: turn this into a more generic way to compute this
      if (isHtml = (value instanceof HTML))
        value = (html = value).html;
      if (lastValue === value && lastError == error) return;
      isDomElement = isElement(value);
      if (!isHtml && !isDomElement && isObject(value)) {
        value = toJson(value, true);
      }
      if (value != lastValue || error != lastError) {
        lastValue = value;
        lastError = error;
        elementError(element, NG_EXCEPTION, error);
        if (error) value = error;
        if (isHtml) {
          element.html(html.get());
        } else if (isDomElement) {
          element.html('');
          element.append(value);
        } else {
          element.text(value == undefined ? '' : value);
        }
      }
    }, element);
  };
});

var bindTemplateCache = {};
function compileBindTemplate(template){
  var fn = bindTemplateCache[template];
  if (!fn) {
    var bindings = [];
    forEach(parseBindings(template), function(text){
      var exp = binding(text);
      bindings.push(exp
        ? function(element){
            var error, value = this.$tryEval(exp, function(e){
              error = toJson(e);
            });
            elementError(element, NG_EXCEPTION, error);
            return error ? error : value;
          }
        : function() {
            return text;
          });
    });
    bindTemplateCache[template] = fn = function(element, prettyPrintJson){
      var parts = [], self = this,
         oldElement = this.hasOwnProperty($$element) ? self.$element : undefined;
      self.$element = element;
      for ( var i = 0; i < bindings.length; i++) {
        var value = bindings[i].call(self, element);
        if (isElement(value))
          value = '';
        else if (isObject(value))
          value = toJson(value, prettyPrintJson);
        parts.push(value);
      }
      self.$element = oldElement;
      return parts.join('');
    };
  }
  return fn;
}

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:bind-template
 *
 * @description
 * The `ng:bind-template` attribute specifies that the element
 * text should be replaced with the template in ng:bind-template.
 * Unlike ng:bind the ng:bind-template can contain multiple `{{` `}}`
 * expressions. (This is required since some HTML elements
 * can not have SPAN elements such as TITLE, or OPTION to name a few.
 *
 * @element ANY
 * @param {string} template of form
 *   <tt>{{</tt> <tt>expression</tt> <tt>}}</tt> to eval.
 *
 * @example
 * Try it here: enter text in text box and watch the greeting change.
   <doc:example>
     <doc:source>
      Salutation: <input type="text" name="salutation" value="Hello"><br/>
      Name: <input type="text" name="name" value="World"><br/>
      <pre ng:bind-template="{{salutation}} {{name}}!"></pre>
     </doc:source>
     <doc:scenario>
       it('should check ng:bind', function(){
         expect(using('.doc-example-live').binding('{{salutation}} {{name}}')).
           toBe('Hello World!');
         using('.doc-example-live').input('salutation').enter('Greetings');
         using('.doc-example-live').input('name').enter('user');
         expect(using('.doc-example-live').binding('{{salutation}} {{name}}')).
           toBe('Greetings user!');
       });
     </doc:scenario>
   </doc:example>
 */
angularDirective("ng:bind-template", function(expression, element){
  element.addClass('ng-binding');
  var templateFn = compileBindTemplate(expression);
  return function(element) {
    var lastValue;
    this.$onEval(function() {
      var value = templateFn.call(this, element, true);
      if (value != lastValue) {
        element.text(value);
        lastValue = value;
      }
    }, element);
  };
});

var REMOVE_ATTRIBUTES = {
  'disabled':'disabled',
  'readonly':'readOnly',
  'checked':'checked',
  'selected':'selected'
};
/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:bind-attr
 *
 * @description
 * The `ng:bind-attr` attribute specifies that {@link guide.data-binding databindings}  should be
 * created between element attributes and given expressions. Unlike `ng:bind` the `ng:bind-attr`
 * contains a JSON key value pairs representing which attributes need to be mapped to which
 * {@link guide.expression expressions}.
 *
 * You don't usually write the `ng:bind-attr` in the HTML since embedding
 * <tt ng:non-bindable>{{expression}}</tt> into the attribute directly as the attribute value is
 * preferred. The attributes get translated into `<span ng:bind-attr="{attr:expression}"/>` at
 * compile time.
 *
 * This HTML snippet is preferred way of working with `ng:bind-attr`
 * <pre>
 *   <a href="http://www.google.com/search?q={{query}}">Google</a>
 * </pre>
 *
 * The above gets translated to bellow during bootstrap time.
 * <pre>
 *   <a ng:bind-attr='{"href":"http://www.google.com/search?q={{query}}"}'>Google</a>
 * </pre>
 *
 * @element ANY
 * @param {string} attribute_json a JSON key-value pairs representing
 *    the attributes to replace. Each key matches the attribute
 *    which needs to be replaced. Each value is a text template of
 *    the attribute with embedded
 *    <tt ng:non-bindable>{{expression}}</tt>s. Any number of
 *    key-value pairs can be specified.
 *
 * @example
 * Try it here: enter text in text box and click Google.
   <doc:example>
     <doc:source>
      Google for:
      <input type="text" name="query" value="AngularJS"/>
      <a href="http://www.google.com/search?q={{query}}">Google</a>
     </doc:source>
     <doc:scenario>
       it('should check ng:bind-attr', function(){
         expect(using('.doc-example-live').element('a').attr('href')).
           toBe('http://www.google.com/search?q=AngularJS');
         using('.doc-example-live').input('query').enter('google');
         expect(using('.doc-example-live').element('a').attr('href')).
           toBe('http://www.google.com/search?q=google');
       });
     </doc:scenario>
   </doc:example>
 */
angularDirective("ng:bind-attr", function(expression){
  return function(element){
    var lastValue = {};
    var updateFn = element.data($$update) || noop;
    this.$onEval(function(){
      var values = this.$eval(expression),
          dirty = noop;
      for(var key in values) {
        var value = compileBindTemplate(values[key]).call(this, element),
            specialName = REMOVE_ATTRIBUTES[lowercase(key)];
        if (lastValue[key] !== value) {
          lastValue[key] = value;
          if (specialName) {
            if (toBoolean(value)) {
              element.attr(specialName, specialName);
              element.attr('ng-' + specialName, value);
            } else {
              element.removeAttr(specialName);
              element.removeAttr('ng-' + specialName);
            }
            (element.data($$validate)||noop)();
          } else {
            element.attr(key, value);
          }
          dirty = updateFn;
        }
      }
      dirty();
    }, element);
  };
});


/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:click
 *
 * @description
 * The ng:click allows you to specify custom behavior when
 * element is clicked.
 *
 * @element ANY
 * @param {expression} expression {@link guide.expression Expression} to eval upon click.
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
       it('should check ng:click', function(){
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
angularDirective("ng:click", function(expression, element){
  return injectUpdateView(function($updateView, element){
    var self = this;
    element.bind('click', function(event){
      self.$tryEval(expression, element);
      $updateView();
      event.stopPropagation();
    });
  });
});


/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:submit
 *
 * @description
 * Enables binding angular expressions to onsubmit events.
 *
 * Additionally it prevents the default action (which for form means sending the request to the
 * server and reloading the current page).
 *
 * @element form
 * @param {expression} expression {@link guide.expression Expression} to eval.
 *
 * @example
   <doc:example>
     <doc:source>
      <form ng:submit="list.push(text);text='';" ng:init="list=[]">
        Enter text and hit enter:
        <input type="text" name="text" value="hello"/>
      </form>
      <pre>list={{list}}</pre>
     </doc:source>
     <doc:scenario>
       it('should check ng:submit', function(){
         expect(binding('list')).toBe('list=[]');
         element('.doc-example-live form input').click();
         this.addFutureAction('submit from', function($window, $document, done) {
           $window.angular.element(
             $document.elements('.doc-example-live form')).
               trigger('submit');
           done();
         });
         expect(binding('list')).toBe('list=["hello"]');
       });
     </doc:scenario>
   </doc:example>
 */
angularDirective("ng:submit", function(expression, element) {
  return injectUpdateView(function($updateView, element) {
    var self = this;
    element.bind('submit', function(event) {
      self.$tryEval(expression, element);
      $updateView();
      event.preventDefault();
    });
  });
});


function ngClass(selector) {
  return function(expression, element){
    var existing = element[0].className + ' ';
    return function(element){
      this.$onEval(function(){
        if (selector(this.$index)) {
          var value = this.$eval(expression);
          if (isArray(value)) value = value.join(' ');
          element[0].className = trim(existing + value);
        }
      }, element);
    };
  };
}

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:class
 *
 * @description
 * The `ng:class` allows you to set CSS class on HTML element
 * conditionally.
 *
 * @element ANY
 * @param {expression} expression {@link guide.expression Expression} to eval.
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
       it('should check ng:class', function(){
         expect(element('.doc-example-live span').attr('className')).not().
           toMatch(/ng-input-indicator-wait/);

         using('.doc-example-live').element(':button:first').click();

         expect(element('.doc-example-live span').attr('className')).
           toMatch(/ng-input-indicator-wait/);

         using('.doc-example-live').element(':button:last').click();

         expect(element('.doc-example-live span').attr('className')).not().
           toMatch(/ng-input-indicator-wait/);
       });
     </doc:scenario>
   </doc:example>
 */
angularDirective("ng:class", ngClass(function(){return true;}));

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:class-odd
 *
 * @description
 * The `ng:class-odd` and `ng:class-even` works exactly as
 * `ng:class`, except it works in conjunction with `ng:repeat`
 * and takes affect only on odd (even) rows.
 *
 * @element ANY
 * @param {expression} expression {@link guide.expression Expression} to eval. Must be inside
 * `ng:repeat`.
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
       it('should check ng:class-odd and ng:class-even', function(){
         expect(element('.doc-example-live li:first span').attr('className')).
           toMatch(/ng-format-negative/);
         expect(element('.doc-example-live li:last span').attr('className')).
           toMatch(/ng-input-indicator-wait/);
       });
     </doc:scenario>
   </doc:example>
 */
angularDirective("ng:class-odd", ngClass(function(i){return i % 2 === 0;}));

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:class-even
 *
 * @description
 * The `ng:class-odd` and `ng:class-even` works exactly as
 * `ng:class`, except it works in conjunction with `ng:repeat`
 * and takes affect only on odd (even) rows.
 *
 * @element ANY
 * @param {expression} expression {@link guide.expression Expression} to eval. Must be inside
 * `ng:repeat`.
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
       it('should check ng:class-odd and ng:class-even', function(){
         expect(element('.doc-example-live li:first span').attr('className')).
           toMatch(/ng-format-negative/);
         expect(element('.doc-example-live li:last span').attr('className')).
           toMatch(/ng-input-indicator-wait/);
       });
     </doc:scenario>
   </doc:example>
 */
angularDirective("ng:class-even", ngClass(function(i){return i % 2 === 1;}));

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:show
 *
 * @description
 * The `ng:show` and `ng:hide` directives show or hide a portion of the DOM tree (HTML)
 * conditionally.
 *
 * @element ANY
 * @param {expression} expression If the {@link guide.expression expression} is truthy then the element
 *     is shown or hidden respectively.
 *
 * @example
   <doc:example>
     <doc:source>
        Click me: <input type="checkbox" name="checked"><br/>
        Show: <span ng:show="checked">I show up when your checkbox is checked.</span> <br/>
        Hide: <span ng:hide="checked">I hide when your checkbox is checked.</span>
     </doc:source>
     <doc:scenario>
       it('should check ng:show / ng:hide', function(){
         expect(element('.doc-example-live span:first:hidden').count()).toEqual(1);
         expect(element('.doc-example-live span:last:visible').count()).toEqual(1);

         input('checked').check();

         expect(element('.doc-example-live span:first:visible').count()).toEqual(1);
         expect(element('.doc-example-live span:last:hidden').count()).toEqual(1);
       });
     </doc:scenario>
   </doc:example>
 */
angularDirective("ng:show", function(expression, element){
  return function(element){
    this.$onEval(function(){
      element.css($display, toBoolean(this.$eval(expression)) ? '' : $none);
    }, element);
  };
});

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:hide
 *
 * @description
 * The `ng:hide` and `ng:show` directives hide or show a portion
 * of the HTML conditionally.
 *
 * @element ANY
 * @param {expression} expression If the {@link guide.expression expression} truthy then the element
 *     is shown or hidden respectively.
 *
 * @example
   <doc:example>
     <doc:source>
        Click me: <input type="checkbox" name="checked"><br/>
        Show: <span ng:show="checked">I show up when you checkbox is checked?</span> <br/>
        Hide: <span ng:hide="checked">I hide when you checkbox is checked?</span>
     </doc:source>
     <doc:scenario>
       it('should check ng:show / ng:hide', function(){
         expect(element('.doc-example-live span:first:hidden').count()).toEqual(1);
         expect(element('.doc-example-live span:last:visible').count()).toEqual(1);

         input('checked').check();

         expect(element('.doc-example-live span:first:visible').count()).toEqual(1);
         expect(element('.doc-example-live span:last:hidden').count()).toEqual(1);
       });
     </doc:scenario>
   </doc:example>
 */
angularDirective("ng:hide", function(expression, element){
  return function(element){
    this.$onEval(function(){
      element.css($display, toBoolean(this.$eval(expression)) ? $none : '');
    }, element);
  };
});

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:style
 *
 * @description
 * The ng:style allows you to set CSS style on an HTML element conditionally.
 *
 * @element ANY
 * @param {expression} expression {@link guide.expression Expression} which evals to an object whose
 *      keys are CSS style names and values are corresponding values for those CSS keys.
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
       it('should check ng:style', function(){
         expect(element('.doc-example-live span').css('color')).toBe('rgb(0, 0, 0)');
         element('.doc-example-live :button[value=set]').click();
         expect(element('.doc-example-live span').css('color')).toBe('red');
         element('.doc-example-live :button[value=clear]').click();
         expect(element('.doc-example-live span').css('color')).toBe('rgb(0, 0, 0)');
       });
     </doc:scenario>
   </doc:example>
 */
angularDirective("ng:style", function(expression, element){
  return function(element){
    var resetStyle = getStyle(element);
    this.$onEval(function(){
      var style = this.$eval(expression) || {}, key, mergedStyle = {};
      for(key in style) {
        if (resetStyle[key] === undefined) resetStyle[key] = '';
        mergedStyle[key] = style[key];
      }
      for(key in resetStyle) {
        mergedStyle[key] = mergedStyle[key] || resetStyle[key];
      }
      element.css(mergedStyle);
    }, element);
  };
});

