chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "checkURL") {
      const flaggedSites = ["youtube.com", "gmail.com"];
      const isFlaggedSite = flaggedSites.some(site => request.url.includes(site));
  
      if (isFlaggedSite) {
        // Report to background script
        chrome.runtime.sendMessage({ action: "siteReported", url: request.url });
      }
    } else if (request.action === "tabClosed") {
        console.log("Tab closed:", sender.tab.id);
      // Handle tab closure here
      // note: can add additional logic here if needed
    }
  });