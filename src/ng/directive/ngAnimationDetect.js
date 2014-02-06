'use strict';

/**
 * @ngdoc directive
 * @name ng.directive:ngAnimationDetect
 * @restrict A
 *
 * @description
 * The `ngAnimationDetect` attribute tells Angular to when the CSS3 Transition animation has
 * started, is in iteration and ended.
 *
 *
 * @element ANY
 * @param {expression} ngAnimationDetect {@link guide/expression Expression} to evaluate.
 *
 * @sample
   <doc:sample>
     <doc:source>
       <script>
         function Ctrl($scope) {
           $scope.name = 'Whirled';
         }
       </script>
       <div ng-controller="Ctrl">
          <span ng-animation-detect='{"start": "start()", "end": "end()"}'>
            ... <!-- some css3 transition animation here-->
          </span>
       </div>
     </doc:source>
   </doc:sample>
 */
var ngAnimationDetectDirective = ngDirective(function(scope, element, attrs) {

    var methods = JSON.parse(attrs.ngAnimationdetect);
    var el = element;
    var pfx = ["webkit", "moz", "MS", "o", ""];
    var PrefixedEvent = function(element, type, callback) {
        for (var p = 0; p < pfx.length; p++) {
            if (!pfx[p]) type = type.toLowerCase();
            element.bind(pfx[p] + type, callback);
        }
    }
    // handle animation events
    var AnimationStartListener = function(e) {
        scope.$eval(methods.start);
    }
    var AnimationIterationListener = function(e) {
        scope.$eval(methods.iterate);
    }
    var AnimationEndListener = function(e) {
        scope.$eval(methods.end);
    }

    PrefixedEvent(el, "AnimationStart", AnimationStartListener);
    PrefixedEvent(el, "AnimationIteration", AnimationIterationListener);
    PrefixedEvent(el, "AnimationEnd", AnimationEndListener);

});