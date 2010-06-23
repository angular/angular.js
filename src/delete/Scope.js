function Scope(initialState, name) {
  var self = this;
  self.widgets = [];
  self.evals = [];
  self.watchListeners = {};
  self.name = name;
  initialState = initialState || {};
  var State = function(){};
  State.prototype = initialState;
  self.state = new State();
  extend(self.state, {
    '$parent': initialState,
    '$watch': bind(self, self.addWatchListener),
    '$eval': bind(self, self.eval),
    '$bind': bind(self, bind, self),
    // change name to autoEval?
    '$addEval': bind(self, self.addEval),
    '$updateView': bind(self, self.updateView)
  });
  if (name == "ROOT") {
    self.state['$root'] = self.state;
  }
};

Scope.expressionCache = {};
Scope.getter = function(instance, path) {
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
    if (_.isUndefined(instance)  && key.charAt(0) == '$') {
      var type = angular['Global']['typeOf'](lastInstance);
      type = angular[type.charAt(0).toUpperCase()+type.substring(1)];
      var fn = type ? type[[key.substring(1)]] : undefined;
      if (fn) {
        instance = _.bind(fn, lastInstance, lastInstance);
        return instance;
      }
    }
  }
  if (typeof instance === 'function' && !instance['$$factory']) {
    return bind(lastInstance, instance);
  }
  return instance;
};

Scope.setter = function(instance, path, value){
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
};

Scope.prototype = {
  // TODO: rename to update? or eval?
  updateView: function() {
    var self = this;
    this.fireWatchers();
    foreach(this.widgets, function(widget){
      self.evalWidget(widget, "", {}, function(){
        this.updateView(self);
      });
    });
    foreach(this.evals, bind(this, this.apply));
  },

  addWidget: function(controller) {
    if (controller) this.widgets.push(controller);
  },

  addEval: function(fn, listener) {
    // todo: this should take a function/string and a listener
    // todo: this is a hack, which will need to be cleaned up.
    var self = this,
        listenFn = listener || noop,
        expr = self.compile(fn);
    this.evals.push(function(){
      self.apply(listenFn, expr());
    });
  },

  isProperty: function(exp) {
    for ( var i = 0; i < exp.length; i++) {
      var ch = exp.charAt(i);
      if (ch!='.'  && !Lexer.prototype.isIdent(ch)) {
        return false;
      }
    }
    return true;
  },

  get: function(path) {
//    log('SCOPE.get', path, Scope.getter(this.state, path));
    return Scope.getter(this.state, path);
  },

  set: function(path, value) {
//    log('SCOPE.set', path, value);
    var instance = this.state;
    return Scope.setter(instance, path, value);
  },

  setEval: function(expressionText, value) {
    this.eval(expressionText + "=" + toJson(value));
  },

  compile: function(exp) {
    if (isFunction(exp)) return bind(this.state, exp);
    var expFn = Scope.expressionCache[exp], self = this;
    if (!expFn) {
      var parser = new Parser(exp);
      expFn = parser.statements();
      parser.assertAllConsumed();
      Scope.expressionCache[exp] = expFn;
    }
    return function(context){
      context = context || {};
      context.self = self.state;
      context.scope = self;
      return expFn.call(self, context);
    };
  },

  eval: function(exp, context) {
//    log('Scope.eval', expressionText);
    return this.compile(exp)(context);
  },

  //TODO: Refactor. This function needs to be an execution closure for widgets
  // move to widgets
  // remove expression, just have inner closure.
  evalWidget: function(widget, expression, context, onSuccess, onFailure) {
    try {
      var value = this.eval(expression, context);
      if (widget.hasError) {
        widget.hasError = false;
        jQuery(widget.view).
          removeClass('ng-exception').
          removeAttr('ng-error');
      }
      if (onSuccess) {
        value = onSuccess.apply(widget, [value]);
      }
      return true;
    } catch (e){
      var jsonError = toJson(e, true);
      error('Eval Widget Error:', jsonError);
      widget.hasError = true;
      jQuery(widget.view).
        addClass('ng-exception').
        attr('ng-error', jsonError);
      if (onFailure) {
        onFailure.apply(widget, [e, jsonError]);
      }
      return false;
    }
  },

  validate: function(expressionText, value, element) {
    var expression = Scope.expressionCache[expressionText];
    if (!expression) {
      expression = new Parser(expressionText).validator();
      Scope.expressionCache[expressionText] = expression;
    }
    var self = {scope:this, self:this.state, '$element':element};
    return expression(self)(self, value);
  },

  entity: function(entityDeclaration, datastore) {
    var expression = new Parser(entityDeclaration).entityDeclaration();
    return expression({scope:this, datastore:datastore});
  },

  clearInvalid: function() {
    var invalid = this.state['$invalidWidgets'];
    while(invalid.length > 0) {invalid.pop();}
  },

  markInvalid: function(widget) {
    this.state['$invalidWidgets'].push(widget);
  },

  watch: function(declaration) {
    var self = this;
    new Parser(declaration).watch()({
      scope:this,
      addListener:function(watch, exp){
        self.addWatchListener(watch, function(n,o){
          try {
            return exp({scope:self}, n, o);
          } catch(e) {
            alert(e);
          }
        });
      }
    });
  },

  addWatchListener: function(watchExpression, listener) {
    // TODO: clean me up!
    if (!isFunction(listener)) {
      listener = this.compile(listener);
    }
    var watcher = this.watchListeners[watchExpression];
    if (!watcher) {
      watcher = {listeners:[], expression:watchExpression};
      this.watchListeners[watchExpression] = watcher;
    }
    watcher.listeners.push(listener);
  },

  fireWatchers: function() {
    var self = this, fired = false;
    foreach(this.watchListeners, function(watcher) {
      var value = self.eval(watcher.expression);
      if (value !== watcher.lastValue) {
        foreach(watcher.listeners, function(listener){
          listener(value, watcher.lastValue);
          fired = true;
        });
        watcher.lastValue = value;
      }
    });
    return fired;
  },

  apply: function(fn) {
    fn.apply(this.state, slice.call(arguments, 1, arguments.length));
  }
};

//////////////////////////////

function getter(instance, path) {
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
    if (_.isUndefined(instance)  && key.charAt(0) == '$') {
      var type = angular['Global']['typeOf'](lastInstance);
      type = angular[type.charAt(0).toUpperCase()+type.substring(1)];
      var fn = type ? type[[key.substring(1)]] : undefined;
      if (fn) {
        instance = _.bind(fn, lastInstance, lastInstance);
        return instance;
      }
    }
  }
  if (typeof instance === 'function' && !instance['$$factory']) {
    return bind(lastInstance, instance);
  }
  return instance;
};

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
};

var compileCache = {};
function expressionCompile(exp){
  if (isFunction(exp)) return exp;
  var expFn = compileCache[exp];
  if (!expFn) {
    var parser = new Parser(exp);
    expFn = parser.statements();
    parser.assertAllConsumed();
    compileCache[exp] = expFn;
  }
  // return expFn
  // TODO(remove this hack)
  return function(){
    return expFn({
      scope: {
        set: this.$set,
        get: this.$get
      }
    });
  };
};

var NON_RENDERABLE_ELEMENTS = {
  '#text': 1, '#comment':1, 'TR':1, 'TH':1
};

function isRenderableElement(element){
  return element && element[0] && !NON_RENDERABLE_ELEMENTS[element[0].nodeName];
}

function rethrow(e) { throw e; }
function errorHandlerFor(element) {
  while (!isRenderableElement(element)) {
    element = element.parent() || jqLite(document.body);
  }
  return function(error) {
    element.attr('ng-error', angular.toJson(error));
    element.addClass('ng-exception');
  };
}

function createScope(parent, Class) {
  function Parent(){}
  function API(){}
  function Behavior(){}

  var instance, behavior, api, watchList = [], evalList = [];

  Class = Class || noop;
  parent = Parent.prototype = parent || {};
  api = API.prototype = new Parent();
  behavior = Behavior.prototype = extend(new API(), Class.prototype);
  instance = new Behavior();

  extend(api, {
    $parent: parent,
    $bind: bind(instance, bind, instance),
    $get: bind(instance, getter, instance),
    $set: bind(instance, setter, instance),

    $eval: function(exp) {
      if (isDefined(exp)) {
        return expressionCompile(exp).apply(instance, slice.call(arguments, 1, arguments.length));
      } else {
        foreach(evalList, function(eval) {
          instance.$tryEval(eval.fn, eval.handler);
        });
        foreach(watchList, function(watch) {
          var value = instance.$tryEval(watch.watch, watch.handler);
          if (watch.last !== value) {
            instance.$tryEval(watch.listener, watch.handler, value, watch.last);
            watch.last = value;
          }
        });
      }
    },

    $tryEval: function (expression, exceptionHandler) {
      try {
        return expressionCompile(expression).apply(instance, slice.call(arguments, 2, arguments.length));
      } catch (e) {
        error(e);
        if (isFunction(exceptionHandler)) {
          exceptionHandler(e);
        } else if (exceptionHandler) {
          errorHandlerFor(exceptionHandler)(e);
        }
      }
    },

    $watch: function(watchExp, listener, exceptionHandler) {
      var watch = expressionCompile(watchExp);
      watchList.push({
        watch: watch,
        last: watch.call(instance),
        handler: exceptionHandler,
        listener:expressionCompile(listener)
      });
    },

    $onEval: function(expr, exceptionHandler){
      evalList.push({
        fn: expressionCompile(expr),
        handler: exceptionHandler
      });
    }
  });

  Class.apply(instance, slice.call(arguments, 2, arguments.length));

  return instance;
}
