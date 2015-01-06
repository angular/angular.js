angular.
    module('FooterController', []).
    controller('FooterController', FooterController);

function FooterController() {
  var vm = this;
  var v = angular.version;

  vm.versionNumber = v.full;
  vm.version = v.full + '  ' + v.codeName;
}
