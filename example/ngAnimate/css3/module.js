angular.module('Animator', [])

  .controller('AppCtrl', function($scope) {
    $scope.items = [
      'one','two','three','four','five'
    ];
  })

  .animation('fadeEnterCb', function() {
    return {
      setup : function(element) {
        element.css('opacity',0);
        element.css('top',-element.height());
      },
      start : function(element, done, memo) {
        element.animate({
          'opacity':1,
          'top':0
        }, done);
      }
    }
  })

  .animation('fadeLeaveCb', function() {
    return {
      setup : function(element) {
        var height = element.height();
        return height;
      },
      start : function(element, done, memo) {
        element.animate({
          'opacity':0,
          'top':-memo
        }, done);
      }
    };
  });
