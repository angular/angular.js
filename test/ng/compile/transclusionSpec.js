describe('element transclusion', function() {

  var element, directive, $compile, $rootScope;

  beforeEach(module(provideLog, function($provide, $compileProvider){
    element = null;
    directive = $compileProvider.directive;

    directive('log', function(log) {
      return {
        restrict: 'CAM',
        priority:0,
        compile: valueFn(function(scope, element, attrs) {
          log(attrs.log || 'LOG');
        })
      };
    });

    directive('highLog', function(log) {
      return { restrict: 'CAM', priority:3, compile: valueFn(function(scope, element, attrs) {
        log(attrs.highLog || 'HIGH');
      })};
    });

    return function(_$compile_, _$rootScope_) {
      $rootScope = _$rootScope_;
      $compile = _$compile_;
    };
  }));

  function compile(html) {
    element = angular.element(html);
    $compile(element)($rootScope);
  }

  afterEach(function(){
    dealoc(element);
  });

  it('should support basic element transclusion', function() {
    module(function() {
      directive('trans', function(log) {
        return {
          transclude: 'element',
          priority: 2,
          controller: function($transclude) { this.$transclude = $transclude; },
          compile: function(element, attrs, template) {
            log('compile: ' + angular.mock.dump(element));
            return function(scope, element, attrs, ctrl) {
              log('link');
              var cursor = element;
              template(scope.$new(), function(clone) {cursor.after(cursor = clone)});
              ctrl.$transclude(function(clone) {cursor.after(clone)});
            };
          }
        }
      });
    });
    inject(function(log, $rootScope, $compile) {
      element = $compile('<div><div high-log trans="text" log>{{$parent.$id}}-{{$id}};</div></div>')
          ($rootScope);
      $rootScope.$apply();
      expect(log).toEqual('compile: <!-- trans: text -->; link; LOG; LOG; HIGH');
      expect(element.text()).toEqual('001-002;001-003;');
    });
  });

  it('should only allow one element transclusion per element', function() {
    module(function() {
      directive('first', valueFn({
        transclude: 'element'
      }));
      directive('second', valueFn({
        transclude: 'element'
      }));
    });
    inject(function($compile) {
      expect(function() {
        $compile('<div first second></div>');
      }).toThrowMinErr('$compile', 'multidir', 'Multiple directives [first, second] asking for transclusion on: ' +
              '<!-- first:  -->');
    });
  });


  it('should only allow one element transclusion per element when directives have different priorities', function() {
    // we restart compilation in this case and we need to remember the duplicates during the second compile
    // regression #3893
    module(function() {
      directive('first', valueFn({
        transclude: 'element',
        priority: 100
      }));
      directive('second', valueFn({
        transclude: 'element'
      }));
    });
    inject(function($compile) {
      expect(function() {
        $compile('<div first second></div>');
      }).toThrowMinErr('$compile', 'multidir', /Multiple directives \[first, second\] asking for transclusion on: <div .+/);
    });
  });


  it('should only allow one element transclusion per element when async replace directive is in the mix', function() {
    module(function() {
      directive('template', valueFn({
        templateUrl: 'template.html',
        replace: true
      }));
      directive('first', valueFn({
        transclude: 'element',
        priority: 100
      }));
      directive('second', valueFn({
        transclude: 'element'
      }));
    });
    inject(function($compile, $httpBackend) {
      $httpBackend.expectGET('template.html').respond('<p second>template.html</p>');
      $compile('<div template first></div>');
      expect(function() {
        $httpBackend.flush();
      }).toThrowMinErr('$compile', 'multidir', /Multiple directives \[first, second\] asking for transclusion on: <p .+/);
    });
  });


  it('should support transcluded element on root content', function() {
    var comment;
    module(function() {
      directive('transclude', valueFn({
        transclude: 'element',
        compile: function(element, attr, linker) {
          return function(scope, element, attr) {
            comment = element;
          };
        }
      }));
    });
    inject(function($compile, $rootScope) {
      var element = jqLite('<div>before<div transclude></div>after</div>').contents();
      expect(element.length).toEqual(3);
      expect(nodeName_(element[1])).toBe('DIV');
      $compile(element)($rootScope);
      expect(nodeName_(element[1])).toBe('#comment');
      expect(nodeName_(comment)).toBe('#comment');
    });
  });


  it('should terminate compilation only for element trasclusion', function() {
    module(function() {
      directive('elementTrans', function(log) {
        return {
          transclude: 'element',
          priority: 50,
          compile: log.fn('compile:elementTrans')
        };
      });
      directive('regularTrans', function(log) {
        return {
          transclude: true,
          priority: 50,
          compile: log.fn('compile:regularTrans')
        };
      });
    });
    inject(function(log, $compile, $rootScope) {
      $compile('<div><div element-trans log="elem"></div><div regular-trans log="regular"></div></div>')($rootScope);
      expect(log).toEqual('compile:elementTrans; compile:regularTrans; regular');
    });
  });


  it('should instantiate high priority controllers only once, but low priority ones each time we transclude',
      function() {
    module(function() {
      directive('elementTrans', function(log) {
        return {
          transclude: 'element',
          priority: 50,
          controller: function($transclude, $element) {
            log('controller:elementTrans');
            $transclude(function(clone) {
              $element.after(clone);
            });
            $transclude(function(clone) {
              $element.after(clone);
            });
            $transclude(function(clone) {
              $element.after(clone);
            });
          }
        };
      });
      directive('normalDir', function(log) {
        return {
          controller: function() {
            log('controller:normalDir');
          }
        };
      });
    });
    inject(function($compile, $rootScope, log) {
      element = $compile('<div><div element-trans normal-dir></div></div>')($rootScope);
      expect(log).toEqual([
        'controller:elementTrans',
        'controller:normalDir',
        'controller:normalDir',
        'controller:normalDir'
      ]);
    });
  });

  it('should allow to access $transclude in the same directive', function() {
    var _$transclude;
    module(function() {
      directive('transclude', valueFn({
        transclude: 'element',
        controller: function($transclude) {
          _$transclude = $transclude;
        }
      }));
    });
    inject(function($compile) {
      element = $compile('<div transclude></div>')($rootScope);
      expect(_$transclude).toBeDefined()
    });
  });

  it('should copy the directive controller to all clones', function() {
    var transcludeCtrl, cloneCount = 2;
    module(function() {
      directive('transclude', valueFn({
        transclude: 'element',
        controller: function() {
          transcludeCtrl = this;
        },
        link: function(scope, el, attr, ctrl, $transclude) {
          var i;
          for (i=0; i<cloneCount; i++) {
            $transclude(cloneAttach);
          }

          function cloneAttach(clone) {
            el.after(clone);
          }
        }
      }));
    });
    inject(function($compile) {
      element = $compile('<div><div transclude></div></div>')($rootScope);
      var children = element.children(), i;
      for (i=0; i<cloneCount; i++) {
        expect(children.eq(i).data('$transcludeController')).toBe(transcludeCtrl);
      }
    });
  });

  it('should expose the directive controller to transcluded children', function() {
    var capturedTranscludeCtrl;
    module(function() {
      directive('transclude', valueFn({
        transclude: 'element',
        controller: function() {
        },
        link: function(scope, element, attr, ctrl, $transclude) {
          $transclude(scope, function(clone) {
            element.after(clone);
          });
        }
      }));
      directive('child', valueFn({
        require: '^transclude',
        link: function(scope, element, attr, ctrl) {
          capturedTranscludeCtrl = ctrl;
        }
      }));
    });
    inject(function($compile) {
      element = $compile('<div transclude><div child></div></div>')($rootScope);
      expect(capturedTranscludeCtrl).toBeTruthy();
    });
  });

  it('should allow access to $transclude in a templateUrl directive', function() {
    var transclude;
    module(function() {
      directive('template', valueFn({
        templateUrl: 'template.html',
        replace: true
      }));
      directive('transclude', valueFn({
        transclude: 'content',
        controller: function($transclude) {
          transclude = $transclude;
        }
      }));
    });
    inject(function($compile, $httpBackend) {
      $httpBackend.expectGET('template.html').respond('<div transclude></div>');
      element = $compile('<div template></div>')($rootScope);
      $httpBackend.flush();
      expect(transclude).toBeDefined();
    });
  });

  // issue #6006
  it('should link directive with $element as a comment node', function() {
    module(function($provide) {
      directive('innerAgain', function(log) {
        return {
          transclude: 'element',
          link: function(scope, element, attr, controllers, transclude) {
            log('innerAgain:'+lowercase(nodeName_(element))+':'+trim(element[0].data));
            transclude(scope, function(clone) {
              element.parent().append(clone);
            });
          }
        };
      });
      directive('inner', function(log) {
        return {
          replace: true,
          templateUrl: 'inner.html',
          link: function(scope, element) {
            log('inner:'+lowercase(nodeName_(element))+':'+trim(element[0].data));
          }
        };
      });
      directive('outer', function(log) {
        return {
          transclude: 'element',
          link: function(scope, element, attrs, controllers, transclude) {
            log('outer:'+lowercase(nodeName_(element))+':'+trim(element[0].data));
            transclude(scope, function(clone) {
              element.parent().append(clone);
            });
          }
        };
      });
    });
    inject(function(log, $compile, $rootScope, $templateCache) {
      $templateCache.put('inner.html', '<div inner-again><p>Content</p></div>');
      element = $compile('<div><div outer><div inner></div></div></div>')($rootScope);
      $rootScope.$digest();
      var child = element.children();

      expect(log.toArray()).toEqual([
        "outer:#comment:outer:",
        "innerAgain:#comment:innerAgain:",
        "inner:#comment:innerAgain:"]);
      expect(child.length).toBe(1);
      expect(child.contents().length).toBe(2);
      expect(lowercase(nodeName_(child.contents().eq(0)))).toBe('#comment');
      expect(lowercase(nodeName_(child.contents().eq(1)))).toBe('div');
    });
  });

  it('should safely create transclude comment node and not break with "-->"',
      inject(function($rootScope) {
    // see: https://github.com/angular/angular.js/issues/1740
    element = $compile('<ul><li ng-repeat="item in [\'-->\', \'x\']">{{item}}|</li></ul>')($rootScope);
    $rootScope.$digest();

    expect(element.text()).toBe('-->|x|');
  }));

});
