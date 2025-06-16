document.getElementById("ad-ticket-organizer").addEventListener("click", () => {
    const clientName = document.getElementById("clientName").value.trim();
    const ticketTitle = document.getElementById("ticketTitle").value.trim();
    
    if (!clientName) {
        return;
    }
    else {
        chrome.runtime.sendMessage({ action: "organize-ticket", clientName, ticketTitle });
        window.close();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const clientNameInput = document.getElementById("clientName");
    const ticketTitleInput = document.getElementById("ticketTitle");
    const submitButton = document.getElementById("ad-ticket-organizer");

    submitButton.disabled = true;

    clientNameInput.addEventListener("input", () => {
        submitButton.disabled = !clientNameInput.value.trim();
    });

    clientNameInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !submitButton.disabled) {
            submitButton.click();
        }
    });

    ticketTitleInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !submitButton.disabled) {
            submitButton.click();
        }
    });

    clientNameInput.focus();
});
