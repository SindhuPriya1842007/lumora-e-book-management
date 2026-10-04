const API_URL = "http://localhost:5000/api";

const booksContainer = document.getElementById("booksContainer");
const bookCount = document.getElementById("bookCount");

async function loadMyBooks() {

    const user = JSON.parse(localStorage.getItem("lumoraUser"));

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {

        const response = await fetch(`${API_URL}/issues`);

        if (!response.ok) {
            throw new Error("Unable to load issued books");
        }

        const issues = await response.json();

        // Show only this user's active books
        const myBooks = issues.filter(issue =>
            issue.status === "Issued" &&
            (
                issue.email === user.email ||
                issue.studentName === `${user.firstName} ${user.lastName}`
            )
        );

        if (bookCount) {
            bookCount.textContent = myBooks.length;
        }

        if (!booksContainer) return;

        if (myBooks.length === 0) {

            booksContainer.innerHTML = `
                <div class="empty-state">
                    <h3>No books issued yet</h3>
                    <p>Explore the library and issue your first book.</p>
                    <a href="explore.html">
                        Explore Library
                    </a>
                </div>
            `;

            return;
        }

        booksContainer.innerHTML = myBooks.map(issue => {

            return `
                <div class="my-book-card">

                    <div class="my-book-cover">
                        <span>BOOK</span>
                    </div>

                    <div class="my-book-info">

                        <h3>${issue.bookTitle}</h3>

                        <p>
                            ${issue.author}
                        </p>

                        <div class="book-dates">
                            <span>
                                Issued: ${issue.issueDate}
                            </span>

                            <span>
                                Due: ${issue.returnDate}
                            </span>
                        </div>

                        <div class="book-actions">

                            <a
                                href="read-book.html?issueId=${issue.id}"
                                class="read-btn"
                            >
                                Continue Reading
                            </a>

                            <a
                                href="return-book.html?issueId=${issue.id}"
                                class="return-btn"
                            >
                                Return Book
                            </a>

                        </div>

                    </div>

                </div>
            `;

        }).join("");

    } catch (error) {

        console.error(error);

        if (booksContainer) {
            booksContainer.innerHTML = `
                <div class="empty-state">
                    <h3>Unable to load your books</h3>
                    <p>Please make sure the backend server is running.</p>
                </div>
            `;
        }
    }
}

loadMyBooks();