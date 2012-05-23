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

var $extension = chrome.extension;

// forward messages
$extension.onRequest.addListener(function (request, sender, sendResponse) {
  if (responses[request]) {
    responses[request]();
  } else {
    console.log(request);
  }
});
