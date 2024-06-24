document.addEventListener('DOMContentLoaded', function() {
  const textEditor = document.getElementById('text-editor');
  const saveBtn = document.getElementById('save-btn');
  const readStorageBtn = document.getElementById('read-storage-btn');
  const deleteStorageBtn = document.getElementById('delete-storage-btn');
  const exportBtn = document.getElementById('export-btn');
  const importBtn = document.getElementById('import-btn');
  const importFile = document.getElementById('import-file');

  // ボタンの状態を更新する関数
  function updateButtonStates() {
    const hasData = localStorage.getItem('textEditorContent') !== null;
    readStorageBtn.disabled = !hasData;
    deleteStorageBtn.disabled = !hasData;
  }

  // テキストを保存する機能
  saveBtn.addEventListener('click', function() {
    const text = textEditor.value;
    localStorage.setItem('textEditorContent', text);
    alert('Content saved.');
    updateButtonStates(); // セーブ後にボタンの状態を更新
  });

  // ストレージからデータを読み込む機能
  readStorageBtn.addEventListener('click', function() {
    const storedText = localStorage.getItem('textEditorContent');
    if (storedText) {
      textEditor.value = storedText;
      alert('Content loaded.');
    }
  });

  // ストレージからデータを削除する機能
  deleteStorageBtn.addEventListener('click', function() {
    localStorage.removeItem('textEditorContent');
    textEditor.value = ''; // テキストエディタの内容もクリア
    alert('Content deleted.');
    updateButtonStates(); // ボタンの状態を更新
  });

  // ページロード時にストレージからデータを自動的に読み込む
  const storedText = localStorage.getItem('textEditorContent');
  if (storedText) {
    textEditor.value = storedText;
  }

  // ボタンの状態を初期化
  updateButtonStates();

  // テキストをエクスポートする機能
  exportBtn.addEventListener('click', function() {
    const text = textEditor.value;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text-editor-content.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // テキストをインポートする機能
  importBtn.addEventListener('click', function() {
    importFile.click(); // ファイル入力をトリガー
  });

  importFile.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const content = e.target.result;
        const convertedContent = content.replace(/\t/g, '\n'); // タブを改行に置換
        textEditor.value = convertedContent; // テキストエディタに内容を表示
      };
      reader.readAsText(file);
    }
  });

  // ペーストイベントの処理を追加
  textEditor.addEventListener('paste', function(event) {
    // ペーストされたデータを取得
    const pastedData = event.clipboardData || window.clipboardData;
    const text = pastedData.getData('text');

    // タブを改行に置換
    const convertedText = text.replace(/\t/g, '\n');

    // デフォルトのペースト処理を防止
    event.preventDefault();

    // カーソル位置に変換後のテキストを挿入
    document.execCommand('insertText', false, convertedText);
  });
});
