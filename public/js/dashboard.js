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
document.getElementById("userName").textContent =
    user.name;

document.getElementById("userRole").textContent =
    user.role;


// Admin controls
if (user.role === "admin") {

    document.getElementById(
        "addStudentButton"
    ).style.display = "block";

    document.getElementById(
        "actionsHeader"
    ).style.display = "table-cell";
}


// Load students
async function loadStudents() {

    try {

        const response = await fetch(
            "/api/students",
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        const data = await response.json();


        if (!response.ok) {

            if (response.status === 401) {

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                window.location.href = "/";

                return;
            }


            document.getElementById(
                "studentMessage"
            ).textContent = data.message;

            return;
        }


        displayStudents(data);

    } catch (error) {

        console.error(error);

        document.getElementById(
            "studentMessage"
        ).textContent =
            "Unable to load students.";

    }
}


// Display students
function displayStudents(students) {

    const tableBody =
        document.getElementById(
            "studentsTableBody"
        );


    tableBody.innerHTML = "";


    students.forEach(student => {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>${student.id}</td>

            <td>
                ${student.student_number || "N/A"}
            </td>

            <td>
                ${student.name}
            </td>

            <td>
                ${student.age ?? "N/A"}
            </td>

            <td>
                ${student.course || "N/A"}
            </td>

            <td>
                ${new Date(
                    student.created_at
                ).toLocaleString()}
            </td>

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
document.getElementById(
    "logoutButton"
).addEventListener(
    "click",
    async () => {

        try {

            await fetch(
                "/api/auth/logout",
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        } catch (error) {

            console.error(error);

        }


        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/";

    }
);


// Add student
document.getElementById(
    "addStudentButton"
).addEventListener(
    "click",
    async () => {

        const studentNumber =
            prompt(
                "Enter student number:\nExample: 23-123456"
            );


        if (
            !studentNumber ||
            studentNumber.trim() === ""
        ) {
            return;
        }


        const name =
            prompt(
                "Enter student's full name:"
            );


        if (
            !name ||
            name.trim() === ""
        ) {
            return;
        }


        const email =
            prompt(
                "Enter student's email:"
            );


        if (
            !email ||
            email.trim() === ""
        ) {
            return;
        }


        const ageInput =
            prompt(
                "Enter student's age:"
            );


        if (!ageInput) {
            return;
        }


        const age =
            Number(ageInput);


        if (
            !Number.isInteger(age) ||
            age <= 0
        ) {

            alert(
                "Please enter a valid age."
            );

            return;
        }


        const course =
            prompt(
                "Enter student's course:"
            );


        if (
            !course ||
            course.trim() === ""
        ) {
            return;
        }


        try {

            const response =
                await fetch(
                    "/api/students",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            studentNumber:
                                studentNumber.trim(),

                            name:
                                name.trim(),

                            email:
                                email.trim(),

                            age,

                            course:
                                course.trim()
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Unable to create student."
                );

                return;
            }


            alert(
                `Student account created successfully!

Student Number:
${data.student.student_number}

Name:
${data.student.name}

Email:
${data.user.email}

Initial Password:
${data.initialPassword}

Please give the initial password to the student.`
            );


            loadStudents();


        } catch (error) {

            console.error(error);

            alert(
                "Unable to connect to the server."
            );

        }

    }
);


// Edit student
async function editStudent(id) {

    const name =
        prompt(
            "Enter new student name:"
        );


    if (
        !name ||
        name.trim() === ""
    ) {
        return;
    }


    const ageInput =
        prompt(
            "Enter new student age:"
        );


    if (!ageInput) {
        return;
    }


    const age =
        Number(ageInput);


    if (
        !Number.isInteger(age) ||
        age <= 0
    ) {

        alert(
            "Please enter a valid age."
        );

        return;
    }


    const course =
        prompt(
            "Enter new student course:"
        );


    if (
        !course ||
        course.trim() === ""
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/students/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        name:
                            name.trim(),

                        age,

                        course:
                            course.trim()
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Unable to update student."
            );

            return;
        }


        alert(
            "Student updated successfully."
        );


        loadStudents();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to update student."
        );

    }
}


// Delete student
async function deleteStudent(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this student and their login account?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/students/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Unable to delete student."
            );

            return;
        }


        alert(
            "Student and linked account deleted successfully."
        );


        loadStudents();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to delete student."
        );

    }
}


// Initial load
loadStudents();