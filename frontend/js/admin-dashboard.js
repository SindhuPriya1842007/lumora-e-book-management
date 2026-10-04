const API_URL = "https://lumora-e-book-management-git-main-narsingsindhu-5850.vercel.app/api";

const totalBooksEl = document.getElementById("totalBooks");
const availableBooksEl = document.getElementById("availableBooks");
const issuedBooksEl = document.getElementById("issuedBooks");
const totalUsersEl = document.getElementById("totalUsers");

async function loadDashboard() {
    try {
        const [booksResponse, usersResponse, issuesResponse] =
            await Promise.all([
                fetch(`${API_URL}/books`),
                fetch(`${API_URL}/users`),
                fetch(`${API_URL}/issues`)
            ]);

        const books = await booksResponse.json();
        const users = await usersResponse.json();
        const issues = await issuesResponse.json();

        // Total books
        if (totalBooksEl) {
            totalBooksEl.textContent = books.length;
        }

        // Books currently available
        const availableBooks = books.filter(
            book => Number(book.copies) > 0
        ).length;

        if (availableBooksEl) {
            availableBooksEl.textContent = availableBooks;
        }

        // Currently issued
        const activeIssues = issues.filter(
            issue => issue.status === "Issued"
        ).length;

        if (issuedBooksEl) {
            issuedBooksEl.textContent = activeIssues;
        }

        // Registered users
        if (totalUsersEl) {
            totalUsersEl.textContent = users.length;
        }

    } catch (error) {
        console.error("Dashboard error:", error);
    }
}


// =========================
// LOGOUT
// =========================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn?.addEventListener("click", () => {
    localStorage.removeItem("lumoraAdmin");
    window.location.href = "admin-login.html";
});


// =========================
// ADMIN AUTH CHECK
// =========================

if (localStorage.getItem("lumoraAdmin") !== "true") {
    window.location.href = "admin-login.html";
} else {
    loadDashboard();
}