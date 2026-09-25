import {
    registerUser,
    loginUser,
    getUserById
} from '../services/authService.js';

export const register = async (req, res) => {
    try {
        const {
            studentNumber,
            name,
            email,
            age,
            course
        } = req.body;

        const result = await registerUser(
            studentNumber,
            name,
            email,
            age,
            course
        );

        res.status(201).json({
            success: true,
            message: 'Student registration successful',
            user: result.user,
            student: result.student,
            initialPassword: result.initialPassword
        });

    } catch (error) {
        console.error(error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await loginUser(
            email,
            password
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token: result.token,
            user: result.user
        });

    } catch (error) {
        console.error(error);

        res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

export const me = async (req, res) => {
    try {
        const user = await getUserById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const logout = async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logout successful'
    });
};