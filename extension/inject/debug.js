
//alert('doc loading');

var fn = function (window) {
	var bootstrap = window.angular.bootstrap;

	window.angular.bootstrap = function () {
		alert('nope');
	};
};

var script = window.document.createElement('script');
script.innerHTML = '(' + fn.toString() + '(window))';
window.document.getElementsByTagName('head')[0].appendChild(script);