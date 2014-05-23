'use strict';

/**
 * @ngdoc directive
 * @name dir
 * @requires $bidi
 * @restrict A
 *
 * @description
 * This directive provides bidirectional text support for AngularJS.
 * It uses the {@link ng.service:$bidi $bidi} service to estimate the directionality
 * of text.
 *
 * The bidirectionality handling is activated whenever there is a parent element with a
 * `dir` attribute. Applications that support bidirectional texts should set
 * the default directionality on the {@link ng.service:$rootElement $rootElement}
 * of the angular application. This directive also supports the special value `dir="locale"`
 * to apply the directionality of the current angular locale to the `dir` attribute.
 *
 * Rules for the bidirectional text handling in text interpolations:
 * * Wrap the expression value into a separate `<span dir="...">` element to define the
 *   directionality.
 * * If there is some non interpolated text right after the interpolation, add a correctional
 *   unicode embedding character to prevent spillover to the following characters
 *   with neutral directionality. E.g. `{{name}} - 2 reviews`
 *   would have a wrong word order without this.
 * * Dont' wrap into a `<span>` but use the `dir` property of the container element
 *   if the container only contains one interpolation
 *   with one expression, e.g. `<div>{{someProperty}}</div>`.
 * * If the directionality
 *   of an expression value is the same as the directionality of the nearest parent
 *   that defines a `dir` attribute, don't change the directionality.
 * * If two expressions with the same directionality are right next to each other,
 *   only apply the directionality for their sum, e.g. `<div>{{a}}{{b}}</div>`.
 * * Within `<title>`, `<option>` and `<textarea>` elements, don't wrap into `<span>`s,
 *   as those elements don't support nested elements. Instead, declare the directionality
 *   of the expression values using unicode directional embedding control characters.
 *
 * Rules for bidirectional text handling in attribute interpolations:
 * * Wrap the expression value using unicode directional embedding control characters
 *   to declare the directionality.
 * * If there is some non interpolated text right after the interpolation, add a correctional
 *   unicode embedding character to prevent spillover to the following characters
 *   with neutral directionality. E.g. `{{name}} - 2 reviews`
 *   would have a wrong word order without this.
 * * If the directionality
 *   of an expression value is the same as the directionality of the nearest parent
 *   that defines a `dir` attribute, don't change the directionality.
 * * If two expressions with the same directionality are right next to each other,
 *   only apply the directionality for their sum, e.g. `<div>{{a}}{{b}}</div>`.
 *
 * Rules for {@link ng.directive:ngBind ngBind} and {@link ng.directive:ngBindHtml ngBindHtml}:
 * * Set the directionality via the `dir` property of the element that `ngBind` has been used
 * * If the directionality
 *   of an expression value is the same as the directionality of the nearest parent
 *   that defines a `dir` attribute, don't change the directionality.
 *
 * Rules for {@link ngBindTemplate ngBindTemplate}: See normal text interpolation.
 */
var dirDirective = ['$bidi', function($bidi) {
  var ELEMENTS_THAT_DONT_ALLOW_SPANS = {
    'TITLE': true,
    'OPTION': true,
    'TEXTAREA': true
  };
  var ATTRIBUTES_WITH_NO_UNICODE_EMBEDDING = {
    'ngBindTemplate': true
  };

  var DIR_EMBED = 'e';
  var DIR_CONTAINER = 'c';

  return {
    restrict: 'A',
    controller: ['$scope', '$element', '$attrs', DirController]
  };

  function DirController($scope, $element, attrs) {
    var self = this;
    var parentDirCtrl = $element.parent().inheritedData('$dirController');

    this.isDirAwareAttribute = function(element, attrName) {
      return !!ATTRIBUTES_WITH_NO_UNICODE_EMBEDDING[attrName];
    };

    this.interpolateWithUnicodeEmbedding = function(values, separators) {
      var containerDir = self.getDir();
      var embedDir = containerDir === $bidi.Dir.LTR ? $bidi.Dir.RTL : $bidi.Dir.LTR;

      var valuesAndLayout = mergeValuesAndSeparators(containerDir, values, separators);
      var layout = valuesAndLayout.layout;
      var mergedValues = valuesAndLayout.values;
      for (var i=0; i<mergedValues.length; i++) {
        var value = mergedValues[i];
        if (layout[i] === DIR_EMBED) {
          value = getUnicodeEmbeddingChar(embedDir) + value + $bidi.Format.PDF;
        }
        mergedValues[i] = value;
      }
      return mergedValues.join('');
    };

    this.interpolateTextNode = function(textNode, values, separators) {
      var i, node;
      var range = textNode.$$bidiRange;
      if (!range) {
        range = textNode.$$bidiRange = document.createRange();
        range.selectNode(textNode);
        textNode.$$layout = DIR_CONTAINER;
        textNode.$$nodes = [textNode];
      }
      if (ELEMENTS_THAT_DONT_ALLOW_SPANS[range.startContainer.nodeName]) {
        textNode.nodeValue = this.interpolateWithUnicodeEmbedding(values, separators);
        return;
      }
      var containerDir = self.getDir();
      var embedDir = containerDir === $bidi.Dir.LTR ? $bidi.Dir.RTL : $bidi.Dir.LTR;

      var valuesAndLayout = mergeValuesAndSeparators(containerDir, values, separators);
      var layout = valuesAndLayout.layout;
      var mergedValues = valuesAndLayout.values;
      if (textNode.$$layout !== layout) {
        // recreate nodes
        textNode.$$layout = layout;
        textNode.$$nodes = [];
        var nodes = document.createDocumentFragment();
        for (i=0; i<mergedValues.length; i++) {
          node = updateNode(null, mergedValues[i], layout[i]);
          nodes.appendChild(node);
          textNode.$$nodes.push(node);
        }
        range.deleteContents();
        range.insertNode(nodes);
      } else {
        // update nodes
        for (i=0; i<mergedValues.length; i++) {
          node = textNode.$$nodes[i];
          updateNode(node, mergedValues[i], layout[i]);
        }
      }

      function updateNode(node, value, type) {
        if (type === DIR_CONTAINER) {
          if (!node) {
            node = document.createTextNode(value);
          } else {
            node.nodeValue = value;
          }
        } else {
          if (!node) {
            node = document.createElement('span');
          }
          node.textContent = value;
          setDirOnElement(node, embedDir);
        }
        return node;
      }
    };

    this.updateElementDir = function(element, value, isHtml) {
      var dir = $bidi.estimateDirection(value, isHtml);
      if (dir !== $bidi.Dir.NEUTRAL && dir !== self.getDir()) {
        setDirOnElement(element, dir);
      }
    };

    this.getDir = function() {
      if (!self._dir) {
        if (parentDirCtrl) {
          return parentDirCtrl.getDir();
        } else {
          return $bidi.Dir.LTR;
        }
      }
      return self._dir;
    };

    init();

    function init() {
      if (attrs.dir === 'locale') {
        setDirOnElement($element[0], $bidi.localeDir());
      } else {
        attrs.$observe('dir', function(newDir) {
          // TODO: put this into a hash!
          if (newDir === 'ltr') {
            self._dir = $bidi.Dir.LTR;
          } else if (newDir === 'rtl') {
            self._dir = $bidi.Dir.RTL;
          } else {
            self._dir = $bidi.Dir.NEUTRAL;
          }
        });
      }
    }

    function setDirOnElement(element, dir) {
      var htmlDir = '';
      if (dir === $bidi.Dir.LTR) {
        htmlDir = 'ltr';
      } else if (dir === $bidi.Dir.RTL) {
        htmlDir = 'rtl';
      }
      element.dir = htmlDir;
    }

    function mergeValuesAndSeparators(containerDir, values, separators) {
      var resultValues = [];
      var layoutArr = [];
      for (var i=0; i<values.length; i++) {
        addValueWithDir(separators[i], false);
        addValueWithDir(values[i], true);
      }
      addValueWithDir(separators[i], false);
      return {
        values: resultValues,
        layout: layoutArr.join('')
      };

      function addValueWithDir(value, isExpression) {
        if (!value) {
          return;
        }
        var dir;
        if (!isExpression) {
          dir = containerDir;
        } else {
          dir = $bidi.estimateDirection(value, false);
        }
        var layout = dir === containerDir ? DIR_CONTAINER: DIR_EMBED;
        var lastLayout = layoutArr[layoutArr.length-1];
        if (lastLayout) {
          if (layout === lastLayout) {
            resultValues[resultValues.length-1] += value;
            return;
          } else if (layout === DIR_CONTAINER) {
            // insert correcting unicode character to prevent spillover
            value = getUnicodeEmbeddingChar(containerDir) + value;
          }
        }
        resultValues.push(value);
        layoutArr.push(layout);
      }
    }

    function getUnicodeEmbeddingChar(dir) {
      if (dir === $bidi.Dir.RTL) {
        return $bidi.Format.RLE;
      }
      return $bidi.Format.LRE;
    }
  }

}];
