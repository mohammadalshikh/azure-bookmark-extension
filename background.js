CLIENT_IMP_FOLDER_ID = "";

chrome.bookmarks.search('client imp', function(bookmarks) {
    for (const bookmark of bookmarks) {
        CLIENT_IMP_FOLDER_ID = bookmark.id;
        break;
    }
    if (CLIENT_IMP_FOLDER_ID === "") {
        chrome.bookmarks.create({ parentId: '1', title: 'client imp' },
            (clientFolder) => {
                CLIENT_IMP_FOLDER_ID = clientFolder.id
            }
        );
    }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "organize-ticket") {
        const clientName = message.clientName;

        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            if (!tab || !tab.url) return;

            const pageTitle = tab.title || "New Ticket";
            const pageURL = tab.url;

            handleClientFolder(clientName, pageTitle, pageURL);
        });
    }
});

function handleClientFolder(clientName, pageTitle, pageURL) {
    chrome.bookmarks.getChildren(CLIENT_IMP_FOLDER_ID, (folders) => {
        const clientFolder = folders.find((folder) => folder.title.toLowerCase() === clientName.toLowerCase());

        if (clientFolder) {
            handleIssuesFolder(clientFolder.id, pageTitle, pageURL);
        } else {
            chrome.bookmarks.create(
                { parentId: CLIENT_IMP_FOLDER_ID, title: clientName },
                (newClientFolder) => {
                    chrome.bookmarks.create(
                        { parentId: newClientFolder.id, title: "issues" },
                        (issuesFolder) => {
                            createNewFolder(issuesFolder, pageTitle, pageURL)
                        }
                    );
                }
            );
        }
    });
}

function handleIssuesFolder(clientFolderId, pageTitle, pageURL) {
    chrome.bookmarks.getChildren(clientFolderId, (folders) => {
        const issuesFolder = folders.find((folder) => folder.title.toLowerCase() === "issues");
        if (issuesFolder) {
            createNewFolder(issuesFolder, pageTitle, pageURL)
        }
    });
}

function createNewFolder(issuesFolder, pageTitle, pageURL) {
    chrome.bookmarks.create(
        { parentId: issuesFolder.id, title: pageTitle },
        (newFolder) => {
            chrome.bookmarks.create({ parentId: newFolder.id, title: "Ticket", url: pageURL });
        }
    );
}