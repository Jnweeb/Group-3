import dbCon from "../config/database.js";

export const findAllStudents = async () => {
    const result = await dbCon.query(
        `SELECT
            id,
            user_id,
            student_number,
            name,
            age,
            course,
            created_at
         FROM students
         ORDER BY id`
    );

    return result.rows;
};

export const findStudentById = async (studentId) => {
    const result = await dbCon.query(
        `SELECT
            id,
            user_id,
            student_number,
            name,
            age,
            course,
            created_at
         FROM students
         WHERE id = $1`,
        [studentId]
    );

    return result.rows[0];
};

export const createStudent = async (studentData) => {
    const result = await dbCon.query(
        `INSERT INTO students
            (user_id, student_number, name, age, course)
         VALUES
            ($1, $2, $3, $4, $5)
         RETURNING
            id,
            user_id,
            student_number,
            name,
            age,
            course,
            created_at`,
        [
            studentData.user_id,
            studentData.student_number,
            studentData.name,
            studentData.age,
            studentData.course
        ]
    );

    return result.rows[0];
};

export const updateStudent = async (studentId, studentData) => {
    const result = await dbCon.query(
        `UPDATE students
         SET
            name = $1,
            age = $2,
            course = $3
         WHERE id = $4
         RETURNING
            id,
            user_id,
            student_number,
            name,
            age,
            course,
            created_at`,
        [
            studentData.name,
            studentData.age,
            studentData.course,
            studentId
        ]
    );

    return result.rows[0];
};

export const deleteStudent = async (studentId) => {
    const result = await dbCon.query(
        `DELETE FROM students
         WHERE id = $1
         RETURNING
            id,
            user_id,
            student_number,
            name,
            age,
            course,
            created_at`,
        [studentId]
    );

    return result.rows[0];
};