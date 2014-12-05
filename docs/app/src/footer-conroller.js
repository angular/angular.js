angular.
    module('FooterController', []).
    controller('FooterController', FooterController);

function FooterController() {
  var v = angular.version;
  this.versionNumber = v.full;
  this.version = v.full + '  ' + v.codeName;
}
