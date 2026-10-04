const API_URL = "http://localhost:5000/api";

const tableBody = document.getElementById("usersTableBody");
const searchInput = document.getElementById("searchInput");

let users = [];


// =========================
// LOAD USERS
// =========================

async function loadUsers() {

    try {

        const response = await fetch(`${API_URL}/users`);

        if (!response.ok) {
            throw new Error("Unable to load users");
        }

        users = await response.json();

        displayUsers();

    } catch (error) {

        console.error(error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    Unable to load users.
                    Make sure the backend is running.
                </td>
            </tr>
        `;
    }
}


// =========================
// DISPLAY USERS
// =========================

function displayUsers() {

    const search =
        searchInput?.value.toLowerCase().trim() || "";

    const filteredUsers = users.filter(user => {

        const fullName =
            `${user.firstName || ""} ${user.lastName || ""}`
            .toLowerCase();

        const email =
            (user.email || "").toLowerCase();

        return (
            fullName.includes(search) ||
            email.includes(search)
        );
    });


    if (filteredUsers.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    No users found.
                </td>
            </tr>
        `;

        return;
    }


    tableBody.innerHTML = filteredUsers.map(user => {

        const name =
            `${user.firstName || ""} ${user.lastName || ""}`.trim();

        return `
            <tr>

                <td>
                    ${user.id}
                </td>

                <td>
                    ${name}
                </td>

                <td>
                    ${user.email}
                </td>

                <td>
                    <span class="status-active">
                        Active
                    </span>
                </td>

                <td>
                    Registered
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
    displayUsers
);


// =========================
// START
// =========================

loadUsers();