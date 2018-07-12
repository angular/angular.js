'use strict';

var beforeReady;
(function() {
  var divAfterScripts = window.document.getElementById('div-after-scripts');
  beforeReady = divAfterScripts && divAfterScripts.textContent;
})();

var afterReady;
angular.element(function() {
  var divAfterScripts = window.document.getElementById('div-after-scripts');
  afterReady = divAfterScripts && divAfterScripts.textContent;
});

var afterReadyMethod;
angular.element(window.document).ready(function() {
  var divAfterScripts = window.document.getElementById('div-after-scripts');
  afterReadyMethod = divAfterScripts && divAfterScripts.textContent;
});

var afterReadySync = afterReady;
var afterReadyMethodSync = afterReadyMethod;

angular
  .module('test', [])
  .run(function($rootScope) {
    $rootScope.beforeReady = beforeReady;
    $rootScope.afterReady = afterReady;
    $rootScope.afterReadySync = afterReadySync;
    $rootScope.afterReadyMethod = afterReadyMethod;
    $rootScope.afterReadyMethodSync = afterReadyMethodSync;
  });
