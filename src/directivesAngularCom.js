
angular.directive("auth", function(expression, element){
  return function(){
    if(expression == "eager") {
      this.$users.fetchCurrent();
    }
  };
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


