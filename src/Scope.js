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
      var fn = type ? type[[key.substring(1)]] : _undefined;
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
foreach(
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
  foreach(path.split('.'), function(key) {
    key = (JS_KEYWORDS[key]) ? '["' + key + '"]' : '.' + key;
    code += 'if(!s) return s;\n' +
            'l=s;\n' +
            's=s' + key + ';\n' +
            'if(typeof s=="function") s = function(){ return l'+key+'.apply(l, arguments); };\n';
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

function createScope(parent, providers, instanceCache) {
  function Parent(){}
  parent = Parent.prototype = (parent || {});
  var instance = new Parent();
  var evalLists = {sorted:[]};
  var postList = [], postHash = {}, postId = 0;

  extend(instance, {
    'this': instance,
    $id: (scopeId++),
    $parent: parent,
    $bind: bind(instance, bind, instance),
    $get: bind(instance, getter, instance),
    $set: bind(instance, setter, instance),

    $eval: function $eval(exp) {
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
        while(postList.length) {
          fn = postList.shift();
          delete postHash[fn.$postEvalId];
          instance.$tryEval(fn);
        }
      } else if (type === $function) {
        return exp.call(instance);
      } else  if (type === 'string') {
        return expressionCompile(exp).call(instance);
      }
    },

    $tryEval: function (expression, exceptionHandler) {
      var type = typeof expression;
      try {
        if (type == $function) {
          return expression.call(instance);
        } else if (type == 'string'){
          return expressionCompile(expression).call(instance);
        }
      } catch (e) {
        (instance.$log || {error:error}).error(e);
        if (isFunction(exceptionHandler)) {
          exceptionHandler(e);
        } else if (exceptionHandler) {
          errorHandlerFor(exceptionHandler, e);
        } else if (isFunction(instance.$exceptionHandler)) {
          instance.$exceptionHandler(e);
        }
      }
    },


    /**
     * Registers `listener` as a watcher of the `watchExp` and executes it (optional, see `initRun`
     * flag). Afterwards `listener` is executed every time the result of `watchExp` changes.
     *
     * The `listener` function will be called with two parameters `newValue` and `oldValue`.
     *
     * @param {Function|string} watchExp Expression that yields results. Can be an angular string
     *    expression or a function.
     * @param {Function|string} listener Function (or angular string expression) that gets called
     *    every time the value of the `watchExp` changes.
     * @param {Function} exceptionHanlder Handler that gets called when listeners throws an
     *    exception.
     * @param {boolean} [initRun=true] Flag that prevents the first execution of the listener upon
     *    registration.
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

    $postEval: function(expr) {
      if (expr) {
        var fn = expressionCompile(expr);
        var id = fn.$postEvalId;
        if (!id) {
          id = '$' + instance.$id + "_" + (postId++);
          fn.$postEvalId = id;
        }
        if (!postHash[id]) {
          postList.push(postHash[id] = fn);
        }
      }
    },

    $become: function(Class) {
      if (isFunction(Class)) {
        instance.constructor = Class;
        foreach(Class.prototype, function(fn, name){
          instance[name] = bind(instance, fn);
        });
        instance.$inject.apply(instance, concat([Class, instance], arguments, 1));

        //TODO: backwards compatibility hack, remove when we don't depend on init methods
        if (isFunction(Class.prototype.init)) {
          instance.init();
        }
      }
    },

    $new: function(Class) {
      var child = createScope(instance);
      child.$become.apply(instance, concat([Class], arguments, 1));
      instance.$onEval(child.$eval);
      return child;
    }

  });

  if (!parent.$root) {
    instance.$root = instance;
    instance.$parent = instance;
    (instance.$inject = createInjector(instance, providers, instanceCache))();
  }

  return instance;
}
