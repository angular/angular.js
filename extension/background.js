
var jQueryInjected = false;

var responses = {
  showScopes: function () {
    chrome.tabs.executeScript({
      file: 'inject/showscopes.js'
    });
  },
  hideScopes: function () {
    chrome.tabs.executeScript({
      file: 'inject/hidescopes.js'
    });
  },
  showBindings: function () {
    chrome.tabs.executeScript({
      file: 'inject/showbindings.js'
    });
  },
  hideBindings: function () {
    chrome.tabs.executeScript({
      file: 'inject/hidebindings.js'
    });
  }
}

// forward messages
chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
  if (responses[request]) {
    responses[request]();
  }
});
