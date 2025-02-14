document.addEventListener("DOMContentLoaded", () => {
    let notesList = document.getElementById("notesList");

    chrome.storage.sync.get("pageNotes", (data) => {
        let pageNotes = data.pageNotes || {};
        if (Object.keys(pageNotes).length === 0) {
            notesList.innerHTML = "<p>保存されたメモはありません。</p>";
            return;
        }

        Object.entries(pageNotes).forEach(([page, note]) => {
            let listItem = document.createElement("li");
            listItem.classList.add("note-item");

            let textContainer = document.createElement("div");
            let shortUrl = page.length > 30 ? page.substring(0, 30) + "..." : page;
            textContainer.innerHTML = `<strong title='${page}'>${shortUrl}</strong>: <span class='note-text'>${note}</span>`;
            textContainer.classList.add("note-text-container");
            textContainer.addEventListener("click", () => {
                chrome.tabs.create({ url: page });
            });

            let deleteButton = document.createElement("button");
            deleteButton.textContent = "❌";
            deleteButton.classList.add("delete-button");
            deleteButton.addEventListener("click", (event) => {
                event.stopPropagation();
                deleteNote(page);
            });

            listItem.appendChild(textContainer);
            listItem.appendChild(deleteButton);
            notesList.appendChild(listItem);
        });
    });

    function deleteNote(page) {
        chrome.storage.sync.get("pageNotes", (data) => {
            let pageNotes = data.pageNotes || {};
            delete pageNotes[page];
            chrome.storage.sync.set({ pageNotes }, () => {
                location.reload(); // UIを更新
            });
        });
    }
});
