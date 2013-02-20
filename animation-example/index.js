angular.module('Animator', [])

  .controller('AppCtrl', function($scope) {
    $scope.add = function(name) {
      if(!name) return;
      $scope.items.push({
        index : $scope.items.length,
        name : name
      });
    };
    $scope.pop = function() {
      $scope.items.pop();
    };
    $scope.remove = function(index) {
      var found;
      for(var i=0;i<$scope.items.length;i++) {
        if($scope.items[i].index == index) {
          found = i;
          break;
        }
      }
      $scope.items.splice(found, 1);
    };
    $scope.sort = function(key) {
      $scope.order = key;
    };

    var defaultItems = ["Afghanistan"," Albania"," Algeria"," American Samoa"," Andorra"," Angola"," Anguilla"," Antarctica"," Antigua and Barbuda"," Argentina"," Armenia"," Aruba"," Ashmore and Cartier"," Australia"," Austria"," Azerbaijan"," Bahrain"," Baker Island"," Bangladesh"," Barbados"," Bassas da India"," Belarus"," Belgium"," Belize"," Benin"," Bermuda"," Bhutan"," Bolivia"," Bosnia and Herzegovina"," Botswana"," Bouvet Island"," Brazil"," British Indian Ocean Territory"," British Virgin Islands"," Brunei Darussalam"," Bulgaria"," Burkina Faso"," Burma"," Burundi"," Cambodia"," Cameroon"," Canada"," Cape Verde"," Cayman Islands"," Central African Republic"," Chad"];
    
    var i = 0;
    $scope.items = [];
    angular.forEach(defaultItems, function(item) {
      $scope.items.push({
        index : i++,
        name : item
      });
    });
    $scope.order = 'index';
  })

  .animation('fade-enter', function() {
    return function(node, parent, after) {
      after ? after.after(node) : parent.append(node);
      node.css('opacity',0);
      node.animate({
        'opacity':1
      });
    };
  })

  .animation('fade-move', function() {
    return function(node, parent, after) {
      //node.css('opacity',0);
      after ? after.after(node) : parent.append(node);
      node.animate({
        'opacity':1
      });
    };
  })

  .animation('fade-leave', function() {
    return function(node, parent, after) {
      node.fadeOut(function() {
        node.remove();
      });
    };
  })

  .animation('slide-enter', function() {
    return function(node, parent, after) {
      after ? after.after(node) : parent.append(node);
      node.css({
        'opacity':0,
        'position':'relative',
        'left':-100
      });
      node.animate({
        'opacity':1,
        'left':0
      });
    };
  })

  .animation('slide-leave', function() {
    return function(node, parent, after) {
      node.animate({
        'opacity':0,
        'left':-100
      }, function() {
        node.remove();
      });
    };
  })

  .animation('slide-move', function() {
    return function(node, parent, after) {
      after ? after.after(node) : parent.append(node);
    };
  })
