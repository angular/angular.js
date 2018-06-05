'use strict';

describe('ngRef', function() {

  beforeEach(function() {
    jasmine.addMatchers({
      toEqualJq: function(util) {
        return {
          compare: function(actual, expected) {
            // Jquery <= 2.2 objects add a context property that is irrelevant for equality
            if (actual && actual.hasOwnProperty('context')) {
              delete actual.context;
            }

            if (expected && expected.hasOwnProperty('context')) {
              delete expected.context;
            }

            return {
              pass: util.equals(actual, expected)
            };
          }
        };
      }
    });
  });

  describe('on a component', function() {

    var myComponentController, attributeDirectiveController, $rootScope, $compile;

    beforeEach(module(function($compileProvider) {
      $compileProvider.component('myComponent', {
        template: 'foo',
        controller: function() {
          myComponentController = this;
        }
      });

      $compileProvider.directive('attributeDirective', function() {
        return {
          restrict: 'A',
          controller: function() {
            attributeDirectiveController = this;
          }
        };
      });

    }));

    beforeEach(inject(function(_$compile_, _$rootScope_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
    }));

    it('should bind in the current scope the controller of a component', function() {
      $rootScope.$ctrl = 'undamaged';

      $compile('<my-component ng-ref="myComponentRef"></my-component>')($rootScope);
      expect($rootScope.$ctrl).toBe('undamaged');
      expect($rootScope.myComponentRef).toBe(myComponentController);
    });

    it('should throw if the expression is not assignable', function() {
      expect(function() {
        $compile('<my-component ng-ref="\'hello\'"></my-component>')($rootScope);
      }).toThrowMinErr('ngRef', 'nonassign', 'Expression in ngRef="\'hello\'" is non-assignable!');
    });

    it('should work with non:normalized entity name', function() {
      $compile('<my:component ng-ref="myComponent1"></my:component>')($rootScope);
      expect($rootScope.myComponent1).toBe(myComponentController);
    });

    it('should work with data-non-normalized entity name', function() {
      $compile('<data-my-component ng-ref="myComponent2"></data-my-component>')($rootScope);
      expect($rootScope.myComponent2).toBe(myComponentController);
    });

    it('should work with x-non-normalized entity name', function() {
      $compile('<x-my-component ng-ref="myComponent3"></x-my-component>')($rootScope);
      expect($rootScope.myComponent3).toBe(myComponentController);
    });

    it('should work with data-non-normalized attribute name', function() {
      $compile('<my-component data-ng-ref="myComponent1"></my-component>')($rootScope);
      expect($rootScope.myComponent1).toBe(myComponentController);
    });

    it('should work with x-non-normalized attribute name', function() {
      $compile('<my-component x-ng-ref="myComponent2"></my-component>')($rootScope);
      expect($rootScope.myComponent2).toBe(myComponentController);
    });

    it('should not bind the controller of an attribute directive', function() {
      $compile('<my-component attribute-directive-1 ng-ref="myComponentRef"></my-component>')($rootScope);
      expect($rootScope.myComponentRef).toBe(myComponentController);
    });

    it('should not leak to parent scopes', function() {
      var template =
        '<div ng-if="true">' +
          '<my-component ng-ref="myComponent"></my-component>' +
        '</div>';
      $compile(template)($rootScope);
      expect($rootScope.myComponent).toBe(undefined);
    });

    it('should nullify the variable once the component is destroyed', function() {
      var template = '<div><my-component ng-ref="myComponent"></my-component></div>';

      var element = $compile(template)($rootScope);
      expect($rootScope.myComponent).toBe(myComponentController);

      var componentElement = element.children();
      var isolateScope = componentElement.isolateScope();
      componentElement.remove();
      isolateScope.$destroy();
      expect($rootScope.myComponent).toBe(null);
    });

    it('should be compatible with entering/leaving components', inject(function($animate) {
      var template = '<my-component ng-ref="myComponent"></my-component>';
      $rootScope.$ctrl = {};
      var parent = $compile('<div></div>')($rootScope);

      var leaving = $compile(template)($rootScope);
      var leavingController = myComponentController;

      $animate.enter(leaving, parent);
      expect($rootScope.myComponent).toBe(leavingController);

      var entering = $compile(template)($rootScope);
      var enteringController = myComponentController;

      $animate.enter(entering, parent);
      $animate.leave(leaving, parent);
      expect($rootScope.myComponent).toBe(enteringController);
    }));

    it('should allow binding to a nested property', function() {
      $rootScope.obj = {};

      $compile('<my-component ng-ref="obj.myComponent"></my-component>')($rootScope);
      expect($rootScope.obj.myComponent).toBe(myComponentController);
    });

  });

  it('should bind the jqlite wrapped DOM element if there is no component', inject(function($compile, $rootScope) {

    var el = $compile('<span ng-ref="mySpan">my text</span>')($rootScope);

    expect($rootScope.mySpan).toEqualJq(el);
    expect($rootScope.mySpan[0].textContent).toBe('my text');
  }));

  it('should nullify the expression value if the DOM element is destroyed', inject(function($compile, $rootScope) {
    var element = $compile('<div><span ng-ref="mySpan">my text</span></div>')($rootScope);
    element.children().remove();
    expect($rootScope.mySpan).toBe(null);
  }));

  it('should bind the controller of an element directive', function() {
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
      $compile('<my-directive ng-ref="myDirective"></my-directive>')($rootScope);

      expect($rootScope.myDirective).toBe(myDirectiveController);
    });
  });

  describe('ngRefRead', function() {

    it('should bind the element instead of the controller of a component if ngRefRead="$element" is set', function() {

      module(function($compileProvider) {

        $compileProvider.component('myComponent', {
          template: 'my text',
          controller: function() {}
        });
      });

      inject(function($compile, $rootScope) {

        var el = $compile('<my-component ng-ref="myEl" ng-ref-read="$element"></my-component>')($rootScope);
        expect($rootScope.myEl).toEqualJq(el);
        expect($rootScope.myEl[0].textContent).toBe('my text');
      });
    });


    it('should bind the element instead an element-directive controller if ngRefRead="$element" is set', function() {

      module(function($compileProvider) {
        $compileProvider.directive('myDirective', function() {
          return {
            restrict: 'E',
            template: 'my text',
            controller: function() {}
          };
        });
      });

      inject(function($compile, $rootScope) {
        var el = $compile('<my-directive ng-ref="myEl" ng-ref-read="$element"></my-directive>')($rootScope);

        expect($rootScope.myEl).toEqualJq(el);
        expect($rootScope.myEl[0].textContent).toBe('my text');
      });
    });


    it('should bind an attribute-directive controller if ngRefRead="controllerName" is set', function() {
      var attrDirective1Controller;

      module(function($compileProvider) {
        $compileProvider.directive('elementDirective', function() {
          return {
            restrict: 'E',
            template: 'my text',
            controller: function() {}
          };
        });

        $compileProvider.directive('attributeDirective1', function() {
          return {
            restrict: 'A',
            controller: function() {
              attrDirective1Controller = this;
            }
          };
        });

        $compileProvider.directive('attributeDirective2', function() {
          return {
            restrict: 'A',
            controller: function() {}
          };
        });

      });

      inject(function($compile, $rootScope) {
        var el = $compile('<element-directive' +
          'attribute-directive-1' +
          'attribute-directive-2' +
          'ng-ref="myController"' +
          'ng-ref-read="$element"></element-directive>')($rootScope);

        expect($rootScope.myController).toBe(attrDirective1Controller);
      });
    });

    it('should throw if no controller is found for the ngRefRead value', function() {

      module(function($compileProvider) {
        $compileProvider.directive('elementDirective', function() {
          return {
            restrict: 'E',
            template: 'my text',
            controller: function() {}
          };
        });
      });

      inject(function($compile, $rootScope) {

        expect(function() {
            $compile('<element-directive ' +
              'ng-ref="myController"' +
              'ng-ref-read="attribute"></element-directive>')($rootScope);
        }).toThrowMinErr('ngRef', 'noctrl', 'The controller for ngRefRead="attribute" could not be found on ngRef="myController"');

      });
    });

  });


  it('should bind the jqlite element if the controller is on an attribute-directive', function() {
    var myDirectiveController;

    module(function($compileProvider) {
      $compileProvider.directive('myDirective', function() {
        return {
          restrict: 'A',
          template: 'my text',
          controller: function() {
            myDirectiveController = this;
          }
        };
      });
    });

    inject(function($compile, $rootScope) {
      var el = $compile('<div my-directive ng-ref="myEl"></div>')($rootScope);

      expect(myDirectiveController).toBeDefined();
      expect($rootScope.myEl).toEqualJq(el);
      expect($rootScope.myEl[0].textContent).toBe('my text');
    });
  });


  it('should bind the jqlite element if the controller is on an class-directive', function() {
    var myDirectiveController;

    module(function($compileProvider) {
      $compileProvider.directive('myDirective', function() {
        return {
          restrict: 'C',
          template: 'my text',
          controller: function() {
            myDirectiveController = this;
          }
        };
      });
    });

    inject(function($compile, $rootScope) {
      var el = $compile('<div class="my-directive" ng-ref="myEl"></div>')($rootScope);

      expect(myDirectiveController).toBeDefined();
      expect($rootScope.myEl).toEqualJq(el);
      expect($rootScope.myEl[0].textContent).toBe('my text');
    });
  });

  describe('transclusion', function() {

    it('should work with simple transclusion', function() {
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
        var template = '<my-component ng-ref="myComponent">{{myComponent.text}}</my-component>';
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
              this.$postLink = function() {
                $transclude(function(clone, newScope) {
                  $animate.enter(clone, $element.parent(), $element);
                });
              };
            }
          });
      });

      inject(function($compile, $rootScope) {
        var template =
          '<div>' +
            '<my-component ng-ref="myComponent">' +
              '{{myComponent.text}}' +
            '</my-component>' +
          '</div>';
        var element = $compile(template)($rootScope);
        $rootScope.$apply();
        expect(element.text()).toBe('SUCCESS');
        dealoc(element);
      });
    });

    it('should be compatible with ngIf and transclusion on same element', function() {
      module(function($compileProvider) {
        $compileProvider.component('myComponent', {
          template: '<ng-transclude></ng-transclude>',
          transclude: true,
          controller: function($scope) {
            this.text = 'SUCCESS';
          }
        });
      });

      inject(function($compile, $rootScope) {
        var template =
          '<div>' +
            '<my-component ng-if="present" ng-ref="myComponent" >' +
                '{{myComponent.text}}' +
            '</my-component>' +
          '</div>';
        var element = $compile(template)($rootScope);

        $rootScope.$apply('present = false');
        expect(element.text()).toBe('');
        $rootScope.$apply('present = true');
        expect(element.text()).toBe('SUCCESS');
        $rootScope.$apply('present = false');
        expect(element.text()).toBe('');
        $rootScope.$apply('present = true');
        expect(element.text()).toBe('SUCCESS');
        dealoc(element);
      });
    });

    it('should be compatible with element transclude & destroy components', function() {
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
            '<my-transcluding-component ng-ref="myComponent">' +
              '{{myComponent.text}}' +
            '</my-transcluding-component>' +
          '</div>';
        var element = $compile(template)($rootScope);
        $rootScope.$apply();
        expect(element.text()).toBe('');

        myComponentController.transclude('transcludedOk');
        $rootScope.$apply();
        expect(element.text()).toBe('transcludedOk');

        myComponentController.destroy();
        $rootScope.$apply();
        expect(element.text()).toBe('');
      });
    });

    it('should be compatible with element transclude directives', function() {
      module(function($compileProvider) {
        $compileProvider
          .directive('myDirective', function($animate) {
            return {
              transclude: 'element',
              controller: function() {
                this.text = 'SUCCESS';
              },
              link: function(scope, element, attrs, ctrl, $transclude) {
                $transclude(function(clone, newScope) {
                  $animate.enter(clone, element.parent(), element);
                });
              }
            };
          });
      });

      inject(function($compile, $rootScope) {
        var template =
          '<div>' +
            '<my-directive ng-ref="myDirective">' +
              '{{myDirective.text}}' +
            '</my-directive>' +
          '</div>';
        var element = $compile(template)($rootScope);
        $rootScope.$apply();
        expect(element.text()).toBe('SUCCESS');
        dealoc(element);
      });
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
      var template = '<div><http-component ng-ref="controller"></http-component></div>';
      var element = $compile(template)($rootScope);
      $httpBackend.expect('GET', 'template.html').respond('ok');
      $rootScope.$apply();
      expect($rootScope.controller).toBeUndefined();
      $httpBackend.flush();
      expect($rootScope.controller.me).toBe(true);
      dealoc(element);
    });
  });


  it('should work with ngRepeat-ed components', function() {
    var controllers = [];

    module(function($compileProvider) {
      $compileProvider.component('myComponent', {
        template: 'foo',
        controller: function() {
          controllers.push(this);
        }
      });
    });


    inject(function($compile, $rootScope) {
      $rootScope.elements = [0,1,2,3,4];
      $rootScope.controllers = []; // Initialize the array because ngRepeat creates a child scope

      var template = '<div><my-component ng-repeat="(key, el) in elements" ng-ref="controllers[key]"></my-component></div>';
      var element = $compile(template)($rootScope);
      $rootScope.$apply();

      expect($rootScope.controllers).toEqual(controllers);

      $rootScope.$apply('elements = []');

      expect($rootScope.controllers).toEqual([null, null, null, null, null]);
    });
  });

});
