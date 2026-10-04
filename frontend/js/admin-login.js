const adminLoginForm =
    document.getElementById("adminLoginForm");

const loginMessage =
    document.getElementById("loginMessage");


function togglePassword() {

    const password =
        document.getElementById("adminPassword");

    const button =
        document.querySelector(".show-password");

    if (password.type === "password") {

        password.type = "text";
        button.textContent = "Hide";

    } else {

        password.type = "password";
        button.textContent = "Show";
    }
}


adminLoginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const email =
        document.getElementById("adminEmail").value.trim();

    const password =
        document.getElementById("adminPassword").value;


    // Demo admin credentials
    const adminEmail = "admin@lumora.com";
    const adminPassword = "admin123";


    if (
        email === adminEmail &&
        password === adminPassword
    ) {

        loginMessage.textContent =
            "Login successful. Opening dashboard...";

        loginMessage.className =
            "login-message success";


        localStorage.setItem(
            "lumoraAdmin",
            "true"
        );


        setTimeout(() => {

            window.location.href =
                "admin-dashboard.html";

        }, 700);

    } else {

        loginMessage.textContent =
            "Invalid admin email or password.";

        loginMessage.className =
            "login-message error";
    }

});