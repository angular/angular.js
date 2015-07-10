'use strict'
var templator = angular.module('ngTemplator', ['ngSanitize']);
templator.config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['self', '**']);
});
templator.service('GetSections', function ($http) {
    var getData = function () {
        return $http.get('example.json');
    };
    return {
        getData: getData
    };
});
templator.factory('GetTemplate', function ($http) {  
	var Render = function (template) {		
        return $http.get(template);
    };
    return {
    	Render: Render
    };
});
templator.controller('LayoutCtrl', function (GetSections) {
    var ctrl = this;
    ctrl.sections = [];
    ctrl.fetchContent = function () {
    	GetSections.getData().then(function (result) {
            ctrl.sections = result.data;
        });    	
    };
    ctrl.fetchContent();
});
templator.directive('renderTemplaminator', function ($http,$compile,$sce, GetTemplate) {
	var linker = function (scope, element, attrs) {	
	    var codex = JSON.stringify(scope.content, null, 4);
			scope.content.code = codex;
			GetTemplate.Render(scope.content.template).then(function (result) {
    			    	scope.content.render = result.data;
	    	    	  element.html(result.data);
	    	    	  $compile(element.contents())(scope);
    	});
    };
    return {
        restrict: 'E',
        link: linker,
        scope: {
        	content: '='
        }
    };
});
