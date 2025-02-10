document.getElementById("ad-ticket-organizer").addEventListener("click", () => {
    const clientName = document.getElementById("clientName").value.trim();
    if (!clientName) {
        return;
    }
    else {
        chrome.runtime.sendMessage({ action: "organize-ticket", clientName });
        window.close();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const clientNameInput = document.getElementById("clientName");
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

    clientNameInput.focus();
});