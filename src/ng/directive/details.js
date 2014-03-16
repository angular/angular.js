'use strict';

/**
 * @ngdoc directive
 * @name details
 * @restrict E
 *
 * @description
 * Modifies the default behavior of the html details tag so that when used with ng-open
 * the scope variable that it is pointing at is updated on click.
 *
 * This change allows for automatically linking a details element to a model, e.g.:
 * `<input type="checkbox" ng-model="open">`
 * `<details ng-open="open"><summary>Show/Hide me</summary>Details</details>`
 */
var detailsDirective = valueFn({
	restrict: 'E',
	link: function(scope, element, attrs) {
		var normalized = directiveNormalize('ng-open');
		var ngOpen = attrs[normalized];

		if (!ngOpen) return;

		element.on('click', function() {
			scope[ngOpen] = !scope[ngOpen];
		});
	}
});

