console.log("content.js loaded");

let debounceTimeout;

function pasteDateTime() {
  console.log("Executing pasteDateTime function");

  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  debounceTimeout = setTimeout(() => {
    const now = new Date();
    const day = now.getDate();
    const hours = now.getHours();

    // Create the date and time string separated by a tab
    const dateStr = `${day}\t${hours.toString().padStart(2, '0')}`;

    // Copy the data to the clipboard
    navigator.clipboard.writeText(dateStr).then(() => {
      console.log("Date and time copied to clipboard:", dateStr);
      const activeElement = document.activeElement;
      console.log("Active element:", activeElement);

      // Paste into the focused element
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable)) {
        activeElement.focus();
        document.execCommand('paste');
        console.log(`Pasted date and time: ${dateStr}`);
      } else {
        console.error("No active text input, textarea, or contenteditable element to insert date and time");
      }
    }).catch(err => {
      console.error("Failed to copy date and time to clipboard:", err);
    });
  }, 500);  // 500ms debounce
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.command === "paste-date-time") {
    console.log("Received paste-date-time command");
    pasteDateTime();
    sendResponse({ result: "success" });
  }
});
