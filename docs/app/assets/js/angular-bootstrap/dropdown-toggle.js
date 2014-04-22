/* This code is taken from the AngularUI - Bootstrap Project (https://github.com/angular-ui/bootstrap)
 *
 * The MIT License
 * 
 * Copyright (c) 2012-2014 the AngularUI Team, https://github.com/organizations/angular-ui/teams/291112
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

angular.module('ui.bootstrap.dropdown', [])

.constant('dropdownConfig', {
  openClass: 'open'
})

.service('dropdownService', ['$document', function($document) {
  var self = this, openScope = null;

  this.open = function( dropdownScope ) {
    if ( !openScope ) {
      $document.on('click', closeDropdown);
      $document.on('keydown', escapeKeyBind);
    }

    if ( openScope && openScope !== dropdownScope ) {
        openScope.isOpen = false;
    }

    openScope = dropdownScope;
  };

  this.close = function( dropdownScope ) {
    if ( openScope === dropdownScope ) {
      openScope = null;
      $document.off('click', closeDropdown);
      $document.off('keydown', escapeKeyBind);
    }
  };

  var closeDropdown = function() {
    openScope.$apply(function() {
      openScope.isOpen = false;
    });
  };

  var escapeKeyBind = function( evt ) {
    if ( evt.which === 27 ) {
      closeDropdown();
    }
  };
}])

.controller('DropdownController', ['$scope', '$attrs', 'dropdownConfig', 'dropdownService', '$animate', function($scope, $attrs, dropdownConfig, dropdownService, $animate) {
  var self = this, openClass = dropdownConfig.openClass;

  this.init = function( element ) {
    self.$element = element;
    $scope.isOpen = angular.isDefined($attrs.isOpen) ? $scope.$parent.$eval($attrs.isOpen) : false;
  };

  this.toggle = function( open ) {
    return $scope.isOpen = arguments.length ? !!open : !$scope.isOpen;
  };

  // Allow other directives to watch status
  this.isOpen = function() {
    return $scope.isOpen;
  };

  $scope.$watch('isOpen', function( value ) {
    $animate[value ? 'addClass' : 'removeClass'](self.$element, openClass);

    if ( value ) {
      dropdownService.open( $scope );
    } else {
      dropdownService.close( $scope );
    }

    $scope.onToggle({ open: !!value });
  });

  $scope.$on('$locationChangeSuccess', function() {
    $scope.isOpen = false;
  });
}])

.directive('dropdown', function() {
  return {
    restrict: 'CA',
    controller: 'DropdownController',
    scope: {
      isOpen: '=?',
      onToggle: '&'
    },
    link: function(scope, element, attrs, dropdownCtrl) {
      dropdownCtrl.init( element );
    }
  };
})

.directive('dropdownToggle', function() {
  return {
    restrict: 'CA',
    require: '?^dropdown',
    link: function(scope, element, attrs, dropdownCtrl) {
      if ( !dropdownCtrl ) {
        return;
      }

      element.on('click', function(event) {
        event.preventDefault();
        event.stopPropagation();

        if ( !element.hasClass('disabled') && !element.prop('disabled') ) {
          scope.$apply(function() {
            dropdownCtrl.toggle();
          });
        }
      });

      // WAI-ARIA
      element.attr({ 'aria-haspopup': true, 'aria-expanded': false });
      scope.$watch(dropdownCtrl.isOpen, function( isOpen ) {
        element.attr('aria-expanded', !!isOpen);
      });
    }
  };
});