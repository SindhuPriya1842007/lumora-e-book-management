const API_URL = "https://lumora-e-book-management-git-main-narsingsindhu-5850.vercel.app/api";

const tableBody = document.getElementById("returnsTableBody");

const totalReturned = document.getElementById("totalReturned");
const totalOverdue = document.getElementById("totalOverdue");
const totalFine = document.getElementById("totalFine");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

let issues = [];


// =========================
// LOAD RETURNED BOOKS
// =========================

async function loadReturns() {

    try {

        const response = await fetch(`${API_URL}/issues`);

        if (!response.ok) {
            throw new Error("Unable to load returns");
        }

        const allIssues = await response.json();

        // Only returned books
        issues = allIssues.filter(
            issue => issue.status === "Returned"
        );

        updateStats();
        displayReturns();

    } catch (error) {

        console.error(error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    Unable to load return records.
                    Make sure the backend is running.
                </td>
            </tr>
        `;
    }
}


// =========================
// UPDATE STATS
// =========================

function updateStats() {

    const returnedCount = issues.length;

    const overdueCount = issues.filter(
        issue => Number(issue.fine) > 0
    ).length;

    const fineAmount = issues.reduce(
        (total, issue) => total + Number(issue.fine || 0),
        0
    );

    if (totalReturned) {
        totalReturned.textContent = returnedCount;
    }

    if (totalOverdue) {
        totalOverdue.textContent = overdueCount;
    }

    if (totalFine) {
        totalFine.textContent = `₹${fineAmount}`;
    }
}


// =========================
// DISPLAY RETURNS
// =========================

function displayReturns() {

    const search =
        searchInput?.value.toLowerCase().trim() || "";

    const status =
        statusFilter?.value || "all";


    const filtered = issues.filter(issue => {

        const matchesSearch =
            issue.bookTitle?.toLowerCase().includes(search) ||
            issue.studentName?.toLowerCase().includes(search) ||
            issue.registrationNumber?.toLowerCase().includes(search);

        let matchesStatus = true;

        if (status === "fine") {
            matchesStatus = Number(issue.fine) > 0;
        }

        if (status === "no-fine") {
            matchesStatus = Number(issue.fine) === 0;
        }

        return matchesSearch && matchesStatus;
    });


    if (filtered.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    No return records found.
                </td>
            </tr>
        `;

        return;
    }


    tableBody.innerHTML = filtered.map(issue => {

        const fine = Number(issue.fine || 0);

        return `
            <tr>

                <td>
                    ${issue.bookTitle || "-"}
                </td>

                <td>
                    ${issue.studentName || "-"}
                </td>

                <td>
                    ${issue.issueDate || "-"}
                </td>

                <td>
                    ${issue.returnDate || "-"}
                </td>

                <td>
                    ${issue.returnedDate || "-"}
                </td>

                <td>
                    ${
                        fine > 0
                            ? `<span class="fine-badge">₹${fine}</span>`
                            : `<span class="no-fine">₹0</span>`
                    }
                </td>

                <td>
                    <span class="status-returned">
                        Returned
                    </span>
                </td>

            </tr>
        `;

    }).join("");
}


// =========================
// SEARCH
// =========================

searchInput?.addEventListener(
    "input",
    displayReturns
);


// =========================
// FILTER
// =========================

statusFilter?.addEventListener(
    "change",
    displayReturns
);


// =========================
// START
// =========================

loadReturns();