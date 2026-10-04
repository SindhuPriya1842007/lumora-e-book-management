const API_URL = "http://localhost:5000/api";

const tableBody = document.getElementById("issuedTableBody");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

const totalIssued = document.getElementById("totalIssued");
const activeIssued = document.getElementById("activeIssued");
const pendingOtp = document.getElementById("pendingOtp");
const overdueBooks = document.getElementById("overdueBooks");

let issues = [];


// =========================
// LOAD ISSUES
// =========================

async function loadIssues() {

    try {

        const response = await fetch(`${API_URL}/issues`);

        if (!response.ok) {
            throw new Error("Unable to load issues");
        }

        issues = await response.json();

        updateStats();
        displayIssues();

    } catch (error) {

        console.error(error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    Unable to load issued books.
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

    const active = issues.filter(
        issue => issue.status === "Issued"
    );

    const pending = issues.filter(
        issue => issue.status === "Pending OTP"
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdue = issues.filter(issue => {

        if (
            issue.status !== "Issued" ||
            !issue.returnDate
        ) {
            return false;
        }

        const dueDate = new Date(issue.returnDate);
        dueDate.setHours(0, 0, 0, 0);

        return dueDate < today;
    });

    if (totalIssued) {
        totalIssued.textContent = issues.length;
    }

    if (activeIssued) {
        activeIssued.textContent = active.length;
    }

    if (pendingOtp) {
        pendingOtp.textContent = pending.length;
    }

    if (overdueBooks) {
        overdueBooks.textContent = overdue.length;
    }
}


// =========================
// DISPLAY ISSUES
// =========================

function displayIssues() {

    const search =
        searchInput?.value.toLowerCase().trim() || "";

    const status =
        statusFilter?.value || "all";

    const filtered = issues.filter(issue => {

        const matchesSearch =
            issue.studentName?.toLowerCase().includes(search) ||
            issue.registrationNumber?.toLowerCase().includes(search) ||
            issue.bookTitle?.toLowerCase().includes(search);

        const matchesStatus =
            status === "all" ||
            issue.status === status;

        return matchesSearch && matchesStatus;
    });


    if (filtered.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    No issued books found.
                </td>
            </tr>
        `;

        return;
    }


    tableBody.innerHTML = filtered.map(issue => {

        let statusClass = "status-active";

        if (issue.status === "Returned") {
            statusClass = "status-returned";
        }

        if (issue.status === "Pending OTP") {
            statusClass = "status-pending";
        }


        return `
            <tr>

                <td>
                    ${issue.bookTitle || "-"}
                </td>

                <td>
                    ${issue.studentName || "-"}
                </td>

                <td>
                    ${issue.registrationNumber || "-"}
                </td>

                <td>
                    ${issue.issueDate || "-"}
                </td>

                <td>
                    ${issue.returnDate || "-"}
                </td>

                <td>
                    <span class="${statusClass}">
                        ${issue.status || "-"}
                    </span>
                </td>

                <td>
                    ${
                        issue.status === "Returned"
                            ? "Returned"
                            : "Active"
                    }
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
    displayIssues
);


// =========================
// STATUS FILTER
// =========================

statusFilter?.addEventListener(
    "change",
    displayIssues
);


// =========================
// START
// =========================

loadIssues();