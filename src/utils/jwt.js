import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );
};