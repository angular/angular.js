function Scope(initialState, name) {
  this.widgets = [];
  this.watchListeners = {};
  this.name = name;
  initialState = initialState || {};
  var State = function(){};
  State.prototype = initialState;
  this.state = new State();
  this.state['$parent'] = initialState;
  if (name == "ROOT") {
    this.state['$root'] = this.state;
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

Scope.prototype = {
  updateView: function() {
    var self = this;
    this.fireWatchers();
    _.each(this.widgets, function(widget){
      self.evalWidget(widget, "", {}, function(){
        this.updateView(self);
      });
    });
  },
  
  addWidget: function(controller) {
    if (controller) this.widgets.push(controller);
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
  },
  
  setEval: function(expressionText, value) {
    this.eval(expressionText + "=" + toJson(value));
  },
  
  eval: function(expressionText, context) {
//    log('Scope.eval', expressionText);
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
      error('Eval Widget Error:', e);
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
    var watcher = this.watchListeners[watchExpression];
    if (!watcher) {
      watcher = {listeners:[], expression:watchExpression};
      this.watchListeners[watchExpression] = watcher;
    }
    watcher.listeners.push(listener);
  },
  
  fireWatchers: function() {
    var self = this;
    var fired = false;
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
  }
};