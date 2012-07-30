AngularJS
=========

This repo is a fork of AngularJS which adds support for parameter suffixes for resources.

This way you can create resources which have a URL which relates to /resources/:id.json

## Usage
```
angular.module('App',['ngResource']).factory('Model',['$resource',function($resource) {

  return $resource('/path/to/resource',{
      _suffx : '.json'
    },{
      //actions
    }
  );
}]);
