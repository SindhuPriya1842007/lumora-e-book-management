const params = new URLSearchParams(
    window.location.search
);

const issueId = params.get("issueId");

const demoOtp =
    document.getElementById("demoOtp");

const otpForm =
    document.getElementById("otpForm");

const otpMessage =
    document.getElementById("otpMessage");


// =========================
// GENERATE OTP
// =========================

async function generateOTP() {

    try {

        const response = await fetch(
            `http://localhost:5000/api/issues/${issueId}/send-otp`,
            {
                method: "POST"
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            otpMessage.textContent =
                data.message;

            return;
        }


        // DEMO ONLY

        demoOtp.textContent =
            data.otp;


    } catch (error) {

        console.error(error);

        otpMessage.textContent =
            "Unable to generate OTP.";

    }
}


// =========================
// VERIFY OTP
// =========================

otpForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const otp =
            document.getElementById("otp")
                .value.trim();


        if (!/^\d{6}$/.test(otp)) {

            otpMessage.textContent =
                "Enter a valid 6-digit OTP.";

            return;
        }


        try {

            const response = await fetch(
                `http://localhost:5000/api/issues/${issueId}/verify-otp`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        otp: otp
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                otpMessage.textContent =
                    data.message;

                return;
            }


            // Save verified issue

            localStorage.setItem(
                "lumoraIssue",
                JSON.stringify(data.issue)
            );


            // Access granted

            window.location.href =
                `access-granted.html?issueId=${issueId}`;


        } catch (error) {

            console.error(error);

            otpMessage.textContent =
                "Unable to connect to the server.";

        }

    }
);


// =========================
// START
// =========================

generateOTP();