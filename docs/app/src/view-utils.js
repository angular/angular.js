angular.
    module('ViewUtils', ['ngMaterial']).
    service('ViewUtils', ViewUtilsService);

ViewUtilsService.$inject = ['$mdMedia', '$mdSidenav'];
function ViewUtilsService($mdMedia, $mdSidenav) {
  this.closeSidenav = closeSidenav;
  this.getFlex = getFlex;
  this.getValueForSize = getValueForSize;
  this.media = $mdMedia;
  this.openSidenav = openSidenav;

  var flexMap = {
    toc: {
      'gt-lg': '20',
      'lg': '25',
      'md': '33'
    },
    search: {
      'gt-lg': '20'
    }
  };

  function closeSidenav(id) {
    $mdSidenav(id).close();
  }

  function getFlex(componentId) {
    var flex;

    if (flexMap.hasOwnProperty(componentId)) {
      var queriesMap = flexMap[componentId];
      flex = getValueForSize(queriesMap);
    }

    return flex;
  }

  function getValueForSize(queriesMap, defaultVal) {
    var val = defaultVal;

    Object.keys(queriesMap).some(function(q) {
      if ($mdMedia(q)) {
        val= queriesMap[q];
        return true;
      }
    });

    return val;
  }

  function openSidenav(id) {
    $mdSidenav(id).open();
  }
}
