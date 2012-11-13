'use strict';

var directive = {};

directive.dropdownToggle =
          ['$document', '$location', '$window',
  function ($document,   $location,   $window) {
    var openElement = null, close;
    return {
      restrict: 'C',
      link: function(scope, element, attrs) {
        scope.$watch(function dropdownTogglePathWatch(){return $location.path();}, function dropdownTogglePathWatchAction() {
          close && close();
        });

        element.parent().bind('click', function(event) {
          close && close();
        });

        element.bind('click', function(event) {
          event.preventDefault();
          event.stopPropagation();

          var iWasOpen = false;

          if (openElement) {
            iWasOpen = openElement === element;
            close();
          }

          if (!iWasOpen){
            element.parent().addClass('open');
            openElement = element;

            close = function (event) {
              event && event.preventDefault();
              event && event.stopPropagation();
              $document.unbind('click', close);
              element.parent().removeClass('open');
              close = null;
              openElement = null;
            }

            $document.bind('click', close);
          }
        });
      }
    };
  }];


directive.tabbable = function() {
  return {
    restrict: 'C',
    compile: function(element) {
      var navTabs = angular.element('<ul class="nav nav-tabs"></ul>'),
          tabContent = angular.element('<div class="tab-content"></div>');

      tabContent.append(element.contents());
      element.append(navTabs).append(tabContent);
    },
    controller: ['$scope', '$element', function($scope, $element) {
      var navTabs = $element.contents().eq(0),
          ngModel = $element.controller('ngModel') || {},
          tabs = [],
          selectedTab;

      ngModel.$render = function() {
        var $viewValue = this.$viewValue;

        if (selectedTab ? (selectedTab.value != $viewValue) : $viewValue) {
          if(selectedTab) {
            selectedTab.paneElement.removeClass('active');
            selectedTab.tabElement.removeClass('active');
            selectedTab = null;
          }
          if($viewValue) {
            for(var i = 0, ii = tabs.length; i < ii; i++) {
              if(tabs[i].subTabs.length>0)
                for(var j = 0, jj = tabs[i].subTabs.length; j < jj; j++){
                  if ($viewValue == tabs[i].subTabs[j].value) {
                    selectedTab = tabs[i].subTabs[j];
                    selectedTab.paneElement.parent().addClass('active');
                    break;
                  }
                }
              else
                if ($viewValue == tabs[i].value) {
                  selectedTab = tabs[i];
                  break;
                }
            }
            if (selectedTab) {
              selectedTab.paneElement.addClass('active');
              selectedTab.tabElement.addClass('active');
            }
          }

        }
      };

      this.addPane = function(element, attr) {
        var fbind, _a, close,
        li = null;
        if(!attr.type)
          li = angular.element('<li><a href></a></li>');
        else
          li = angular.element('<li class="dropdown"><a href data-toggle="dropdown" class="dropdown-toggle"><b class="caret"></b></a><ul class="dropdown-menu"></ul></li>');
        var li_drop_item = null,
            a = li.find('a'),
            ul = li.find('ul'),
            tab = {
              paneElement: element,
              paneAttrs: attr,
              tabElement: li,
              subTabs: []
            };

        tabs.push(tab);

        attr.$observe('value', update);
        attr.$observe('title', function(){ update(); a.prepend(tab.title); });
        attr.$observe('type', function(){
          update();
          if(tab.type){
            //atr was mock obj to pass as arg to addPane()
            var atr = {$observe: function(){}}, _li, ndrops = element.children().length, elem;
            //outer tab has no content
            tab.paneElement = null;
            for(var i=0; i<ndrops; i++){
              elem = angular.element(element.children()[i]);
              atr.title = elem.attr('_title');
              _li = angular.element('<li><a href></a></li>');
              _a = _li.find('a');
              _a.text(atr.title);
              ul.append(_li);
              tab.subTabs.push({paneElement: elem, value: atr.title, tabElement: li});
              _a.click(fbind);
            }
            return;
          }
        });

        function update() {
          tab.type = attr.type || null;
          tab.title = attr.title;
          tab.value = attr.value || attr.title;
          if (!ngModel.$setViewValue && (!ngModel.$viewValue || tab == selectedTab)) {
            // we are not part of angular
            ngModel.$viewValue = tab.value;
          }
          ngModel.$render();
        }

        navTabs.append(li);

        function fbind(event){
          event.preventDefault();
          event.stopPropagation();

           var tabval;

          tab.subTabs.forEach(function(e,i){
            if($(event.target).text()==e.value){
              tabval = e.value;
              console.log(tabval);
            }
          });

          if (ngModel.$setViewValue) {
            $scope.$apply(function() {
              ngModel.$setViewValue(tabval);
              ngModel.$render();
            });
          } else {
            // we are not part of angular
            ngModel.$viewValue = tabval;
            ngModel.$render();
          }
        }

        a.bind('click', function(event) {console.log(tab.value);
          event.preventDefault();
          event.stopPropagation();

          if(attr.type){
            var iWasOpen = false, elm = $(this);

            if ($(this).parent().hasClass('open')) {
              iWasOpen = true;
              close();
            }

            if (!iWasOpen){
              $(this).parent().addClass('open');

              close = function (event) {console.log('closing');
                event && event.preventDefault();
                event && event.stopPropagation();
                $(document).unbind('click', close);
                elm.parent().removeClass('open');
                close = null;
              }

              $(document).bind('click', close);}
              return;
          }

          if (ngModel.$setViewValue) {
            $scope.$apply(function() {
              ngModel.$setViewValue(tab.value);
              ngModel.$render();
            });
          } else {
            // we are not part of angular
            ngModel.$viewValue = tab.value;
            ngModel.$render();
          }
        });

        return function() {
          tab.tabElement.remove();
          for(var i = 0, ii = tabs.length; i < ii; i++ ) {
            if (tab == tabs[i]) {
              tabs.splice(i, 1);
            }
          }
        };
      }
    }]
  };
};


directive.tabPane = function() {
  return {
    require: '^tabbable',
    restrict: 'C',
    link: function(scope, element, attrs, tabsCtrl) {
      element.bind('$remove', tabsCtrl.addPane(element, attrs));
    }
  };
};


angular.module('bootstrap', []).directive(directive);
