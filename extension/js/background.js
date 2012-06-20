var injectPrereqs = {};

var cbs = {};

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
  if (request.script === 'register') {
    chrome.tabs.onUpdated.addListener(cbs[request.tab]);

  } else if (request.script === 'debug-true') {
    cbs[request.tab] = (function (req) {
      return function (tabId, changeInfo, tab) {
        if (tabId !== req.tab) {
          return;
        }
        chrome.tabs.executeScript(tabId, {
          file: 'js/inject/debug.js'
        });
      };
    }(request));
    chrome.tabs.onUpdated.addListener(cbs[request.tab]);

  } else if (request.script === 'debug-false' && cbs[request.tab]) {
    chrome.tabs.onUpdated.removeListener(cbs[request.tab]);
    delete cbs[request.tab];
    
  } else {
    chrome.tabs.executeScript(request.tab, {
      file: 'js/inject/css-inject.js'
    }, function () {
      injectPrereqs[request.tab] = true;
      chrome.tabs.executeScript(request.tab, {
        file: 'inject/' + request.script + '.js'
      });
    });
  }
  if (sendResponse) {
    sendResponse();
  }
});

// notify of page refreshes
chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function (msg) {
    if (msg.action === 'register') {
      var respond = function (tabId, changeInfo, tab) {
        if (tabId !== msg.inspectedTabId) {
          return;
        }
        port.postMessage('refresh');
      };

      chrome.tabs.onUpdated.addListener(respond);
      port.onDisconnect.addListener(function () {
        chrome.tabs.onUpdated.removeListener(respond);
      });
    }
  });
  port.onDisconnect.addListener(function () {
    console.log('disconnected');
  });
});

