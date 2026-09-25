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
 *     summary: Create a new student
 *     description: Only administrators can create students.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Student created successfully
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
    validateStudent,
    updateStudent
);

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Delete a student
 *     description: Only administrators can delete students.
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
 *         description: Student deleted successfully
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