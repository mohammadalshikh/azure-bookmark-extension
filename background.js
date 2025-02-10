PARENT_FOLDER_ID = "";

chrome.bookmarks.search("client imp", function(bookmarks) {
    for (const bookmark of bookmarks) {
        PARENT_FOLDER_ID = bookmark.id;
        break;
    }
    if (PARENT_FOLDER_ID === "") {
        chrome.bookmarks.create({ parentId: "1", title: "client imp" },
            (clientFolder) => {
                PARENT_FOLDER_ID = clientFolder.id
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
    chrome.bookmarks.getChildren(PARENT_FOLDER_ID, (folders) => {
        const clientFolder = folders.find((folder) => (!(folder.url)) && folder.title.toLowerCase() === clientName.toLowerCase());

        if (clientFolder) {
            handleIssuesFolder(clientFolder.id, pageTitle, pageURL);
        } else {
            chrome.bookmarks.create(
                { parentId: PARENT_FOLDER_ID, title: clientName },
                (clientFolder) => {
                    chrome.bookmarks.create(
                        { parentId: clientFolder.id, title: "issues" },
                        (issuesFolder) => {
                            handleTicketFolder(issuesFolder.id, pageTitle, pageURL)
                        }
                    );
                }
            );
        }
    });
}

function handleIssuesFolder(clientFolderId, pageTitle, pageURL) {
    chrome.bookmarks.getChildren(clientFolderId, (folders) => {
        const issuesFolder = folders.find((folder) => (!(folder.url)) && folder.title.toLowerCase() === "issues");
        if (issuesFolder) {
            handleTicketFolder(issuesFolder.id, pageTitle, pageURL)
        }
        else {
            chrome.bookmarks.create(
                {parentId: clientFolderId, title: "issues"},
                (issuesFolder) => {
                    handleTicketFolder(issuesFolder.id, pageTitle, pageURL)
                }
            );
        }
    });
}

function handleTicketFolder(issuesFolderId, pageTitle, pageURL) {
    chrome.bookmarks.create(
        { parentId: issuesFolderId, title: pageTitle },
        (newFolder) => {
            chrome.bookmarks.create({ parentId: newFolder.id, title: "ticket", url: pageURL });
        }
    );
}