importScripts('moveTabs.js', 'pasteDateTime.js', 'goToFirstPage.js');

chrome.commands.onCommand.addListener(async function(command) {
  const tabs = await chrome.tabs.query({ currentWindow: true, active: true });
  let activeTab = tabs[0];

  if (command === "move-tab-left") {
    console.log("Moving to the previous tab");
    await moveTabLeft();
  } else if (command === "move-tab-right") {
    console.log("Moving to the next tab");
    await moveTabRight();
  } else if (command === "paste-date-time") {
    console.log("Paste Date and Time command received");
    await pasteDateTime(activeTab.id);
  } else if (command === "go-to-first-page") {
    console.log("Go to First Page command received");
    await goToFirstPage(activeTab.id);
  }
});

async function moveTabLeft() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const activeTab = tabs.find(tab => tab.active);
  const newIndex = (activeTab.index - 1 + tabs.length) % tabs.length;
  await chrome.tabs.update(tabs[newIndex].id, { active: true });
}

async function moveTabRight() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const activeTab = tabs.find(tab => tab.active);
  const newIndex = (activeTab.index + 1) % tabs.length;
  await chrome.tabs.update(tabs[newIndex].id, { active: true });
}

// Create context menu items
chrome.runtime.onInstalled.addListener(() => {
  // Create a top-level context menu item for storing selected text
  chrome.contextMenus.create({
    id: "storeSelectedText",
    title: "Store selected text",
    contexts: ["selection"]
  });

  // Create a menu item to open option.html
  chrome.contextMenus.create({
    id: "open-workspace",
    title: "Open Workspace",
    contexts: ["all"]
  });

  // Initial dynamic menu update
  updateDynamicContextMenu();
});

// Handle context menu item click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "storeSelectedText" && info.selectionText) {
    // Remove trailing tab from the selected text
    let selectedText = info.selectionText.replace(/\t+$/, '');

    // Store the selected text in chrome storage
    chrome.storage.local.get({storedTexts: []}, (data) => {
      let storedTexts = data.storedTexts;
      storedTexts.push(selectedText);
      chrome.storage.local.set({storedTexts: storedTexts}, () => {
        console.log("Text stored:", selectedText);
        // Update the options page and dynamic context menu
        updateStoredTextsAndMenu();
      });
    });
  } else if (info.menuItemId.startsWith("storedText_")) {
    // Copy the selected text to the clipboard via content script
    const textIndex = parseInt(info.menuItemId.split("_")[1], 10);
    chrome.storage.local.get({storedTexts: []}, (data) => {
      const textToCopy = data.storedTexts[textIndex];
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ['content.js']
      }, () => {
        chrome.tabs.sendMessage(tab.id, { action: "copyTextToClipboard", text: textToCopy }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error sending message to content script:", chrome.runtime.lastError.message);
          } else {
            console.log("Message sent to content script:", response);
          }
        });
      });
    });
  } else if (info.menuItemId === "open-workspace") {
    // Open option.html in a new tab
    chrome.tabs.create({ url: chrome.runtime.getURL("option/option.html") });
  }
});

// Update the dynamic context menu and send a message to the options page to update
function updateStoredTextsAndMenu() {
  // Update the dynamic context menu
  updateDynamicContextMenu();

  // Check if the options page is open
  chrome.runtime.sendMessage({action: "updateStoredTexts"}, (response) => {
    if (chrome.runtime.lastError) {
      // Ignore errors when the options page is not open
      return;
    } else {
      console.log("Options page updated: ", response);
    }
  });
}

// Listen for messages to update the context menu
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateStoredTexts") {
    updateDynamicContextMenu();
  } else if (request.action === "copy-text") {
    copyTextToClipboard(request.index);
    sendResponse({ result: "success" });
  }
});

// Update the dynamic context menu
function updateDynamicContextMenu() {
  // First, remove existing dynamic menu items
  chrome.contextMenus.removeAll(() => {
    // Recreate the static context menu items
    chrome.contextMenus.create({
      id: "storeSelectedText",
      title: "Store selected text",
      contexts: ["selection"]
    });

    // Create a menu item to open option.html
    chrome.contextMenus.create({
      id: "open-workspace",
      title: "Open Workspace",
      contexts: ["all"]
    });

    // Get stored texts and create new dynamic menu items
    chrome.storage.local.get({storedTexts: []}, (data) => {
      data.storedTexts.forEach((text, index) => {
        chrome.contextMenus.create({
          id: `storedText_${index}`,
          title: `* Stored text / ${text}`,
          contexts: ["all"]
        });
      });
    });
  });
}

function copyTextToClipboard(index) {
  chrome.storage.local.get({ storedTexts: [] }, (data) => {
    const text = data.storedTexts[index];
    if (text) {
      chrome.scripting.executeScript({
        target: { allFrames: true },
        func: (text) => {
          navigator.clipboard.writeText(text).then(() => {
            console.log(`Text copied: ${text}`);
          }).catch(err => {
            console.error('Could not copy text: ', err);
          });
        },
        args: [text]
      });
    }
  });
}
