
var responses = {
  showScopes: function () {
    chrome.tabs.insertCSS({
      file: 'css/scope.css'
    });
  }
}


chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");

  if (responses[request]) {
    responses[request]();
  }
});