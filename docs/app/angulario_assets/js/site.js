/*
* Apllication Module
*
*/

var angularIO = angular.module('angularIOApp', ['ngMaterial', 'ngTouch'])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue', {
      'default': '700', // by default use shade 400 from the pink palette for primary intentions
      'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
      'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
      'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
    })
    // If you specify less than all of the keys, it will inherit from the
    // default shades
    .accentPalette('purple', {
      'default': '200' // use shade 200 for default, and keep all other shades the same
    });
});


/*
* Apllication Controller
*
*/

angularIO.controller('AppCtrl', ['$scope', '$mdDialog', function($scope, $mdDialog){

  $scope.showDocsNav = false;
  $scope.showMainNav = false;
  $scope.showMenu = false;

  // TOGGLE MAIN NAV (TOP) ON MOBILE
  $scope.toggleDocsMenu = function(event) {
    event.preventDefault();
    $scope.showDocsNav = !$scope.showDocsNav;
  };

  // TOGGLE DOCS NAV
  $scope.toggleMainMenu = function(event) {
    event.preventDefault();
    $scope.showMainNav = !$scope.showMainNav;
  };

  // TOGGLE DOCS VERSION & LANGUAGE
  $scope.toggleVersionMenu = function(event) {
    event.preventDefault();
    $scope.showMenu = !$scope.showMenu;
  };


  /*
  * Code Switcher
  *
  */

  $scope.language = 'es5';
  var $codeBoxes = $('.code-box');

  var getTabName = function(name) {
    var prettyName = name;

    switch(name) {
      case 'es5':         prettyName = 'ES5';         break;
      case 'typescript':  prettyName = 'TypeScript';  break;
      default:            prettyName = name;
    }

    return prettyName;
  };

  if($codeBoxes.length) {
    //UPDATE ALL CODE BOXES
    $codeBoxes.each(function(index, codeBox) {
      //REGISTER ELEMENTS
      var $codeBox = $(codeBox);
      var $examples = $codeBox.find('.prettyprint');
      var $firstItem = $($examples[0]);
      var $header = $("<header class='code-box-header'></header>");
      var $nav = $("<nav class='code-box-nav'></nav>");
      var selectedName = '';

      //HIDE/SHOW CONTENT
      $examples.addClass('is-hidden');
      $firstItem.removeClass('is-hidden');

      //UPDATE NAV FOR EACH CODE BOX
      $examples.each(function(index, example) {
        var $example = $(example);
        var name = $example.data('name');
        var tabName = getTabName(name);
        var selected = (index === 0) ? 'is-selected' : '';
        var $button = $("<button class='button " + selected + "' data-name='" + name + "'>" + tabName + "</button>");

        // ADD EVENTS FOR CODE SNIPPETS
        $button.on('click', function(e) {
          e.preventDefault();
          var $currentButton = $(e.currentTarget);
          var $buttons = $nav.find('.button');
          var selectedName = $currentButton.data('name');
          $buttons.removeClass('is-selected');
          $currentButton.addClass('is-selected');

          //UPDAT VIEW ON SELECTTION
          $examples.addClass('is-hidden');
          var $currentExample = $codeBox.find(".prettyprint[data-name='" + selectedName + "']");
          $currentExample.removeClass('is-hidden').addClass('animated fadeIn');
        });

        $nav.append($button);
      });

      //ADD HEADER TO DOM
      $header.append($nav);
      $codeBox.prepend($header);
    });

    //FADEIN EXAMPLES
    $codeBoxes.addClass('is-visible');
  }

  // TOGGLE CODE LANGUAGE
  $scope.toggleCodeExample = function(event, name) {
    event.preventDefault();
    $scope.language = language;
  };

  /*
  * Code Formatting
  *
  */

  var $codeBlocks = $('pre');

  if($codeBlocks.length) {
    $codeBlocks.each(function(index, codeEl) {
      var $codeEl = $(codeEl);

      if(!$codeEl.hasClass('prettyprint')) {
        $codeEl.addClass('prettyprint linenums');
      }
    });
  }

  // BIO MODAL
  $scope.showBio = function($event) {
    var parentEl = angular.element(document.body);
    var person = angular.element($event.currentTarget);
    var name = person.attr('data-name');
    var bio = person.attr('data-bio');
    var pic = person.attr('data-pic');
    var twitter = person.attr('data-twitter');
    var website =  person.attr('data-website');
    var $twitter = twitter !== 'undefined' ? '<a class="button button-subtle button-small" href="https://twitter.com/' +  person.attr('data-twitter') + '" md-button>Twitter</a>' : '';
    var $website = website !== 'undefined' ? '<a class="button button-subtle button-small" href="' + person.attr('data-website') + '" md-button>Website</a>' : '';

    $mdDialog.show({
      parent: parentEl,
      targetEvent: $event,
      template:
        '<md-dialog class="modal" aria-label="List dialog">' +
        '  <md-content>' +
        '     <img class="left" src="' + pic + '" />' +
        '     <h3 class="text-headline">' + name + '</h3>' +
        '     <div class="modal-social">' + $twitter + $website + '</div>' +
        '     <p class="text-body">' + bio + '</p>' +
        '  </md-content>' +
        '  <div class="md-actions">' +
        '    <md-button ng-click="closeDialog()">' +
        '      Close Bio' +
        '    </md-button>' +
        '  </div>' +
        '</md-dialog>',
      locals: {
        items: $scope.items
      },
    controller: DialogController
    });

    function DialogController(scope, $mdDialog, items) {
      scope.items = items;
      scope.closeDialog = function() {
        $mdDialog.hide();
      };
    }
  };


  // INITIALIZE PRETTY PRINT
  prettyPrint();
}]);




