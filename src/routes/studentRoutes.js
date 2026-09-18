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

// Students and admins can view students
router.get(
    "/",
    protect,
    authorize("student", "admin"),
    getStudents
);

// Only admins can create students
router.post(
    "/",
    protect,
    authorize("admin"),
    validateStudent,
    createStudent
);

// Only admins can update students
router.put(
    "/:id",
    protect,
    authorize("admin"),
    validateStudent,
    updateStudent
);

// Only admins can delete students
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteStudent
);

export default router;