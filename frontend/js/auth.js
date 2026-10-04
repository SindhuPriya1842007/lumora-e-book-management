function togglePassword(inputId, button) {

    const input = document.getElementById(inputId);

    if (input.type === "password") {

        input.type = "text";
        button.textContent = "Hide";

    } else {

        input.type = "password";
        button.textContent = "Show";

    }
}


// =====================================
// REGISTER
// =====================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const firstName =
            document.getElementById("firstName").value.trim();

        const lastName =
            document.getElementById("lastName").value.trim();

        const email =
            document.getElementById("registerEmail").value.trim();

        const password =
            document.getElementById("registerPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        // Check passwords

        if (password !== confirmPassword) {

            alert("Passwords do not match.");

            return;

        }


        try {

            const response = await fetch(
                "https://lumora-e-book-management-git-main-narsingsindhu-5850.vercel.app/api/register",
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        firstName,
                        lastName,
                        email,
                        password

                    })

                }
            );


            const data = await response.json();


            if (!response.ok) {

                alert(data.message);

                return;

            }


            alert("Account created successfully!");

            window.location.href = "login.html";


        } catch (error) {

            console.error(error);

            alert(
                "Unable to connect to the server."
            );

        }

    });

}


// =====================================
// LOGIN
// =====================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;


        try {

            const response = await fetch(
                "https://lumora-e-book-management-git-main-narsingsindhu-5850.vercel.app/api/login",
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        email,
                        password

                    })

                }
            );


            const data = await response.json();


            if (!response.ok) {

                alert(data.message);

                return;

            }


            // Save logged-in user

            localStorage.setItem(
                "lumoraUser",
                JSON.stringify(data.user)
            );


            alert("Welcome back!");

            window.location.href = "index.html";


        } catch (error) {

            console.error(error);

            alert(
                "Unable to connect to the server."
            );

        }

    });

}