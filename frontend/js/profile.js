const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");

const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const accountId = document.getElementById("accountId");

const avatar = document.getElementById("avatar");
const logoutBtn = document.getElementById("logoutBtn");


const savedUser =
    localStorage.getItem("lumoraUser");


if (!savedUser) {

    userName.textContent = "Welcome to Lumora";
    userEmail.textContent = "You are not currently logged in.";

    fullName.textContent = "Guest";
    email.textContent = "—";
    accountId.textContent = "—";

} else {

    const user = JSON.parse(savedUser);

    const name =
        `${user.firstName} ${user.lastName}`;

    userName.textContent =
        `Welcome, ${user.firstName}`;

    userEmail.textContent =
        user.email;

    fullName.textContent =
        name;

    email.textContent =
        user.email;

    accountId.textContent =
        user.id;

    avatar.textContent =
        user.firstName.charAt(0).toUpperCase();
}


/* LOGOUT */

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("lumoraUser");

    localStorage.removeItem("lumoraIssue");

    window.location.href = "index.html";

});