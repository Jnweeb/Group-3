const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    message.textContent = "Creating account...";

    try {

        const response = await fetch("/api/auth/register", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {

            message.textContent = data.message;

            return;
        }

        message.textContent =
            "Registration successful! Redirecting to login...";

        setTimeout(() => {
            window.location.href = "/";
        }, 1500);

    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to connect to the server.";
    }
});