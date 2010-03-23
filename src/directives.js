angularDirective("ng-init", function(expression){
  return function(){
    this.$eval(expression);
  };
});

angularDirective("ng-eval", function(expression){
  return function(){
    this.$addEval(expression);
  };
});

angularDirective("ng-bind", function(expression){
  return function(element) {
    this.$watch(expression, function(value){
      element.text(value);
    });
  };
});

angularDirective("ng-bind-attr", function(expression){
  return function(element){
    this.$watch(expression, bind(element, element.attr));
  };
});

angularDirective("ng-non-bindable", function(){
  this.descend(false);
});

angularDirective("ng-repeat", function(expression, element){
  var reference = this.reference("ng-repeat: " + expression),
      r = element.removeAttr('ng-repeat'),
      template = this.compile(element),
      match = expression.match(/^\s*(.+)\s+in\s+(.*)\s*$/),
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

  var parent = element.parent();
  element.replaceWith(reference);
  return function(){
    var children = [],
        currentScope = this;
    this.$addEval(rhs, function(items){
      var index = 0, childCount = children.length, childScope, lastElement = reference;
      foreach(items || [], function(value, key){
        if (index < childCount) {
          // reuse existing child
          childScope = children[index];
        } else {
          // grow children
          childScope = template(element.clone(), currentScope);
          childScope.init();
          childScope.scope.set('$index', index);
          childScope.element.attr('ng-index', index);
          lastElement.after(childScope.element);
          children.push(childScope);
        }
        childScope.scope.set(valueIdent, value);
        if (keyIdent) childScope.scope.set(keyIdent, key);
        childScope.scope.updateView();
        lastElement = childScope.element;
        index ++;
      });
      // shrink children
      while(children.length > index) {
        children.pop().element.remove();
      }
    });
  };
}, {exclusive: true});

angularDirective("ng-action", function(expression, element){
  return function(){
    var self = this;
    element.click(function(){
      self.$eval(expression);
    });
  };
});

angularDirective("ng-watch", function(expression, element){
  var match = expression.match(/^([^.]*):(.*)$/);
  if (!match) {
    throw "Expecting watch expression 'ident_to_watch: watch_statement' got '"
        + expression + "'";
  }
  return function(){
    this.$watch(match[1], match[2]);
  };
});

function ngClass(selector) {
  return function(expression, element){
    var existing = element[0].className + ' ';
    return function(element){
      this.$addEval(expression, function(value){
        if (selector(this.$index)) {
          if (isArray(value)) value = value.join(' ');
          element[0].className = (existing + value).replace(/\s\s+/g, ' ');
        }
      });
    };
  };
}

angularDirective("ng-class", ngClass(function(){return true;}));
angularDirective("ng-class-odd", ngClass(function(i){return i % 2 == 1;}));
angularDirective("ng-class-even", ngClass(function(i){return i % 2 == 0;}));

angularDirective("ng-show", function(expression, element){
  return function(element){
    this.$addEval(expression, function(value){
      element.css('display', toBoolean(value) ? '' : 'none');
    });
  };
});

angularDirective("ng-hide", function(expression, element){
  return function(element){
    this.$addEval(expression, function(value){
      element.css('display', toBoolean(value) ? 'none' : '');
    });
  };
});
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////





//widget related
//ng-validate, ng-required, ng-formatter
//ng-error

//ng-scope ng-controller????
