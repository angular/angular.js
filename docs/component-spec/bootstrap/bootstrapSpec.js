'use strict';

describe('bootstrap', function() {
  var $compile, $rootScope, element;

  function clickTab(element, index) {
    browserTrigger(element.children().eq(0).children().eq(index));
  }

  beforeEach(module('bootstrap'));
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));
  beforeEach(function(){
    function findTab(element, index) {
      return _jQuery(element[0]).find('> .nav-tabs > li').eq(index);
    }
    function findTabPane(element, index) {
      return _jQuery(element[0]).find('> .tab-content > .tab-pane').eq(index);
    }

    this.addMatchers({
      toHaveTab: function(index, title) {
        var tab = findTab(element, index);

        this.message = function() {
          if (tab.length) {
            return 'Expect tab index ' + index + ' to be ' + toJson(title) + ' but was ' + toJson(tab.text());
          } else {
            return 'Expect tab index ' + index + ' to be ' + toJson(title) + ' but there are only ' +
              element.children().length + ' tabs.';
          }
        };

        return tab.length && tab.text() == title;
      },

      toHaveTabPane: function(index, title) {
        var tabPane = findTabPane(element, index);

        this.message = function() {
          if (tabPane.length) {
            return 'Expect tab pane index ' + index + ' to be ' + toJson(title) + ' but was ' + toJson(tabPane.text());
          } else {
            return 'Expect tab pane index ' + index + ' to be ' + toJson(title) + ' but there are only ' +
              element.children().length + 'tab panes.';
          }
        };

        return tabPane.length && tabPane.text() == title;
      },

      toHaveSelected: function(index) {
        var tab = findTab(element, index);
        var tabPane = findTabPane(element, index);

        this.message = function() {
          return 'Expect tab  index ' + index + ' to be selected\n' +
            '     TAB: ' + angular.mock.dump(tab) + '\n' +
            'TAB-PANE: ' + angular.mock.dump(tabPane);
        };

        return tabPane.hasClass('active') && tab.hasClass('active');
      }
    });
  });

  afterEach(function() {
    dealoc(element);
  });

  describe('tabbable', function() {

    it('should create the right structure', function() {
      element = $compile(
        '<div class="tabbable">' +
          '<div class="tab-pane" title="first">tab1</div>' +
          '<div class="tab-pane" title="second">tab2</div>' +
        '</div>')($rootScope);

      $rootScope.$apply();

      expect(element).toHaveTab(0, 'first');
      expect(element).toHaveTab(1, 'second');

      expect(element).toHaveTabPane(0, 'tab1');
      expect(element).toHaveTabPane(1, 'tab2');

      expect(element).toHaveSelected(0);
    });


    it('should respond to tab click', function(){
      element = $compile(
        '<div class="tabbable">' +
          '<div class="tab-pane" title="first">tab1</div>' +
          '<div class="tab-pane" title="second">tab2</div>' +
          '</div>')($rootScope);

      expect(element).toHaveSelected(0);
      clickTab(element, 1);
      expect(element).toHaveSelected(1);
    });


    it('should select the first tab in repeater', function() {
      element = $compile(
        '<div class="tabbable">' +
          '<div class="tab-pane" ng-repeat="id in [1,2,3]" title="Tab {{id}}" value="tab-{{id}}">' +
          'Tab content {{id}}!' +
          '</div>' +
        '</div>')($rootScope);
      $rootScope.$apply();

      expect(element).toHaveSelected(0);
    });


    describe('ngModel', function() {
      it('should bind to model', function() {
        $rootScope.tab = 'B';

        element = $compile(
          '<div class="tabbable" ng-model="tab">' +
            '<div class="tab-pane" title="first" value="A">tab1</div>' +
            '<div class="tab-pane" title="second" value="B">tab2</div>' +
          '</div>')($rootScope);

        $rootScope.$apply();
        expect(element).toHaveSelected(1);

        $rootScope.tab = 'A';
        $rootScope.$apply();
        expect(element).toHaveSelected(0);

        clickTab(element, 1);
        expect($rootScope.tab).toEqual('B');
        expect(element).toHaveSelected(1);
      });


      it('should not overwrite the model', function() {
        $rootScope.tab = 'tab-2';
        element = $compile(
        '<div class="tabbable" ng-model="tab">' +
            '<div class="tab-pane" ng-repeat="id in [1,2,3]" title="Tab {{id}}" value="tab-{{id}}">' +
            'Tab content {{id}}!' +
            '</div>' +
            '</div>')($rootScope);
        $rootScope.$apply();

        expect(element).toHaveSelected(1);
      });
    });
  });
});
