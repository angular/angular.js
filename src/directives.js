
angular.directive("auth", function(expression, element){
  return function(){
    if(expression == "eager") {
      this.$users.fetchCurrent();
    }
  }
});


//expression = "book=Book:{year=2000}"
angular.directive("entity", function(expression, element){
  //parse expression, ignore element
  var entityName; // "Book";
  var instanceName; // "book";
  var defaults; // {year: 2000};

  parse(expression);

  return function(){
    this[entityName] = this.$datastore.entity(entityName, defaults);
    this[instanceName] = this[entityName]();
    this.$watch("$anchor."+instanceName, function(newAnchor){
      this[instanceName] = this[entityName].get(this.$anchor[instanceName]);
    });
  };
});


angular.directive("init", function(expression, element){
  return function(){
    this.$eval(expresssion);
  }
});


//translation of {{ }} to ng-bind is external to this
angular.directive("bind", function(expression, element){
  return function() {
    this.$watch(expression, function(value){
      element.innerText = value;
    });
  };
});


// translation of {{ }} to ng-bind-attr is external to this
// <a href="http://example.com?id={{book.$id}}" alt="{{book.$name}}">link</a>
// becomes
// <a href="" ng-bind-attr="{href:'http://example.com?id={{book.$id}}', alt:'{{book.$name}}'}">link</a>
angular.directive("bind-attr", function(expression, element){
  var jElement = jQuery(element);
  return function(){
    this.$watch(expression, _(jElement.attr).bind(jElement));
  };
});

angular.directive("repeat", function(expression, element){
  var anchor = document.createComment(expression);
  jQuery(element).replace(anchor);
  var template = this.compile(element);
  var lhs = "item";
  var rhs = "items";
  var children = [];
  return function(){
    this.$watch(rhs, function(items){
      foreach(children, function(child){
        child.element.remove();
      });
      foreach(items, function(item){
        var child = template(item); // create scope
        element.addChild(child.element, anchor);
        children.push(child);
      });
    });
  };
});


//ng-non-bindable
angular.directive("non-bindable", function(expression, element){
  return false;
});

//Styling
//
//ng-class
//ng-class-odd, ng-class-even
//ng-style
//ng-show, ng-hide


angular.directive("action", function(expression, element){
  return function(){
    var self = this;
    jQuery(element).click(function(){
      self.$eval(expression);
    });
  };
});

//ng-eval
angular.directive("eval", function(expression, element){
  return function(){
    this.$onUpdate( expression);
  }
});
//ng-watch
// <div ng-watch="$anchor.book: book=Book.get();"/>
angular.directive("watch", function(expression, element){
  var watches = {
    'lhs':'rhs'
  }; // parse
  return function(){
    this.$watch(watches);
  }
});

//widget related
//ng-validate, ng-required, ng-formatter
//ng-error
