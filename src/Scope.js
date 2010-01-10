// Copyright (C) 2009 BRAT Tech LLC

Scope = function(initialState, name) {
  this.widgets = [];
  this.watchListeners = {};
  this.name = name;
  initialState = initialState || {};
  var State = function(){};
  State.prototype = initialState;
  this.state = new State();
  this.state.$parent = initialState;
  if (name == "ROOT") {
    this.state.$root = this.state;
  }
};

Scope.expressionCache = {};

Scope.prototype.updateView = function() {
  var self = this;
  this.fireWatchers();
  _.each(this.widgets, function(widget){
    self.evalWidget(widget, "", {}, function(){
      this.updateView(self);
    });
  });
};

Scope.prototype.addWidget = function(controller) {
  if (controller) this.widgets.push(controller);
};

Scope.prototype.isProperty = function(exp) {
  for ( var i = 0; i < exp.length; i++) {
    var ch = exp.charAt(i);
    if (ch!='.'  && !Lexer.prototype.isIdent(ch)) {
      return false;
    }
  }
  return true;
};

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
  if (typeof instance === 'function' && !instance.$$factory) {
    return bind(lastInstance, instance);
  }
  return instance;
};

Scope.prototype.get = function(path) {
  return Scope.getter(this.state, path);
};

Scope.prototype.set = function(path, value) {
  var element = path.split('.');
  var instance = this.state;
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

Scope.prototype.setEval = function(expressionText, value) {
  this.eval(expressionText + "=" + toJson(value));
};

Scope.prototype.eval = function(expressionText, context) {
  var expression = Scope.expressionCache[expressionText];
  if (!expression) {
    var parser = new Parser(expressionText);
    expression = parser.statements();
    parser.assertAllConsumed();
    Scope.expressionCache[expressionText] = expression;
  }
  context = context || {};
  context.scope = this;
  return expression(context);
};

//TODO: Refactor. This function needs to be an execution closure for widgets
// move to widgets
// remove expression, just have inner closure.
Scope.prototype.evalWidget = function(widget, expression, context, onSuccess, onFailure) {
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
    console.error('Eval Widget Error:', e);
    var jsonError = toJson(e, true);
    widget.hasError = true;
    jQuery(widget.view).
      addClass('ng-exception').
      attr('ng-error', jsonError);
    if (onFailure) {
      onFailure.apply(widget, [e, jsonError]);
    }
    return false;
  }
};

Scope.prototype.validate = function(expressionText, value) {
  var expression = Scope.expressionCache[expressionText];
  if (!expression) {
    expression = new Parser(expressionText).validator();
    Scope.expressionCache[expressionText] = expression;
  }
  var self = {scope:this};
  return expression(self)(self, value);
};

Scope.prototype.entity = function(entityDeclaration) {
  var expression = new Parser(entityDeclaration).entityDeclaration();
  return expression({scope:this});
};

Scope.prototype.markInvalid = function(widget) {
  this.state.$invalidWidgets.push(widget);
};

Scope.prototype.watch = function(declaration) {
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
};

Scope.prototype.addWatchListener = function(watchExpression, listener) {
  var watcher = this.watchListeners[watchExpression];
  if (!watcher) {
    watcher = {listeners:[], expression:watchExpression};
    this.watchListeners[watchExpression] = watcher;
  }
  watcher.listeners.push(listener);
};

Scope.prototype.fireWatchers = function() {
  var self = this;
  var fired = false;
  jQuery.each(this.watchListeners, function(name, watcher) {
    var value = self.eval(watcher.expression);
    if (value !== watcher.lastValue) {
      jQuery.each(watcher.listeners, function(i, listener){
        listener(value, watcher.lastValue);
        fired = true;
      });
      watcher.lastValue = value;
    }
  });
  return fired;
};
