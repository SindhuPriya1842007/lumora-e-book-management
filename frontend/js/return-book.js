const API_URL = "http://localhost:5000/api";

const params = new URLSearchParams(window.location.search);
const issueId = params.get("issueId");

const issueInfo = document.getElementById("issueInfo");
const returnBtn = document.getElementById("returnBtn");

let issue = null;


// Load issue details
async function loadIssue() {
    if (!issueId) {
        issueInfo.innerHTML = "<p>Invalid issue ID.</p>";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/issues/${issueId}`);

        if (!response.ok) {
            throw new Error("Issue not found");
        }

        issue = await response.json();

        issueInfo.innerHTML = `
            <div>
                <strong>${issue.bookTitle}</strong>
                <p>Author: ${issue.author}</p>
                <p>Issue Date: ${issue.issueDate}</p>
                <p>Due Date: ${issue.returnDate}</p>
            </div>
        `;

    } catch (error) {
        console.error(error);

        issueInfo.innerHTML = `
            <p>Unable to load book details.</p>
        `;
    }
}


// Return book
returnBtn.addEventListener("click", async () => {

    if (!issueId) {
        alert("Invalid issue.");
        return;
    }

    returnBtn.disabled = true;
    returnBtn.textContent = "Returning...";

    try {

        const response = await fetch(
            `${API_URL}/issues/${issueId}/return`,
            {
                method: "POST"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Return failed");
        }

        alert(
            data.fine > 0
                ? `Book returned successfully!\nFine: ₹${data.fine}`
                : "Book returned successfully!\nNo fine."
        );

        localStorage.removeItem("lumoraIssue");

        window.location.href = "my-books.html";

    } catch (error) {

        console.error(error);

        alert(error.message);

        returnBtn.disabled = false;
        returnBtn.textContent = "Confirm Return";
    }
});


loadIssue();