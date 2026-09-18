import bcrypt from 'bcryptjs';

import {
    findUserByEmail,
    createUser,
    findUserById
} from '../models/userModel.js';

import { generateToken } from '../utils/jwt.js';

export const registerUser = async (name, email, password) => {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
        throw new Error('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser(
        name,
        email,
        hashedPassword
    );

    return user;
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