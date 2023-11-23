// background.js

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    // Send a message to content script to check the URL
    chrome.tabs.sendMessage(tabId, { action: "checkURL", url: tab.url });
  }
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  // Send a message to content script to handle tab removal
  chrome.tabs.sendMessage(tabId, { action: "tabClosed" });
});
