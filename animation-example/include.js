angular.module('Animator', [])

  .controller('AppCtrl' , function($scope) {
    $scope.randomTemplate = function() {
      var rand = (new Date().getTime());
      return './random_template.html?' + rand;
    };
  })

  .animation('display-inline', function() {
    return function(element) {
      element.css('display','inline');
    };
  })
