const params = new URLSearchParams(
    window.location.search
);

const bookId = params.get("id");

const bookSummary =
    document.getElementById("bookSummary");

const issueForm =
    document.getElementById("issueForm");

const message =
    document.getElementById("message");


let selectedBook = null;


// =========================
// LOAD BOOK
// =========================

async function loadBook() {

    try {

        const response = await fetch(
            `http://localhost:5000/api/books/${bookId}`
        );


        if (!response.ok) {
            throw new Error("Book not found");
        }


        selectedBook = await response.json();


        displayBookSummary(selectedBook);


    } catch (error) {

        console.error(error);

        bookSummary.innerHTML = `
            <p>
                Unable to load book information.
            </p>
        `;
    }
}


// =========================
// BOOK SUMMARY
// =========================

function displayBookSummary(book) {

    bookSummary.innerHTML = `

        <div class="summary-label">
            SELECTED BOOK
        </div>

        <div class="summary-title">
            ${book.title}
        </div>

        <div class="summary-author">
            by ${book.author}
        </div>

        <div class="summary-category">
            ${book.category}
        </div>

        <div class="summary-availability">

            ${book.copies}
            ${book.copies === 1 ? "copy" : "copies"}
            currently available

        </div>

    `;
}


// =========================
// SET DEFAULT DATE
// =========================

const today =
    new Date().toISOString().split("T")[0];

document.getElementById("issueDate").value =
    today;


// Default return date = 14 days

const returnDate = new Date();

returnDate.setDate(
    returnDate.getDate() + 14
);

document.getElementById("returnDate").value =
    returnDate.toISOString().split("T")[0];


// Minimum issue date

document.getElementById("issueDate").min =
    today;

document.getElementById("returnDate").min =
    today;


// =========================
// FORM SUBMISSION
// =========================

issueForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const studentName =
            document.getElementById("studentName")
                .value.trim();


        const registrationNo =
            document.getElementById("registrationNo")
                .value.trim();


        const issueDate =
            document.getElementById("issueDate")
                .value;


        const returnDate =
            document.getElementById("returnDate")
                .value;


        const comments =
            document.getElementById("comments")
                .value.trim();


        // Date validation

        if (returnDate <= issueDate) {

            showError(
                "Return date must be after the issue date."
            );

            return;
        }


        try {

            const response = await fetch(
                "http://localhost:5000/api/issues",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        studentName,

                        registrationNo,

                        bookId: selectedBook.id,

                        issueDate,

                        returnDate,

                        comments

                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                showError(data.message);

                return;
            }


            // Save issue temporarily

            localStorage.setItem(
                "lumoraIssue",
                JSON.stringify(data.issue)
            );


            // Go to OTP page

            window.location.href =
                `otp.html?issueId=${data.issue.id}`;


        } catch (error) {

            console.error(error);

            showError(
                "Unable to connect to the server."
            );

        }

    }
);


// =========================
// ERROR MESSAGE
// =========================

function showError(text) {

    message.textContent = text;

    message.className =
        "form-message error";

}
    

// =========================
// START
// =========================

loadBook();