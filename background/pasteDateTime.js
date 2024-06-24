async function pasteDateTime(tabId) {
  try {
    // Get the active tab's URL
    const tab = await chrome.tabs.get(tabId);
    const url = tab.url;
    console.log("Active tab URL:", url);

    // Check if the URL matches Google Sheets
    if (url.includes("https://docs.google.com/spreadsheets/")) {
      console.log("Google Sheets detected");

      // Get the current date and time
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');

      // Create the date and time string to paste
      const dateTimeString = `${day}\t${hours}`;
      console.log("DateTime string to paste:", dateTimeString);

      // Execute the script to copy the date and time string to the clipboard
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: (dateTimeString) => {
          const textArea = document.createElement("textarea");
          textArea.value = dateTimeString;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          alert("Date and time copied to clipboard. Please paste it manually (Ctrl+V).");
          console.log("DateTime string copied to clipboard");
        },
        args: [dateTimeString]
      }, () => {
        if (chrome.runtime.lastError) {
          console.error("Script execution error:", chrome.runtime.lastError.message);
        } else {
          console.log("Script executed successfully");
        }
      });
    } else {
      console.log("pasteDateTime function is restricted to Google Sheets only.");
    }
  } catch (error) {
    console.error("Error in pasteDateTime:", error);
  }
}
