chrome.commands.onCommand.addListener(function(command) {
  chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
    let activeTab = tabs[0];
    
    if (command === "paste-user-id") {
      console.log("Paste User ID command received");
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        function: pasteUserId
      });
    } else if (command === "move-tab-left") {
      console.log("Moving to the previous tab");
      chrome.tabs.query({ currentWindow: true }, function(allTabs) {
        let newIndex = (activeTab.index - 1 + allTabs.length) % allTabs.length;
        chrome.tabs.update(allTabs[newIndex].id, { active: true });
      });
    } else if (command === "move-tab-right") {
      console.log("Moving to the next tab");
      chrome.tabs.query({ currentWindow: true }, function(allTabs) {
        let newIndex = (activeTab.index + 1) % allTabs.length;
        chrome.tabs.update(allTabs[newIndex].id, { active: true });
      });
    } else if (command === "replace-url-part") {
      console.log("Replace URL part command received");
      let currentUrl = activeTab.url;
      
      // 置換したいURLの部分と新しい部分
      let oldPart = "old-part"; // 置換したい部分
      let newPart = "new-part"; // 新しい部分

      // URLの置換
      let newUrl = currentUrl.replace(oldPart, newPart);
      
      // タブのURLを更新
      chrome.tabs.update(activeTab.id, { url: newUrl });
    }
  });
});

function pasteUserId() {
  console.log("Executing pasteUserId function");
  navigator.clipboard.readText().then(text => {
    console.log("Clipboard text: ", text);
    let textField = document.querySelector("#userID"); // ID属性を使用
    if (textField) {
      console.log("Text field found");
      textField.value = text;
      console.log("Text field value set");
    } else {
      console.log("Text field not found");
    }
  }).catch(err => {
    console.error("Failed to read clipboard text: ", err);
  });
}
