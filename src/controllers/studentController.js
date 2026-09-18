import {
    getAllStudents,
    addStudent,
    editStudent,
    removeStudent
} from "../services/studentService.js";

export const getStudents = async (request, response) => {
    try {
        const students = await getAllStudents();

        response.status(200).send(students);

    } catch (error) {
        console.error(error);

        response.status(500).send({
            message: "Server error"
        });
    }
};

export const createStudent = async (request, response) => {
    try {
        const newStudent = await addStudent(request.body);

        response.status(201).send(newStudent);

    } catch (error) {
        console.error(error);

        response.status(500).send({
            message: "Server error"
        });
    }
};

export const updateStudent = async (request, response) => {
    try {
        const studentId = Number(request.params.id);

        const updatedStudent = await editStudent(
            studentId,
            request.body
        );

        if (!updatedStudent) {
            return response.status(404).send({
                message: "Student not found"
            });
        }

        response.status(200).send(updatedStudent);

    } catch (error) {
        console.error(error);

        response.status(500).send({
            message: "Server error"
        });
    }
};

export const deleteStudent = async (request, response) => {
    try {
        const studentId = Number(request.params.id);

        const deletedStudent = await removeStudent(studentId);

        if (!deletedStudent) {
            return response.status(404).send({
                message: "Student not found"
            });
        }

        response.status(200).send({
            message: "Student deleted successfully"
        });

    } catch (error) {
        console.error(error);

        response.status(500).send({
            message: "Server error"
        });
    }
};