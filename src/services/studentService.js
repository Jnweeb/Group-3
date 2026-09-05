import { 
    findAllStudents,
    findStudentById, 
    createStudent, 
    updateStudent, 
    deleteStudent 
}from "../models/studentModel.js";

export const getAllStudents = () => {
    return findAllStudents();
};

export const addStudent = (studentData) => {
    return createStudent(studentData);
};

export const editStudent = (studentId, studentData) => {
    const student = findStudentById(studentId); 

    if(!student) {
        return null;
    }   
    return updateStudent(studentId, studentData);
};

export const removeStudent = (studentId) => {
    const student = findStudentById(studentId);

    if(!student) {
        return null;
    }
    return deleteStudent(studentId);
};
