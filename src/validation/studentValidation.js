export const validateStudent = (request, response, next) => {
    const { name } = request.body;

    if (!name || name.trim() === "") {
        return response.status(400).send({
            message: "Student name is required"
        });
    }

    next();
};