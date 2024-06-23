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

    // アクティブ要素が BODY かどうかをチェックして挿入
    const activeElement = document.activeElement;
    if (activeElement && activeElement.tagName === 'BODY') {
      document.execCommand('insertText', false, dateTimeString);
    }
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
  navigator.clipboard.writeText(text).then(() => {
    console.log('Text copied to clipboard');
  }).catch(err => {
    console.error('Could not copy text: ', err);
  });
}
