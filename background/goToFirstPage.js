async function goToFirstPage(tabId) {
  console.log("Attempting to go to the first page in tab history");
  await chrome.scripting.executeScript({
    target: { tabId },
    function: function() {
      console.log("Executing script to go to the first page in tab history");
      window.history.go(-(window.history.length - 1));
    }
  }).then(() => {
    console.log("Script executed successfully");
  }).catch((error) => {
    console.error("Failed to execute script:", error);
  });
}
