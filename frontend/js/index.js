// const API_URL = "http://localhost:5000/api";

const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:5000/api"
        : "/api";
// ==========================================
// LOAD BOOKS
// ==========================================

async function loadHomeBooks() {

    const booksGrid = document.getElementById("homeBooksGrid");

    if (!booksGrid) return;

    try {

        const response = await fetch(`${API_URL}/books`);

        if (!response.ok) {
            throw new Error("Failed to load books");
        }

        const books = await response.json();

        displayBooks(books);

    } catch (error) {

        console.error("Error loading books:", error);

        booksGrid.innerHTML = `
            <p class="error-message">
                Unable to load books. Please make sure the backend is running.
            </p>
        `;
    }
}


// ==========================================
// DISPLAY BOOKS
// ==========================================

function displayBooks(books) {

    const booksGrid = document.getElementById("homeBooksGrid");

    if (!booksGrid) return;

    if (books.length === 0) {

        booksGrid.innerHTML = `
            <p>No books available.</p>
        `;

        return;
    }

    // Show first 4 books on Home page
    const popularBooks = books.slice(0, 4);

    booksGrid.innerHTML = popularBooks.map((book, index) => {

        const coverClass =
            `cover-${(index % 4) + 1}`;

        return `
            <article class="book-card">

                <div class="card-cover ${coverClass}">

                    <span>
                        ${book.category}
                    </span>

                    <h3>
                        ${formatTitle(book.title)}
                    </h3>

                    <small>
                        ${book.author}
                    </small>

                </div>


                <div class="book-info">

                    <div>

                        <h3>
                            ${book.title}
                        </h3>

                        <p>
                            ${book.author}
                        </p>

                    </div>

                    <a
                        href="book-details.html?id=${book.id}"
                        class="bookmark"
                        title="View book"
                    >
                        →
                    </a>

                </div>


                <div class="book-meta">

                    <span>
                        ${book.category}
                    </span>

                    <span>
                        ★ ${book.rating}
                    </span>

                </div>

            </article>
        `;

    }).join("");
}


// ==========================================
// FORMAT BOOK TITLE
// ==========================================

function formatTitle(title) {

    const words = title.split(" ");

    if (words.length <= 2) {
        return title;
    }

    const middle = Math.ceil(words.length / 2);

    return `
        ${words.slice(0, middle).join(" ")}<br>
        ${words.slice(middle).join(" ")}
    `;
}


// ==========================================
// HOME SEARCH
// ==========================================

const searchInput =
    document.getElementById("homeSearchInput");

const searchButton =
    document.getElementById("homeSearchBtn");


function performSearch() {

    if (!searchInput) return;

    const searchText =
        searchInput.value.trim();

    if (searchText === "") {

        window.location.href = "explore.html";

        return;
    }

    window.location.href =
        `explore.html?search=${encodeURIComponent(searchText)}`;
}


// Search button
searchButton?.addEventListener(
    "click",
    performSearch
);


// Enter key
searchInput?.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {
            performSearch();
        }

    }
);


// ==========================================
// NAVBAR SEARCH BUTTON
// ==========================================

const navSearchButton =
    document.querySelector(".search-btn");

navSearchButton?.addEventListener(
    "click",
    function () {

        const searchSection =
            document.querySelector(".search-section");

        if (searchSection) {

            searchSection.scrollIntoView({
                behavior: "smooth"
            });

        }

        searchInput?.focus();

    }
);


// ==========================================
// CATEGORY CARDS
// ==========================================

const categoryCards =
    document.querySelectorAll(".category-card");


categoryCards.forEach(card => {

    card.addEventListener("click", function () {

        const category =
            card.querySelector("h3")?.textContent.trim();

        if (!category) return;

        window.location.href =
            `explore.html?category=${encodeURIComponent(category)}`;

    });

});


// ==========================================
// START
// ==========================================

loadHomeBooks();