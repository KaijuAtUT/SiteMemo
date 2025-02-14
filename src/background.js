// 拡張機能がインストールされたときの処理
chrome.runtime.onInstalled.addListener(() => {
    // 既存のコンテキストメニューを削除
    chrome.contextMenus.removeAll(() => {
        // 「このページのメモを追加」メニューを作成
        chrome.contextMenus.create({
            id: "addNote",
            title: "このページのメモを追加",
            contexts: ["page"] // ページ上で右クリックしたときに表示
        });
        // 「保存したメモを表示」メニューを作成
        chrome.contextMenus.create({
            id: "viewNotes",
            title: "保存したメモを表示",
            contexts: ["browser_action"] // 拡張機能アイコンをクリックしたときに表示
        });
    });
});

// コンテキストメニューがクリックされたときの処理
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "addNote") {
        // メモを追加するため、現在のページのURLをコンテンツスクリプトに送信
        chrome.tabs.sendMessage(tab.id, { action: "addNote", url: tab.url });
    } else if (info.menuItemId === "viewNotes") {
        chrome.storage.sync.get("pageNotes", (data) => {
            // 保存されたメモを取得し、一覧を表示
            let pageNotes = data.pageNotes || {};
            let notesList = Object.entries(pageNotes).map(([page, note]) => `${page}: ${note}`).join("\n");
            alert(notesList || "保存されたメモはありません。");
        });
    }
});

// タブが更新されたとき（ページの読み込みが完了したとき）の処理
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") { // ページの読み込みが完了したら
        chrome.storage.sync.get("pageNotes", (data) => {
            let pageNotes = data.pageNotes || {};
            if (pageNotes[tab.url]) {
                // 該当ページに保存されたメモがある場合、コンテンツスクリプトに送信
                chrome.tabs.sendMessage(tabId, { action: "showNote", note: pageNotes[tab.url] });
            }
        });
    }
});
