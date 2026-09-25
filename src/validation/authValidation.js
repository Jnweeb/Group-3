export const validateRegister = (req, res, next) => {
    const {
        studentNumber,
        name,
        email,
        age,
        course
    } = req.body;

    if (!studentNumber || !name || !email || age === undefined || !course) {
        return res.status(400).json({
            success: false,
            message: 'Student number, name, email, age, and course are required'
        });
    }

    if (!/^\d{2}-\d{5}$/.test(studentNumber)) {
        return res.status(400).json({
            success: false,
            message: 'Student number must follow the format XX-XXXXX'
        });
    }

    if (name.trim().length < 2) {
        return res.status(400).json({
            success: false,
            message: 'Name must be at least 2 characters'
        });
    }

    if (!email.includes('@')) {
        return res.status(400).json({
            success: false,
            message: 'Please enter a valid email'
        });
    }

    if (!Number.isInteger(age) || age <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Age must be a positive integer'
        });
    }

    if (course.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Course is required'
        });
    }

    next();
};

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }

    next();
};