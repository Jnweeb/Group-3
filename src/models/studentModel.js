

let students = [
    {
        id: 1, 
        name: "student1" 
    }
];

export const findAllStudents = () => {
    return students;
};

export const findStudentById = (studentId) => {
    return students.find(student => student.id === studentId);
};

export const createStudent = (studentData) => {
    const newStudent = {
        id: students.length + 1,
        name: studentData.name
    };
    students.push(newStudent);
    return newStudent;
};

export const updateStudent = (studentId, studentData) => {
    students = students.map(student => {
        if(student.id === studentId) {
            return {
                ...student,
                ...studentData
            };
        }
        return student;
    });
    return findStudentById(studentId);
};

export const deleteStudent = (studentId) => {
    const student = findStudentById(studentId);

    students = students.filter(student => student.id !== studentId);

    return student;
};

