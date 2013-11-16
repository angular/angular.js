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

        element.parent().on('click', function(event) {
          close && close();
        });

        element.on('click', function(event) {
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
              $document.off('click', close);
              element.parent().removeClass('open');
              close = null;
              openElement = null;
            }

            $document.on('click', close);
          }
        });
      }
    };
  }];

directive.syntax = function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      function makeLink(type, text, link, icon) {
        return '<a href="' + link + '" class="btn syntax-' + type + '" target="_blank" rel="nofollow">' + 
                '<span class="' + icon + '"></span> ' + text +
               '</a>';
      };

      var html = '';
      var types = {
        'github' : {
          text : 'View on Github',
          key : 'syntaxGithub',
          icon : 'icon-github'
        },
        'plunkr' : {
          text : 'View on Plunkr',
          key : 'syntaxPlunkr',
          icon : 'icon-arrow-down'
        },
        'jsfiddle' : {
          text : 'View on JSFiddle',
          key : 'syntaxFiddle',
          icon : 'icon-cloud'
        }
      };
      for(var type in types) {
        var data = types[type];
        var link = attrs[data.key];
        if(link) {
          html += makeLink(type, data.text, link, data.icon);
        }
      };

      var nav = document.createElement('nav');
      nav.className = 'syntax-links';
      nav.innerHTML = html;

      var node = element[0];
      var par = node.parentNode;
      par.insertBefore(nav, node);
    }
  }
}

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
        var li = angular.element('<li><a href></a></li>'),
            a = li.find('a'),
            tab = {
              paneElement: element,
              paneAttrs: attr,
              tabElement: li
            };

        tabs.push(tab);

        attr.$observe('value', update)();
        attr.$observe('title', function(){ update(); a.text(tab.title); })();

        function update() {
          tab.title = attr.title;
          tab.value = attr.value || attr.title;
          if (!ngModel.$setViewValue && (!ngModel.$viewValue || tab == selectedTab)) {
            // we are not part of angular
            ngModel.$viewValue = tab.value;
          }
          ngModel.$render();
        }

        navTabs.append(li);
        li.on('click', function(event) {
          event.preventDefault();
          event.stopPropagation();
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

directive.table = function() {
  return {
    restrict: 'E',
    link: function(scope, element, attrs) {
      if (!attrs['class']) {
        element.addClass('table table-bordered table-striped code-table');
      }
    }
  };
};

var popoverElement = function() {
  var object = {
    init : function() {
      this.element = angular.element(
        '<div class="popover popover-incode top">' +
          '<div class="arrow"></div>' +
          '<div class="popover-inner">' +
            '<div class="popover-title"><code></code></div>' +
            '<div class="popover-content"></div>' +
          '</div>' +
        '</div>'
      );
      this.node = this.element[0];
      this.element.css({
        'display':'block',
        'position':'absolute'
      });
      angular.element(document.body).append(this.element);

      var inner = this.element.children()[1];
      this.titleElement   = angular.element(inner.childNodes[0].firstChild);
      this.contentElement = angular.element(inner.childNodes[1]);

      //stop the click on the tooltip
      this.element.bind('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
      });

      var self = this;
      angular.element(document.body).bind('click',function(event) {
        if(self.visible()) self.hide();
      });
    },

    show : function(x,y) {
      this.element.addClass('visible');
      this.position(x || 0, y || 0);
    },

    hide : function() {
      this.element.removeClass('visible');
      this.position(-9999,-9999);
    },

    visible : function() {
      return this.position().y >= 0;
    },

    isSituatedAt : function(element) {
      return this.besideElement ? element[0] == this.besideElement[0] : false;
    },

    title : function(value) {
      return this.titleElement.html(value);
    },

    content : function(value) { 
      if(value && value.length > 0) {
        value = marked(value);
      }
      return this.contentElement.html(value);
    },

    positionArrow : function(position) {
      this.node.className = 'popover ' + position;
    },

    positionAway : function() {
      this.besideElement = null;
      this.hide();
    },

    positionBeside : function(element) {
      this.besideElement = element;

      var elm = element[0];
      var x = elm.offsetLeft;
      var y = elm.offsetTop;
      x -= 30;
      y -= this.node.offsetHeight + 10;
      this.show(x,y);
    },

    position : function(x,y) {
      if(x != null && y != null) {
        this.element.css('left',x + 'px');
        this.element.css('top', y + 'px');
      }
      else {
        return {
          x : this.node.offsetLeft,
          y : this.node.offsetTop
        };
      }
    }
  };

  object.init();
  object.hide();

  return object;
};

directive.popover = ['popoverElement', function(popover) {
  return {
    restrict: 'A',
    priority : 500,
    link: function(scope, element, attrs) {
      element.bind('click',function(event) {
        event.preventDefault();
        event.stopPropagation();
        if(popover.isSituatedAt(element) && popover.visible()) {
          popover.title('');
          popover.content('');
          popover.positionAway();
        }
        else {
          popover.title(attrs.title);
          popover.content(attrs.content);
          popover.positionBeside(element);
        }
      });
    }
  }
}];

directive.tabPane = function() {
  return {
    require: '^tabbable',
    restrict: 'C',
    link: function(scope, element, attrs, tabsCtrl) {
      element.on('$remove', tabsCtrl.addPane(element, attrs));
    }
  };
};

directive.foldout = ['$http', '$animate','$window', function($http, $animate, $window) {
  return {
    restrict: 'A',
    priority : 500,
    link: function(scope, element, attrs) {
      var container, loading, url = attrs.url;
      if(/\/build\//.test($window.location.href)) {
        url = '/build/docs' + url;
      }
      element.bind('click',function() {
        scope.$apply(function() {
          if(!container) {
            if(loading) return;

            loading = true;
            var par = element.parent();
            container = angular.element('<div class="foldout">loading...</div>');
            $animate.enter(container, null, par);

            $http.get(url, { cache : true }).success(function(html) {
              loading = false;

              html = '<div class="foldout-inner">' +
                      '<div calss="foldout-arrow"></div>' +
                      html +
                     '</div>';
              container.html(html);

              //avoid showing the element if the user has already closed it
              if(container.css('display') == 'block') {
                container.css('display','none');
                $animate.addClass(container, 'ng-hide');
              }
            });
          }
          else {
            container.hasClass('ng-hide') ? $animate.removeClass(container, 'ng-hide') : $animate.addClass(container, 'ng-hide');
          }
        });
      });
    }
  }
}];

angular.module('bootstrap', [])
  .directive(directive)
  .factory('popoverElement', popoverElement)
  .run(function() {
    marked.setOptions({
      gfm: true,
      tables: true
    });
  });
