// グローバルスコープに変数を宣言
if (typeof debounceTimeout === 'undefined') {
  var debounceTimeout;
}

function pasteDateTime() {
  console.log("Executing pasteDateTime function");

  // 前回のタイムアウトをクリア
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  debounceTimeout = setTimeout(() => {
    // 日付と時間の取得
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const dateTimeString = `${day}\t${hours}`;

    // クリップボードにテキストをコピー
    const textArea = document.createElement("textarea");
    textArea.value = dateTimeString;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    console.log('DateTime string copied to clipboard');

    // ユーザーに手動でペーストさせるメッセージを表示
    alert("Date and time copied to clipboard. Please paste it manually (Ctrl+V).");
  }, 500); // デバウンスの時間を 500ms に設定
}

// メッセージリスナー
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "pasteDateTime") {
    pasteDateTime();
    sendResponse({result: "success"});
  } else if (request.action === "copyTextToClipboard") {
    copyTextToClipboard(request.text);
    sendResponse({result: "success"});
  }
});

// テキストをクリップボードにコピーする関数
function copyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
  console.log('Text copied to clipboard');
}