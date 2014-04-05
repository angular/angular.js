describe('template', function() {

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

    directive('mediumLog', function(log) {
      return { restrict: 'CAM', priority:2, compile: valueFn(function(scope, element, attrs) {
        log(attrs.mediumLog || 'MEDIUM');
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

  beforeEach(module(function() {
    directive('replace', valueFn({
      restrict: 'CAM',
      replace: true,
      template: '<div class="log" style="width: 10px" high-log>Replace!</div>',
      compile: function(element, attr) {
        attr.$set('compiled', 'COMPILED');
        expect(element).toBe(attr.$$element);
      }
    }));
    directive('append', valueFn({
      restrict: 'CAM',
      template: '<div class="log" style="width: 10px" high-log>Append!</div>',
      compile: function(element, attr) {
        attr.$set('compiled', 'COMPILED');
        expect(element).toBe(attr.$$element);
      }
    }));
    directive('replaceWithInterpolatedClass', valueFn({
      replace: true,
      template: '<div class="class_{{1+1}}">Replace with interpolated class!</div>',
      compile: function(element, attr) {
        attr.$set('compiled', 'COMPILED');
        expect(element).toBe(attr.$$element);
      }
    }));
    directive('replaceWithInterpolatedStyle', valueFn({
      replace: true,
      template: '<div style="width:{{1+1}}px">Replace with interpolated style!</div>',
      compile: function(element, attr) {
        attr.$set('compiled', 'COMPILED');
        expect(element).toBe(attr.$$element);
      }
    }));
    directive('replaceWithTr', valueFn({
      replace: true,
      template: '<tr><td>TR</td></tr>'
    }));
    directive('replaceWithTd', valueFn({
      replace: true,
      template: '<td>TD</td>'
    }));
    directive('replaceWithTh', valueFn({
      replace: true,
      template: '<th>TH</th>'
    }));
    directive('replaceWithThead', valueFn({
      replace: true,
      template: '<thead><tr><td>TD</td></tr></thead>'
    }));
    directive('replaceWithTbody', valueFn({
      replace: true,
      template: '<tbody><tr><td>TD</td></tr></tbody>'
    }));
    directive('replaceWithTfoot', valueFn({
      replace: true,
      template: '<tfoot><tr><td>TD</td></tr></tfoot>'
    }));
  }));


  it('should replace element with template', inject(function($compile, $rootScope) {
    element = $compile('<div><div replace>ignore</div><div>')($rootScope);
    expect(element.text()).toEqual('Replace!');
    expect(element.find('div').attr('compiled')).toEqual('COMPILED');
  }));


  it('should append element with template', inject(function($compile, $rootScope) {
    element = $compile('<div><div append>ignore</div><div>')($rootScope);
    expect(element.text()).toEqual('Append!');
    expect(element.find('div').attr('compiled')).toEqual('COMPILED');
  }));


  it('should compile template when replacing', inject(function($compile, $rootScope, log) {
    element = $compile('<div><div replace medium-log>ignore</div><div>')
      ($rootScope);
    $rootScope.$digest();
    expect(element.text()).toEqual('Replace!');
    expect(log).toEqual('LOG; HIGH; MEDIUM');
  }));


  it('should compile template when appending', inject(function($compile, $rootScope, log) {
    element = $compile('<div><div append medium-log>ignore</div><div>')
      ($rootScope);
    $rootScope.$digest();
    expect(element.text()).toEqual('Append!');
    expect(log).toEqual('LOG; HIGH; MEDIUM');
  }));


  it('should merge attributes including style attr', inject(function($compile, $rootScope) {
    element = $compile(
      '<div><div replace class="medium-log" style="height: 20px" ></div><div>')
      ($rootScope);
    var div = element.find('div');
    expect(div.hasClass('medium-log')).toBe(true);
    expect(div.hasClass('log')).toBe(true);
    expect(div.css('width')).toBe('10px');
    expect(div.css('height')).toBe('20px');
    expect(div.attr('replace')).toEqual('');
    expect(div.attr('high-log')).toEqual('');
  }));

  it('should prevent multiple templates per element', inject(function($compile) {
    try {
      $compile('<div><span replace class="replace"></span></div>');
      this.fail(new Error('should have thrown Multiple directives error'));
    } catch(e) {
      expect(e.message).toMatch(/Multiple directives .* asking for template/);
    }
  }));

  it('should play nice with repeater when replacing', inject(function($compile, $rootScope) {
    element = $compile(
      '<div>' +
        '<div ng-repeat="i in [1,2]" replace></div>' +
      '</div>')($rootScope);
    $rootScope.$digest();
    expect(element.text()).toEqual('Replace!Replace!');
  }));


  it('should play nice with repeater when appending', inject(function($compile, $rootScope) {
    element = $compile(
      '<div>' +
        '<div ng-repeat="i in [1,2]" append></div>' +
      '</div>')($rootScope);
    $rootScope.$digest();
    expect(element.text()).toEqual('Append!Append!');
  }));


  it('should handle interpolated css class from replacing directive', inject(
      function($compile, $rootScope) {
    element = $compile('<div replace-with-interpolated-class></div>')($rootScope);
    $rootScope.$digest();
    expect(element).toHaveClass('class_2');
  }));

  if (!msie || msie > 11) {
    // style interpolation not working on IE (including IE11).
    it('should handle interpolated css style from replacing directive', inject(
      function($compile, $rootScope) {
        element = $compile('<div replace-with-interpolated-style></div>')($rootScope);
        $rootScope.$digest();
        expect(element.css('width')).toBe('2px');
    }));
  }

  it('should merge interpolated css class', inject(function($compile, $rootScope) {
    element = $compile('<div class="one {{cls}} three" replace></div>')($rootScope);

    $rootScope.$apply(function() {
      $rootScope.cls = 'two';
    });

    expect(element).toHaveClass('one');
    expect(element).toHaveClass('two'); // interpolated
    expect(element).toHaveClass('three');
    expect(element).toHaveClass('log'); // merged from replace directive template
  }));


  it('should merge interpolated css class with ngRepeat',
      inject(function($compile, $rootScope) {
    element = $compile(
        '<div>' +
          '<div ng-repeat="i in [1]" class="one {{cls}} three" replace></div>' +
        '</div>')($rootScope);

    $rootScope.$apply(function() {
      $rootScope.cls = 'two';
    });

    var child = element.find('div').eq(0);
    expect(child).toHaveClass('one');
    expect(child).toHaveClass('two'); // interpolated
    expect(child).toHaveClass('three');
    expect(child).toHaveClass('log'); // merged from replace directive template
  }));

  it("should fail if replacing and template doesn't have a single root element", function() {
    module(function() {
      directive('noRootElem', function() {
        return {
          replace: true,
          template: 'dada'
        }
      });
      directive('multiRootElem', function() {
        return {
          replace: true,
          template: '<div></div><div></div>'
        }
      });
      directive('singleRootWithWhiteSpace', function() {
        return {
          replace: true,
          template: '  <div></div> \n'
        }
      });
    });

    inject(function($compile) {
      expect(function() {
        $compile('<p no-root-elem></p>');
      }).toThrowMinErr("$compile", "tplrt", "Template for directive 'noRootElem' must have exactly one root element. ");

      expect(function() {
        $compile('<p multi-root-elem></p>');
      }).toThrowMinErr("$compile", "tplrt", "Template for directive 'multiRootElem' must have exactly one root element. ");

      // ws is ok
      expect(function() {
        $compile('<p single-root-with-white-space></p>');
      }).not.toThrow();
    });
  });

  it('should support templates with root <tr> tags', inject(function($compile, $rootScope) {
    expect(function() {
      element = $compile('<div replace-with-tr></div>')($rootScope);
    }).not.toThrow();
    expect(nodeName_(element)).toMatch(/tr/i);
  }));

  it('should support templates with root <td> tags', inject(function($compile, $rootScope) {
    expect(function() {
      element = $compile('<div replace-with-td></div>')($rootScope);
    }).not.toThrow();
    expect(nodeName_(element)).toMatch(/td/i);
  }));

  it('should support templates with root <th> tags', inject(function($compile, $rootScope) {
    expect(function() {
      element = $compile('<div replace-with-th></div>')($rootScope);
    }).not.toThrow();
    expect(nodeName_(element)).toMatch(/th/i);
  }));

  it('should support templates with root <thead> tags', inject(function($compile, $rootScope) {
    expect(function() {
      element = $compile('<div replace-with-thead></div>')($rootScope);
    }).not.toThrow();
    expect(nodeName_(element)).toMatch(/thead/i);
  }));

  it('should support templates with root <tbody> tags', inject(function($compile, $rootScope) {
    expect(function() {
      element = $compile('<div replace-with-tbody></div>')($rootScope);
    }).not.toThrow();
    expect(nodeName_(element)).toMatch(/tbody/i);
  }));

  it('should support templates with root <tfoot> tags', inject(function($compile, $rootScope) {
    expect(function() {
      element = $compile('<div replace-with-tfoot></div>')($rootScope);
    }).not.toThrow();
    expect(nodeName_(element)).toMatch(/tfoot/i);
  }));


  describe('template as function', function() {

    beforeEach(module(function() {
      directive('myDirective', valueFn({
        replace: true,
        template: function($element, $attrs) {
          expect($element.text()).toBe('original content');
          expect($attrs.myDirective).toBe('some value');
          return '<div id="templateContent">template content</div>';
        },
        compile: function($element, $attrs) {
          expect($element.text()).toBe('template content');
          expect($attrs.id).toBe('templateContent');
        }
      }));
    }));


    it('should evaluate `template` when defined as fn and use returned string as template', inject(
        function($compile, $rootScope) {
      element = $compile('<div my-directive="some value">original content<div>')($rootScope);
      expect(element.text()).toEqual('template content');
    }));
  });

});
