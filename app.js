var app = angular.module('app', ['app.filter', 'app.service', 'app.directive', 'app.controller','app.style']).
config(function($routeProvider){
    console.log("here");
    $routeProvider.when('/view',
        {
            templateUrl:'app/templates/view.html',
            controller:'controller'
        });


});


