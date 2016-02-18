'use strict';

describe('ngAs', function() {

  describe('given a component', function() {

    var myComponentController, $rootScope, $compile;

    beforeEach(module(function($compileProvider) {
      $compileProvider.component('myComponent', {
        template: 'foo',
        controller: function() {
          myComponentController = this;
        }
      });
    }));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
    }));

    it('should bind in the current scope the controller of a component', function() {
      var $ctrl = {undamaged: true};
      $rootScope.$ctrl = $ctrl;

      $compile('<my-component ng-as="$ctrl.myComponent"></my-component>')($rootScope);
      expect($rootScope.$ctrl).toBe($ctrl);
      expect($rootScope.$ctrl.undamaged).toBe(true);
      expect($ctrl.myComponent).toBe(myComponentController);
    });

    it('should be parametrized with any variable', function() {
      $compile('<my-component ng-as="bar.myComponent"></my-component>')($rootScope);
      expect($rootScope.bar.myComponent).toBe(myComponentController);
    });

    it('should work with non:normalized entity name', function() {
      $compile('<my:component ng-as="$ctrl.myComponent1"></my:component>')($rootScope);
      expect($rootScope.$ctrl.myComponent1).toBe(myComponentController);
    });

    it('should work with data-non-normalized entity name', function() {
      $compile('<data-my-component ng-as="$ctrl.myComponent2"></data-my-component>')($rootScope);
      expect($rootScope.$ctrl.myComponent2).toBe(myComponentController);
    });

    it('should work with x-non-normalized entity name', function() {
      $compile('<x-my-component ng-as="$ctrl.myComponent3"></x-my-component>')($rootScope);
      expect($rootScope.$ctrl.myComponent3).toBe(myComponentController);
    });

    it('should work with data-non-normalized attribute name', function() {
      $compile('<my-component data-ng-as="$ctrl.myComponent1"></my-component>')($rootScope);
      expect($rootScope.$ctrl.myComponent1).toBe(myComponentController);
    });

    it('should work with x-non-normalized attribute name', function() {
      $compile('<my-component x-ng-as="$ctrl.myComponent2"></my-component>')($rootScope);
      expect($rootScope.$ctrl.myComponent2).toBe(myComponentController);
    });

    it('should nullify the variable once the component is destroyed', function() {
      var template =
        '<div ng-if="!nullified">' +
          '<my-component ng-as="$ctrl.myComponent"></my-component>' +
        '</div>';
      $rootScope.$ctrl = {};
      $compile(template)($rootScope);
      $rootScope.$apply('nullified = false');
      expect($rootScope.$ctrl.myComponent).toBe(myComponentController);

      $rootScope.$apply('nullified = true');
      expect($rootScope.$ctrl.myComponent).toBe(null);
    });

    it('should nullify the variable once the component is destroyed externally', function() {
      var template = '<my-component ng-as="$ctrl.myComponent"></my-component>';
      var element = $compile(template)($rootScope);
      var isolateScope = element.isolateScope();
      expect($rootScope.$ctrl.myComponent).toBe(myComponentController);

      element.remove();
      isolateScope.$destroy();
      expect($rootScope.$ctrl.myComponent).toBe(null);
    });

    it('should nullify be compatible with $element transclusion', function() {
      var template = '<my-component ' +
        'ng-as="$ctrl.myComponent" ' +
        'ng-if="!nullified"' +
        '></my-component>';
      $rootScope.$ctrl = {};
      $compile(template)($rootScope);

      $rootScope.$apply('nullified = true');
      expect($rootScope.$ctrl.myComponent).toBeUndefined();
      $rootScope.$apply('nullified = false');
      expect($rootScope.$ctrl.myComponent).toBe(myComponentController);
      $rootScope.$apply('nullified = true');
      expect($rootScope.$ctrl.myComponent).toBe(null);
    });

    it('should be compatible with entering/leaving components', inject(function($animate) {
      var template = '<my-component ng-as="$ctrl.myComponent"></my-component>';
      $rootScope.$ctrl = {};
      var parent = $compile('<div></div>')($rootScope);

      var leavingScope = $rootScope.$new();
      var leaving = $compile(template)(leavingScope);
      var leavingController = myComponentController;

      $animate.enter(leaving, parent);
      expect($rootScope.$ctrl.myComponent).toBe(leavingController);

      var enteringScope = $rootScope.$new();
      var entering = $compile(template)($rootScope);
      var enteringController = myComponentController;

      $animate.enter(entering, parent);
      $animate.leave(leaving, parent);
      leavingScope.$destroy();
      expect($rootScope.$ctrl.myComponent).toBe(enteringController);
    }));

  });

  it('should be compatible with directives on entities with controller', function() {
    var myDirectiveController;

    module(function($compileProvider) {
      $compileProvider.directive('myDirective', function() {
        return {
          controller: function() {
            myDirectiveController = this;
          }
        };
      });
    });

    inject(function($compile, $rootScope) {
      $compile('<my-directive ng-as="bar.myDirective"></my-directive>')($rootScope);

      expect($rootScope.bar.myDirective).toBe(myDirectiveController);
    });
  });

  it('should work with transclussion', function() {
    module(function($compileProvider) {
      $compileProvider
        .component('myComponent', {
          transclude: true,
          template: '<ng-transclude></ng-transclude>',
          controller: function() {
            this.text = 'SUCCESS';
          }
        });
    });

    inject(function($compile, $rootScope) {
      var template = '<my-component ng-as="myComponent">{{myComponent.text}}</my-component>';
      var element = $compile(template)($rootScope);
      $rootScope.$apply();
      expect(element.text()).toBe('SUCCESS');
      dealoc(element);
    });
  });

  it('should be compatible with element transclude components', function() {
    module(function($compileProvider) {
      $compileProvider
        .component('myComponent', {
          transclude: 'element',
          controller: function($animate, $element, $transclude) {
            this.text = 'SUCCESS';
            $transclude(function(clone, newScope) {
              $animate.enter(clone, $element.parent(), $element);
            });
          }
        });
    });

    inject(function($compile, $rootScope) {
      var template =
        '<div>' +
          '<my-component ng-as="myComponent">' +
            '{{myComponent.text}}' +
          '</my-component>' +
        '</div>';
      var element = $compile(template)($rootScope);
      $rootScope.$apply();
      expect(element.text()).toBe('SUCCESS');
      dealoc(element);
    });
  });

  it('should be compatible with transclude&destroy components', function() {
    var myComponentController;
    module(function($compileProvider) {
      $compileProvider
        .component('myTranscludingComponent', {
          transclude: 'element',
          controller: function($animate, $element, $transclude) {
            myComponentController = this;

            var currentClone, currentScope;
            this.transclude = function(text) {
              this.text = text;
              $transclude(function(clone, newScope) {
                currentClone = clone;
                currentScope = newScope;
                $animate.enter(clone, $element.parent(), $element);
              });
            };
            this.destroy = function() {
              currentClone.remove();
              currentScope.$destroy();
            };
          }
        });
    });

    inject(function($compile, $rootScope) {
      var template =
        '<div>' +
          '<my-transcluding-component ng-as="$ctrl.myComponent">' +
            '{{$ctrl.myComponent.text}}' +
          '</my-transcluding-component>' +
        '</div>';
      $rootScope.$ctrl = {};
      var element = $compile(template)($rootScope);
      $rootScope.$apply();
      expect(element.text()).toBe('');
      expect($rootScope.$ctrl.myComponent).toBeUndefined();

      myComponentController.transclude('transcludedOk');
      $rootScope.$apply();
      expect(element.text()).toBe('transcludedOk');
      expect($rootScope.$ctrl.myComponent).toBe(myComponentController);

      myComponentController.destroy();
      $rootScope.$apply();
      expect($rootScope.$ctrl.myComponent).toBe(null);
    });
  });

  it('should be compatible with element transclude directives', function() {
    module(function($compileProvider) {
      $compileProvider
        .directive('myDirective', function() {
          return {
            transclude: 'element',
            controller: function($animate, $element, $transclude) {
              this.text = 'SUCCESS';
              $transclude(function(clone, newScope) {
                $animate.enter(clone, $element.parent(), $element);
              });
            }
          };
        });
    });

    inject(function($compile, $rootScope) {
      var template =
        '<div>' +
          '<my-directive ng-as="myDirective">' +
            '{{myDirective.text}}' +
          '</my-directive>' +
        '</div>';
      var element = $compile(template)($rootScope);
      $rootScope.$apply();
      expect(element.text()).toBe('SUCCESS');
      dealoc(element);
    });
  });

  it('should work with components with templates via $http', function() {
    module(function($compileProvider) {
      $compileProvider.component('httpComponent', {
        templateUrl: 'template.html',
        controller: function() {
          this.me = true;
        }
      });
    });

    inject(function($compile, $httpBackend, $rootScope) {
      var template = '<div><http-component ng-as="controller"></http-component></div>';
      var element = $compile(template)($rootScope);
      $httpBackend.expect('GET', 'template.html').respond('ok');
      $rootScope.$apply();
      expect($rootScope.controller).toBeUndefined();
      $httpBackend.flush();
      expect($rootScope.controller.me).toBe(true);
      dealoc(element);
    });
  });

});
