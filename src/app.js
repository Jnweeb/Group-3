import express from 'express';
const app = express();

let students = [
    { id: 1, name: "student1" }
];

app.use(express.json());



app.get("/students", (request, response) => {
    response.send(students);
});



app.post("/students", (request, response) => {
    const newStudent = {
        id: students.length + 1,
        name: request.body.name
    };

    students = [...students, newStudent];

    response.send(newStudent);
});


app.patch("/students/:id", (request, response) => {
    const studentId = Number(request.params.id);
    const updatedStudentData = request.body;

    const student = students.find(
        (student) => student.id === studentId
    );


    students = students.map((student) => {
        if (student.id === studentId) {
            return {
                ...student,
                ...updatedStudentData
            };
        }

        return student;
    });

    const updatedStudent = students.find(
        (student) => student.id === studentId
    );

    response.send(updatedStudent);
});



app.delete("/students/:id", (request, response) => {
    const studentId = Number(request.params.id);

    const student = students.find(
        (student) => student.id === studentId
    );


    students = students.filter(
        (student) => student.id !== studentId
    );


});

export default app;