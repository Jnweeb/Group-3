import {
    getAllStudents,
    addStudent,
    editStudent,
    removeStudent
}from "../services/studentService.js";

export const getStudents = (request, response) => {
    const students = getAllStudents();

    response.status(200).send(students);
};

export const createStudent = (request, response) => {
    const newStudent = addStudent(request.body);

    response.status(201).send(newStudent);
};

export const updateStudent = (request, response) => {
    const studentId = Number(request.params.id);

    const updatedStudent = editStudent(studentId, request.body);

    if(!updatedStudent) {
        return response.status(404).send({ message: "Student not found" });
    }
    response.status(200).send(updatedStudent);
};

export const deleteStudent = (request, response) => {
    const studentId = Number(request.params.id);

    const deletedStudent = removeStudent(studentId);

    if(!deletedStudent) {return response.status(404).send({ message: "Student not found" });
    }
    response.status(200).send({ message: "Student deleted successfully" });
};
