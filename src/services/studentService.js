import bcrypt from "bcryptjs";

import dbCon from "../config/database.js";

import {
    findAllStudents,
    findStudentById,
    updateStudent,
    deleteStudent
} from "../models/studentModel.js";

import { generateInitialPassword } from "../utils/passwordGenerator.js";

export const getAllStudents = async () => {
    return await findAllStudents();
};


export const addStudent = async (studentData) => {

    const {
        studentNumber,
        name,
        email,
        age,
        course
    } = studentData;

    // Check if email already exists
    const existingUser = await dbCon.query(
        `SELECT id
         FROM users
         WHERE email = $1`,
        [email]
    );

    if (existingUser.rows.length > 0) {
        throw new Error("Email is already registered");
    }

    // Check if student number already exists
    const existingStudent = await dbCon.query(
        `SELECT id
         FROM students
         WHERE student_number = $1`,
        [studentNumber]
    );

    if (existingStudent.rows.length > 0) {
        throw new Error("Student number is already registered");
    }

    // Generate initial password
    const initialPassword = generateInitialPassword(
        name,
        studentNumber
    );

    // Hash password before storing it
    const hashedPassword = await bcrypt.hash(
        initialPassword,
        10
    );

    const client = await dbCon.connect();

    try {
        await client.query("BEGIN");

        // Create student user account
        const userResult = await client.query(
            `INSERT INTO users
                (name, email, password, role)
             VALUES
                ($1, $2, $3, $4)
             RETURNING
                id,
                name,
                email,
                role,
                created_at`,
            [
                name,
                email,
                hashedPassword,
                "student"
            ]
        );

        const user = userResult.rows[0];

        // Create student record linked to user
        const studentResult = await client.query(
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
                user.id,
                studentNumber,
                name,
                age,
                course
            ]
        );

        const student = studentResult.rows[0];

        await client.query("COMMIT");

        return {
            user,
            student,
            initialPassword
        };

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();

    }
};


export const editStudent = async (
    studentId,
    studentData
) => {

    const student = await findStudentById(studentId);

    if (!student) {
        return null;
    }

    return await updateStudent(
        studentId,
        studentData
    );
};


export const removeStudent = async (studentId) => {

    const student = await findStudentById(studentId);

    if (!student) {
        return null;
    }

    const client = await dbCon.connect();

    try {

        await client.query("BEGIN");

        // Delete student record
        const studentResult = await client.query(
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

        const deletedStudent = studentResult.rows[0];

        // Delete the connected student account
        if (deletedStudent.user_id) {

            await client.query(
                `DELETE FROM users
                 WHERE id = $1
                 AND role = 'student'`,
                [deletedStudent.user_id]
            );

        }

        await client.query("COMMIT");

        return deletedStudent;

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();

    }
};