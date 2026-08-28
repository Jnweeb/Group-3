import express from 'express';

let students = [{id: 1, name: "student1"}];

const app = express();

app.use(express.json());

app.get("/students", (req, res) => {
    res.send(students);
});

app.post("/students", (req, res) =>{
    const newStudent = req.body;

    students = [...students, newStudent];

    res.send(newStudent);
});
app.patch("/students/:id", (req, res) => {
    const id = Number(req.params.id);
    const updatedStudentData = req.body;

    students = students.map((student) => {
        if (student.id === id) {
            return { ...student, ...updatedStudentData };
        }
        return student;
    });

    const updatedStudent = students.find((student) => student.id === id);

    res.send(updatedStudent);
});

app.listen(3000, () => {
    console.log("listening to port 3000");
});