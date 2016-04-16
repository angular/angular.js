(function(angular) {
  'use strict';
function HeroDetailController() {

}

angular.module('heroApp').component('heroDetail', {
  templateUrl: 'heroDetail.html',
  controller: HeroDetailController,
  bindings: {
    hero: '='
  }
});
})(window.angular);