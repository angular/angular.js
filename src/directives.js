angularDirective("ng-init", function(expression){
  return function(element){
    this.$tryEval(expression, element);
  };
});

angularDirective("ng-controller", function(expression){
  return function(element){
    var controller = getter(window, expression, true) || getter(this, expression, true);
    if (!controller)
      throw "Can not find '"+expression+"' controller.";
    if (!isFunction(controller))
      throw "Reference '"+expression+"' is not a class.";
    this.$become(controller);
    (this.init || noop)();
  };
});

angularDirective("ng-eval", function(expression){
  return function(element){
    this.$onEval(expression, element);
  };
});

angularDirective("ng-bind", function(expression){
  return function(element) {
    var lastValue, lastError;
    this.$onEval(function() {
      var error,
          value = this.$tryEval(expression, function(e){
            error = toJson(e);
          }),
          isElem = isElement(value);
      if (!isElem && isObject(value)) {
        value = toJson(value);
      }
      if (value != lastValue || error != lastError) {
        lastValue = value;
        lastError = error;
        elementError(element, NG_EXCEPTION, error);
        if (error) value = error;
        if (isElem) {
          element.html('');
          element.append(value);
        } else {
          element.text(value);
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
    foreach(parseBindings(template), function(text){
      var exp = binding(text);
      bindings.push(exp ? function(element){
        var error, value = this.$tryEval(exp, function(e){
          error = toJson(e);
        });
        elementError(element, NG_EXCEPTION, error);
        return error ? error : value;
      } : function() {
        return text;
      });
    });
    bindTemplateCache[template] = fn = function(element){
      var parts = [], self = this;
      foreach(bindings, function(fn){
        var value = fn.call(self, element);
        if (isElement(value))
          value = '';
        else if (isObject(value))
          value = toJson(value, true);
        parts.push(value);
      });
      return parts.join('');
    };
  }
  return fn;
}

angularDirective("ng-bind-template", function(expression){
  var templateFn = compileBindTemplate(expression);
  return function(element) {
    var lastValue;
    this.$onEval(function() {
      var value = templateFn.call(this, element);
      if (value != lastValue) {
        element.text(value);
        lastValue = value;
      }
    }, element);
  };
});

var REMOVE_ATTRIBUTES = {
  'disabled':true,
  'readonly':true,
  'checked':true
};
angularDirective("ng-bind-attr", function(expression){
  return function(element){
    this.$onEval(function(){
      foreach(this.$eval(expression), function(bindExp, key) {
        var value = compileBindTemplate(bindExp).call(this, element);
        if (REMOVE_ATTRIBUTES[lowercase(key)]) {
          if (!toBoolean(value)) {
            element.removeAttr(key);
          } else {
            element.attr(key, value);
          }
          (element.data('$validate')||noop)();
        } else {
          element.attr(key, value);
        }
      }, this);
    }, element);
  };
});

angularWidget("@ng-non-bindable", noop);

angularWidget("@ng-repeat", function(expression, element){
  element.removeAttr('ng-repeat');
  element.replaceWith(this.comment("ng-repeat: " + expression));
  var template = this.compile(element);
  return function(reference){
    var match = expression.match(/^\s*(.+)\s+in\s+(.*)\s*$/),
        lhs, rhs, valueIdent, keyIdent;
    if (! match) {
      throw "Expected ng-repeat in form of 'item in collection' but got '" +
      expression + "'.";
    }
    lhs = match[1];
    rhs = match[2];
    match = lhs.match(/^([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\)$/);
    if (!match) {
      throw "'item' in 'item in collection' should be identifier or (key, value) but got '" +
      keyValue + "'.";
    }
    valueIdent = match[3] || match[1];
    keyIdent = match[2];

    if (isUndefined(this.$eval(rhs))) this.$set(rhs, []);

    var children = [], currentScope = this;
    this.$onEval(function(){
      var index = 0, childCount = children.length, childScope, lastElement = reference;
      foreach(this.$tryEval(rhs, reference), function(value, key){
        function assign(scope) {
          scope[valueIdent] = value;
          if (keyIdent) scope[keyIdent] = key;
        }
        if (index < childCount) {
          // reuse existing child
          assign(childScope = children[index]);
        } else {
          // grow children
          assign(childScope = template(element.clone(), createScope(currentScope)));
          lastElement.after(childScope.$element);
          childScope.$index = index;
          childScope.$element.attr('ng-repeat-index', index);
          childScope.$init();
          children.push(childScope);
        }
        childScope.$eval();
        lastElement = childScope.$element;
        index ++;
      });
      // shrink children
      while(children.length > index) {
        children.pop().$element.remove();
      }
    }, reference);
  };
});

angularDirective("ng-click", function(expression, element){
  return function(element){
    var self = this;
    element.bind('click', function(){
      self.$tryEval(expression, element);
      self.$root.$eval();
      return false;
    });
  };
});

angularDirective("ng-watch", function(expression, element){
  return function(element){
    var self = this;
    new Parser(expression).watch()({
      scope:{get: self.$get, set: self.$set},
      addListener:function(watch, exp){
        self.$watch(watch, function(){
          return exp({scope:{get: self.$get, set: self.$set}, state:self});
        }, element);
      }
    });
  };
});

function ngClass(selector) {
  return function(expression, element){
    var existing = element[0].className + ' ';
    return function(element){
      this.$onEval(function(){
        var value = this.$eval(expression);
        if (selector(this.$index)) {
          if (isArray(value)) value = value.join(' ');
          element[0].className = trim(existing + value);
        }
      }, element);
    };
  };
}

angularDirective("ng-class", ngClass(function(){return true;}));
angularDirective("ng-class-odd", ngClass(function(i){return i % 2 === 0;}));
angularDirective("ng-class-even", ngClass(function(i){return i % 2 === 1;}));

angularDirective("ng-show", function(expression, element){
  return function(element){
    this.$onEval(function(){
      element.css('display', toBoolean(this.$eval(expression)) ? '' : 'none');
    }, element);
  };
});

angularDirective("ng-hide", function(expression, element){
  return function(element){
    this.$onEval(function(){
      element.css('display', toBoolean(this.$eval(expression)) ? 'none' : '');
    }, element);
  };
});

angularDirective("ng-style", function(expression, element){
  return function(element){
    this.$onEval(function(){
      element.css(this.$eval(expression));
    }, element);
  };
});

