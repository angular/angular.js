var lruTab;

chrome.tabs.onActivated.addListener(function (activeTab) {
  //lruTab = tab.tabId;
  chrome.tabs.get(activeTab.tabId, function (tab) {
    if (tab.url.indexOf('chrome://') === -1 && tab.url.indexOf('chrome-devtools://') === -1) {
      console.log(tab);
      lruTab = tab.id;
    }
  });
});


chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
  
  if (request === 'getTab') {
    console.log(lruTab);
    sendResponse(lruTab);
  } else {
    chrome.tabs.executeScript(request.tab, {
      file: 'inject/' + request.script + '.js'
    });
  }

});