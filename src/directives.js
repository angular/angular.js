angularDirective("ng-init", function(expression){
  return function(element){
    this.$tryEval(expression, element);
  };
});

angularDirective("ng-eval", function(expression){
  return function(element){
    this.$onEval(expression, element);
  };
});

angularDirective("ng-bind", function(expression){
  var templateFn = compileBindTemplate("{{" + expression + "}}");
  return function(element) {
    var lastValue;
    this.$onEval(function() {
      var value = templateFn.call(this);
      if (value != lastValue) {
        element.text(value);
        lastValue = value;
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
      bindings.push(exp ? function(){
        return this.$eval(exp);
      } : function(){
        return text;
      });
    });
    bindTemplateCache[template] = fn = function(){
      var parts = [], self = this;
      foreach(bindings, function(fn){
        var value = fn.call(self);
        if (isObject(value)) value = toJson(value, true);
        parts.push(value);
      });
      return parts.join('');
    };
  }
  return fn;
};
angularDirective("ng-bind-template", function(expression){
  var templateFn = compileBindTemplate(expression);
  return function(element) {
    var lastValue;
    this.$onEval(function() {
      var value = templateFn.call(this);
      if (value != lastValue) {
        element.text(value);
        lastValue = value;
      }
    }, element);
  };
});

angularDirective("ng-bind-attr", function(expression){
  return function(element){
    this.$onEval(function(){
      foreach(this.$eval(expression), function(value, key){
        element.attr(key, compileBindTemplate(value).call(this));
      }, this);
    }, element);
  };
});

angularDirective("ng-non-bindable", function(){
  this.descend(false);
});

angularDirective("ng-repeat", function(expression, element){
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

    var children = [], currentScope = this;
    this.$onEval(function(){
      var index = 0, childCount = children.length, childScope, lastElement = reference;
      foreach(this.$tryEval(rhs, reference), function(value, key){
        if (index < childCount) {
          // reuse existing child
          childScope = children[index];
        } else {
          // grow children
          childScope = template(element.clone(), currentScope);
          lastElement.after(childScope.$element);
          childScope.$index = index;
          childScope.$element.attr('ng-index', index);
          childScope.$init();
          children.push(childScope);
        }
        childScope[valueIdent] = value;
        if (keyIdent) childScope[keyIdent] = key;
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
}, {exclusive: true});

angularDirective("ng-action", function(expression, element){
  return function(element){
    var self = this;
    element.click(function(){
      self.$tryEval(expression, element);
      self.$eval();
    });
  };
});

angularDirective("ng-watch", function(expression, element){
  var match = expression.match(/^([^.]*):(.*)$/);
  return function(element){
    if (!match) {
      throw "Expecting watch expression 'ident_to_watch: watch_statement' got '"
      + expression + "'";
    }
    this.$watch(match[1], match[2], element);
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
          element[0].className = (existing + value).replace(/\s\s+/g, ' ');
        }
      }, element);
    };
  };
}

angularDirective("ng-class", ngClass(function(){return true;}));
angularDirective("ng-class-odd", ngClass(function(i){return i % 2 == 1;}));
angularDirective("ng-class-even", ngClass(function(i){return i % 2 == 0;}));

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

