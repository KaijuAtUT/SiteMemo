document.addEventListener("DOMContentLoaded", () => {
    let notesList = document.getElementById("notesList");

    // 保存されたメモを取得
    chrome.storage.sync.get("pageNotes", (data) => {
        let pageNotes = data.pageNotes || {};
        if (Object.keys(pageNotes).length === 0) {
            // メモがない場合のメッセージ
            notesList.innerHTML = "<p>保存されたメモはありません。</p>";
            return;
        }

        // すべてのメモをリストとして表示
        Object.entries(pageNotes).forEach(([page, note]) => {
            let listItem = document.createElement("li");
            listItem.innerHTML = `<strong>${page}</strong>: ${note}`;
            listItem.addEventListener("click", () => {
                // メモをクリックすると該当ページを開く
                chrome.tabs.create({ url: page });
            });
            notesList.appendChild(listItem);
        });
    });
});
