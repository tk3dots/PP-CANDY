async function pasteDateTime(tabId) {
  // Get the active tab's URL
  const tab = await chrome.tabs.get(tabId);
  const url = tab.url;

  // Check if the URL matches Google Sheets
  if (url.includes("https://docs.google.com/spreadsheets/")) {
    // Get the current date and time
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');

    // Create the date and time string to paste
    const dateTimeString = `${day}\t${hours}`;

    // Execute the script to paste the date and time
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: (dateTimeString) => {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.tagName === 'BODY') {
          document.execCommand('insertText', false, dateTimeString);
        }
      },
      args: [dateTimeString]
    });
  } else {
    console.log("pasteDateTime function is restricted to Google Sheets only.");
  }
}
