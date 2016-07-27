(function(angular) {
  'use strict';
angular.module('address-bar', [])
.directive('ngAddressBar', function($browser, $timeout) {
   return {
     template: 'Address: <input id="addressBar" type="text" style="width: 400px" >',
     link: function(scope, element, attrs){
       var input = element.children("input"), delay;

       input.on('keypress keyup keydown', function(event) {
               delay = (!delay ? $timeout(fireUrlChange, 250) : null);
               event.stopPropagation();
             })
            .val($browser.url());

       $browser.url = function(url) {
         return url ? input.val(url) : input.val();
       };

       function fireUrlChange() {
         delay = null;
         $browser.urlChange(input.val());
       }
     }
   };
 });
})(window.angular);