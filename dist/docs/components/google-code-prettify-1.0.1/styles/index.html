<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML//EN">
<html><head>
<title>Prettify Themes Gallery</title>
<style type="text/css">
iframe { width: 100%; border-style: none; margin: 0; padding: 0 }
</style>
<script>
var allThemes = [
  { name: 'default' },
  { name: 'desert',
    authorHtml: '<a href="http://code.google.com/u/@VhJeSlJYBhVMWgF7/">'
        + 'techto&hellip;@<\/a>' },
  { name: 'sunburst', authorHtml: 'David Leibovic' },
  { name: 'sons-of-obsidian',
    authorHtml: '<a href="http://CodeTunnel.com/blog/post/71'
        + '/google-code-prettify-obsidian-theme">Alex Ford<\/a>' },
];

// Called by the demo.html frames loaded per theme to
// size the iframes properly and to allow them to tile
// the page nicely.
function adjustChildIframeSize(themeName, width, height) {
  if (typeof console != 'undefined') {
    try {
      console.log('adjusting ' + themeName + ' to ' + width + 'x' + height);
    } catch (ex) {
      // Don't bother logging log failure.
    }
  }

  var container = document.getElementById(themeName).parentNode;
  container.style.width = (+width + 16) + 'px';
  container.style.display = 'inline-block';
  var iframe = container.getElementsByTagName('iframe')[0];
  iframe.style.height = (+height + 16) + 'px';
}
</script>
</head>

<body>
<noscript>This page requires JavaScript</noscript>

<h1>Gallery of themes for
<a href="http://code.google.com/p/google-code-prettify/">code prettify</a></h1>
<p>
Click on a theme name for a link to the file in revision control.
Print preview this page to see how the themes work on the printed page.
</p>
<script>(function () {
  // Produce an iframe per theme.
  // We pass the threme name to the iframe via its URI query, and
  // it loads prettify and the theme CSS, and calls back to this page
  // to resize the iframe.
  for (var i = 0, n = allThemes.length; i < n; ++i) {
    var theme = allThemes[i];
    if (!theme) { continue; }
    var iframe = document.createElement('iframe');
    iframe.name = theme.name;
    iframe.src = 'demo.html?' + encodeURIComponent(theme.name);
    var header = document.createElement('h2');
    header.id = theme.name;
    var linkToThemeSrc = document.createElement('a');
    linkToThemeSrc.href = (
        'http://code.google.com/p/google-code-prettify/source/browse/trunk/' +
        (theme.name === 'default'
         ? 'src/prettify.css'
         : 'styles/' + encodeURIComponent(theme.name) + '.css'));
    linkToThemeSrc.appendChild(document.createTextNode(
       theme.name.replace(/\b[a-z]/g,  // Capitalize first letter of each word
       function (letter) { return letter.toUpperCase(); })));
    header.appendChild(linkToThemeSrc);

    var attribution;
    if (theme.authorHtml) {
      attribution = document.createElement('span');
      attribution.className = 'attribution';
      attribution.innerHTML = 'by ' + theme.authorHtml;
    }

    var div = document.createElement('div');
    div.appendChild(header);
    if (attribution) { div.appendChild(attribution); }
    div.appendChild(iframe);
    document.body.appendChild(div);
  }
})()</script>

</body></html>
