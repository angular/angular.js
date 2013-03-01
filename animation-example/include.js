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

  .animation('fade-enter', function() {
    return function(element, container) {
      element.css({
        'opacity':0
      });
      container.append(element);
      element.animate({
        'opacity':1
      });
    };
  })

  .animation('fade-leave', function() {
    return function(element) {
      element.animate({
        'opacity':0
      }, function() {
        element.remove();
      });
    };
  })

  .animation('slide-enter', function() {
    return function(element, container) {
      var width = container.width();
      element.css({
        'left':(width * 2),
        'width':width,
        'top':0
      });
      container.append(element);
      element.animate({
        'left':0
      });
    };
  })

  .animation('slide-leave', function() {
    return function(element, container) {
      var width = container.width();
      element.animate({
        'left':-width
      }, function() {
        element.remove();
      });
    };
  })
