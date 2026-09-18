import dbCon from "../config/database.js";

export const findAllStudents = async () => {
    const result = await dbCon.query(
        `SELECT id, user_id, name, created_at
         FROM students
         ORDER BY id`
    );

    return result.rows;
};

export const findStudentById = async (studentId) => {
    const result = await dbCon.query(
        `SELECT id, user_id, name, created_at
         FROM students
         WHERE id = $1`,
        [studentId]
    );

    return result.rows[0];
};

export const createStudent = async (studentData) => {
    const result = await dbCon.query(
        `INSERT INTO students (name)
         VALUES ($1)
         RETURNING id, user_id, name, created_at`,
        [studentData.name]
    );

    return result.rows[0];
};

export const updateStudent = async (studentId, studentData) => {
    const result = await dbCon.query(
        `UPDATE students
         SET name = $1
         WHERE id = $2
         RETURNING id, user_id, name, created_at`,
        [studentData.name, studentId]
    );

    return result.rows[0];
};

export const deleteStudent = async (studentId) => {
    const result = await dbCon.query(
        `DELETE FROM students
         WHERE id = $1
         RETURNING id, user_id, name, created_at`,
        [studentId]
    );

    return result.rows[0];
};