console.log("content.js loaded");

function pasteDateTime() {
  console.log("Executing pasteDateTime function");
  const now = new Date();
  const day = now.getDate();
  const hours = now.getHours();

  // 日にちと時間の文字列を作成
  const dateStr = `${day}\t${hours.toString().padStart(2, '0')}`;

  // クリップボードにデータをコピー
  navigator.clipboard.writeText(dateStr).then(() => {
    console.log("Date and time copied to clipboard:", dateStr);
    const activeElement = document.activeElement;
    console.log("Active element:", activeElement);

    // フォーカスされている要素に貼り付け
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
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.command === "paste-date-time") {
    console.log("Received paste-date-time command");
    pasteDateTime();
    sendResponse({ result: "success" });
  }
});
