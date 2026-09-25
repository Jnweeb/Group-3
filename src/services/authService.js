import bcrypt from 'bcryptjs';

import dbCon from '../config/database.js';

import {
    findUserByEmail,
    findUserById
} from '../models/userModel.js';

import { generateToken } from '../utils/jwt.js';
import { generateInitialPassword } from '../utils/passwordGenerator.js';

export const registerUser = async (
    studentNumber,
    name,
    email,
    age,
    course
) => {

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        throw new Error('Email is already registered');
    }

    const existingStudent = await dbCon.query(
        `SELECT id
         FROM students
         WHERE student_number = $1`,
        [studentNumber]
    );

    if (existingStudent.rows.length > 0) {
        throw new Error('Student number is already registered');
    }

    const initialPassword = generateInitialPassword(
        name,
        studentNumber
    );

    const hashedPassword = await bcrypt.hash(
        initialPassword,
        10
    );

    const client = await dbCon.connect();

    try {
        await client.query('BEGIN');

        // Create user account
        const userResult = await client.query(
            `INSERT INTO users
                (name, email, password, role)
             VALUES
                ($1, $2, $3, $4)
             RETURNING id, name, email, role, created_at`,
            [
                name,
                email,
                hashedPassword,
                'student'
            ]
        );

        const user = userResult.rows[0];

        // Create student record connected to the user
        const studentResult = await client.query(
            `INSERT INTO students
                (user_id, name, age, course, student_number)
             VALUES
                ($1, $2, $3, $4, $5)
             RETURNING id, user_id, name, age, course, student_number, created_at`,
            [
                user.id,
                name,
                age,
                course,
                studentNumber
            ]
        );

        const student = studentResult.rows[0];

        await client.query('COMMIT');

        return {
            user,
            student,
            initialPassword
        };

    } catch (error) {
        await client.query('ROLLBACK');
        throw error;

    } finally {
        client.release();
    }
};

export const loginUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordMatch) {
        throw new Error('Invalid email or password');
    }

    const token = generateToken(user);

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

export const getUserById = async (id) => {
    return await findUserById(id);
};