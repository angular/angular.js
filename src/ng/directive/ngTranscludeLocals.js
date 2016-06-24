'use strict';

/**
 * @ngdoc directive
 * @name ngTranscludeLocals
 * @restrict A
 *
 * @description
 * Defines local variables for a given transclusion scope.
 *
 *
 * It works with {@link ng.directive:ngTransclude ngTransclude} and it
 * expects an object which define the local varibles for the transcluded template.
 *
 * @param {Object} ngTranscludeLocals an object with pairs of key-value
 *                                    in which the key is the variable name inside the template
 *                                    and the value is the value for those variables
 *
 * @example
 * ### Transclude with locals
 * This example demonstrates basic transclusion of local context into a transcluded template.
 * <example name="simpleTranscludeExample" module="transcludeLocalsExample">
 *   <file name="index.html">
 *     <aside>
 *       <b>Heros</b>:
 *       <foreach-hero hero-as="hero">
 *         {{hero}}
 *       </foreach-hero>
 *     </aside>
 *     <div class="card-container">
 *       <foreach-hero hero-as="hero" position-as="rank">
 *         <div class="card">
 *           <h3>#{{rank}}</h3>
 *           <h5>{{hero}}</h5>
 *         </div>
 *       </foreach-hero>
 *     </div>
 *   </file>
 *   <file name="example.js">
 *     angular.module('transcludeLocalsExample', [])
 *       .component('foreachHero', {
 *         transclude: true,
 *         bindings: { heroAs:'@', positionAs:'@', },
 *         template: '<span ng-repeat="hero in $ctrl.heros">' +
 *                     '<ng-transclude ng-transclude-locals="{'+
 *                         '[$ctrl.heroAs]: hero, '+
 *                         '[$ctrl.positionAs]: $index+1 '+
 *                      '}"></ng-transclude>' +
 *                   '</span>',
 *         controller: function() {
 *           this.heros = ['Superman','Batman','Spawn'];
 *         }
 *       });
 *   </file>
 *   <file name="style.css">
 *     aside {
 *       padding: 10px;
 *       background: #fefefe;
 *     }
 *     .card {
 *       float: left;
 *       border-radius: 5px;
 *       background: #eee;
 *       padding: 0 15px;
 *       margin: 6px;
 *       min-width: 8em;
 *     }
 *   </file>
 *   <file name="protractor.js" type="protractor">
 *     it('should have transcluded all repeated elements with different local', function() {
 *       var heros = element.all(by.repeater('hero in $ctrl.heros'));
 *       expect(heros.get(0).getText()).toEqual('Superman');
 *       expect(heros.get(1).getText()).toEqual('Batman');
 *       expect(heros.get(2).getText()).toEqual('Spawn');
 *       expect(heros.get(3).getText()).toEqual('#1\nSuperman');
 *       expect(heros.get(4).getText()).toEqual('#2\nBatman');
 *       expect(heros.get(5).getText()).toEqual('#3\nSpawn');
 *      });
 *   </file>
 * </example>
 */
var ngTranscludeLocalsMinErr = minErr('ngTranscludeLocals');
var ngTranscludeLocalsDirective = function() {
  return {
    scope: true,
    restrict: 'A',
    link: function ngTranscludeLocalsLink($scope, $element, $attrs) {
      $scope.$watchCollection($attrs.ngTranscludeLocals, function(newLocals, oldLocals) {
        var transcludeScope = $scope.$$childHead;
        if (oldLocals && (newLocals !== oldLocals) && transcludeScope) {
          forEach(oldLocals, function(val, local) { delete transcludeScope[local]; });
        }
        if (newLocals && transcludeScope) {
          forEach(newLocals, function(val, local) { transcludeScope[local] = val; });
        }
      });
    }
  };
};
