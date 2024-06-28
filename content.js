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
  } else if (request.action === "highlightText") {
    highlightText(request.text);
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

// テキストノードをハイライトする関数
function highlightText(text) {
  // option.htmlページを除外
  if (window.location.href.includes("option.html")) {
    return;
  }

  // 最低限の文字列長をチェック（例えば2文字以上）
  if (text.length < 2) {
    return;
  }

  // 再帰的にDOMを走査してテキストノードを置き換える
  function highlightNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const parentNode = node.parentNode;
      // インプットフィールドなどを除外
      if (parentNode.nodeName !== 'SCRIPT' && parentNode.nodeName !== 'STYLE' && parentNode.nodeName !== 'TEXTAREA' && parentNode.nodeName !== 'INPUT') {
        const regex = new RegExp(`(${text})`, 'gi');
        const parts = node.nodeValue.split(regex);
        if (parts.length > 1) {
          const fragment = document.createDocumentFragment();
          parts.forEach((part, index) => {
            if (index % 2 === 1) {
              const highlight = document.createElement('span');
              highlight.style.backgroundColor = 'yellow';
              highlight.textContent = part;
              fragment.appendChild(highlight);
            } else {
              fragment.appendChild(document.createTextNode(part));
            }
          });
          parentNode.replaceChild(fragment, node);
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      node.childNodes.forEach(highlightNode);
    }
  }

  highlightNode(document.body);
}

// メッセージリスナー
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "highlightText") {
    highlightText(request.text);
    sendResponse({ result: "success" });
  }
});

// ページのロード時にReview Timeをハイライト
chrome.storage.local.get(['reviewTime'], (data) => {
  if (data.reviewTime) {
    highlightText(data.reviewTime);
  }
});

// ストレージの変更を監視してReview Timeをハイライト
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.reviewTime) {
    highlightText(changes.reviewTime.newValue);
  }
});
