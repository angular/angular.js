(function(){
	var HTML_TEMPLATE =
	'<!DOCTYPE HTML>\n' + 
	'<html xmlns:ng="http://angularjs.org">\n' +
	'  <head>\n' +
	'    <script type="text/javascript"\n' +
	'         src="http://angularjs.org/ng/js/angular-debug.js" ng:autobind></script>\n' +
	'  </head>\n' +
	'  <body>\n' +
	'_HTML_SOURCE_\n' +
	'  </body>\n' +
	'</html>';

	angular.widget('WIKI:SOURCE', function(element){
		this.descend(true);
		var html = element.text();
		element.show();
		var tabs = angular.element(
			'<ul class="tabs">' +
			'<li class="tab selected" to="angular">&lt;angular/&gt;</li>' +
			'<li class="tab" to="plain">plain</li>' +
			'<li class="tab" to="source">source</li>' +
			'<li class="pane selected angular">' + html + '</li>' +
			'<li class="pane plain" ng:non-bindable>' + html + '</li>' +
			'<li class="pane source" ng:non-bindable><pre class="brush: js; html-script: true"></pre></li>' +
			'</ul>');
			var pre = tabs.
				find('>li.source>pre').
				text(HTML_TEMPLATE.replace('_HTML_SOURCE_', html));
			var color = element.attr('color') || 'white';
			element.html('');
			element.append(tabs);
			element.find('>ul.tabs>li.pane').css('background-color', color);
			var script = (html.match(/<script[^\>]*>([\s\S]*)<\/script>/) || [])[1] || '';
			try {
			  eval(script);
			} catch (e) {
		      alert(e);
			}
			return function(element){
				element.find('>ul.tabs>li.tab').click(function(){
					if ($(this).is(".selected")) return;
					element.
					find('>ul.tabs>li.selected').
					add(this).
					add(element.find('>ul>li.pane.' + angular.element(this).attr('to'))).
					toggleClass('selected');
				});
			};
		});
})();