function getter(instance, path, unboundFn) {
  if (!path) return instance;
  var element = path.split('.');
  var key;
  var lastInstance = instance;
  var len = element.length;
  for ( var i = 0; i < len; i++) {
    key = element[i];
    if (!key.match(/^[\$\w][\$\w\d]*$/))
        throw "Expression '" + path + "' is not a valid expression for accesing variables.";
    if (instance) {
      lastInstance = instance;
      instance = instance[key];
    }
    if (isUndefined(instance)  && key.charAt(0) == '$') {
      var type = angular['Global']['typeOf'](lastInstance);
      type = angular[type.charAt(0).toUpperCase()+type.substring(1)];
      var fn = type ? type[[key.substring(1)]] : undefined;
      if (fn) {
        instance = bind(lastInstance, fn, lastInstance);
        return instance;
      }
    }
  }
  if (!unboundFn && isFunction(instance)) {
    return bind(lastInstance, instance);
  }
  return instance;
}

function setter(instance, path, value){
  var element = path.split('.');
  for ( var i = 0; element.length > 1; i++) {
    var key = element.shift();
    var newInstance = instance[key];
    if (!newInstance) {
      newInstance = {};
      instance[key] = newInstance;
    }
    instance = newInstance;
  }
  instance[element.shift()] = value;
  return value;
}

///////////////////////////////////
var scopeId = 0,
    getterFnCache = {},
    compileCache = {},
    JS_KEYWORDS = {};
forEach(
    ("abstract,boolean,break,byte,case,catch,char,class,const,continue,debugger,default," +
    "delete,do,double,else,enum,export,extends,false,final,finally,float,for,function,goto," +
    "if,implements,import,ininstanceof,intinterface,long,native,new,null,package,private," +
    "protected,public,return,short,static,super,switch,synchronized,this,throw,throws," +
    "transient,true,try,typeof,var,volatile,void,undefined,while,with").split(/,/),
  function(key){ JS_KEYWORDS[key] = true;}
);
function getterFn(path){
  var fn = getterFnCache[path];
  if (fn) return fn;

  var code = 'var l, fn, t;\n';
  forEach(path.split('.'), function(key) {
    key = (JS_KEYWORDS[key]) ? '["' + key + '"]' : '.' + key;
    code += 'if(!s) return s;\n' +
            'l=s;\n' +
            's=s' + key + ';\n' +
            'if(typeof s=="function" && !(s instanceof RegExp)) s = function(){ return l'+key+'.apply(l, arguments); };\n';
    if (key.charAt(1) == '$') {
      // special code for super-imposed functions
      var name = key.substr(2);
      code += 'if(!s) {\n' +
              '  t = angular.Global.typeOf(l);\n' +
              '  fn = (angular[t.charAt(0).toUpperCase() + t.substring(1)]||{})["' + name + '"];\n' +
              '  if (fn) s = function(){ return fn.apply(l, [l].concat(Array.prototype.slice.call(arguments, 0, arguments.length))); };\n' +
              '}\n';
    }
  });
  code += 'return s;';
  fn = Function('s', code);
  fn["toString"] = function(){ return code; };

  return getterFnCache[path] = fn;
}

///////////////////////////////////

function expressionCompile(exp){
  if (typeof exp === $function) return exp;
  var fn = compileCache[exp];
  if (!fn) {
    var p = parser(exp);
    var fnSelf = p.statements();
    p.assertAllConsumed();
    fn = compileCache[exp] = extend(
      function(){ return fnSelf(this);},
      {fnSelf: fnSelf});
  }
  return fn;
}

function errorHandlerFor(element, error) {
  elementError(element, NG_EXCEPTION, isDefined(error) ? formatError(error) : error);
}


/**
 * @workInProgress
 * @ngdoc overview
 * @name angular.scope
 *
 * @description
 * Scope is a JavaScript object and the execution context for expressions. You can think about
 * scopes as JavaScript objects that have extra APIs for registering watchers. A scope is the
 * context in which model (from the model-view-controller design pattern) exists.
 *
 * Angular scope objects provide the following methods:
 *
 * * {@link angular.scope.$become $become()} -
 * * {@link angular.scope.$bind $bind()} -
 * * {@link angular.scope.$eval $eval()} -
 * * {@link angular.scope.$get $get()} -
 * * {@link angular.scope.$new $new()} -
 * * {@link angular.scope.$onEval $onEval()} -
 * * {@link angular.scope.$service $service()} -
 * * {@link angular.scope.$set $set()} -
 * * {@link angular.scope.$tryEval $tryEval()} -
 * * {@link angular.scope.$watch $watch()} -
 *
 * For more information about how angular scope objects work, see {@link guide/dev_guide.scopes
 * Angular Scope Objects} in the angular Developer Guide.
 */
function createScope(parent, providers, instanceCache) {
  function Parent(){}
  parent = Parent.prototype = (parent || {});
  var instance = new Parent();
  var evalLists = {sorted:[]};
  var $log, $exceptionHandler;

  extend(instance, {
    'this': instance,
    $id: (scopeId++),
    $parent: parent,

    /**
     * @workInProgress
     * @ngdoc function
     * @name angular.scope.$bind
     * @function
     *
     * @description
     * Binds a function `fn` to the current scope. See: {@link angular.bind}.

       <pre>
         var scope = angular.scope();
         var fn = scope.$bind(function(){
           return this;
         });
         expect(fn()).toEqual(scope);
       </pre>
     *
     * @param {function()} fn Function to be bound.
     */
    $bind: bind(instance, bind, instance),


    /**
     * @workInProgress
     * @ngdoc function
     * @name angular.scope.$get
     * @function
     *
     * @description
     * Returns the value for `property_chain` on the current scope. Unlike in JavaScript, if there
     * are any `undefined` intermediary properties, `undefined` is returned instead of throwing an
     * exception.
     *
       <pre>
         var scope = angular.scope();
         expect(scope.$get('person.name')).toEqual(undefined);
         scope.person = {};
         expect(scope.$get('person.name')).toEqual(undefined);
         scope.person.name = 'misko';
         expect(scope.$get('person.name')).toEqual('misko');
       </pre>
     *
     * @param {string} property_chain String representing name of a scope property. Optionally
     *     properties can be chained with `.` (dot), e.g. `'person.name.first'`
     * @returns {*} Value for the (nested) property.
     */
    $get: bind(instance, getter, instance),


    /**
     * @workInProgress
     * @ngdoc function
     * @name angular.scope.$set
     * @function
     *
     * @description
     * Assigns a value to a property of the current scope specified via `property_chain`. Unlike in
     * JavaScript, if there are any `undefined` intermediary properties, empty objects are created
     * and assigned in to them instead of throwing an exception.
     *
       <pre>
         var scope = angular.scope();
         expect(scope.person).toEqual(undefined);
         scope.$set('person.name', 'misko');
         expect(scope.person).toEqual({name:'misko'});
         expect(scope.person.name).toEqual('misko');
       </pre>
     *
     * @param {string} property_chain String representing name of a scope property. Optionally
     *     properties can be chained with `.` (dot), e.g. `'person.name.first'`
     * @param {*} value Value to assign to the scope property.
     */
    $set: bind(instance, setter, instance),


    /**
     * @workInProgress
     * @ngdoc function
     * @name angular.scope.$eval
     * @function
     *
     * @description
     * Without the `exp` parameter triggers an eval cycle for this scope and its child scopes.
     *
     * With the `exp` parameter, compiles the expression to a function and calls it with `this` set
     * to the current scope and returns the result. In other words, evaluates `exp` as angular
     * expression in the context of the current scope.
     *
     * # Example
       <pre>
         var scope = angular.scope();
         scope.a = 1;
         scope.b = 2;

         expect(scope.$eval('a+b')).toEqual(3);
         expect(scope.$eval(function(){ return this.a + this.b; })).toEqual(3);

         scope.$onEval('sum = a+b');
         expect(scope.sum).toEqual(undefined);
         scope.$eval();
         expect(scope.sum).toEqual(3);
       </pre>
     *
     * @param {(string|function())=} exp An angular expression to be compiled to a function or a js
     *     function.
     *
     * @returns {*} The result of calling compiled `exp` with `this` set to the current scope.
     */
    $eval: function(exp) {
      var type = typeof exp;
      var i, iSize;
      var j, jSize;
      var queue;
      var fn;
      if (type == $undefined) {
        for ( i = 0, iSize = evalLists.sorted.length; i < iSize; i++) {
          for ( queue = evalLists.sorted[i],
              jSize = queue.length,
              j= 0; j < jSize; j++) {
            instance.$tryEval(queue[j].fn, queue[j].handler);
          }
        }
      } else if (type === $function) {
        return exp.call(instance);
      } else  if (type === 'string') {
        return expressionCompile(exp).call(instance);
      }
    },


    /**
     * @workInProgress
     * @ngdoc function
     * @name angular.scope.$tryEval
     * @function
     *
     * @description
     * Evaluates the expression in the context of the current scope just like
     * {@link angular.scope.$eval} with expression parameter, but also wraps it in a try/catch
     * block.
     *
     * If an exception is thrown then `exceptionHandler` is used to handle the exception.
     *
     * # Example
       <pre>
         var scope = angular.scope();
         scope.error = function(){ throw 'myerror'; };
         scope.$exceptionHandler = function(e) {this.lastException = e; };

         expect(scope.$eval('error()'));
         expect(scope.lastException).toEqual('myerror');
         this.lastException = null;

         expect(scope.$eval('error()'),  function(e) {this.lastException = e; });
         expect(scope.lastException).toEqual('myerror');

         var body = angular.element(window.document.body);
         expect(scope.$eval('error()'), body);
         expect(body.attr('ng-exception')).toEqual('"myerror"');
         expect(body.hasClass('ng-exception')).toEqual(true);
       </pre>
     *
     * @param {string|function()} expression Angular expression to evaluate.
     * @param {(function()|DOMElement)=} exceptionHandler Function to be called or DOMElement to be
     *     decorated.
     * @returns {*} The result of `expression` evaluation.
     */
    $tryEval: function (expression, exceptionHandler) {
      var type = typeof expression;
      try {
        if (type == $function) {
          return expression.call(instance);
        } else if (type == 'string'){
          return expressionCompile(expression).call(instance);
        }
      } catch (e) {
        if ($log) $log.error(e);
        if (isFunction(exceptionHandler)) {
          exceptionHandler(e);
        } else if (exceptionHandler) {
          errorHandlerFor(exceptionHandler, e);
        } else if (isFunction($exceptionHandler)) {
          $exceptionHandler(e);
        }
      }
    },


    /**
     * @workInProgress
     * @ngdoc function
     * @name angular.scope.$watch
     * @function
     *
     * @description
     * Registers `listener` as a callback to be executed every time the `watchExp` changes. Be aware
     * that the callback gets, by default, called upon registration, this can be prevented via the
     * `initRun` parameter.
     *
     * # Example
       <pre>
         var scope = angular.scope();
         scope.name = 'misko';
         scope.counter = 0;

         expect(scope.counter).toEqual(0);
         scope.$watch('name', 'counter = counter + 1');
         expect(scope.counter).toEqual(1);

         scope.$eval();
         expect(scope.counter).toEqual(1);

         scope.name = 'adam';
         scope.$eval();
         expect(scope.counter).toEqual(2);
       </pre>
     *
     * @param {function()|string} watchExp Expression that should be evaluated and checked for
     *    change during each eval cycle. Can be an angular string expression or a function.
     * @param {function()|string} listener Function (or angular string expression) that gets called
     *    every time the value of the `watchExp` changes. The function will be called with two
     *    parameters, `newValue` and `oldValue`.
     * @param {(function()|DOMElement)=} [exceptionHanlder=angular.service.$exceptionHandler] Handler
     *    that gets called when `watchExp` or `listener` throws an exception. If a DOMElement is
     *    specified as handler, the element gets decorated by angular with the information about the
     *    exception.
     * @param {boolean=} [initRun=true] Flag that prevents the first execution of the listener upon
     *    registration.
     *
     */
    $watch: function(watchExp, listener, exceptionHandler, initRun) {
      var watch = expressionCompile(watchExp),
          last = watch.call(instance);
      listener = expressionCompile(listener);
      function watcher(firstRun){
        var value = watch.call(instance),
            // we have to save the value because listener can call ourselves => inf loop
            lastValue = last;
        if (firstRun || lastValue !== value) {
          last = value;
          instance.$tryEval(function(){
            return listener.call(instance, value, lastValue);
          }, exceptionHandler);
        }
      }
      instance.$onEval(PRIORITY_WATCH, watcher);
      if (isUndefined(initRun)) initRun = true;
      if (initRun) watcher(true);
    },

    /**
     * @workInProgress
     * @ngdoc function
     * @name angular.scope.$onEval
     * @function
     *
     * @description
     * Evaluates the `expr` expression in the context of the current scope during each
     * {@link angular.scope.$eval eval cycle}.
     *
     * # Example
       <pre>
         var scope = angular.scope();
         scope.counter = 0;
         scope.$onEval('counter = counter + 1');
         expect(scope.counter).toEqual(0);
         scope.$eval();
         expect(scope.counter).toEqual(1);
       </pre>
     *
     * @param {number} [priority=0] Execution priority. Lower priority numbers get executed first.
     * @param {string|function()} expr Angular expression or function to be executed.
     * @param {(function()|DOMElement)=} [exceptionHandler=angular.service.$exceptionHandler] Handler
     *     function to call or DOM element to decorate when an exception occurs.
     *
     */
    $onEval: function(priority, expr, exceptionHandler){
      if (!isNumber(priority)) {
        exceptionHandler = expr;
        expr = priority;
        priority = 0;
      }
      var evalList = evalLists[priority];
      if (!evalList) {
        evalList = evalLists[priority] = [];
        evalList.priority = priority;
        evalLists.sorted.push(evalList);
        evalLists.sorted.sort(function(a,b){return a.priority-b.priority;});
      }
      evalList.push({
        fn: expressionCompile(expr),
        handler: exceptionHandler
      });
    },

    /**
     * @workInProgress
     * @ngdoc function
     * @name angular.scope.$become
     * @function
     * @deprecated This method will be removed before 1.0
     *
     * @description
     * Modifies the scope to act like an instance of the given class by:
     *
     * - copying the class's prototype methods
     * - applying the class's initialization function to the scope instance (without using the new
     *   operator)
     *
     * That makes the scope be a `this` for the given class's methods — effectively an instance of
     * the given class with additional (scope) stuff. A scope can later `$become` another class.
     *
     * `$become` gets used to make the current scope act like an instance of a controller class.
     * This allows for use of a controller class in two ways.
     *
     * - as an ordinary JavaScript class for standalone testing, instantiated using the new
     *   operator, with no attached view.
     * - as a controller for an angular model stored in a scope, "instantiated" by
     *   `scope.$become(ControllerClass)`.
     *
     * Either way, the controller's methods refer to the model  variables like `this.name`. When
     * stored in a scope, the model supports data binding. When bound to a view, {{name}} in the
     * HTML template refers to the same variable.
     */
    $become: function(Class) {
      if (isFunction(Class)) {
        instance.constructor = Class;
        forEach(Class.prototype, function(fn, name){
          instance[name] = bind(instance, fn);
        });
        instance.$service.apply(instance, concat([Class, instance], arguments, 1));

        //TODO: backwards compatibility hack, remove when we don't depend on init methods
        if (isFunction(Class.prototype.init)) {
          instance.init();
        }
      }
    },

    /**
     * @workInProgress
     * @ngdoc function
     * @name angular.scope.$new
     * @function
     *
     * @description
     * Creates a new {@link angular.scope scope}, that:
     *
     * - is a child of the current scope
     * - will {@link angular.scope.$become $become} of type specified via `constructor`
     *
     * @param {function()} constructor Constructor function of the type the new scope should assume.
     * @returns {Object} The newly created child scope.
     *
     */
    $new: function(constructor) {
      var child = createScope(instance);
      child.$become.apply(instance, concat([constructor], arguments, 1));
      instance.$onEval(child.$eval);
      return child;
    }

  });

  if (!parent.$root) {
    instance.$root = instance;
    instance.$parent = instance;

    /**
     * @workInProgress
     * @ngdoc function
     * @name angular.scope.$service
     * @function
     *
     * @description
     * Provides access to angular's dependency injector and
     * {@link angular.service registered services}. In general the use of this api is discouraged,
     * except for tests and components that currently don't support dependency injection (widgets,
     * filters, etc).
     *
     * @param {string} serviceId String ID of the service to return.
     * @returns {*} Value, object or function returned by the service factory function if any.
     */
    (instance.$service = createInjector(instance, providers, instanceCache))();
  }

  $log = instance.$service('$log');
  $exceptionHandler = instance.$service('$exceptionHandler');

  return instance;
}
