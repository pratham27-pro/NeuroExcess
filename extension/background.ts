chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "read-selection-aloud",
    title: "Read selection aloud",
    contexts: ["selection"]
  })
  chrome.contextMenus.create({
    id: "read-page-aloud",
    title: "Read page aloud",
    contexts: ["page"]
  })
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (tab?.id) {
    if (info.menuItemId === "read-selection-aloud") {
      chrome.tabs.sendMessage(tab.id, { type: "neuroaccess:read-selection" })
    } else if (info.menuItemId === "read-page-aloud") {
      chrome.tabs.sendMessage(tab.id, { type: "neuroaccess:read-page" })
    }
  }
})
