'use strict';

describe('ngTranscludeLocals', function() {

  beforeEach(module(function($compileProvider) {
      $compileProvider
        .directive('transcludeParam', function() {
          return {
            transclude: true,
            scope: { param: '<' },
            template: '<div ng-transclude ng-transclude-locals="param"></div>'
          };
        })
        .component('transcludeListItems', {
          transclude: true,
          bindings: { param: '<' },
          template: '<div ng-repeat="item in $ctrl.items track by $index">' +
                      '<ng-transclude ng-transclude-locals="{' +
                        'item: item, ' +
                        'position: $index + 1, ' +
                        'param: $ctrl.param' +
                      '}"></ng-transclude>' +
                    '</div>',
          controller: function() {
            this.items = ['first','second','third'];
          }
        })
        .component('transcludePane', {
          bindings: { param: '<' },
          transclude: {
            'title': '?paneTitle',
            'body': 'paneBody',
            'footer': '?paneFooter'
          },
          template:
            '<div ng-transclude="title" ng-transclude-locals="{title: $ctrl.param}"></div>' +
            '<div ng-transclude="body" ng-transclude-locals="{body: $ctrl.param}"></div>' +
            '<div ng-transclude="footer" ng-transclude-locals="{footer: $ctrl.param}"></div>'
        });
    }));

    var $compile, $rootScope;
    beforeEach(inject(function(_$compile_,_$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
    }));

    var element;
    afterEach(function() {
      dealoc(element);
    });

    it('should set locals values', function() {
      $rootScope.works = 'works';
      var html = '<transclude-param param="{it: works}">{{it}}</transclude-param>';
      element = $compile(html)($rootScope);
      $rootScope.$apply();

      expect(element.text()).toBe('works');
    });

    it('should set locals values from objects', function() {
      $rootScope.status = {is: 'success'};
      var html = '<transclude-param param="status">{{is}}</transclude-param>';
      element = $compile(html)($rootScope);
      $rootScope.$apply();

      expect(element.text()).toBe('success');
    });

    it('should track changes in locals values', function() {
      var html = '<transclude-param param="status">{{partA}}-{{partB}}</transclude-param>';
      element = $compile(html)($rootScope);

      $rootScope.status = {partA: '1'};
      $rootScope.$apply();
      expect(element.text()).toBe('1-');

      $rootScope.status.partB = '2';
      $rootScope.$apply();
      expect(element.text()).toBe('1-2');

      delete $rootScope.status.partA;
      $rootScope.$apply();
      expect(element.text()).toBe('-2');

      delete $rootScope.status;
      $rootScope.$apply();
      expect(element.text()).toBe('-');
    });

    it('should be compatible with ngRepeat', function() {
      var html = '<transclude-list-items param="\'ctx\'">' +
                   '[{{position}}] {{item}} ({{param}})' +
                 '</transclude-list-items>';
      element = $compile(html)($rootScope);

      $rootScope.$apply();
      expect(element.text()).toBe('[1] first (ctx)[2] second (ctx)[3] third (ctx)');
    });

    it('should do nothing if used without ngTransclude', function() {
      expect(function() {
        var scope = $rootScope.$new();
        element = $compile('<div ng-transclude-locals="{a:1}"></div>')(scope);
        scope.$digest();
      }).not.toThrow();
    });

    it('should be compatible with transclusion slots', function() {
      var html =
        '<transclude-pane param="\'value\'">' +
          '<pane-title>T:{{title}}</pane-title>' +
          '<pane-body>B:{{body}}</pane-body>' +
        '</transclude-pane>';

      element = $compile(html)($rootScope);

      $rootScope.$apply();
      expect(element.text()).toBe('T:valueB:value');
    });

});
