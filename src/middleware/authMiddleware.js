import jwt from 'jsonwebtoken';
import 'dotenv/config';

import { findUserById } from '../models/userModel.js';

export const protect = async (req, res, next) => {
    let token;

    const authorization = req.headers.authorization;

    if (
        authorization &&
        authorization.startsWith('Bearer ')
    ) {
        token = authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await findUserById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists'
            });
        }

        req.user = user;

        next();

    } catch (error) {
        console.error(error);

        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access forbidden'
            });
        }

        next();
    };
};