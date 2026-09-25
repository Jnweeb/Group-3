export const validateStudent = (
    request,
    response,
    next
) => {

    const {
        studentNumber,
        name,
        email,
        age,
        course
    } = request.body;


    // Student number
    if (!studentNumber || studentNumber.trim() === "") {

        return response.status(400).send({
            message: "Student number is required"
        });

    }


    // Student number format
    if (!/^\d{2}-\d{5}$/.test(studentNumber)) {

        return response.status(400).send({
            message:
                "Student number must follow the format XX-XXXXX"
        });

    }


    // Name
    if (!name || name.trim() === "") {

        return response.status(400).send({
            message: "Student name is required"
        });

    }


    if (name.trim().length < 2) {

        return response.status(400).send({
            message:
                "Student name must be at least 2 characters"
        });

    }


    // Email
    if (!email || email.trim() === "") {

        return response.status(400).send({
            message: "Student email is required"
        });

    }


    if (!email.includes("@")) {

        return response.status(400).send({
            message: "Please enter a valid email"
        });

    }


    // Age
    if (age === undefined || age === null) {

        return response.status(400).send({
            message: "Student age is required"
        });

    }


    if (!Number.isInteger(age) || age <= 0) {

        return response.status(400).send({
            message:
                "Student age must be a positive integer"
        });

    }


    // Course
    if (!course || course.trim() === "") {

        return response.status(400).send({
            message: "Student course is required"
        });

    }


    next();
};