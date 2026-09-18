import {
    findAllStudents,
    findStudentById,
    createStudent,
    updateStudent,
    deleteStudent
} from "../models/studentModel.js";

export const getAllStudents = async () => {
    return await findAllStudents();
};

export const addStudent = async (studentData) => {
    return await createStudent(studentData);
};

export const editStudent = async (studentId, studentData) => {
    const student = await findStudentById(studentId);

    if (!student) {
        return null;
    }

    return await updateStudent(studentId, studentData);
};

export const removeStudent = async (studentId) => {
    const student = await findStudentById(studentId);

    if (!student) {
        return null;
    }

    return await deleteStudent(studentId);
};