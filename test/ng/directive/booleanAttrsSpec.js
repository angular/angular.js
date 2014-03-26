'use strict';

describe('boolean attr directives', function() {
  var element;

  afterEach(function() {
    dealoc(element);
  });


  it('should properly evaluate 0 as false', inject(function($rootScope, $compile) {
    // jQuery does not treat 0 as false, when setting attr()
    element = $compile('<button ng-disabled="isDisabled">Button</button>')($rootScope)
    $rootScope.isDisabled = 0;
    $rootScope.$digest();
    expect(element.attr('disabled')).toBeFalsy();
    $rootScope.isDisabled = 1;
    $rootScope.$digest();
    expect(element.attr('disabled')).toBeTruthy();
  }));


  it('should bind disabled', inject(function($rootScope, $compile) {
    element = $compile('<button ng-disabled="isDisabled">Button</button>')($rootScope)
    $rootScope.isDisabled = false;
    $rootScope.$digest();
    expect(element.attr('disabled')).toBeFalsy();
    $rootScope.isDisabled = true;
    $rootScope.$digest();
    expect(element.attr('disabled')).toBeTruthy();
  }));


  it('should bind checked', inject(function($rootScope, $compile) {
    element = $compile('<input type="checkbox" ng-checked="isChecked" />')($rootScope)
    $rootScope.isChecked = false;
    $rootScope.$digest();
    expect(element.attr('checked')).toBeFalsy();
    $rootScope.isChecked=true;
    $rootScope.$digest();
    expect(element.attr('checked')).toBeTruthy();
  }));


  it('should bind selected', inject(function($rootScope, $compile) {
    element = $compile('<select><option value=""></option><option ng-selected="isSelected">Greetings!</option></select>')($rootScope)
    jqLite(document.body).append(element)
    $rootScope.isSelected=false;
    $rootScope.$digest();
    expect(element.children()[1].selected).toBeFalsy();
    $rootScope.isSelected=true;
    $rootScope.$digest();
    expect(element.children()[1].selected).toBeTruthy();
  }));


  it('should bind readonly', inject(function($rootScope, $compile) {
    element = $compile('<input type="text" ng-readonly="isReadonly" />')($rootScope)
    $rootScope.isReadonly=false;
    $rootScope.$digest();
    expect(element.attr('readOnly')).toBeFalsy();
    $rootScope.isReadonly=true;
    $rootScope.$digest();
    expect(element.attr('readOnly')).toBeTruthy();
  }));


  it('should bind open', inject(function($rootScope, $compile) {
    element = $compile('<details ng-open="isOpen"></details>')($rootScope)
    $rootScope.isOpen=false;
    $rootScope.$digest();
    expect(element.attr('open')).toBeFalsy();
    $rootScope.isOpen=true;
    $rootScope.$digest();
    expect(element.attr('open')).toBeTruthy();
  }));


  describe('multiple', function() {
    it('should NOT bind to multiple via ngMultiple', inject(function($rootScope, $compile) {
      element = $compile('<select ng-multiple="isMultiple"></select>')($rootScope)
      $rootScope.isMultiple=false;
      $rootScope.$digest();
      expect(element.attr('multiple')).toBeFalsy();
      $rootScope.isMultiple='multiple';
      $rootScope.$digest();
      expect(element.attr('multiple')).toBeFalsy(); // ignore
    }));


    it('should throw an exception if binding to multiple attribute', inject(function($rootScope, $compile) {
      if (msie < 9) return; //IE8 doesn't support biding to boolean attributes

      expect(function() {
        $compile('<select multiple="{{isMultiple}}"></select>')
      }).toThrowMinErr('$compile', 'selmulti', 'Binding to the \'multiple\' attribute is not supported. ' +
                 'Element: <select multiple="{{isMultiple}}">');

    }));
  });
});


describe('ngSrc', function() {
  it('should interpolate the expression and bind to src with raw same-domain value',
      inject(function($compile, $rootScope) {
        var element = $compile('<div ng-src="{{id}}"></div>')($rootScope);

        $rootScope.$digest();
        expect(element.attr('src')).toBeUndefined();

        $rootScope.$apply(function() {
          $rootScope.id = '/somewhere/here';
        });
        expect(element.attr('src')).toEqual('/somewhere/here');

        dealoc(element);
      }));


  it('should interpolate the expression and bind to src with a trusted value', inject(function($compile, $rootScope, $sce) {
    var element = $compile('<div ng-src="{{id}}"></div>')($rootScope);

    $rootScope.$digest();
    expect(element.attr('src')).toBeUndefined();

    $rootScope.$apply(function() {
      $rootScope.id = $sce.trustAsResourceUrl('http://somewhere');
    });
    expect(element.attr('src')).toEqual('http://somewhere');

    dealoc(element);
  }));


  it('should NOT interpolate a multi-part expression for non-img src attribute', inject(function($compile, $rootScope) {
    expect(function() {
      var element = $compile('<div ng-src="some/{{id}}"></div>')($rootScope);
      dealoc(element);
    }).toThrowMinErr(
          "$interpolate", "noconcat", "Error while interpolating: some/{{id}}\nStrict " +
          "Contextual Escaping disallows interpolations that concatenate multiple expressions " +
          "when a trusted value is required.  See http://docs.angularjs.org/api/ng.$sce");
  }));


  it('should interpolate a multi-part expression for regular attributes', inject(function($compile, $rootScope) {
    var element = $compile('<div foo="some/{{id}}"></div>')($rootScope);
    $rootScope.$digest();
    expect(element.attr('foo')).toBe('some/');
    $rootScope.$apply(function() {
      $rootScope.id = 1;
    });
    expect(element.attr('foo')).toEqual('some/1');
  }));


  it('should NOT interpolate a wrongly typed expression', inject(function($compile, $rootScope, $sce) {
    expect(function() {
      var element = $compile('<div ng-src="{{id}}"></div>')($rootScope);
      $rootScope.$apply(function() {
        $rootScope.id = $sce.trustAsUrl('http://somewhere');
      });
      element.attr('src');
    }).toThrowMinErr(
            "$interpolate", "interr", "Can't interpolate: {{id}}\nError: [$sce:insecurl] Blocked " +
                "loading resource from url not allowed by $sceDelegate policy.  URL: http://somewhere");
  }));


  if (msie) {
    it('should update the element property as well as the attribute', inject(
        function($compile, $rootScope, $sce) {
          // on IE, if "ng:src" directive declaration is used and "src" attribute doesn't exist
          // then calling element.setAttribute('src', 'foo') doesn't do anything, so we need
          // to set the property as well to achieve the desired effect

          var element = $compile('<div ng-src="{{id}}"></div>')($rootScope);

          $rootScope.$digest();
          expect(element.prop('src')).toBeUndefined();
          dealoc(element);

          element = $compile('<div ng-src="some/"></div>')($rootScope);

          $rootScope.$digest();
          expect(element.prop('src')).toEqual('some/');
          dealoc(element);

          element = $compile('<div ng-src="{{id}}"></div>')($rootScope);
          $rootScope.$apply(function() {
            $rootScope.id = $sce.trustAsResourceUrl('http://somewhere');
          });
          expect(element.prop('src')).toEqual('http://somewhere');

          dealoc(element);
        }));
  }
});


describe('ngSrcset', function() {
  it('should interpolate the expression and bind to srcset', inject(function($compile, $rootScope) {
    var element = $compile('<div ng-srcset="some/{{id}} 2x"></div>')($rootScope);

    $rootScope.$digest();
    expect(element.attr('srcset')).toEqual('some/ 2x');

    $rootScope.$apply(function() {
      $rootScope.id = 1;
    });
    expect(element.attr('srcset')).toEqual('some/1 2x');

    dealoc(element);
  }));
});


describe('ngHref', function() {
  var element;

  afterEach(function() {
    dealoc(element);
  });


  it('should interpolate the expression and bind to href', inject(function($compile, $rootScope) {
    element = $compile('<div ng-href="some/{{id}}"></div>')($rootScope)
    $rootScope.$digest();
    expect(element.attr('href')).toEqual('some/');

    $rootScope.$apply(function() {
      $rootScope.id = 1;
    });
    expect(element.attr('href')).toEqual('some/1');
  }));


  it('should bind href and merge with other attrs', inject(function($rootScope, $compile) {
    element = $compile('<a ng-href="{{url}}" rel="{{rel}}"></a>')($rootScope);
    $rootScope.url = 'http://server';
    $rootScope.rel = 'REL';
    $rootScope.$digest();
    expect(element.attr('href')).toEqual('http://server');
    expect(element.attr('rel')).toEqual('REL');
  }));


  it('should bind href even if no interpolation', inject(function($rootScope, $compile) {
    element = $compile('<a ng-href="http://server"></a>')($rootScope)
    $rootScope.$digest();
    expect(element.attr('href')).toEqual('http://server');
  }));

  if (isDefined(window.SVGElement)) {
    describe('SVGAElement', function() {
      it('should interpolate the expression and bind to xlink:href', inject(function($compile, $rootScope) {
        element = $compile('<svg><a ng-href="some/{{id}}"></a></svg>')($rootScope);
        var child = element.children('a');
        $rootScope.$digest();
        expect(child.attr('xlink:href')).toEqual('some/');

        $rootScope.$apply(function() {
          $rootScope.id = 1;
        });
        expect(child.attr('xlink:href')).toEqual('some/1');
      }));


      it('should bind xlink:href even if no interpolation', inject(function($rootScope, $compile) {
        element = $compile('<svg><a ng-href="http://server"></a></svg>')($rootScope);
        var child = element.children('a');
        $rootScope.$digest();
        expect(child.attr('xlink:href')).toEqual('http://server');
      }));
    });
  }
});
