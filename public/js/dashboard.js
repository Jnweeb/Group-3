const token = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

// If there is no token, go back to login
if (!token) {
    window.location.href = "/";
}

const user = storedUser
    ? JSON.parse(storedUser)
    : null;

if (!user) {
    localStorage.removeItem("token");
    window.location.href = "/";
}

// Display user information
document.getElementById("userName").textContent = user.name;
document.getElementById("userRole").textContent = user.role;

// Admin controls
if (user.role === "admin") {

    document.getElementById("addStudentButton")
        .style.display = "block";

    document.getElementById("actionsHeader")
        .style.display = "table-cell";
}

// Load students
async function loadStudents() {

    try {

        const response = await fetch("/api/students", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {

            if (response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                window.location.href = "/";

                return;
            }

            document.getElementById("studentMessage")
                .textContent = data.message;

            return;
        }

        displayStudents(data);

    } catch (error) {

        console.error(error);

        document.getElementById("studentMessage")
            .textContent = "Unable to load students.";
    }
}

// Display students in table
function displayStudents(students) {

    const tableBody =
        document.getElementById("studentsTableBody");

    tableBody.innerHTML = "";

    students.forEach(student => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${new Date(student.created_at).toLocaleString()}</td>
            ${
                user.role === "admin"
                    ? `
                        <td>
                            <button
                                class="action-button"
                                onclick="editStudent(${student.id})"
                            >
                                Edit
                            </button>

                            <button
                                class="action-button"
                                onclick="deleteStudent(${student.id})"
                            >
                                Delete
                            </button>
                        </td>
                    `
                    : ""
            }
        `;

        tableBody.appendChild(row);
    });
}

// Logout
document.getElementById("logoutButton")
    .addEventListener("click", async () => {

        try {

            await fetch("/api/auth/logout", {
                method: "POST",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

        } catch (error) {
            console.error(error);
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/";
    });

// Add student
document.getElementById("addStudentButton")
    .addEventListener("click", async () => {

        const name = prompt("Enter student name:");

        if (!name || name.trim() === "") {
            return;
        }

        try {

            const response = await fetch("/api/students", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    name: name.trim()
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            loadStudents();

        } catch (error) {

            console.error(error);

            alert("Unable to add student.");
        }
    });

// Edit student
async function editStudent(id) {

    const name = prompt("Enter new student name:");

    if (!name || name.trim() === "") {
        return;
    }

    try {

        const response = await fetch(`/api/students/${id}`, {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({
                name: name.trim()
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        loadStudents();

    } catch (error) {

        console.error(error);

        alert("Unable to update student.");
    }
}

// Delete student
async function deleteStudent(id) {

    const confirmed =
        confirm("Are you sure you want to delete this student?");

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(`/api/students/${id}`, {
            method: "DELETE",

            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        loadStudents();

    } catch (error) {

        console.error(error);

        alert("Unable to delete student.");
    }
}

// Initial load
loadStudents();