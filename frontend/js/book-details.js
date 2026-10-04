const bookDetails = document.getElementById("bookDetails");


// =========================
// GET BOOK ID FROM URL
// =========================

const params = new URLSearchParams(window.location.search);

const bookId = params.get("id");


// =========================
// LOAD BOOK
// =========================

async function loadBook() {

    if (!bookId) {

        bookDetails.innerHTML = `
            <div class="loading">
                Book not found.
            </div>
        `;

        return;
    }


    try {

        const response = await fetch(
            `http://localhost:5000/api/books/${bookId}`
        );


        if (!response.ok) {
            throw new Error("Book not found");
        }


        const book = await response.json();

        displayBook(book);


    } catch (error) {

        console.error(error);

        bookDetails.innerHTML = `
            <div class="loading">
                Unable to load this book.
            </div>
        `;
    }
}


// =========================
// DISPLAY BOOK
// =========================

function displayBook(book) {

    const availabilityClass =
        book.available
            ? ""
            : "unavailable";


    const availabilityText =
        book.available
            ? `${book.copies} copies available`
            : "Currently unavailable";


    bookDetails.innerHTML = `

        <!-- COVER -->

        <div class="details-cover-area">

            <div class="details-cover">

                <div class="details-cover-inner">

                    <div class="cover-title">
                        ${book.title}
                    </div>

                    <div class="cover-author">
                        ${book.author}
                    </div>

                </div>

            </div>

        </div>


        <!-- INFORMATION -->

        <div class="details-info">

            <span class="details-category">
                ${book.category}
            </span>


            <h1 class="details-title">
                ${book.title}
            </h1>


            <p class="details-author">
                by ${book.author}
            </p>


            <div class="details-meta">

                <span class="details-rating">
                    <span>★</span>
                    ${book.rating}
                </span>

                <span class="details-availability ${availabilityClass}">
                    ${availabilityText}
                </span>

            </div>


            <p class="details-description">
                ${book.description}
            </p>


            <div class="issue-box">

                <h3>
                    Want to read this book?
                </h3>

                <p>
                    Issue this e-book from the Lumora library
                    and get access to it.
                </p>


                ${
                    book.available

                    ?

                    `
                    <a
                        href="issue-book.html?id=${book.id}"
                        class="issue-btn"
                    >
                        Issue this book →
                    </a>
                    `

                    :

                    `
                    <span class="issue-btn disabled">
                        Currently unavailable
                    </span>
                    `
                }

            </div>

        </div>

    `;
}


// =========================
// START
// =========================

loadBook();