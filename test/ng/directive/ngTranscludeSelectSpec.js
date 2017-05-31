'use strict';


describe('ngTranscludeSelect', function() {
  it('should append matching clone elements to ng-transclude-select elements', function() {
    module(function($compileProvider) {
      $compileProvider.directive('transclude', valueFn({
        transclude: true,
        scope: {},
        template: '<div ng-transclude-select="[top]"></div><div ng-transclude-select="[bottom]"></div>'
      }));
    });
    inject(function($compile, $rootScope) {
      var topTarget, bottomTarget;
      var element = $compile(
        '<div transclude><div bottom>In bottom.</div><div top>In top.</div></div></div>'
      )($rootScope);
      topTarget = jqLite(element[0].querySelector('[ng-transclude-select="[top]"]'));
      bottomTarget = jqLite(element[0].querySelector('[ng-transclude-select="[bottom]"]'));
      expect(topTarget.text()).toEqual('In top.');
      expect(bottomTarget.text()).toEqual('In bottom.');
    });
  });
  it('should throw on an ng-transclude-select element inside no transclusion directive', function() {
    inject(function($rootScope, $compile) {
      try {
        $compile('<div><div ng-transclude-select="[top]"></div></div>')($rootScope);
      } catch (e) {
        expect(e.message).toMatch(new RegExp(
            '^\\[ngTransclude:orphan\\] ' +
                'Illegal use of ngTranscludeSelect directive in the template! ' +
                'No parent directive that requires a transclusion found\\. ' +
                'Element: <div ng-transclude-select.+'));
      }
    });
  });
});
