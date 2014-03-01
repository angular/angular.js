'use strict';

/**
 * @ngdoc directive
 * @name ngDir
 * @requires $bidi
 * @restrict A
 *
 * @description
 * This directive implements a polyfill for `dir="auto"` based
 * on the
 * [bidi support of the Google Closure Library](https://closure-library.googlecode.com/git/closure/goog/i18n/bidi.js).
 *
 * The polyfill is needed as not all browsers support the html5 standard
 * (see [W3C dir=auto tests](http://www.w3.org/International/tests/html5/the-dir-attribute/results-dir-auto))
 * and the html5 standard only looks for the first character with a strong directionality to the determine the
 * directionality of the whole element (see
 * [HTML5 dir attribute](http://www.whatwg.org/specs/web-apps/current-work/multipage/elements.html#the-dir-attribute)).
 *
 * How it works:
 *
 * The `dir` property of an element will be calculated based on the text contained in the element
 * and the value of `input` and `textarea` elements. For dynamically changing text,
 * the following directives are already integrated with the calculation of the `dir` attribute:
 * Text interpolation (`{{}}`), {@link ng.directive:ngBind ngBind}, {@link ng.directive:ngBindHtml ngBindHtml},
 * {@link ngBindTemplate ngBindTemplate}, {@link ngModel ngModel},
 * `<input value="{{...}}">` and `<textarea value="{{...}}">`.
 * Custom directives can participate in the calculation of the `dir` attribute via the
 * {@link ngDir.NgDirController NgDirController}.
 *
 * Besides the `ng-dir="auto"` polyfill, this directive also supports the special value `ng-dir="locale"` to apply the
 * directionality of the current locale to the `dir` attribute.
 *
 * Restrictions of the polyfill:
 *
 * * If `dir=""` this will not check parent elements for a `dir` attribute
 * * Inside of a `dir="auto"` element there can be no directives that do transcludes (e.g. `ng-repeat`)
 *   or compile and link children manually (e.g. `ng-view`). This is because those directives could add
 *   new static text that the `dir` directive would not know about.
 * @example
   Try it: enter some RTL characters &#x05d0 and see how the direction of the input changes

   <example>
     <file name="index.html">
      A sample RTL character: &#x05d0;
      <input ng-dir="auto" type="text" ng-model="text">
     </file>
   </example>
 */
var ngDirDirective = ['$bidi', function($bidi) {
  var dirAutoMinErr = minErr('dirNgAuto');

  return {
    restrict: 'A',
    controller: ['$scope', '$element', '$attrs', NgDirController]
  };

  /**
   * @ngdoc type
   * @name ngDir.NgDirController
   *
   * @description
   * `DirController` provides the API for the `dir` directive. The controller contains
   * methods for controlling the direction of bidirectional text.
   */
  function NgDirController($scope, $element, attrs) {
    var self = this;
    var directionStatusAuto = null;
    var isAuto = false;

    /**
     * @ngdoc method
     * @name ngDir.NgDirController#createTextChanger
     * @function
     * @description
     * Creates a function that tells the DirController that some child text
     * changed and that it should update the dir property if needed.
     *
     * @param {scope} scope the scope of the calling directive
     * @param {string} initialValue initial text value in the DOM
     * @param {boolean=} isHtml whether the value is html or normal text
     * @return function(value) a function to be called whenever the text changes
     */
    this.createTextChanger = function(scope, initialValue, isHtml) {
      if (!isAuto) {
        return null;
      }
      if (scope !== $scope) {
        throw dirAutoMinErr('childscope', 'Polyfill ng-dir="auto" does not support child scopes.');
      }
      var oldValue = initialValue;
      return function(newValue) {
        if (oldValue === newValue) {
          return;
        }
        var oldDir = directionStatusAuto.get();
        directionStatusAuto.remove(oldValue, isHtml).add(newValue, isHtml);
        var newDir = directionStatusAuto.get();
        if (oldDir !== newDir) {
          setDirOnElement(newDir);
        }
        oldValue = newValue;
      };
    };

    init();

    function init() {
      if (attrs.ngDir === 'auto') {
        isAuto = true;
        directionStatusAuto = $bidi.estimateDirectionIncremental();
        // Need to initialize the status with the fixed text
        // as Angular does not create directives for fixed text.
        directionStatusAuto.add($element.text(), false);
        setDirOnElement(directionStatusAuto.get());
      } else if (attrs.ngDir === 'locale') {
        setDirOnElement($bidi.localeDir());
      } else {
        attrs.$observe('ngDir', function(newValue) {
          $element.prop('dir', newValue);
        });
      }
    }

    function setDirOnElement(dir) {
      var htmlDir = '';
      if (dir === $bidi.Dir.LTR) {
        htmlDir = 'ltr';
      } else if (dir === $bidi.Dir.RTL) {
        htmlDir = 'rtl';
      }
      $element.prop('dir', htmlDir);
    }
  }

}];
