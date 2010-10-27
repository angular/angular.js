function DocController($resource, $location){
  this.docs = $resource('documentation.json').get();
  this.getPartialDoc = function(){
    return encodeURIComponent($location.hashPath) + '.html';
  };
}
DocController.$inject=['$resource', '$location'];