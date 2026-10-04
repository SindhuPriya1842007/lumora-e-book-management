const API_URL = "https://lumora-e-book-management-git-main-narsingsindhu-5850.vercel.app/api";

const booksContainer = document.getElementById("booksContainer");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

const totalBooks = document.getElementById("totalBooks");
const availableBooks = document.getElementById("availableBooks");
const issuedBooks = document.getElementById("issuedBooks");

let books = [];


// =========================
// LOAD BOOKS
// =========================

async function loadBooks() {
    try {
        const response = await fetch(`${API_URL}/books`);

        if (!response.ok) {
            throw new Error("Unable to load books");
        }

        books = await response.json();

        updateStats();
        displayBooks();

    } catch (error) {
        console.error(error);

        booksContainer.innerHTML = `
            <p>Unable to load books. Make sure backend is running.</p>
        `;
    }
}


// =========================
// STATS
// =========================

function updateStats() {

    const total = books.length;

    const available = books.filter(
        book => book.copies > 0
    ).length;

    const issued = books.reduce(
        (total, book) => total + Math.max(0, book.copies),
        0
    );

    if (totalBooks) {
        totalBooks.textContent = total;
    }

    if (availableBooks) {
        availableBooks.textContent = available;
    }

    if (issuedBooks) {
        issuedBooks.textContent = issued;
    }
}


// =========================
// DISPLAY BOOKS
// =========================

function displayBooks() {

    const search =
        searchInput?.value.toLowerCase().trim() || "";

    const category =
        categoryFilter?.value || "all";


    const filteredBooks = books.filter(book => {

        const matchesSearch =
            book.title.toLowerCase().includes(search) ||
            book.author.toLowerCase().includes(search);

        const matchesCategory =
            category === "all" ||
            book.category === category;

        return matchesSearch && matchesCategory;
    });


    if (filteredBooks.length === 0) {

        booksContainer.innerHTML = `
            <div class="empty-state">
                <h3>No books found</h3>
                <p>Try another search or category.</p>
            </div>
        `;

        return;
    }


    booksContainer.innerHTML = filteredBooks.map(book => {

        return `
            <div class="admin-book-card">

                <div class="book-cover">
                    <span>${book.category}</span>
                    <h3>${book.title}</h3>
                </div>

                <div class="book-details">

                    <h3>${book.title}</h3>

                    <p>
                        ${book.author}
                    </p>

                    <span>
                        ${book.copies} copies available
                    </span>

                    <div class="book-actions">

                        <button
                            class="delete-btn"
                            onclick="deleteBook(${book.id})"
                        >
                            Delete
                        </button>

                    </div>

                </div>

            </div>
        `;

    }).join("");
}


// =========================
// ADD BOOK
// =========================

async function addBook(bookData) {

    try {

        const response = await fetch(
            `${API_URL}/books`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bookData)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to add book"
            );
        }

        alert("Book added successfully!");

        await loadBooks();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}


// =========================
// DELETE BOOK
// =========================

async function deleteBook(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this book?"
    );

    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/books/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to delete book"
            );
        }

        alert("Book deleted successfully!");

        await loadBooks();

    } catch (error) {

        console.error(error);

        alert(error.message);
    }
}


// =========================
// SEARCH
// =========================

searchInput?.addEventListener(
    "input",
    displayBooks
);


// =========================
// CATEGORY FILTER
// =========================

categoryFilter?.addEventListener(
    "change",
    displayBooks
);


// =========================
// ADD BOOK FORM
// =========================

const addBookForm =
    document.getElementById("addBookForm");

addBookForm?.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const formData = new FormData(addBookForm);

        const bookData = {
            title: formData.get("title"),
            author: formData.get("author"),
            category: formData.get("category"),
            rating: formData.get("rating") || 0,
            copies: Number(formData.get("copies")) || 0,
            description: formData.get("description") || ""
        };

        await addBook(bookData);

        addBookForm.reset();
    }
);


// =========================
// START
// =========================

loadBooks();