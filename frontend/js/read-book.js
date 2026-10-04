const params = new URLSearchParams(window.location.search);
const issueId = params.get("issueId");

const API_URL = "https://lumora-e-book-management-git-main-narsingsindhu-5850.vercel.app/api";

async function loadBook() {
    if (!issueId) {
        console.error("No issue ID found.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/issues/${issueId}`);

        if (!response.ok) {
            throw new Error("Unable to load issue");
        }

        const issue = await response.json();

        const titleElement = document.getElementById("bookTitle");
        const authorElement = document.getElementById("bookAuthor");
        const pdfViewer = document.getElementById("pdfViewer");

        if (titleElement) {
            titleElement.textContent = issue.bookTitle;
        }

        if (authorElement) {
            authorElement.textContent = issue.author;
        }

        // Demo PDF
        if (pdfViewer) {
            pdfViewer.src = "ebooks/sample-book.pdf";
        }

    } catch (error) {
        console.error("Error loading book:", error);
    }
}

loadBook();