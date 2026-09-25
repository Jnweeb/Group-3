const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const studentNumber =
        document.getElementById("studentNumber").value.trim();

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const age =
        Number(document.getElementById("age").value);

    const course =
        document.getElementById("course").value.trim();

    message.textContent = "Creating account...";

    try {

        const response = await fetch("/api/auth/register", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                studentNumber,
                name,
                email,
                age,
                course
            })
        });

        const data = await response.json();

        if (!response.ok) {

            message.textContent = data.message;

            return;
        }

        message.innerHTML = `
            Registration successful!<br>
            Your initial password is:
            <strong>${data.initialPassword}</strong>
            <br><br>
            Redirecting to login...
        `;

        setTimeout(() => {
            window.location.href = "/";
        }, 4000);

    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to connect to the server.";
    }
});