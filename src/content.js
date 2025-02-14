chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "addNote") {
        let note = prompt("このページのメモを入力してください:");
        if (note) {
            // メモを `chrome.storage.sync` に保存
            chrome.storage.sync.get("pageNotes", (data) => {
                let pageNotes = data.pageNotes || {};
                pageNotes[message.url] = note;
                chrome.storage.sync.set({ pageNotes });
            });
        }
    } else if (message.action === "showNote") {
        // 該当ページに保存されたメモをアラートで表示
        alert("メモ: " + message.note);
    }
});
