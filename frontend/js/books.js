let allBooks = [];
let selectedCategory = "All";

const booksGrid = document.getElementById("booksGrid");
const searchInput = document.getElementById("searchInput");
const bookCount = document.getElementById("bookCount");


// =========================
// LOAD BOOKS FROM BACKEND
// =========================

async function loadBooks() {

    try {

        const response = await fetch(
            "https://lumora-e-book-management-git-main-narsingsindhu-5850.vercel.app/api/books"
        );

        if (!response.ok) {
            throw new Error("Unable to load books");
        }

        allBooks = await response.json();

        displayBooks(allBooks);

    } catch (error) {

        console.error(error);

        booksGrid.innerHTML = `
            <div class="loading">
                Unable to load the library.
                Please make sure the backend is running.
            </div>
        `;
    }
}


// =========================
// DISPLAY BOOKS
// =========================

function displayBooks(books) {

    bookCount.textContent =
        `${books.length} books`;

    if (books.length === 0) {

        booksGrid.innerHTML = `
            <div class="loading">
                No books found.
            </div>
        `;

        return;
    }


    booksGrid.innerHTML = books.map(book => {

        const availabilityClass =
            book.available ? "available" : "unavailable";

        const availabilityText =
            book.available
                ? `${book.copies} copies available`
                : "Currently unavailable";


        return `

            <article class="book-card">

                <div class="book-cover">

                    <div class="book-cover-content">

                        <div class="book-cover-title">
                            ${book.title}
                        </div>

                        <div class="book-cover-author">
                            ${book.author}
                        </div>

                    </div>

                </div>


                <div class="book-info">

                    <span class="book-category">
                        ${book.category}
                    </span>

                    <h3 class="book-title">
                        ${book.title}
                    </h3>

                    <p class="book-author">
                        ${book.author}
                    </p>


                    <div class="book-bottom">

                        <span class="rating">
                            ★ ${book.rating}
                        </span>

                        <span class="availability ${availabilityClass}">
                            ${availabilityText}
                        </span>

                    </div>


                    <a
                        href="book-details.html?id=${book.id}"
                        class="view-btn"
                    >
                        View book
                    </a>

                </div>

            </article>

        `;

    }).join("");
}


// =========================
// SEARCH + FILTER
// =========================

function filterBooks() {

    const searchTerm =
        searchInput.value.toLowerCase().trim();


    const filteredBooks = allBooks.filter(book => {

        const matchesCategory =
            selectedCategory === "All" ||
            book.category === selectedCategory;


        const matchesSearch =
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.category.toLowerCase().includes(searchTerm);


        return matchesCategory && matchesSearch;

    });


    displayBooks(filteredBooks);
}


// =========================
// SEARCH EVENT
// =========================

searchInput.addEventListener(
    "input",
    filterBooks
);


// =========================
// CATEGORY EVENTS
// =========================

document.querySelectorAll(".category-btn")
    .forEach(button => {

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".category-btn")
                .forEach(btn =>
                    btn.classList.remove("active")
                );

            button.classList.add("active");

            selectedCategory =
                button.dataset.category;

            filterBooks();

        });

    });


// =========================
// START
// =========================

loadBooks();