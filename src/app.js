import express from "express";

import studentRoutes from "./routes/studentRoutes.js";

const app = express();

app.use(express.json());

//route for students
app.use("/api/students", studentRoutes);

export default app;