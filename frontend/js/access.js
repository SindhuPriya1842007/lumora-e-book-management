const issuedBook =
    document.getElementById("issuedBook");

const readBtn =
    document.getElementById("readBtn");

const downloadBtn =
    document.getElementById("downloadBtn");


// =========================
// GET SAVED ISSUE
// =========================

const savedIssue =
    localStorage.getItem("lumoraIssue");


if (!savedIssue) {

    issuedBook.innerHTML = `
        <p>
            No active book issue found.
        </p>
    `;

} else {

    const issue =
        JSON.parse(savedIssue);


    // =========================
    // DISPLAY BOOK
    // =========================

    issuedBook.innerHTML = `

        <div class="issued-label">
            E-BOOK ISSUED
        </div>

        <div class="issued-title">
            ${issue.bookTitle}
        </div>

        <div class="issued-author">
            by ${issue.author}
        </div>


        <div class="issue-dates">

            <div class="date-item">

                <span class="date-label">
                    Issued
                </span>

                <span class="date-value">
                    ${issue.issueDate}
                </span>

            </div>


            <div class="date-item">

                <span class="date-label">
                    Return by
                </span>

                <span class="date-value">
                    ${issue.returnDate}
                </span>

            </div>

        </div>

    `;


    // =========================
    // E-BOOK LINKS
    // =========================

    /*
       Temporary demo PDF.

       Later we will replace this with
       the actual PDF belonging to the book.
    */

    readBtn.href = `read-book.html?issueId=${issue.id}`;

    downloadBtn.href = "ebooks/sample-book.pdf";

}