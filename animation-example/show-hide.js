angular.module('Animator', [])

  .controller('AppCtrl' , function($scope) {
    $scope.on1 = true;
    $scope.on2 = true;
    $scope.on3 = true;
    $scope.on4 = true;
  })

  .animation('display-inline', function() {
    return function(element) {
      element.css('display','inline');
    };
  })

  .animation('fade-show', function() {
    return function(element) {
      element.css({
        'opacity':0,
        'display':'block'
      });
      element.animate({
        'opacity':1
      });
    };
  })

  .animation('fade-hide', function() {
    return function(element) {
      element.css('display','block');
      element.animate({
        opacity : 0
      }, function() {
        element.css({
          'opacity':1,
          'display':'none'
        });
      });
    };
  })

  .animation('slide-show', function() {
    return function(element) {
      element.css({
        'position':'relative',
        'display':'block'
      });
      element.animate({
        'opacity':1,
        'top':'0',
        'left':'0'
      });
    };
  })

  .animation('slide-hide', function() {
    return function(element) {
      element.css({
        'position':'relative'
      });
      var height = element.height();
      height = '-' + height + 'px';
      element.animate({
        'opacity':0,
        'top':height,
        'left':'0'
      }, function() {
        element.css({
          'display':'none'
        });
      });
    };
  });
