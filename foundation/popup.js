
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "siteReported") {
    // Update the popup with the reported site
    document.getElementById("report").innerText = `Reported site: ${request.url}`;
  }
});