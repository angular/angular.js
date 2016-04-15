(function(angular) {
  'use strict';
angular.module('cspExample', [])
  .controller('MainController', function() {
     this.counter = 0;
     this.inc = function() {
       this.counter++;
     };
     this.evil = function() {
       // jshint evil:true
       try {
         eval('1+2');
       } catch (e) {
         this.evilError = e.message;
       }
     };
   });
})(window.angular);