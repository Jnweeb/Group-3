import express from "express";

import {
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent
} from "../controllers/studentController.js";

import {
    validateStudent
} from "../validation/studentValidation.js";

import {
    protect,
    authorize
} from "../middleware/authMiddleware.js";


const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student management endpoints
 */


/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get all students
 *     description: Students and administrators can view the student list.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Students retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: Access denied
 */
router.get(
    "/",
    protect,
    authorize("student", "admin"),
    getStudents
);


/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create a student
 *     description: Only administrators can create students.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan Dela Cruz
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Invalid student information
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: Admin access required
 */
router.post(
    "/",
    protect,
    authorize("admin"),
    validateStudent,
    createStudent
);


/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Update a student
 *     description: Only administrators can update student information.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *               - course
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan Dela Cruz
 *               age:
 *                 type: integer
 *                 minimum: 1
 *                 example: 21
 *               course:
 *                 type: string
 *                 example: BS Information Technology
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       400:
 *         description: Invalid student information
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Student not found
 */
router.put(
    "/:id",
    protect,
    authorize("admin"),
    async (request, response, next) => {

        // PUT only needs name, age and course.
        // student number and email are not changed here.

        const {
            name,
            age,
            course
        } = request.body;

        if (!name || name.trim() === "") {
            return response.status(400).send({
                message: "Student name is required"
            });
        }

        if (
            age === undefined ||
            !Number.isInteger(age) ||
            age <= 0
        ) {
            return response.status(400).send({
                message:
                    "Student age must be a positive integer"
            });
        }

        if (!course || course.trim() === "") {
            return response.status(400).send({
                message: "Student course is required"
            });
        }

        next();

    },
    updateStudent
);


/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Delete a student
 *     description: Only administrators can delete a student and the student's linked login account.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Student ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Student and linked account deleted successfully
 *       401:
 *         description: Unauthorized or invalid token
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Student not found
 */
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteStudent
);


export default router;