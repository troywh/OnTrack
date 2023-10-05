const tabs = await chrome.tabs.query({
    url: [
      "https://www.linkedin.com/in/troy-womack-henderson/",
      "https://www.codeproject.com/Questions/5253015/How-to-get-all-tabs-details-from-current-browser-i/",
    ],
  });

//sorting tabs
const collator = new Intl.Collator();
tabs.sort((a, b) => collator.compare(a.title, b.title));

const template = document.getElementById("li_template");
const elements = new Set();
for (const tab of tabs) {
  const element = template.content.firstElementChild.cloneNode(true);

  const title = tab.title.split("-")[0].trim();
  const pathname = new URL(tab.url).pathname.slice("/docs".length);

  element.querySelector(".title").textContent = title;
  element.querySelector(".pathname").textContent = pathname;
  element.querySelector("a").addEventListener("click", async () => {
    // need to focus window as well as the active tab
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
  });

  elements.add(element);
}
document.querySelector("ul").append(...elements);

// // creating button
// const button = document.querySelector("button");
// button.addEventListener("click", async () => {
//   const tabIds = tabs.map(({ id }) => id);
//   const group = await chrome.tabs.group({ tabIds });
//   await chrome.tabGroups.update(group, { title: "DOCS" });
// });